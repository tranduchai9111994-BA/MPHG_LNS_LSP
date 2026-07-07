# Đặc tả Markdown cho Claude code HTML — Demo diễn giải logic tính lương năng suất

> **Nguồn đầu vào:** file Excel `Alll_TH.xlsx` gồm các sheet trường hợp tính lương năng suất: `TH2-NS, TH3-Công, TH3-NS, TH4-Công, TH4-NS`.  
> **Mục tiêu:** Claude dùng file `.md` này để code prototype HTML: mỗi **trường hợp = 1 sheet/tabs**, trong mỗi trường hợp có các bước tính; khi bấm vào từng nhân viên thì mở bảng diễn giải chi tiết như hình mẫu modal người dùng cung cấp.

---

## 1. Kết quả mong muốn của HTML

HTML cần thể hiện được 3 tầng thông tin:

1. **Danh sách trường hợp**: mỗi sheet Excel là một case riêng.
2. **Luồng bước tính của từng case**: hiển thị tuần tự theo các khối bảng trong Excel.
3. **Drill-down theo nhân viên**: khi người dùng bấm vào một nhân viên, mở panel/modal chi tiết gồm:
   - Thông tin nhóm/bàn/ca/level nếu có.
   - Bước 1: công thực tế và công năng suất của nhân viên trong nhóm.
   - Bước 2: phân bổ năng suất/sản lượng theo công năng suất.
   - Bước 3: kết quả năng suất tính lương của nhân viên.
   - Bước 4: kiểm chứng tổng nhóm/tổng bàn/tổng PV để đối chiếu.

Giao diện cần ưu tiên mục đích **giải thích nghiệp vụ**, không chỉ hiển thị số cuối. Mỗi số quan trọng phải có công thức diễn giải bên cạnh.

---

## 2. Quy ước dữ liệu và công thức chung

### 2.1. Đối tượng chính

```js
const SCENARIOS = [
  {
    id: "TH2-NS",
    title: "TH2-NS — Tính năng suất theo công năng suất",
    sourceSheet: "TH2-NS",
    steps: []
  },
  {
    id: "TH3-CONG",
    title: "TH3-Công — Tính công thực tế/công năng suất cho Bàn và PV",
    sourceSheet: "TH3-Công",
    steps: []
  },
  {
    id: "TH3-NS",
    title: "TH3-NS — Phân bổ năng suất giữa nhiều bàn",
    sourceSheet: "TH3-NS",
    steps: []
  },
  {
    id: "TH4-CONG",
    title: "TH4-Công — Tính công cho Bàn và PV trước khi phân bổ",
    sourceSheet: "TH4-Công",
    steps: []
  },
  {
    id: "TH4-NS",
    title: "TH4-NS — Tính năng suất có trích/chia cho bộ phận phục vụ PV",
    sourceSheet: "TH4-NS",
    steps: []
  }
];
```

### 2.2. Công thức tổng quát

```text
Công thực tế NV ngày = dữ liệu chấm công theo N01..N31
Hệ số năng suất NV = nếu ô % có giá trị thì % / 100, nếu trống thì 1
Công năng suất NV ngày = Công thực tế NV ngày × Hệ số năng suất NV
Tổng công năng suất nhóm/ngày = SUM(Công năng suất của tất cả NV trong nhóm/ngày)
Tổng công năng suất NV/tháng = SUM(Công năng suất NV từ N01..N31)

Nếu có PV:
Hệ số cộng PV = 0.1
Công năng suất PV NV ngày = Công thực tế PV NV ngày × (Hệ số năng suất NV + 0.1)
```

### 2.3. Phân bổ năng suất

```text
Đơn giá 1 công năng suất/ngày = Năng suất hoặc sản lượng tính lương của nhóm/ngày / Tổng công năng suất nhóm/ngày
Năng suất tính lương NV/ngày = Công năng suất NV/ngày × Đơn giá 1 công năng suất/ngày
Năng suất tính lương NV/tháng = SUM(Năng suất tính lương NV từ N01..N31)
```

### 2.4. Phân bổ năng suất nhiều bàn

```text
Tổng công năng suất toàn Ka/ngày = SUM(Tổng công năng suất từng bàn/ngày)
Năng suất phân bổ cho bàn/ngày = Tổng năng suất thực tế toàn Ka/ngày × Tổng công năng suất bàn/ngày / Tổng công năng suất toàn Ka/ngày
Đơn giá 1 công năng suất của bàn/ngày = Năng suất phân bổ cho bàn/ngày / Tổng công năng suất bàn/ngày
```

### 2.5. Trường hợp có trích PV

```text
Công năng suất trích cho PV/ngày = giá trị công năng suất hoặc tỷ trọng PV được xác định riêng theo bảng PV
Năng suất còn lại cho bàn/ngày = Năng suất thực tế bàn/ngày - Năng suất trích cho PV/ngày
Năng suất tính lương NV bàn/ngày = Công năng suất NV bàn/ngày × Đơn giá sau khi trích PV
Năng suất tính lương NV PV/ngày = Công năng suất PV NV/ngày × Đơn giá hoặc quỹ phân bổ PV tương ứng
```

---

## 3. Cấu trúc các trường hợp từ Excel


### 3.1. Sheet `TH2-NS`

**Ý nghĩa:** Trường hợp mô phỏng phân bổ năng suất cho nhân viên trong Bàn 1/Ka1. Gồm 7 bước: công thực tế → công năng suất NV → công năng suất các bàn → năng suất thực tế → đơn giá 1 công NS (BC2) → BC3 năng suất tính lương → tổng hợp năng suất.

**Danh sách nhân viên Bàn 1:**

