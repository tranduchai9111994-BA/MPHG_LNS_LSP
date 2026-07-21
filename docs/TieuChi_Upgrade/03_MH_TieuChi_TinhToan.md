# 03 — Prototype: MH Tiêu chí tính toán (LSP-TT-001)

**File tạo:** `lsp/set3-tieuchi-tinhtoan.html`
**Core gốc:** "Định nghĩa tiêu chí tính toán" (Image 3)
**Loại:** Enhancement/Customization — thêm nhóm "Hành vi dòng" (RowClass/Allocation/AllowSumPrev/Priority). **Đây là màn hình lõi nhất giải bài toán phân bổ.**

## 1. Layout (reuse chuẩn skill)

```
breadcrumb: Lương › Thiết lập (System) › Thiết lập công thức tính lương › Định nghĩa tiêu chí tính toán
page-title: ĐỊNH NGHĨA TIÊU CHÍ TÍNH TOÁN
form-panel ← thêm section Hành vi dòng
actions-bar: [Tìm Kiếm][Làm mới][Lưu][Xóa][Xuất dữ liệu]
data-grid ← thêm 4 cột
ghi-chú-nghiệp-vụ
```

## 2. Form fields

Giữ core: **Mã** (đỏ), **Tên tiếng Anh**, **Tên tiếng Việt** (đỏ), **Thứ tự sắp xếp** (đỏ), **Ghi chú**, **Mã hóa dữ liệu** (checkbox), **Sử dụng** (checkbox).

### Section mới: "🔧 Hành vi dòng (LSP)"

| Field | Type | Required | Default | Options |
|-------|------|----------|---------|---------|
| Phân loại (RowClass) | dropdown | R | Detail | Info / Detail / Summary |
| Cách phân bổ (Allocation) | dropdown | R | None | None / Prorata / OldStage / NewStage / MaxSalaryRow / LastStageRow / Accumulate |
| Cho phép SUM tiêu chí trước (AllowSumPrev) | dropdown Y/N | O | N | Y / N |
| Độ ưu tiên (Priority) | number | R | 0 | ≥ 0 |

Ràng buộc:
- `Allocation=Prorata` chỉ hợp lệ khi `RowClass=Detail`. Message: `Prorata chỉ áp dụng cho tiêu chí Chi tiết`.
- `RowClass=Summary` → gợi ý `AllowSumPrev=Y` (không bắt buộc).
- `Priority ≥ 0`. Message: `Độ ưu tiên phải ≥ 0`.
- Chống circular reference: nếu công thức tham chiếu chính nó hoặc tạo vòng → chặn (mock: kiểm tra chuỗi mã trong công thức so với danh sách Priority).

### Bảng gợi ý Allocation → bài toán (hiển thị dạng info-bar hoặc tooltip)

| Allocation | Dùng cho | Ý nghĩa |
|-----------|----------|---------|
| Prorata | Lương ngày công | chia theo công từng dòng: `giá_trị × (công_dòng / Σcông)` |
| MaxSalaryRow | Bảo hiểm | dồn toàn bộ vào dòng lương cao nhất, dòng khác = 0 |
| LastStageRow | Thuế TNCN | dồn vào dòng có ToDate lớn nhất (giai đoạn cuối) |
| Accumulate | Lũy kế | cộng dồn giá trị các dòng trước |
| OldStage/NewStage | Đặc thù | gán theo giai đoạn cũ/mới |
| None | Detail thường | giữ nguyên theo dòng |

## 3. Data grid — cột

`☐ | STT | ✎ | Mã | Tên tiếng Anh | Tên tiếng Việt | Ghi chú | Thứ tự | **RowClass** | **Allocation** | **SUM trước** | **Priority** | Sử dụng | Mã hóa | audit(4)`

4 cột mới đặt sau `Thứ tự`.

## 4. Mock data (dựa catalog + bài toán phân bổ)

```javascript
window.MOCK_TT = [
  {ma:'TT_LSP_Base_L0', en:'Base L0', vi:'Lương gốc L0', prio:10, rowClass:'Detail', alloc:'None', sumPrev:'N', used:true},
  {ma:'TT_LSP_TienL1', en:'After L1', vi:'Tiền sau ĐC lần 1', prio:20, rowClass:'Detail', alloc:'None', sumPrev:'N', used:true},
  {ma:'TT_LSP_TienL2', en:'After L2', vi:'Tiền sau ĐC lần 2', prio:30, rowClass:'Detail', alloc:'None', sumPrev:'N', used:true},
  {ma:'TT_LSP_TienL3', en:'After L3', vi:'Tiền sau ĐC lần 3', prio:40, rowClass:'Detail', alloc:'None', sumPrev:'N', used:true},
  {ma:'TT_LSP_LuongThoiGian', en:'Time salary', vi:'Lương thời gian (ngày công)', prio:50, rowClass:'Detail', alloc:'Prorata', sumPrev:'N', used:true},
  {ma:'TT_LSP_LuongDongBH', en:'Insurance base', vi:'Lương đóng bảo hiểm', prio:60, rowClass:'Summary', alloc:'MaxSalaryRow', sumPrev:'Y', used:true},
  {ma:'TT_LSP_ThuNhapTinhThue', en:'Taxable income', vi:'Thu nhập tính thuế', prio:70, rowClass:'Summary', alloc:'LastStageRow', sumPrev:'Y', used:true},
  {ma:'TT_LSP_KetQua_Final', en:'Final result', vi:'Tổng LSP cuối cùng', prio:99, rowClass:'Summary', alloc:'None', sumPrev:'Y', used:true},
];
```

## 5. Hành vi JS
- **Lưu**: validate R-TT-01/02/03/04; cập nhật MOCK_TT; render grid; audit; showAlert.
- **✎ Sửa / Xóa / Tìm Kiếm / Xuất**: chuẩn danh mục.
- **Kiểm tra circular** (mock): khi lưu, nếu công thức chứa mã của tiêu chí có Priority ≥ Priority hiện tại → cảnh báo warning.

## 6. Ghi chú nghiệp vụ (điền sẵn)

> `RowClass`: Info (định danh) / Detail (tính per-dòng) / Summary (gộp nhiều dòng). `Allocation` quyết định khi NV nhiều dòng: Prorata=chia theo công, MaxSalaryRow=dồn dòng lương cao nhất (BH), LastStageRow=dồn dòng cuối (thuế), Accumulate=lũy kế. `Priority` = thứ tự engine tính.
> Need Confirm: (1) `MaxSalaryRow` so theo TT_ nào (L0/L4/Final)? 2 dòng bằng nhau chọn dòng nào? (2) `Accumulate` trong kỳ hay xuyên kỳ (retro)? (3) auto-resolve dependency theo Priority?

## 7. Acceptance
- Lưu 4 thuộc tính; ràng buộc Prorata↔Detail hoạt động; circular reference bị cảnh báo; grid hiển thị đủ cột; tiêu chí cũ giữ nguyên.
