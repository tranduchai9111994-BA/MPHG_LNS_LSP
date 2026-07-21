# 01 — Prototype: MH Tiêu chí tìm kiếm (LSP-TK-001)

**File tạo:** `lsp/set1-tieuchi-timkiem.html`
**Core gốc:** "Định nghĩa tiêu chí hệ thống tìm kiếm" (Image 1)
**Loại:** Enhancement — thêm 2 thuộc tính sinh dòng, giữ nguyên phần còn lại.

## 1. Layout (reuse chuẩn skill)

```
top-header (logo Minh Phú, search, FPT Admin)
main-menu (Lương active)
breadcrumb: Lương › Thiết lập (System) › Thiết lập công thức tính lương › Định nghĩa tiêu chí hệ thống tìm kiếm
page-title: ĐỊNH NGHĨA TIÊU CHÍ HỆ THỐNG TÌM KIẾM   (uppercase, #0056b3, center)
form-panel  ← thêm section nâng cao
actions-bar: [Tìm Kiếm][Làm mới][Lưu][Xóa][Xuất dữ liệu]
data-grid   ← thêm 2 cột
ghi-chú-nghiệp-vụ
```

## 2. Form fields

Giữ nguyên các field core: **Mã tiêu chí** (đỏ, required), **Tên tiếng việt** (đỏ), **Tên tiếng anh**, **Thứ tự sắp xếp**, **Dùng fn table** (dropdown), **Công thức (SQL)** (đỏ, textarea), **Kiểu dữ liệu** (dropdown), **Ghi chú**, **Sử dụng?** (checkbox, mặc định tick).

### Section mới: "🔧 Thuộc tính nâng cao (LSP)" — collapsible, mặc định mở

| Field | Type | Required | Default | Options |
|-------|------|----------|---------|---------|
| Áp dụng theo giai đoạn QTLV | dropdown | O | N | Y / N |
| Tham số ngày | dropdown | Conditional | ToDate | ToDate / FromDate / FromDate&ToDate |

- Khi "Áp dụng theo giai đoạn QTLV" = N → disable "Tham số ngày".
- Khi = Y → "Tham số ngày" bắt buộc; nếu để trống, alert-error: `Vui lòng chọn Tham số ngày khi áp dụng theo giai đoạn`.

## 3. Data grid — cột (trái→phải)

`☐ | STT | ✎ | Mã tiêu chí | Tên tiếng Anh | Tên tiếng Việt | Kiểu dữ liệu | Ghi chú | Thứ tự sắp xếp | Công thức (SQL) | Dùng fn table | **Áp dụng QTLV** | **Tham số ngày** | Used | Người tạo | Ngày tạo | Người sửa | Ngày sửa`

- 2 cột mới (`Áp dụng QTLV`, `Tham số ngày`) đặt sau `Dùng fn table`, trước `Used`.
- Cột `Áp dụng QTLV`: hiển thị `X` khi Y, trống khi N.

## 4. Mock data (5–6 dòng, lấy từ catalog LSP)

```javascript
window.MOCK_TK = [
  {ma:'TK_HR_DonViCap3', vi:'Đơn vị cấp 3', en:'Dept L3', sql:'dbo.HR_fnGetDonVi(PR_LSP.EmpID, PR_LSP.ToDate, 3)', fnTable:'', kieu:'nvarchar', applyStage:'Y', dateMode:'ToDate', used:true},
  {ma:'TK_HR_DonViCap5', vi:'Đơn vị cấp 5 (Bàn)', en:'Dept L5', sql:'dbo.HR_fnGetDonVi(PR_LSP.EmpID, PR_LSP.ToDate, 5)', fnTable:'', kieu:'nvarchar', applyStage:'Y', dateMode:'ToDate', used:true},
  {ma:'TK_HR_NhomTinhLuong', vi:'Nhóm tính lương', en:'Salary Group', sql:'dbo.PR_LSP_fnGetNhomTinhLuong(PR_LSP.EmpID, PR_LSP.PRMonth)', fnTable:'', kieu:'nvarchar', applyStage:'N', dateMode:'ToDate', used:true},
  {ma:'TK_HR_DuCong', vi:'Cờ đủ công', en:'Full Attendance', sql:'dbo.PR_LSP_fnGetDuCong(PR_LSP.EmpID, PR_LSP.DeptID, PR_LSP.PRMonth)', fnTable:'', kieu:'int', applyStage:'N', dateMode:'ToDate', used:true},
  {ma:'TK_PR_LSP_LoaiDieuChinh', vi:'Loại điều chỉnh HS', en:'Adjust Type', sql:'dbo.PR_LSP_fnGetLoaiDieuChinh(PR_LSP.DeptID, PR_LSP.PRMonth)', fnTable:'', kieu:'nvarchar', applyStage:'N', dateMode:'ToDate', used:true},
];
```

## 5. Hành vi JS (mock, không backend)

- **Lưu**: validate Mã không trùng, Tên VI + SQL required; nếu applyStage=Y thì dateMode required. Push/cập nhật MOCK_TK, render lại grid, set audit (CURRENT_USER + nowStr()), showAlert success.
- **✎ Sửa**: đọc row → đổ vào form (kể cả 2 field mới) → scroll top.
- **Xóa**: xóa dòng chọn (checkbox). Nếu SQL rỗng chặn lưu.
- **Tìm Kiếm**: lọc theo Mã/Tên trên grid.
- **Xuất dữ liệu**: export grid ra CSV (mock, `console.log` hoặc download Blob).

## 6. Ghi chú nghiệp vụ (điền sẵn)

> RÀNG BUỘC: `ApplyByStage=Y` khiến engine gọi tiêu chí theo **từng giai đoạn QTLV** với cặp ngày theo `Tham số ngày`. Tiêu chí cũ (`N`) chạy như trước (1 lần/kỳ, ToDate cuối tháng) — đảm bảo backward-compatible.
> Need Confirm: có cần mode `GiữaKỳ` cho `Tham số ngày`? Field-level history lưu cả SQL hay chỉ metadata?

## 7. Acceptance
- Lưu & hiển thị đúng 2 thuộc tính mới trên grid.
- Ràng buộc conditional `Tham số ngày` hoạt động.
- Tiêu chí cũ không bị ảnh hưởng.