| Mã NV | Hệ số % | Ghi chú |
|---|---:|---|
| NV701 | 120 | Nhân viên kỹ năng cao |
| NV702 | — | Mặc định 100% |
| NV703 | — | Mặc định 100% |
| NV704 | — | Mặc định 100% |
| NV705 | — | Mặc định 100% |
| NV706 | 80 | Nhân viên mới / thử việc |
| NV707 | 100 | Ghi rõ 100% |
| NV708 | — | Mặc định 100% |
| NV709 | — | Mặc định 100% |
| NV710 | — | Mặc định 100% |
| NV711 | 102 | Hệ số cao hơn nhẹ |
| NV712 | — | Ít ngày công |

**7 bước tính — mỗi bước = 1 bảng dạng cột ngày N01–N31 (y như Excel):**

| Bước | Tên khối | Mục đích |
|---|---|---|
| Bước 1 | CÔNG THỰC TẾ | Dữ liệu đầu vào công thực tế NV/ngày |
| Bước 2 | CÔNG NĂNG SUẤT NHÂN VIÊN BÀN 1 | = CTT × (Hệ số % / 100) |
| Bước 3 | CÔNG NĂNG SUẤT CÁC BÀN | Tổng hợp công NS theo từng bàn/Ka |
| Bước 4 | NĂNG SUẤT THỰC TẾ CÁC BÀN | Sản lượng/năng suất thực tế |
| Bước 5 | 1 CÔNG NĂNG SUẤT — BC2 | = NS thực tế bàn / Công NS bàn |
| Bước 6 | BC 3 — NĂNG SUẤT TÍNH LƯƠNG | = Công NS NV × Đơn giá 1 công NS |
| Bước 7 | NĂNG SUẤT | Tổng hợp năng suất tính lương theo bàn |

#### Dữ liệu mẫu đầy đủ — Hard-code vào HTML

