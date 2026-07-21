# 02 — Prototype: MH Tiêu chí hệ thống (LSP-HT-001)

**File tạo:** `lsp/set2-tieuchi-hethong.html`
**Core gốc:** "Định nghĩa tiêu chí hệ thống" (Image 2)
**Loại:** Enhancement — thêm nhóm thuộc tính "Hành vi nhiều dòng" + popup Chọn Param (theo PeopleX).

## 1. Layout (reuse chuẩn skill)

```
top-header / main-menu (Lương) / breadcrumb
breadcrumb: Lương › Thiết lập (System) › Thiết lập công thức tính lương › Định nghĩa tiêu chí hệ thống
page-title: ĐỊNH NGHĨA TIÊU CHÍ HỆ THỐNG
form-panel  ← thêm section nâng cao + nút Tìm Param
actions-bar: [Tìm Kiếm][Làm mới][Lưu][Xóa][Xuất dữ liệu]
data-grid   ← thêm 5 cột
popup: Chọn Param
ghi-chú-nghiệp-vụ
```

## 2. Form fields

Giữ core: **Mã tiêu chí** (đỏ), **Tên tiếng việt** (đỏ), **Tên tiếng anh**, **Thứ tự sắp xếp**, **Dùng fn table**, **Công thức (SQL)** (đỏ, textarea), **Ghi chú**, **Mã hóa dữ liệu** (checkbox), **Sử dụng?** (checkbox).

### Section mới: "🔧 Thuộc tính nâng cao — Hành vi nhiều dòng (LSP)"

| Field | Type | Required | Default | Options |
|-------|------|----------|---------|---------|
| Cấp độ tính (CalcLevel) | dropdown | R | PerEmployee | PerSlice / PerEmployee / Aggregate |
| Phạm vi tổng hợp (AggregateScope) | dropdown | Conditional | None | None / Ban (cấp5) / Ka (cấp4) / Dept (cấp3) / CrossDept |
| Toán tử tổng hợp (AggregateOp) | dropdown | Conditional | None | None / Sum / Avg / Max / Min |
| Phân hệ (Module) | dropdown | Conditional | (trống) | FO / HR / TS / PR / INS / PIT |
| Param | textbox readonly + nút **[Tìm]** | O | (trống) | mở popup Chọn Param |

Ràng buộc:
- `CalcLevel=Aggregate` ⇒ `AggregateScope≠None` AND `AggregateOp≠None` (blocking). Message: `Tiêu chí tổng hợp phải chọn Phạm vi và Toán tử tổng hợp`.
- Có chọn Param ⇒ Module required. Message: `Chọn Phân hệ trước khi chọn Param`.
- Khi `CalcLevel≠Aggregate` → disable Scope & Op.

## 3. Popup "Chọn Param" (theo PeopleX PR.FR.074-01)

Modal-box wide (700px), header xanh `#0056b3`, tiêu đề `📋 CHỌN PARAM`.

**Bộ lọc:** Phân hệ (dropdown), Mã Param (textbox), Tên Param (textbox), Mô tả (textarea) — nút [Tìm Kiếm].
**Grid kết quả:** Mã Param | Tên Param | Kiểu dữ liệu | Phân hệ | Mô tả | [Chọn].
Click [Chọn] → điền Param + auto Module → đóng popup.

Mock Param:
```javascript
window.MOCK_PARAM = [
  {code:'PARAM_NS_FINAL', name:'Sản lượng NS_FINAL đã khóa', type:'float', module:'PR', desc:'NS_FINAL per NV × CĐ × loại ca'},
  {code:'PARAM_CONG_TT', name:'Công thực tế', type:'float', module:'TS', desc:'Ngày công thực tế theo slice'},
  {code:'PARAM_CONG_CHUAN', name:'Công chuẩn tháng', type:'float', module:'TS', desc:'Thường 26/27'},
  {code:'PARAM_DONGIA_LSP', name:'Đơn giá tiền lương', type:'float', module:'PR', desc:'Theo CĐ × Quy cách × BP'},
  {code:'PARAM_HESO_DC', name:'Hệ số điều chỉnh', type:'float', module:'PR', desc:'HS1/HS2/HS3'},
];
```

