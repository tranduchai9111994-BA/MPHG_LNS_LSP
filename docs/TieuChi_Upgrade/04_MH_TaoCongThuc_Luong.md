# 04 — Prototype: MH Tạo công thức lương (LSP-FRM-001)

**File tạo:** `lsp/set4-tao-congthuc-luong.html`
**Core gốc:** "Tạo công thức lương" (Image 4)
**Loại:** Enhancement — thêm "Chiều sinh dòng", cột "Loại tính" read-only, nút "Xem trước nhiều dòng".

## 1. Layout (reuse chuẩn skill)

```
breadcrumb: Lương › Thiết lập (System) › Thiết lập công thức tính lương › Tạo công thức lương
page-title: TẠO CÔNG THỨC LƯƠNG
form header: Tên Công thức (đỏ), Customer (đỏ, dropdown MPHG), Ghi chú, [dropdown lấy công thức][Lấy C.thức]
           + Chiều sinh dòng (mới)
actions-bar: [Lưu & tiếp][Lưu & đóng][Hủy] + [Xem trước nhiều dòng] (mới)
grid dòng tiêu chí: STT | Mã tiêu chí | Tên tiêu chí | STT thứ tự | Công thức | Ghi chú | **Loại tính** (mới, read-only)
popup: Xem trước nhiều dòng
ghi-chú-nghiệp-vụ
```

## 2. Header fields

Giữ core: **Tên Công thức** (đỏ), **Customer** (đỏ, dropdown, mặc định MPHG), **Ghi chú**, dropdown chọn công thức có sẵn + **[Lấy C.thức]**.

### Field mới
| Field | Type | Required | Default | Options |
|-------|------|----------|---------|---------|
| Chiều sinh dòng (RowGenMode) | dropdown | R | ByWorkHistory | ByWorkHistory (Theo Quá trình làm việc) |

*(chỉ 1 option ở prototype; để mở rộng ByStage/ByShift sau)*

## 3. Grid dòng tiêu chí

Giữ core: STT | Mã tiêu chí | Tên tiêu chí | STT thứ tự | Công thức (textarea) | Ghi chú.
Thêm cột **Loại tính** (read-only): hiển thị `RowClass / Allocation` kế thừa từ tiêu chí (tra từ MOCK_TT/MOCK_HT theo Mã). VD: `Summary / MaxSalaryRow`, `Detail / Prorata`.

Mock các dòng (giống Image 4 + thêm dòng phân bổ):
```javascript
window.MOCK_FORMULA = {
  name:'Lương sản phẩm LSP', customer:'MPHG', rowGenMode:'ByWorkHistory',
  lines:[
    {stt:1, ma:'TT_LSP_Base_L0', ten:'Lương gốc L0', order:1, ct:'Σ(HT_PR_NangSuatTinhLuong × HT_PR_LSP_DonGia)', loaiTinh:'Detail / None'},
    {stt:2, ma:'TT_LSP_TienL1', ten:'Tiền sau ĐC lần 1', order:2, ct:'TT_LSP_Base_L0 × HT_PR_LSP_HeSo1', loaiTinh:'Detail / None'},
    {stt:3, ma:'TT_LSP_LuongThoiGian', ten:'Lương thời gian', order:3, ct:'HT_TS_CongThucTe × ĐơnGiáNgày', loaiTinh:'Detail / Prorata'},
    {stt:4, ma:'TT_LSP_LuongDongBH', ten:'Lương đóng BH', order:4, ct:'MAX(TT_LSP_KetQua_Final theo dòng)', loaiTinh:'Summary / MaxSalaryRow'},
    {stt:5, ma:'TT_LSP_ThuNhapTinhThue', ten:'Thu nhập tính thuế', order:5, ct:'Σ TT_LSP_KetQua_Final', loaiTinh:'Summary / LastStageRow'},
    {stt:6, ma:'TT_LSP_KetQua_Final', ten:'Tổng LSP cuối', order:6, ct:'TT_LSP_TienL3 + HoTro...', loaiTinh:'Summary / None'},
  ]
};
```

## 4. Popup "Xem trước nhiều dòng"

Modal-box wide, header xanh `#0056b3`, tiêu đề `🔍 XEM TRƯỚC KẾT QUẢ NHIỀU DÒNG`.
- Dropdown chọn **NV mẫu** (mock 1–2 NV có QTLV chuyển bàn).
- Bảng preview: mỗi dòng = 1 giai đoạn QTLV, cột = các tiêu chí; dòng tổng hợp thể hiện phân bổ.

Mock NV preview (NV chuyển Bàn giữa tháng — minh hoạ Prorata/Max/Last):
```javascript
window.MOCK_PREVIEW = {
  emp:{id:'1022907668', name:'Nguyễn Thị Loan'},
  slices:[
    {stage:1, ban:'CB101', from:'01/05', to:'15/05', cong:12, L0:5000000, final:6200000},
    {stage:2, ban:'CB102', from:'16/05', to:'31/05', cong:13, L0:5800000, final:7100000},
  ]
  // Kết quả phân bổ minh hoạ:
  // - LuongThoiGian (Prorata): chia theo công 12/25 và 13/25
  // - LuongDongBH (MaxSalaryRow): dồn vào dòng stage2 (final 7.1tr > 6.2tr), stage1 = 0
  // - ThuNhapTinhThue (LastStageRow): dồn vào stage2 (to=31/05 lớn nhất), stage1 = 0
};
```
Preview engine dùng chung logic ở file `05_Engine_NhieuDong_MockData.md`.

## 5. Hành vi JS
- **Lấy C.thức**: nạp MOCK_FORMULA vào form + grid.
- **Lưu & tiếp / Lưu & đóng**: validate Tên+Customer+RowGenMode; R-FRM-01 (có ≥1 tiêu chí Detail khóa dòng); showAlert.
- **Xem trước nhiều dòng**: mở popup, chọn NV mẫu → render bảng preview (gọi engine mock).
- **Hủy**: reset form.

## 6. Ghi chú nghiệp vụ (điền sẵn)

> `RowGenMode=ByWorkHistory`: engine sinh 1 dòng / mỗi giai đoạn QTLV (Bàn/Ka). Cột `Loại tính` giúp BA thấy ngay hành vi dòng của từng tiêu chí. Preview dùng chung engine tính thật để không lệch kết quả.
> Need Confirm (confirm #7): NV làm nhiều BP trong tháng — sau khi tính từng dòng có gộp tổng theo BP (M25=SUM) không? Bộ công thức có cần versioning?

## 7. Acceptance
- Lưu RowGenMode; cột Loại tính hiển thị đúng kế thừa; popup preview sinh đúng số dòng theo QTLV & phân bổ đúng 3 kịch bản (Prorata/Max/Last).