```javascript
const TH2_NS = {
  title: "TH2-NS — Tính năng suất theo công năng suất",
  ban: "Bàn 1",
  ka: "Ka1",

  // ================================================================
  // BƯỚC 1 + 2: CÔNG THỰC TẾ & CÔNG NĂNG SUẤT NV BÀN 1
  // ================================================================
  // ctt: mảng 31 phần tử (N01..N31), giá trị ∈ {0, 0.5, 1}
  // Công năng suất NV = ctt[i] × (pct / 100)
  employees: [
    { id:"NV701", pct:120, ctt:[1,1,1,0.5,1, 0,1,1,1,1, 1,1,0,1,0.5, 1,1,1,1,0, 1,1,1,0.5,1, 1,1,0.5,1,1,0] },       // Σ CTT = 25
    { id:"NV702", pct:100, ctt:[1,0.5,0.5,1,1, 0,1,1,1,1, 0,1,1,1,0, 1,1,1,1,0, 1,1,0,1,0, 0,1,1,1,1,0] },            // Σ CTT = 22
    { id:"NV703", pct:100, ctt:[1,1,1,0,0, 0,1,1,0,1, 0,1,1,1,0, 1,1,0,0.5,0, 1,1,1,0,0, 1,1,0,1,1,0.5] },             // Σ CTT = 19
    { id:"NV704", pct:100, ctt:[1,0.5,0.5,0,1, 0,1,0,0.5,0, 0,1,1,1,0, 1,0,0.5,1,0, 1,0,0,1,0, 1,1,0,1,1,0] },         // Σ CTT = 16
    { id:"NV705", pct:100, ctt:[1,1,1,1,0, 0,1,1,0,1, 0,0,1,1,0, 0,1,1,1,0, 1,1,1,0,1, 0,1,0,0,1,1] },                 // Σ CTT = 19
    { id:"NV706", pct:80,  ctt:[1,1,1,1,0.5, 0,1,1,1,0, 0,1,0,1,0, 1,0,1,1,0, 1,1,0,0,1, 1,0,1,0,1,0.5] },             // Σ CTT = 19
    { id:"NV707", pct:100, ctt:[0,1,1,1,0, 0,1,1,0,1, 0,1,1,1,0, 1,0,1,1,0, 0,1,0.5,0,1, 1,0,1,0,1,0.5] },             // Σ CTT = 18
    { id:"NV708", pct:100, ctt:[1,0,0,0.5,1, 0,0,1,0,0, 0,0,0,1,0, 1,0,0.5,0,0, 1,0,0,0,1, 1,0,0,0.5,0.5,0] },         // Σ CTT = 10
    { id:"NV709", pct:100, ctt:[1,1,0.5,1,1, 0,1,0,1,0, 0,0,1,1,0, 1,1,0,1,0, 1,0,1,1,0, 0,1,0,0,1,0.5] },             // Σ CTT = 17
    { id:"NV710", pct:100, ctt:[1,1,1,0,1, 0,0,1,0,1, 0,1,1,0,0, 1,1,0,0.5,0, 1,0,1,1,0, 0,0,1,1,1,0.5] },             // Σ CTT = 17
    { id:"NV711", pct:102, ctt:[1,1,1,1,0.5, 0,1,0,1,1, 0,1,0,0,0.5, 1,1,1,1,0, 1,0,0,0,1, 1,0,1,0,1,0] },             // Σ CTT = 18
    { id:"NV712", pct:100, ctt:[0,0,0,1,0, 0,1,0,0,0, 0,0,1,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,0,1,1] }                  // Σ CTT = 7
  ],
  // Σ CTT toàn Bàn 1 = 207

  // ================================================================
  // BƯỚC 3: CÔNG NĂNG SUẤT CÁC BÀN (daily totals per bàn)
  // ================================================================
  // Bàn 1: tính tự động = SUM(ctt[i] × pct/100) cho mỗi ngày
  // Các bàn khác: hard-code trực tiếp
  congNsCacBan: {
    // "Bàn 1" tính tự động từ employees
    "Bàn 2":  [12.50,10.84,10.50,12.00,8.00, 0,11.50,10.00,9.50,11.00, 0,10.50,9.00,11.50,2.00, 10.00,11.00,9.50,10.00,0, 11.00,8.50,10.00,7.50,9.00, 10.00,8.50,9.00,10.50,11.00,8.00],
    "Bàn 3":  [14.00,13.50,12.00,15.00,10.00, 0,13.00,12.50,11.00,14.00, 0,12.00,11.50,13.00,3.00, 13.50,12.00,11.00,12.50,0, 13.00,10.00,12.50,9.00,11.00, 12.00,10.00,11.50,13.00,12.00,9.00],
    "Bàn 4":  [15.00,14.50,13.00,14.00,9.00, 0,13.50,14.00,12.00,13.00, 0,14.50,11.00,12.00,1.50, 14.00,13.50,12.00,13.00,0, 14.00,12.00,11.50,10.00,12.00, 13.00,11.00,12.50,14.00,13.00,10.00],
    "Bàn 5":  [11.00,10.00,9.50,11.50,7.00, 0,10.50,9.00,8.50,10.00, 0,9.50,8.00,10.50,1.50, 9.00,10.00,8.50,9.00,0, 10.00,7.50,9.00,6.50,8.00, 9.00,7.50,8.00,9.50,10.00,7.00],
    "Bàn 6":  [12.00,11.00,10.50,12.50,8.00, 0,11.00,10.50,9.00,11.50, 0,10.00,9.50,11.00,2.00, 10.50,11.00,9.00,10.50,0, 11.00,8.00,10.00,7.00,9.50, 9.50,8.00,9.50,11.00,10.50,8.00],
    "Bàn 7":  [12.62,12.27,11.00,12.50,8.50, 0,12.00,11.50,10.00,12.00, 0,11.00,10.00,12.50,2.50, 11.50,12.00,10.50,11.50,0, 12.00,9.00,11.00,8.00,10.00, 10.50,9.00,10.00,12.00,11.50,8.50],
    "Bàn 8":  [12.97,12.50,11.50,13.50,9.00, 0,12.50,12.00,10.50,12.50, 0,11.50,10.50,12.00,2.50, 12.00,12.50,10.00,12.00,0, 12.50,9.50,11.50,8.50,10.50, 11.00,9.50,10.50,12.50,12.00,9.00],
    "Bàn 9":  [12.62,11.28,10.50,12.44,8.00, 0,11.50,11.00,9.50,11.50, 0,10.50,9.50,11.50,2.00, 11.00,11.50,9.50,10.50,0, 11.50,8.50,10.50,7.50,9.50, 10.00,8.50,9.50,11.50,11.00,8.00],
    "Bàn 10": [24.38,21.00,21.00,24.00,16.00, 0,22.50,21.00,19.00,23.00, 0,21.00,19.50,22.00,4.00, 22.00,23.00,19.00,21.00,0, 22.50,17.00,20.00,15.00,18.00, 20.00,17.00,19.00,22.00,21.00,16.00],
    "Ka11":   [14.82,14.20,12.00,15.00,10.00, 0,14.00,13.00,11.00,14.00, 0,12.00,11.50,13.50,3.00, 13.00,13.50,11.00,13.00,0, 13.50,10.50,12.50,9.50,11.50, 12.50,10.50,11.50,13.50,13.00,10.00],
    "PV1":    [8.00,7.50,7.00,8.50,5.50, 0,7.50,7.00,6.00,7.50, 0,7.00,6.00,7.50,1.50, 7.00,7.50,6.00,7.00,0, 7.50,5.50,6.50,5.00,6.00, 6.50,5.50,6.00,7.00,7.50,5.50]
  },
  // Ka1 = Bàn 1 + Bàn 2 + ... + Bàn 10 + Ka11 + PV1

  // ================================================================
  // BƯỚC 4: NĂNG SUẤT THỰC TẾ CÁC BÀN (daily production)
  // ================================================================
  nsThucTe: {
    "Bàn 1":  [200000,180000,170000,150000,120000, 0,200000,180000,100000,150000, 0,180000,160000,200000,20000, 200000,180000,150000,180000,0, 200000,120000,150000,100000,120000, 160000,140000,120000,180000,200000,100000],
    "Bàn 2":  [190000,180000,180000,200000,130000, 0,180000,160000,160000,180000, 0,170000,150000,200000,40000, 160000,180000,160000,170000,0, 180000,140000,170000,130000,150000, 170000,140000,150000,180000,190000,140000],
    "Bàn 3":  [250000,240000,210000,280000,180000, 0,240000,220000,200000,250000, 0,220000,200000,250000,60000, 250000,220000,200000,230000,0, 240000,180000,230000,160000,200000, 220000,180000,210000,240000,220000,160000],
    "Bàn 4":  [280000,260000,240000,260000,160000, 0,250000,260000,220000,240000, 0,270000,200000,220000,30000, 260000,250000,220000,240000,0, 260000,220000,210000,180000,220000, 240000,200000,230000,260000,240000,180000],
    "Bàn 5":  [180000,160000,150000,190000,120000, 0,170000,150000,140000,170000, 0,160000,130000,180000,25000, 150000,170000,140000,150000,0, 170000,130000,150000,110000,130000, 150000,130000,130000,160000,170000,120000],
    "Bàn 6":  [200000,180000,170000,210000,130000, 0,180000,170000,150000,190000, 0,170000,160000,180000,35000, 180000,180000,150000,180000,0, 180000,140000,170000,120000,160000, 160000,140000,160000,180000,180000,140000],
    "Bàn 7":  [220000,210000,190000,220000,150000, 0,210000,200000,170000,210000, 0,190000,170000,220000,45000, 200000,210000,180000,200000,0, 210000,160000,190000,140000,180000, 180000,160000,170000,210000,200000,150000],
    "Bàn 8":  [240000,230000,210000,250000,160000, 0,230000,220000,190000,230000, 0,210000,190000,220000,50000, 220000,230000,180000,220000,0, 230000,170000,210000,150000,190000, 200000,170000,190000,230000,220000,160000],
    "Bàn 9":  [200000,180000,170000,200000,130000, 0,190000,180000,150000,190000, 0,170000,160000,190000,35000, 180000,190000,160000,170000,0, 190000,140000,170000,130000,160000, 170000,140000,160000,190000,180000,130000],
    "Bàn 10": [400000,380000,360000,420000,280000, 0,390000,370000,330000,400000, 0,370000,340000,400000,70000, 390000,400000,330000,370000,0, 400000,300000,350000,260000,320000, 350000,300000,340000,390000,370000,280000],
    "Ka11":   [300000,280000,250000,310000,200000, 0,280000,260000,230000,280000, 0,250000,240000,270000,60000, 270000,280000,230000,270000,0, 280000,220000,260000,200000,240000, 260000,220000,240000,280000,270000,210000],
    "PV1":    [130000,120000,110000,140000,90000, 0,120000,110000,100000,120000, 0,110000,100000,120000,25000, 110000,120000,100000,110000,0, 120000,90000,110000,80000,100000, 110000,90000,100000,120000,120000,90000]
  },
  // Ka1 nsThucTe = SUM tất cả bàn

  // ================================================================
  // BƯỚC 5: 1 CÔNG NĂNG SUẤT — BC2 (Đơn giá)
  // ================================================================
  // Tính tự động:
  // donGia1CongNS[bàn][day] = nsThucTe[bàn][day] / congNsCacBan[bàn][day]
  // Nếu congNs = 0 thì donGia = 0

  // ================================================================
  // BƯỚC 6: BC3 — NĂNG SUẤT TÍNH LƯƠNG
  // ================================================================
  // Tính tự động:
  // nsLuong[nv][day] = congNS_NV[day] × donGia1CongNS["Bàn 1"][day]
  // Trong đó: congNS_NV[day] = ctt[day] × (pct / 100)

  // ================================================================
  // BƯỚC 7: NĂNG SUẤT (tổng hợp)
  // ================================================================
  // nsLuong_ban[day] = SUM(nsLuong[nv][day]) cho tất cả NV trong bàn
  // Kiểm chứng: nsLuong_ban[day] phải = nsThucTe["Bàn 1"][day]
};

// ===== HÀM TÍNH CÁC BƯỚC DẪN XUẤT =====
function tinhTH2NS(data) {
  // Bước 2: Công năng suất NV
  data.employees.forEach(emp => {
    emp.cns = emp.ctt.map(v => +(v * emp.pct / 100).toFixed(3));
    emp.tongCTT = emp.ctt.reduce((s,v) => s+v, 0);
    emp.tongCNS = emp.cns.reduce((s,v) => s+v, 0);
  });

  // Bước 3: Công NS Bàn 1 = SUM CNS NV theo ngày
  const cnsBan1 = Array(31).fill(0);
  data.employees.forEach(emp => {
    emp.cns.forEach((v,i) => cnsBan1[i] += v);
  });
  data.congNsCacBan["Bàn 1"] = cnsBan1.map(v => +v.toFixed(2));

  // Tổng Ka1
  const ka1 = Array(31).fill(0);
  for (const ban in data.congNsCacBan) {
    data.congNsCacBan[ban].forEach((v,i) => ka1[i] += v);
  }
  data.congNsCacBan["Tổng Ka1"] = ka1.map(v => +v.toFixed(2));

  // Bước 5: Đơn giá 1 công NS
  data.donGia = {};
  for (const ban in data.nsThucTe) {
    data.donGia[ban] = data.nsThucTe[ban].map((ns, i) => {
      const cns = data.congNsCacBan[ban]?.[i] || 0;
      return cns > 0 ? +(ns / cns).toFixed(2) : 0;
    });
  }

  // Bước 6: BC3 — NS tính lương NV
  const dgBan1 = data.donGia["Bàn 1"];
  data.employees.forEach(emp => {
    emp.nsLuong = emp.cns.map((cns, i) => +(cns * dgBan1[i]).toFixed(0));
    emp.tongNsLuong = emp.nsLuong.reduce((s,v) => s+v, 0);
  });

  // Bước 7: Tổng NS Bàn 1 = SUM nsLuong NV
  const nsBan1 = Array(31).fill(0);
  data.employees.forEach(emp => {
    emp.nsLuong.forEach((v,i) => nsBan1[i] += v);
  });
  data.nsLuongBan1 = nsBan1;

  return data;
}
```