## 4. Data grid — cột

`☐ | STT | ✎ | Mã tiêu chí | Tên tiếng Việt | Ghi chú | Thứ tự sắp xếp | Công thức (SQL) | **CalcLevel** | **Scope** | **Op** | **Module** | **Param** | Used | audit(4)`

5 cột mới đặt sau `Công thức (SQL)`.

## 5. Mock data (lấy từ catalog LSP – 01_LSP_TieuChi)

```javascript
window.MOCK_HT = [
  {ma:'HT_TS_CongThucTe', vi:'Công thực tế', sql:'dbo.PTS_fnGetCongChiTietNgay(...)', calc:'PerSlice', scope:'None', op:'None', module:'TS', param:'PARAM_CONG_TT', used:true},
  {ma:'HT_TS_CongChuan', vi:'Công chuẩn tháng', sql:'dbo.PR_LSP_fnGetCongChuan(PR_LSP.PRMonth)', calc:'PerEmployee', scope:'None', op:'None', module:'TS', param:'PARAM_CONG_CHUAN', used:true},
  {ma:'HT_PR_NangSuatTinhLuong', vi:'Sản lượng NS_FINAL', sql:'dbo.PR_LSP_fnGetNS(...)', calc:'PerSlice', scope:'None', op:'None', module:'PR', param:'PARAM_NS_FINAL', used:true},
  {ma:'HT_PR_LSP_DonGia', vi:'Đơn giá tiền lương', sql:'dbo.PR_LSP_fnGetDonGia(...)', calc:'PerSlice', scope:'None', op:'None', module:'PR', param:'PARAM_DONGIA_LSP', used:true},
  {ma:'HT_PR_LSP_HeSo1', vi:'Hệ số ĐC lần 1', sql:'dbo.PR_LSP_fnGetHeSo(...,1)', calc:'PerEmployee', scope:'None', op:'None', module:'PR', param:'PARAM_HESO_DC', used:true},
  {ma:'HT_PR_LSP_TongLSP_Dept', vi:'Tổng LSP theo Bộ phận', sql:'dbo.PR_LSP_fnGetTongLSP_Dept(...)', calc:'Aggregate', scope:'Dept', op:'Sum', module:'PR', param:'', used:true},
  {ma:'HT_PR_LSP_TongCong_Dept', vi:'Tổng công theo Bộ phận', sql:'dbo.PR_LSP_fnGetTongCong_Dept(...)', calc:'Aggregate', scope:'Dept', op:'Sum', module:'TS', param:'', used:true},
];
```

## 6. Hành vi JS
- **Lưu**: validate ràng buộc R-HT-01/02/03; cập nhật MOCK_HT; render grid; audit; showAlert.
- **✎ Sửa / Xóa / Tìm Kiếm / Xuất**: như MH danh mục chuẩn.
- **[Tìm] Param**: mở popup; chọn → điền Param + Module.

## 7. Ghi chú nghiệp vụ (điền sẵn)

> `CalcLevel`: PerSlice = tính theo từng giai đoạn QTLV (công, NS theo slice); PerEmployee = 1 giá trị/NV; Aggregate = gộp theo Scope (Ban/Ka/Dept/CrossDept) bằng Op.
> `Param` (theo PeopleX): ánh xạ tiêu chí tới nguồn dữ liệu phân hệ do Dev cung cấp — dùng thay/bổ sung SQL tự do khi có Param chuẩn.
> Need Confirm (LSP-OP-07/09): Aggregate tính realtime hay materialized cho ~3000 NV? Loại trừ NV<50% công ở tử+mẫu hay chỉ mẫu?

## 8. Acceptance
- Lưu 5 thuộc tính; ràng buộc Aggregate hoạt động; popup Chọn Param điền đúng Param+Module; tiêu chí cũ giữ nguyên.
