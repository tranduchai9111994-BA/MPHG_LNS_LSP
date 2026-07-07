# Danh mục: Thiết lập đơn giá - Quy cách tính lương (dm7)

**Mã chức năng:** dm7
**File:** `lns/dm7-quy-cach.html`
**Menu:** LSP · Thiết lập → Quy cách tính lương
**Breadcrumb:** Lương › Tính Lương năng suất › Danh mục › Quy cách

---

## 1. Mô tả tổng quan

Danh mục dùng để khai báo **Quy cách tính lương** (mã quy cách gắn với 1 Tiến trình) và **đơn giá** áp dụng cho 8 loại thời gian làm việc (trong giờ, ca đêm, tăng ca, tăng ca đêm, ngày nghỉ, tăng ca đêm ngày nghỉ, ngày lễ, tăng ca đêm ngày lễ). Dữ liệu này là đầu vào cho tính Lương Sản Phẩm (LSP)/Lương Năng Suất (LNS) theo quy cách.

**Loại form:** Master-detail (Form nhập bên trên + Grid danh sách bên dưới), có Import/Export Excel.

---

## 2. Form nhập liệu (Form Panel)

Layout dạng lưới 2 cột (`form-grid-2col`): mỗi hàng gồm 1 cặp Label – Input, xen kẽ trái/phải.

| # | Trường | ID | Loại | Bắt buộc | Mô tả / Ghi chú |
|---|--------|----|------|----------|------------------|
| 1 | Tiến trình | `dm7_tt` | Dropdown | **Có** | Chọn 1 trong 3 tiến trình: `TT_TOM_SU` (Tiến trình Tôm Sú), `TT_TOM_THE` (Tiến trình Tôm Thẻ), `TT_DONG_GOI` (Tiến trình Đóng gói) |
| 2 | Quy cách tính lương | `dm7_ma` | Text input | **Có** | Mã quy cách — **duy nhất (unique key)**. Tự động loại bỏ khoảng trắng khi gõ (`oninput` regex). Viết liền, không dấu, không khoảng trắng. VD: `LXPTO`, `NBN` |
| 3 | Tên quy cách | `dm7_ten` | Text input | **Có** | Tên diễn giải của quy cách |
| 4 | Đơn vị tính | `dm7_dvt` | Dropdown | **Có** | 1 trong: Kg, Gam, Lbs, Block, Khay, Thùng |
| 5 | Đơn giá trong giờ (1) | `dm7_dg_tronggio` | Text input (số, format tiền VNĐ) | Không | Format tự động dạng `1,200` khi gõ (`formatCurrency`) |
| 6 | Đơn giá ca đêm (2) | `dm7_dg_cadem` | Text input (số) | Không | Idem |
| 7 | Đơn giá tăng ca (3) | `dm7_dg_ngoaigio` | Text input (số) | Không | Idem |
| 8 | Đơn giá tăng ca đêm (4) | `dm7_dg_tangcadem` | Text input (số) | Không | Idem |
| 9 | Đơn giá ngày nghỉ (5) | `dm7_dg_ngaynghi` | Text input (số) | Không | Idem |
| 10 | Đơn giá tăng ca đêm ngày nghỉ (6) | `dm7_dg_demngaynghi` | Text input (số) | Không | Idem |
| 11 | Đơn giá ngày lễ (7) | `dm7_dg_ngayle` | Text input (số) | Không | Idem |
| 12 | Đơn giá tăng ca đêm ngày lễ (8) | `dm7_dg_tc_dem_ngayle` | Text input (số) | Không | Idem |
| 13 | Ghi chú | `dm7_note` | Textarea | Không | Tối đa 500 ký tự |
| 14 | Ghi chú 2 | `dm7_note2` | Textarea | Không | Tối đa 500 ký tự |
| 15 | Ngày hiệu lực | `dm7_ngayhl` | Text input | **Có** | Bắt buộc, định dạng `DD/MM/YYYY` |
| 16 | Ngày kết thúc | `dm7_ngaykt` | Text input | Không | Định dạng `DD/MM/YYYY`, để trống = chưa có ngày kết thúc |