#### Ví dụ layout bảng dạng cột ngày — Bước 1: CÔNG THỰC TẾ

Mỗi bước hiển thị dưới dạng **cột ngày** (N01..N31 là header cột, mỗi NV là 1 dòng):

| Bàn 1 | % | N01 | N02 | N03 | N04 | N05 | ... | N30 | N31 | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| NV701 | 120 | 1 | 1 | 1 | 0.5 | 1 | ... | 1 | 0 | 25 |
| NV702 | — | 1 | 0.5 | 0.5 | 1 | 1 | ... | 1 | 0 | 22 |
| NV703 | — | 1 | 1 | 1 | 0 | 0 | ... | 1 | 0.5 | 19 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| NV712 | — | 0 | 0 | 0 | 1 | 0 | ... | 1 | 1 | 7 |
| **Tổng B1** | | **10** | **9** | **8.5** | **8** | **7** | ... | **11** | **4.5** | **207** |

#### Ví dụ layout — Bước 2: CÔNG NĂNG SUẤT NHÂN VIÊN BÀN 1

| Bàn 1 | % | N01 | N02 | N03 | ... | N31 | Tổng |
|---|---:|---:|---:|---:|---:|---:|---:|
| NV701 | 120 | 1.20 | 1.20 | 1.20 | ... | 0 | 30.00 |
| NV702 | — | 1.00 | 0.50 | 0.50 | ... | 0 | 22.00 |
| NV706 | 80 | 0.80 | 0.80 | 0.80 | ... | 0.40 | 15.20 |
| NV711 | 102 | 1.02 | 1.02 | 1.02 | ... | 0 | 18.36 |
| ... | ... | ... | ... | ... | ... | ... | ... |
| **Tổng B1** | | **10.02** | **9.02** | **8.52** | ... | **...** | **~211** |

