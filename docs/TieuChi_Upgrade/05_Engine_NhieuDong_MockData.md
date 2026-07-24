# 05 — Engine mock tính nhiều dòng + mock data dùng chung (LSP)

**File tạo:** `shared/lsp-engine-mock.js` (import ở MH Tạo công thức để chạy preview).
Mục đích: 1 hàm engine mock duy nhất, dùng cho **cả preview lẫn QA**, tránh viết logic lệch nhau.

## 1. Cấu trúc dữ liệu

```javascript
// 1 slice = 1 giai đoạn QTLV
// { stage, ban, ka, dept, from, to, cong, ns, donGia }
// Tiêu chí: { ma, rowClass, allocation, priority, calcLevel, aggScope, aggOp, expr(fn) }
```

## 2. Engine 2 pha (pseudo → JS mock)

```javascript
function lspCalc(emp, slices, criteria) {
  // ---- PHA 1 ----
  // (a) sinh dòng đã có sẵn = slices (theo QTLV)
  // (b) tính TT_ Detail per-dòng theo Priority ASC
  const detailCrit = criteria.filter(c => c.rowClass === 'Detail')
                             .sort((a,b) => a.priority - b.priority);
  let rows = slices.map(s => ({ ...s, vals:{} }));
  for (const c of detailCrit) {
    for (const r of rows) r.vals[c.ma] = c.expr(r, rows, emp);
  }
  // (c) Allocation=Prorata áp ngay trong Detail (nếu tiêu chí là tổng cần chia)
  applyProrata(rows, detailCrit);

  // ---- PHA 2 ----
  // (d) HT_ Aggregate theo scope
  const aggCrit = criteria.filter(c => c.calcLevel === 'Aggregate');
  for (const c of aggCrit) applyAggregate(rows, c);   // Sum/Avg/Max/Min theo scope

  // (e) TT_ Summary & phân bổ dòng
  const sumCrit = criteria.filter(c => c.rowClass === 'Summary')
                          .sort((a,b) => a.priority - b.priority);
  for (const c of sumCrit) applyAllocation(rows, c);

  return rows;
}
```

## 3. Các hàm phân bổ (mock, khớp bảng ở MH TT_)

```javascript
// Prorata: chia giá trị tổng theo tỉ lệ công từng dòng
function prorata(total, rows) {
  const sumCong = rows.reduce((s,r)=>s+r.cong, 0) || 1;
  rows.forEach(r => r._alloc = total * (r.cong / sumCong));
}

// MaxSalaryRow: dồn vào dòng có lương lớn nhất (so theo tiêu chí Final)
function maxSalaryRow(total, rows, keyMa) {
  let idx = 0, mx = -Infinity;
  rows.forEach((r,i) => { const v = r.vals[keyMa] ?? 0; if (v > mx) { mx = v; idx = i; } });
  // tie-break: chọn dòng có 'to' lớn hơn (Need Confirm)
  rows.forEach((r,i) => r._alloc = (i === idx ? total : 0));
}

// LastStageRow: dồn vào dòng có ToDate lớn nhất
function lastStageRow(total, rows) {
  let idx = 0, mx = '';
  rows.forEach((r,i) => { if (r.to > mx) { mx = r.to; idx = i; } });
  rows.forEach((r,i) => r._alloc = (i === idx ? total : 0));
}

// Accumulate: cộng dồn (lũy kế) — trong kỳ (Need Confirm xuyên kỳ)
function accumulate(rows, keyMa) {
  let run = 0;
  rows.forEach(r => { run += (r.vals[keyMa] ?? 0); r._acc = run; });
}

// Aggregate theo scope
function applyAggregate(rows, c) {
  const groups = groupBy(rows, r => r[c.aggScope === 'Dept' ? 'dept'
                                    : c.aggScope === 'Ka' ? 'ka' : 'ban']);
  for (const g of Object.values(groups)) {
    const vals = g.map(r => r._srcVal ?? 0);
    let agg;
    if (c.aggOp === 'Sum') agg = vals.reduce((a,b)=>a+b,0);
    else if (c.aggOp === 'Avg') agg = vals.reduce((a,b)=>a+b,0) / (g.length||1);
    else if (c.aggOp === 'Max') agg = Math.max(...vals);
    else if (c.aggOp === 'Min') agg = Math.min(...vals);
    g.forEach(r => r.vals[c.ma] = agg);
  }
}
```

## 4. Mock NV mẫu (dùng cho preview & test case)

```javascript
window.MOCK_LSP_EMP = {
  emp:{ id:'1022907668', name:'Nguyễn Thị Loan' },
  slices:[
    { stage:1, ban:'CB101', ka:'CB1', dept:'CB', from:'2026-05-01', to:'2026-05-15', cong:12, ns:800, donGia:6200 },
    { stage:2, ban:'CB102', ka:'CB1', dept:'CB', from:'2026-05-16', to:'2026-05-31', cong:13, ns:900, donGia:6400 },
  ]
};
```

## 5. Kết quả kỳ vọng (dùng làm QA assertion)

- Sinh **2 dòng** (2 giai đoạn QTLV).
- `TT_LSP_LuongThoiGian` (Prorata): dòng1 = total×12/25, dòng2 = total×13/25.
- `TT_TNChiuThueTNCN` (LastStageRow): dồn 100% vào dòng `to='2026-05-31'`; dòng còn lại = 0.
- Tổng các dòng của tiêu chí Detail = giá trị nếu tính gộp 1 dòng (đảm bảo không thất thoát).

## 6. QA test note
- Positive: 2 slice → 2 dòng, phân bổ đúng 3 kịch bản.
- Boundary: 1 slice → mọi Allocation cho kết quả = chính dòng đó.
- Negative: Σcông = 0 → Prorata không chia, trả 0, không lỗi.
- Tie: 2 dòng lương bằng nhau → MaxSalaryRow chọn dòng `to` lớn hơn (ghi rõ Need Confirm).
- Circular: TT_ tham chiếu vòng → engine dừng, báo lỗi cấu hình.