> Số thứ tự `(1)` → `(8)` trong nhãn "Đơn giá ..." tương ứng với thứ tự 8 cột đơn giá trên lưới bên dưới.

### Ghi chú UX

- Tất cả nhãn màu đỏ (`lbl-red`): Tiến trình, Quy cách tính lương, Tên quy cách, Đơn vị tính, Ngày hiệu lực — là **trường bắt buộc**.
- Các ô "Đơn giá ..." đều có ghi chú nhỏ màu xanh bên dưới: *"Không bắt buộc nhập (VNĐ)"*.
- Khi ở chế độ **Sửa** (bấm ✎ trên lưới), ô `dm7_ma` (Quy cách tính lương) chuyển sang `readOnly` để không cho đổi khóa chính.

---

## 3. Thanh hành động (Actions Bar)

| # | Nút | Class | Hàm xử lý | Mô tả |
|---|-----|-------|-----------|-------|
| 1 | **Tìm Kiếm** | `btn-search` | *(chưa gán hàm)* | Placeholder tìm kiếm trên lưới |
| 2 | **Làm mới** | `btn-refresh` | `dm7Clear()` | Xóa trắng toàn bộ form, thoát chế độ Sửa |
| 3 | **Lưu** | `btn-save2` | `dm7Save()` | Validate rồi Thêm mới hoặc Cập nhật quy cách |
| 4 | **Xóa** | `btn-delete` | `dm7Delete()` | Xóa các dòng đã tick chọn trên lưới (có confirm) |
| 5 | **Nhập dữ liệu** | `btn-import` | `showModal('dm7-imp')` | Mở modal Import Excel |
| 6 | **Xuất dữ liệu** | `btn-export` | *(chưa gán hàm)* | Placeholder xuất Excel |

---

## 4. Modal Import (`dm7-imp`)

| Thành phần | Mô tả |
|------------|-------|
| Tiêu đề | "IMPORT THIẾT LẬP ĐƠN GIÁ - QUY CÁCH TÍNH LƯƠNG" |
| Rule Import | 1. Mã NL tồn tại → **UPDATE** Quy cách<br>2. Mã NL chưa tồn tại → **INSERT** mới<br>3. Mã trùng trong file → **DỪNG**, báo lỗi dòng đầu tiên trùng (chữ đỏ) |
| Input file | `accept=".xlsx,.xls"` |
| Link | "Tải template mẫu" |
| Nút **Đóng** | `hideModal('dm7-imp')` — đóng modal, không làm gì thêm |
| Nút **Thực hiện Import** | Đóng modal + hiện alert "Import thành công!" (mock, chưa xử lý file thật) |

---

## 5. Lưới dữ liệu (Grid)

### 5.1. Cột

| # | Cột | Ghi chú hiển thị |
|---|-----|-------------------|
| 1 | ☐ (checkbox) | Checkbox chọn dòng, có checkbox "chọn tất cả" ở header (`dm7-chkAll` → `toggleAll`) |
| 2 | Sửa | Icon ✎ (`btn-edit-row`) → nạp dữ liệu dòng vào form, khóa ô Mã |
| 3 | STT | Số thứ tự (tính lại theo vị trí hiện tại trong mảng) |
| 4 | Ngày hiệu lực | Căn giữa |
| 5 | Ngày kết thúc | Căn giữa, trống nếu chưa có |
| 6 | Tiến trình | Hiển thị dạng "Mã - Tên đầy đủ" qua `ttMap` |
| 7 | Quy cách tính lương | Bold, màu xanh dương (`#0056b3`) |
| 8 | Tên quy cách | |
| 9 | Đơn vị tính | |
| 10 | ĐG trong giờ | Căn phải, format `toLocaleString()`, trống nếu không có giá trị |
| 11 | ĐG ca đêm | Idem |
| 12 | ĐG tăng ca | Idem |
| 13 | ĐG T.ca đêm | Idem |
| 14 | ĐG ngày nghỉ | Idem |
| 15 | ĐG T.ca đêm N.nghỉ | Idem |
| 16 | ĐG ngày lễ | Idem |
| 17 | ĐG T.ca đêm N.lễ | Idem |
| 18 | Ghi chú | Căn trái |
| 19 | Ghi chú 2 | Căn trái |