#### Ví dụ layout — Bước 3: CÔNG NĂNG SUẤT CÁC BÀN

| Ka | N01 | N02 | N03 | ... | N31 | Tổng |
|---|---:|---:|---:|---:|---:|---:|
| Bàn 1 | 10.02 | 9.02 | 8.52 | ... | ... | ~211 |
| Bàn 2 | 12.50 | 10.84 | 10.50 | ... | 8.00 | ... |
| Bàn 3 | 14.00 | 13.50 | 12.00 | ... | 9.00 | ... |
| ... | ... | ... | ... | ... | ... | ... |
| Bàn 10 | 24.38 | 21.00 | 21.00 | ... | 16.00 | ... |
| Ka11 | 14.82 | 14.20 | 12.00 | ... | 10.00 | ... |
| PV1 | 8.00 | 7.50 | 7.00 | ... | 5.50 | ... |
| **Tổng KA1** | **...** | **...** | **...** | ... | **...** | **...** |

#### Ví dụ layout — Bước 4: NĂNG SUẤT THỰC TẾ CÁC BÀN

| Ka | N01 | N02 | N03 | ... | N31 | Tổng |
|---|---:|---:|---:|---:|---:|---:|
| Bàn 1 | 200,000 | 180,000 | 170,000 | ... | 100,000 | ... |
| Bàn 2 | 190,000 | 180,000 | 180,000 | ... | 140,000 | ... |
| ... | ... | ... | ... | ... | ... | ... |
| **Tổng KA1** | **...** | **...** | **...** | ... | **...** | **...** |

#### Ví dụ layout — Bước 5: 1 CÔNG NĂNG SUẤT (BC2)

| Ka | N01 | N02 | N03 | ... | N31 |
|---|---:|---:|---:|---:|---:|
| Bàn 1 | 19,960.08 | 19,955.65 | 19,953.05 | ... | ... |
| Bàn 2 | 15,200.00 | 16,605.17 | 17,142.86 | ... | 17,500.00 |
| ... | ... | ... | ... | ... | ... |

*Công thức: `donGia[bàn][day] = nsThucTe[bàn][day] / congNsCacBan[bàn][day]`*

#### Ví dụ layout — Bước 6: BC3 — NĂNG SUẤT TÍNH LƯƠNG

| Bàn 1 | N01 | N02 | N03 | ... | N31 | Tổng |
|---|---:|---:|---:|---:|---:|---:|
| NV701 | 23,952 | 23,947 | 23,944 | ... | 0 | ... |
| NV702 | 19,960 | 9,978 | 9,977 | ... | 0 | ... |
| NV706 | 15,968 | 15,964 | 15,962 | ... | ... | ... |
| NV711 | 20,359 | 20,355 | 20,352 | ... | 0 | ... |
| ... | ... | ... | ... | ... | ... | ... |
| **Tổng B1** | **200,000** | **180,000** | **170,000** | ... | **100,000** | **...** |

*Kiểm chứng: Tổng B1 BC3 phải = Năng suất thực tế Bàn 1 (Bước 4)*

#### Ví dụ layout — Bước 7: NĂNG SUẤT

| Ka | N01 | N02 | N03 | ... | N31 | Tổng |
|---|---:|---:|---:|---:|---:|---:|
| Bàn 1 | 200,000 | 180,000 | 170,000 | ... | 100,000 | ... |
| Bàn 2 | 190,000 | 180,000 | 180,000 | ... | 140,000 | ... |
| ... | ... | ... | ... | ... | ... | ... |
| **Tổng KA1** | **...** | **...** | **...** | ... | **...** | **...** |

*Kiểm chứng: Bước 7 phải khớp Bước 4 (TH2 không có PV nên không trích)*

**Tổng kiểm chứng TH2-NS:**

| Chỉ tiêu | Giá trị |
|---|---:|
| Σ CTT Bàn 1 (12 NV) | 207 |
| Σ CNS Bàn 1 (sau hệ số) | ~211 (tính tự động) |
| Σ NS thực tế Bàn 1/tháng | SUM(nsThucTe["Bàn 1"]) |
| Σ NS tính lương Bàn 1 = Σ NS thực tế Bàn 1 | Đạt ✓ |
| Σ NS Ka1 = SUM tất cả bàn | Đạt ✓ |


### 3.2. Sheet `TH3-Công`

**Ý nghĩa:** Trường hợp tính công cho Bàn 1 và nhóm PV1. Điểm chính là biến đổi từ công thực tế sang công năng suất; riêng PV có cộng thêm hệ số phục vụ 0.1.

**Các khối/bước nhận diện trong sheet:**

| Bước | Dòng bắt đầu Excel | Tên khối | Mục đích hiển thị trên HTML |
|---:|---:|---|---|
| 1 | 1 | CÔNG THỰC TẾ | Bảng dữ liệu đầu vào công thực tế theo nhân viên/ngày. |
| 2 | 16 | CÔNG NĂNG SUẤT | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 3 | 31 | NĂNG SUẤT TÍNH LƯƠNG | Bảng kết quả năng suất tính lương từng nhân viên/ngày/tháng. |
| 4 | 48 | CÔNG THỰC TẾ | Bảng dữ liệu đầu vào công thực tế theo nhân viên/ngày. |
| 5 | 63 | CÔNG NĂNG SUẤT | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 6 | 79 | NĂNG SUẤT TÍNH LƯƠNG | Bảng kết quả năng suất tính lương từng nhân viên/ngày/tháng. |

**Một số tổng cần đưa vào vùng kiểm chứng:**

| Chỉ tiêu tổng | Giá trị tham khảo |
|---|---:|
| Tổng B1 |  |
| Tổng B1 |  |
| Tổng B1 |  |
| Tổng PV1 |  |
| Tổng PV1 |  |
| Tổng PV1 |  |


### 3.3. Sheet `TH3-NS`

**Ý nghĩa:** Trường hợp phân bổ năng suất giữa nhiều bàn dựa trên tỷ trọng công năng suất. Sau đó tính lại năng suất tính lương từng nhân viên của Bàn 1.

**Các khối/bước nhận diện trong sheet:**

| Bước | Dòng bắt đầu Excel | Tên khối | Mục đích hiển thị trên HTML |
|---:|---:|---|---|
| 1 | 1 | CÔNG NĂNG SUẤT | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 2 | 9 | NĂNG SUẤT THỰC TẾ | Bảng sản lượng/năng suất thực tế làm căn cứ phân bổ. |
| 3 | 17 | 1 CÔNG NĂNG SUẤT - BÁO CÁO SỐ 2 LẤY Ở ĐÂY | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 4 | 24 | NĂNG SUẤT | Hiển thị bảng dữ liệu và công thức diễn giải tương ứng. |
| 5 | 31 | CÔNG THỰC TẾ | Bảng dữ liệu đầu vào công thực tế theo nhân viên/ngày. |
| 6 | 46 | CÔNG NĂNG SUẤT | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 7 | 61 | BC 3 - NĂNG SUẤT TÍNH LƯƠNG | Bảng kết quả năng suất tính lương từng nhân viên/ngày/tháng. |

**Một số tổng cần đưa vào vùng kiểm chứng:**

| Chỉ tiêu tổng | Giá trị tham khảo |
|---|---:|
| Tổng B1 |  |
| Tổng B1 |  |
| Tổng B1 |  |


### 3.4. Sheet `TH4-Công`

**Ý nghĩa:** Trường hợp tính công tương tự TH3-Công nhưng dùng cho luồng TH4, chuẩn bị dữ liệu công cho logic trích/chia PV.

**Các khối/bước nhận diện trong sheet:**

| Bước | Dòng bắt đầu Excel | Tên khối | Mục đích hiển thị trên HTML |
|---:|---:|---|---|
| 1 | 1 | CÔNG THỰC TẾ | Bảng dữ liệu đầu vào công thực tế theo nhân viên/ngày. |
| 2 | 16 | CÔNG NĂNG SUẤT | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 3 | 31 | NĂNG SUẤT TÍNH LƯƠNG | Bảng kết quả năng suất tính lương từng nhân viên/ngày/tháng. |
| 4 | 48 | CÔNG THỰC TẾ | Bảng dữ liệu đầu vào công thực tế theo nhân viên/ngày. |
| 5 | 63 | CÔNG NĂNG SUẤT | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 6 | 79 | NĂNG SUẤT TÍNH LƯƠNG | Bảng kết quả năng suất tính lương từng nhân viên/ngày/tháng. |

**Một số tổng cần đưa vào vùng kiểm chứng:**

| Chỉ tiêu tổng | Giá trị tham khảo |
|---|---:|
| Tổng B1 |  |
| Tổng B1 |  |
| Tổng B1 |  |
| Tổng PV1 |  |
| Tổng PV1 |  |
| Tổng PV1 |  |


### 3.5. Sheet `TH4-NS`

**Ý nghĩa:** Trường hợp đầy đủ nhất: tính công Bàn 1, công PV, công các bàn, công được trích cho PV, công sau khi cộng PV, năng suất thực tế, BC2, BC3 cho bàn, BC3 cho PV, và năng suất sau khi giảm cho PV.

**Các khối/bước nhận diện trong sheet:**

| Bước | Dòng bắt đầu Excel | Tên khối | Mục đích hiển thị trên HTML |
|---:|---:|---|---|
| 1 | 1 | CÔNG THỰC TẾ BÀN 1 | Bảng dữ liệu đầu vào công thực tế theo nhân viên/ngày. |
| 2 | 16 | CÔNG NĂNG SUẤT BÀN 1 | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 3 | 32 | CÔNG THỰC TẾ PHỤC VỤ | Bảng dữ liệu đầu vào công thực tế theo nhân viên/ngày. |
| 4 | 47 | CÔNG NĂNG SUẤT PHỤC VỤ | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 5 | 64 | CÔNG NĂNG SUẤT CÁC BÀN | Bảng quy đổi công thực tế sang công năng suất theo hệ số. |
| 6 | 81 | CÔNG NĂNG SUẤT ĐƯỢC TRÍCH CHO BỘ PHẬN PHỤC VỤ CỦA CÁC BÀN | Hiển thị bảng dữ liệu và công thức diễn giải tương ứng. |
| 7 | 98 | CÔNG NĂNG SUẤT SAU KHI CỘNG THÊM CÔNG PV | Bảng xử lý công hoặc năng suất liên quan bộ phận phục vụ PV. |
| 8 | 114 | NĂNG SUẤT THỰC TẾ | Bảng sản lượng/năng suất thực tế làm căn cứ phân bổ. |
| 9 | 130 | BC 2 -SẢN LƯỢNG 1 CÔNG NĂNG SUẤT SAU KHI ĐÃ TRÍCH CHO PV | Bảng đơn giá hoặc 1 công năng suất dùng để tính lương. |
| 10 | 146 | SẢN LƯỢNG TRÍCH CHO BỘ PHẬN PV | Bảng xử lý công hoặc năng suất liên quan bộ phận phục vụ PV. |
| 11 | 162 | BC 3 - NĂNG SUẤT TÍNH LƯƠNG CHO BÀN 1 | Bảng kết quả năng suất tính lương từng nhân viên/ngày/tháng. |
| 12 | 180 | BC3 - NĂNG SUẤT TÍNH LƯƠNG NHÂN VIÊN BỘ PHẬN PV | Bảng kết quả năng suất tính lương từng nhân viên/ngày/tháng. |
| 13 | 198 | NĂNG SUẤT SAU KHI GIẢM CHO PV | Bảng xử lý công hoặc năng suất liên quan bộ phận phục vụ PV. |