### 5.2. Dữ liệu mẫu (mock, 6 dòng)

| Mã | Tên quy cách | Tiến trình | ĐVT | Có đơn giá? |
|----|--------------|-----------|-----|-------------|
| LXPTO | Lặt xẻ PTO | Tôm Sú | Kg | Có |
| NBN | Nobashi N | Tôm Thẻ | Kg | Không (để trống) |
| SUSH | Sushi | Tôm Thẻ | Khay | Có |
| PD | Peeled Deveined (Lột vỏ, rút chỉ) | Tôm Sú | Lbs | Có |
| HLSO | Headless Shell-on (Bỏ đầu, còn vỏ) | Tôm Sú | Kg | Không |
| CPTO | Cooked Peeled Tail-on (Luộc, lột vỏ, chừa đuôi) | Tôm Sú | Lbs | Có (có cả Ngày kết thúc: 31/12/2026) |

---

## 6. Validate khi Lưu (`dm7Save`)

| # | Rule | Thông báo lỗi |
|---|------|----------------|
| 1 | Ngày hiệu lực bắt buộc | "Vui lòng nhập Ngày hiệu lực." |
| 2 | Ngày hiệu lực đúng định dạng DD/MM/YYYY | "Ngày hiệu lực phải đúng định dạng DD/MM/YYYY." |
| 3 | Ngày kết thúc (nếu có) đúng định dạng | "Ngày kết thúc phải đúng định dạng DD/MM/YYYY." |
| 4 | Quy cách tính lương bắt buộc | "Vui lòng nhập Quy cách tính lương." |
| 5 | Tên quy cách bắt buộc | "Vui lòng nhập Tên quy cách." |
| 6 | Tiến trình bắt buộc | "Vui lòng chọn Tiến trình." |
| 7 | Đơn vị tính bắt buộc | "Vui lòng chọn Đơn vị tính." |
| 8 | Mã quy cách chỉ gồm chữ/số (không dấu, không khoảng trắng) | "Quy cách tính lương không hợp lệ (chỉ chữ/số, không dấu)." |
| 9 | Mã không được trùng (khi thêm mới) | "Lỗi: Mã [XXX] đã tồn tại." |

- Mã quy cách được tự động **viết hoa** (`toUpperCase()`) trước khi lưu/so sánh trùng.
- Khi Lưu thành công: re-render lưới, xóa trắng form (`dm7Clear()`).

---

## 7. Luồng nghiệp vụ

```
1. User chọn Tiến trình + nhập Mã/Tên quy cách + Đơn vị tính
2. (Tùy chọn) Nhập đơn giá cho 8 loại thời gian làm việc
3. Nhập Ngày hiệu lực (bắt buộc) / Ngày kết thúc (tùy chọn)
4. Bấm "Lưu" → validate → Thêm mới hoặc Cập nhật (nếu đang ở chế độ Sửa)
5. Quy cách tính lương sau khi lưu được dùng làm dữ liệu tham chiếu (dropdown Quy cách tính lương)
   ở các màn hình nhập liệu/báo cáo khác trong phân hệ LNS/LSP
   (VD: fn5-khoa-cong, bc6-nang-suat-tong-ma-noi-bo...)
6. Có thể Import hàng loạt qua Excel hoặc Xuất dữ liệu ra file
```

---

## 8. Ghi chú nghiệp vụ

- Textarea cuối trang cho BA/quản lý nhập ghi chú, open points (chưa gắn nút lưu riêng ở khu vực này trong bản hiện tại).