**Một số tổng cần đưa vào vùng kiểm chứng:**

| Chỉ tiêu tổng | Giá trị tham khảo |
|---|---:|
| Tổng B1 |  |
| Tổng B1 |  |
| Tổng PV1 |  |
| Tổng PV1 |  |
| Tổng KA1 |  |
| Tổng KA1 |  |
| Tổng KA1 |  |
| Tổng KA1 |  |
| Tổng KA1 |  |
| Tổng KA1 |  |
| Tổng B1 |  |
| Tổng PV1 |  |


---

## 4. Thiết kế modal khi bấm vào từng nhân viên

### 4.1. Trigger

- Trong các bảng công/năng suất, cột `Mã NV` hoặc `Họ tên` phải là link/button.
- Khi bấm vào nhân viên, mở modal/panel chi tiết.
- Tiêu đề modal theo mẫu:

```text
Chi tiết logic — [Mã sheet] — [Tên bàn/nhóm] — Đang xem: [Mã NV] [Tên NV]
```

### 4.2. Layout modal

Modal gồm các block sau:

#### Block A — Thông tin nhóm

| Trường | Giá trị hiển thị |
|---|---|
| Trường hợp | TH2-NS / TH3-Công / TH3-NS / TH4-Công / TH4-NS |
| Nhóm/Bàn | Bàn 1 / PV1 / Ka1 |
| Mã NV | NV01..NV12 |
| Hệ số % | Ví dụ 110%, 105%, 90%, 85%, hoặc mặc định 100% |
| Tổng công thực tế | Tổng cột `Tổng` của bảng công thực tế |
| Tổng công năng suất | Tổng cột `Tổng` của bảng công năng suất |
| Kết quả cuối | Năng suất tính lương/tháng của nhân viên |

#### Bước 1 — Quy đổi công thực tế sang công năng suất

Hiển thị bảng theo dạng **cột ngày** (mỗi ngày là 1 cột, mỗi chỉ tiêu là 1 dòng) để tiết kiệm diện tích:

| Chỉ tiêu | N01 | N02 | N03 | ... | N31 | Tổng |
|---|---:|---:|---:|---:|---:|---:|
| Công thực tế | 1 | 1 | 1 | ... | 0 | 27 |
| Hệ số % | 110% | 110% | 110% | ... | 110% | — |
| Hệ số cộng PV | 0 | 0 | 0 | ... | 0 | — |
| Công thức | `1 × 110%` | `1 × 110%` | `1 × 110%` | ... | — | `SUM(N01:N31)` |
| Công năng suất | 1.10 | 1.10 | 1.10 | ... | 0 | 29.70 |

Nếu case là PV thì công thức đổi thành:

```text
Công năng suất PV = Công thực tế × (Hệ số % + 0.1)
```

#### Bước 2 — Xác định đơn giá/1 công năng suất

Hiển thị bảng theo dạng **cột ngày**:

| Chỉ tiêu | N01 | N02 | ... | N31 |
|---|---:|---:|---:|---:|
| Năng suất/sản lượng được phân bổ | 326.754,67 | 586.197,88 | ... | — |
| Tổng công năng suất nhóm | 11,92 | 10,716 | ... | — |
| Công thức đơn giá | `326.754,67 / 11,92` | `586.197,88 / 10,716` | ... | — |
| Đơn giá 1 công NS | 27.412,30 | 54.703,05 | ... | — |

Tùy case:

- TH2-NS: nguồn năng suất có thể là năng suất nhóm/bàn đã chốt.
- TH3-NS: năng suất bàn được phân bổ từ tổng Ka theo tỷ trọng công năng suất bàn.
- TH4-NS: trước khi tính đơn giá cần trừ hoặc tách phần PV theo bảng trích PV.

#### Bước 3 — Tính năng suất cho nhân viên

Hiển thị bảng theo dạng **cột ngày**:

| Chỉ tiêu | N01 | N02 | ... | N31 | Tổng |
|---|---:|---:|---:|---:|---:|
| Công năng suất NV | 1,10 | 1,10 | ... | 0 | 29,70 |
| Đơn giá 1 công NS | 27.412,30 | 54.703,05 | ... | — | — |
| Công thức | `1,10 × 27.412,30` | `1,10 × 54.703,05` | ... | — | `SUM(N01:N31)` |
| Năng suất tính lương | 30.153,54 | 60.173,35 | ... | 0 | 1.045.473,63 |

#### Bước 4 — Kết quả cuối & kiểm chứng

Hiển thị card nổi bật:

```text
Kết quả năng suất tính lương của NV01 = 1.045.473,63
```

Bên dưới cần có các dòng kiểm chứng:

| Kiểm chứng | Công thức | Trạng thái |
|---|---|---|
| Tổng năng suất nhân viên trong bàn = Tổng năng suất bàn | `SUM(NS_NV) = NS_Bàn` | Đạt/Không đạt |
| Tổng công năng suất nhân viên = Tổng công năng suất nhóm | `SUM(CNS_NV) = CNS_Nhóm` | Đạt/Không đạt |
| Nếu có PV: Tổng bàn sau giảm + Tổng PV = Tổng năng suất thực tế | `NS_SauGiảm + NS_PV = NS_ThựcTế` | Đạt/Không đạt |

---

## 5. Gợi ý component HTML/CSS/JS

### 5.1. Cấu trúc HTML

```html
<div class="app-shell">
  <header class="topbar">
    <h1>Tính Lương Năng Suất</h1>
    <button id="btnPrint">In màn hình</button>
  </header>

  <nav class="scenario-tabs"></nav>

  <main id="scenarioContainer">
    <!-- Render từng trường hợp tại đây -->
  </main>

  <div id="employeeModal" class="modal hidden">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modalTitle"></h2>
        <button id="modalClose">×</button>
      </div>
      <div id="modalBody"></div>
    </div>
  </div>
</div>
```

### 5.2. Màu sắc theo loại bước

```css
.step-input { border-left: 4px solid #2563eb; }      /* Công thực tế */
.step-calc  { border-left: 4px solid #f97316; }      /* Tính toán */
.step-final { border-left: 4px solid #16a34a; }      /* Kết quả */
.step-check { border-left: 4px solid #7c3aed; }      /* Kiểm chứng */
.employee-link { color: #0057b8; font-weight: 700; cursor: pointer; }
.formula { font-family: Consolas, monospace; background: #f6f8fa; padding: 2px 6px; border-radius: 4px; }
```

### 5.3. Hàm render cần có

```js
function renderScenarioTabs(scenarios) {}
function renderScenario(scenarioId) {}
function renderStepTable(step) {}
function openEmployeeModal(scenarioId, employeeId, groupId) {}
function buildEmployeeExplanation(scenario, employeeId, groupId) {}
function formatNumber(value, digits = 2) {}
function verifyScenarioTotals(scenario) {}
```

---

## 6. Mapping dữ liệu khuyến nghị cho Claude

### 6.1. Model `employeeDailyDetail`

```js
const employeeDailyDetail = {
  scenarioId: "TH3-NS",
  groupId: "BAN_1",
  employeeId: "NV01",
  employeeName: "NV01",
  percent: 110,
  days: [
    {
      day: "N01",
      actualWork: 1,
      productivityWork: 1.1,
      groupProductivity: 326754.67259181809,
      groupProductivityWorkTotal: 11.92,
      unitRate: 27412.30474763575,
      salaryProductivity: 30153.535222399329,
      formula: "1.1 × 27412.30474763575"
    }
  ],
  totals: {
    actualWork: 27,
    productivityWork: 29.7,
    salaryProductivity: 1045473.6255755679
  }
};
```

### 6.2. Model `scenarioStep`

```js
const scenarioStep = {
  stepNo: 1,
  code: "CALC-01",
  title: "Công năng suất",
  description: "Quy đổi công thực tế sang công năng suất theo hệ số % của nhân viên.",
  formula: "CNS = Công thực tế × Hệ số %",
  tableType: "employee-by-day",
  sourceSheet: "TH3-NS",
  sourceBlock: "CÔNG NĂNG SUẤT",
  rows: []
};
```

---

## 7. Checklist bắt buộc khi Claude code HTML

- [ ] Mỗi sheet Excel hiển thị thành **1 tab/trường hợp**.
- [ ] Mỗi tab có timeline các bước tính đúng thứ tự bảng trong Excel.
- [ ] Có badge loại bước: `INPUT`, `CALC-01`, `CALC-02`, `FINAL`, `VERIFY`.
- [ ] Bấm vào từng nhân viên mở modal chi tiết.
- [ ] Modal có đủ: thông tin nhóm, bước công thực tế → công năng suất, bước đơn giá, bước tính lương, kết quả cuối, kiểm chứng.
- [ ] Bảng trong modal phải có cột `Công thức` để diễn giải từng dòng.
- [ ] Các số tiền/năng suất format kiểu Việt Nam: `1.045.473,63`.
- [ ] Các giá trị công format tối đa 3 chữ số thập phân: `10,716`, `29,700`.
- [ ] Các ngày có giá trị 0 cần hiển thị rõ, không bỏ cột.
- [ ] Có nút `Xuất Excel chi tiết` có thể để mock nếu chưa triển khai.
- [ ] Có nút `In màn hình`.
- [ ] Có vùng cảnh báo nếu tổng kiểm chứng không khớp.

---

## 8. Prompt ngắn gọn đưa trực tiếp cho Claude

```text
Hãy code một file HTML/CSS/JS standalone mô phỏng chức năng “Tính Lương Năng Suất” theo đặc tả Markdown này.

Yêu cầu chính:
1. Mỗi sheet/trường hợp trong file Excel là 1 tab.
2. Trong mỗi tab hiển thị các bước tính theo thứ tự bảng trong sheet.
3. Khi bấm vào từng nhân viên, mở modal chi tiết diễn giải logic tính như ảnh mẫu: thông tin nhóm, bước 1 công năng suất, bước 2 chia năng suất theo công năng suất, kết quả cuối, kiểm chứng tổng.
4. Dữ liệu có thể hard-code từ các ví dụ trong đặc tả, nhưng cấu trúc phải dễ thay bằng JSON thật sau này.
5. Ưu tiên UI rõ ràng, bảng có công thức, số format tiếng Việt, có badge INPUT/CALC/FINAL/VERIFY.
6. Không cần backend. Chỉ tạo prototype HTML chạy trực tiếp trên browser.
```

---

## 9. Ghi chú nghiệp vụ cần giữ nguyên

- `Công thực tế` là dữ liệu đầu vào, không tự suy diễn.
- `Công năng suất` là công đã nhân hệ số phần trăm hoặc cộng hệ số PV nếu thuộc nhóm phục vụ.
- `Năng suất thực tế` là quỹ/sản lượng để phân bổ.
- `1 công năng suất` hoặc `đơn giá 1 công NS` là cầu nối giữa công và tiền/năng suất tính lương.
- `Năng suất tính lương` là kết quả cuối cần trả về cho từng nhân viên.
- Trong TH4-NS, PV là logic quan trọng: phải có bước trích cho PV, tính cho PV, sau đó giảm/đối chiếu phần còn lại của bàn.
