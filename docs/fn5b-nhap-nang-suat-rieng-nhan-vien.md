# Nhập năng suất riêng theo nhân viên

**File:** `lns/fn5b-ns-nhan-vien.html`  
**Menu:** Lương › Tính Lương năng suất › Nhập năng suất riêng theo nhân viên  
**Breadcrumb:** Lương › Tính Lương năng suất › Nhập năng suất riêng theo nhân viên

---

## 1. Trường thông tin (Empheader)

Bố cục CSS grid 8 cột: `grid-template-columns: 100px 1fr 100px 1fr 100px 1fr 100px 1fr`. Class `.form-grid-4col`.

### Dòng 1: Thông tin nhân viên

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Mã nhân viên | `fn5bMaNV` | Text | Không | Placeholder: "Nhập mã NV..." |
| Tên nhân viên | `fn5bTenNV` | Text | Không | Placeholder: "Mã hoặc tên NV..." |
| (Nút browse) | — | Button [...] | — | Mở popup tìm nhân viên |
| Công ty | `fn5bCongTy` | Select | — | Mặc định: MPHG |

### Dòng 2: Đơn vị cấp 1–3

| Trường | ID | Kiểu | Options |
|---|---|---|---|
| Đơn vị cấp 1 | `fn5bDv1` | Select | -- Tất cả --, Khối Sản Xuất, Khối Văn Phòng |
| Đơn vị cấp 2 | `fn5bDv2` | Select | -- Tất cả --, Nhà máy 1, Nhà máy 2 |
| Đơn vị cấp 3 | `fn5bDv3` | Select | -- Tất cả --, Phân xưởng A, Phân xưởng B |

### Dòng 3: Đơn vị cấp 4–6

| Trường | ID | Kiểu | Options |
|---|---|---|---|
| Đơn vị cấp 4 | `fn5bDv4` | Select | -- Tất cả --, Tổ 1, Tổ 2 |
| Đơn vị cấp 5 | `fn5bDv5` | Select | -- Tất cả --, Bộ phận PTO, Bộ phận Tẩm bột |
| Đơn vị cấp 6 | `fn5bDv6` | Select | -- Tất cả --, Nhóm A, Nhóm B |

### Dòng 4: Vị trí & Nhóm lương

| Trường | ID | Kiểu | Options |
|---|---|---|---|
| Vị trí công việc | `fn5bViTri` | Select | -- Tất cả -- |
| Nhóm tính lương | `fn5bNhomTL` | Select | -- Tất cả --, Hệ số, Bình quân, Năng suất |

### Dòng 5: Tình trạng

| Trường | Kiểu | Ghi chú |
|---|---|---|
| Tình trạng | Radio group (`fn5bTinhTrang`) | 3 lựa chọn: Đang làm việc / Thôi việc / **Tất cả** (mặc định checked) |

### Bộ lọc ngày (nằm ngoài form-panel)

Dòng riêng flex, nằm dưới empheader, căn trái.

| Trường | ID | Kiểu | Ghi chú |
|---|---|---|---|
| Từ ngày | `fn5bTuNgay` | Date | Mặc định: `2026-06-01` |
| Đến ngày | `fn5bDenNgay` | Date | Mặc định: `2026-06-30` |

---

## 2. Nút chức năng

Thanh actions căn giữa (`justify-content: center`).

| Nút | Class | Hành động | Mô tả |
|---|---|---|---|
| Tìm kiếm | `btn-search` | (chưa implement) | Lọc lưới theo empheader + khoảng ngày |
| Làm mới | `btn-refresh` | `fn5bClear()` | Reset Mã NV, Tên NV |
| Thêm mới | `btn-save2` | `fn5bShowAddPopup()` | Mở popup thêm mới, clear toàn bộ field, title = "Thêm mới" |
| Nhập dữ liệu (Excel) | `btn-import` | `showModal('fn5b-imp')` | Mở modal import Excel |
| Xuất dữ liệu Import | `btn-export` | `fn5bExportImportTemplate()` | Xuất file template import có dữ liệu sẵn |
| Xóa | `btn-delete` | `fn5bDeleteChecked()` | Xóa các dòng checkbox đã chọn |
| Xuất Excel | `btn-export` | (chưa implement) | Xuất dữ liệu lưới ra file Excel |

### Logic nút Xóa (`fn5bDeleteChecked`)

1. Kiểm tra có dòng nào được chọn → nếu không: alert warning "Vui lòng chọn dòng cần xóa."
2. `confirm()` xác nhận → nếu Hủy: dừng
3. Lọc `fn5bData` loại bỏ các id đã chọn
4. Gọi `fn5bRender()` render lại lưới
5. Bỏ chọn checkbox header
6. Alert thành công: "Đã xóa N dòng thành công."

---

## 3. Lưới dữ liệu

### 3.1. Cấu trúc cột

Container: class `table-responsive`, scroll ngang + dọc (max-height 500px). Header sticky, nền vàng `#ffd600`.

| # | Cột | Width | Kiểu hiển thị | Ghi chú |
|---|---|---|---|---|
| 0 | Checkbox | 30px | `<input type="checkbox">` | Header: toggle-all (`fn5bChkAll`), dòng: class `fn5b-chk` |
| 1 | Sửa | 30px | Icon ✎ (xanh `#1565c0`) | Click → `fn5bEdit(id)` mở popup sửa |
| 2 | STT | 35px | Text | Tự động, **sticky left:0** (class `col-freeze-1`) |
| 3 | Mã NV | 75px | Text bold | **Sticky left:35px** (class `col-freeze-2`) |
| 4 | Họ và Tên | 120px | Text | **Sticky left:110px** (class `col-freeze-3`) |
| 5 | Mã BP | 70px | Text | |
| 6 | Bộ phận | 120px | Text | Tên bộ phận |
| 7 | Ka LV | 50px | Text | |
| 8 | Ngày NL | 90px | Text (YYYY-MM-DD) | |
| 9 | Lô | 70px | Text | |
| 10 | Nhóm KS | 70px | Text | |
| 11 | KL Bơ | 60px | Number, căn phải | |
| 12 | Quy cách SX | 100px | Text | |
| 13 | Mã nội bộ | 80px | Text | |
| 14 | Size nội bộ | 80px | Text | |
| 15 | QC tính lương | 120px | Text | |
| 16 | Ngày LV | 90px | Text (YYYY-MM-DD) | |
| 17 | TG bắt đầu | 70px | Text (HH:mm) | |
| 18 | Ngày cân | 90px | Text (YYYY-MM-DD) | |
| 19 | Giờ cân | 70px | Text (HH:mm) | |
| 20 | gr/con | 60px | Number, căn phải | |
| 21 | con/khay | 60px | Number, căn phải | |
| 22 | **Trong giờ** | 70px | Number, căn phải | Nền `#fff9c4`, chữ `#f57f17`, bold |
| 23 | **Ca đêm** | 70px | Number, căn phải | Nền `#fff9c4`, chữ `#f57f17`, bold |
| 24 | **Tăng ca** | 70px | Number, căn phải | Nền `#fff9c4`, chữ `#f57f17`, bold |
| 25 | **Tăng ca đêm** | 80px | Number, căn phải | Nền `#fff9c4`, chữ `#f57f17`, bold |
| 26 | **Ngày nghỉ** | 80px | Number, căn phải | Nền `#fff9c4`, chữ `#f57f17`, bold |
| 27 | **Đêm ngày nghỉ** | 90px | Number, căn phải | Nền `#fff9c4`, chữ `#f57f17`, bold |
| 28 | **Ngày lễ** | 70px | Number, căn phải | Nền `#fff9c4`, chữ `#f57f17`, bold |
| 29 | **Đêm ngày lễ** | 90px | Number, căn phải | Nền `#fff9c4`, chữ `#f57f17`, bold |
| 30 | Đơn vị tính | 70px | Text | |
| 31 | Line.Bơ | 70px | Text | |
| 32 | Ghi chú | 150px | Text, căn trái | |

### 3.2. Cơ chế 8 cột sản lượng theo ca

Giống form bộ phận. Mỗi dòng có trường `ns_lam` (giá trị '1'–'8'). Giá trị `kl_kg` chỉ hiển thị ở cột ca tương ứng, 7 cột còn lại hiển thị `0.00`.

```javascript
// Ví dụ: ns_lam='1', kl_kg=2.42
// → Trong giờ = 2.42, Ca đêm = 0.00, Tăng ca = 0.00, ...
```

| NS Làm | Cột hiển thị |
|---|---|
| 1 | Trong giờ |
| 2 | Ca đêm |
| 3 | Tăng ca |
| 4 | Tăng ca đêm |
| 5 | Ngày nghỉ |
| 6 | Đêm ngày nghỉ |
| 7 | Ngày lễ |
| 8 | Đêm ngày lễ |

### 3.3. Cột freeze (sticky)

3 cột đầu (STT, Mã NV, Họ và Tên) được freeze khi scroll ngang:

| Class | Left | z-index (td) | z-index (th) |
|---|---|---|---|
| `col-freeze-1` | 0 | 5 | 15 |
| `col-freeze-2` | 35px | 5 | 15 |
| `col-freeze-3` | 110px | 5 | 15 |

### 3.4. Style đặc biệt

- 8 cột sản lượng: nền `#fff9c4`, chữ `#f57f17`, bold
- Header: sticky top, nền `#ffd600`
- Font size toàn bộ: 11px
- White-space: nowrap cho tất cả cells

---

## 4. Popup Thêm mới / Sửa (`fn5b-edit-modal`)

### 4.1. Bố cục

- Modal overlay: fixed, full screen, background `rgba(0,0,0,.45)`
- Box: min-width 520px, max-width 700px, border-radius 8px, max-height 90vh, overflow-y auto
- Body: CSS grid 4 cột (`110px 1fr 110px 1fr`), gap 8px × 10px
- Trường Ghi chú nằm ngoài grid, dòng riêng full-width (flex layout)
- Tiêu đề thay đổi: "Thêm mới" hoặc "Chỉnh sửa - {MaNV} - {HoTen}"

### 4.2. Danh sách trường

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Mã NV | `fn5bE_maNV` | Text | **Có** (label đỏ `#d32f2f`) | Placeholder: "Nhập mã NV" |
| Họ và Tên | `fn5bE_hoTen` | Text (readonly) | Không | Placeholder: "Tự động hiển thị", nền xám `#f5f5f5`. Auto-fill từ `nhanVienDB` |
| Mã BP | `fn5bE_maBP` | Text | Không | |
| Bộ phận | `fn5bE_tenBP` | Text | Không | |
| Ka LV | `fn5bE_kaLV` | Number (min 1) | Không | Mặc định: 1 |
| Ngày NL | `fn5bE_ngayNL` | Date | Không | |
| Lô | `fn5bE_lo` | Text | Không | |
| Nhóm KS | `fn5bE_nhomKS` | Text | Không | |
| KL Bơ | `fn5bE_klBo` | Number | Không | |
| Quy cách SX | `fn5bE_quyCachSX` | Text | Không | |
| Mã nội bộ | `fn5bE_maNoiBo` | Text | Không | |
| Size nội bộ | `fn5bE_sizeNoiBo` | Text | Không | |
| QC tính lương | `fn5bE_qcTinhLuong` | Text | Không | |
| Ngày LV | `fn5bE_ngayLV` | Date | Không | |
| TG bắt đầu | `fn5bE_tgBatDau` | Time | Không | |
| Ngày cân | `fn5bE_ngayCan` | Date | Không | |
| Giờ cân | `fn5bE_gioCan` | Time | Không | |
| gr/con | `fn5bE_grCon` | Text | Không | |
| con/khay | `fn5bE_conKhay` | Text | Không | |
| KL (kg) | `fn5bE_klKg` | Number (step 0.01) | Không | Label màu cam `#f57f17` |
| Đơn vị tính | `fn5bE_dvt` | Text | Không | Mặc định: "kg" |
| NS Làm | `fn5bE_nsLam` | Select | Không | Options: 1: Trong ca, 2: Ca đêm, 3: Tăng ca, 4: Tăng ca đêm |
| Line.Bơ | `fn5bE_lineBo` | Text | Không | |
| Ghi chú | `fn5bE_ghiChu` | Text | Không | Nằm dòng riêng dưới grid, full width, placeholder: "Nhập ghi chú..." |

### 4.3. Validation khi Lưu (`fn5bSaveEdit`)

1. Kiểm tra Mã NV bắt buộc → nếu trống: `alert('Vui lòng nhập Mã NV (bắt buộc).')`
2. Nếu có `fn5bE_id` (đang sửa) → cập nhật record trong `fn5bData`
3. Nếu không có id (thêm mới) → tạo id mới, push vào `fn5bData`
4. Gọi `fn5bRender()` render lại lưới
5. Đóng modal, hiện alert thành công

### 4.4. Logic Sửa (`fn5bEdit`)

1. Tìm record theo id trong `fn5bData`
2. Load toàn bộ giá trị vào popup
3. Họ và Tên tự động hiển thị (readonly)
4. Đổi tiêu đề: "Chỉnh sửa - {MaNV} - {HoTen}"

### 4.5. Logic Thêm mới (`fn5bShowAddPopup`)

1. Clear toàn bộ field
2. Reset Ka LV = 1, Đơn vị tính = "kg", NS Làm = "1"
3. Đổi tiêu đề: "Thêm mới"

---

## 5. Import dữ liệu từ Excel (`fn5b-imp`)

### 5.1. Giao diện modal

- Tiêu đề: **"IMPORT NĂNG SUẤT THỰC TẾ NHÂN VIÊN"** (header xanh cyan)
- Hướng dẫn (khung dashed):
  1. Tải template mẫu về và điền 24 cột tương ứng.
  2. *(Đỏ)* Hệ thống sẽ validate realtime Đơn vị tính và Đơn giá sau khi import.
- Input file: `accept=".xlsx,.xls"`
- Link: "Tải template mẫu"
- Nút:
  - **Đóng** (`btn-cancel`): đóng modal
  - **Thực hiện Import** (`btn-ok`): import dữ liệu, đóng modal, hiện alert success "Import dữ liệu thành công! Vui lòng bấm Lưu."

### 5.2. Template Import (24 cột)

| STT cột | Tên cột | Bắt buộc | Kiểu dữ liệu | Ghi chú |
|---|---|---|---|---|
| 1 | Mã NV | **Có** | Text | Mã nhân viên, dùng để auto-fill Họ Tên |
| 2 | Mã BP | Không | Text | Mã bộ phận |
| 3 | Bộ phận | Không | Text | Tên bộ phận |
| 4 | Ka LV | Không | Number | Mặc định: 1 |
| 5 | Ngày NL | Không | Date (YYYY-MM-DD) | |
| 6 | Lô | Không | Text | |
| 7 | Nhóm KS | Không | Text | |
| 8 | KL Bơ | Không | Number | |
| 9 | Quy cách SX | Không | Text | |
| 10 | Mã nội bộ | Không | Text | |
| 11 | Size nội bộ | Không | Text | |
| 12 | QC tính lương | Không | Text | |
| 13 | Ngày LV | Không | Date (YYYY-MM-DD) | |
| 14 | TG bắt đầu | Không | Time (HH:mm) | |
| 15 | Ngày cân | Không | Date | |
| 16 | Giờ cân | Không | Time | |
| 17 | gr/con | Không | Number | |
| 18 | con/khay | Không | Number | |
| 19 | KL (kg) | Không | Number | Khối lượng |
| 20 | Đơn vị tính | Không | Text | kg, con, khay, thung |
| 21 | NS Làm | Không | Number (1–8) | 1: Trong giờ → 8: Đêm ngày lễ |
| 22 | Line.Bơ | Không | Text | |
| 23 | Đơn giá | Không | Number | Dùng để validate sau import |
| 24 | Ghi chú | Không | Text | |

### 5.3. Quy trình Import

1. User tải template mẫu → điền dữ liệu theo 24 cột
2. User chọn file → bấm **Thực hiện Import**
3. Hệ thống đọc file Excel:
   - Auto-fill Họ và Tên từ `nhanVienDB` theo Mã NV
   - Append dữ liệu vào `fn5bData`
4. Gọi `fn5bRender()` hiện lưới
5. Alert: "Import dữ liệu thành công! Vui lòng bấm Lưu."

### 5.4. Validation sau Import (realtime trên lưới)

| Rule | Loại | Điều kiện | Hành vi |
|---|---|---|---|
| Đơn vị tính không hợp lệ | **Error** (chặn lưu) | `dvt` không nằm trong `['kg', 'con', 'khay', 'thung']` | Ô DVT highlight đỏ (`input-error`). Alert: "LỖI CHẶN LƯU: Có dòng sai Đơn vị tính" |
| Đơn giá trống | **Warning** (cho lưu) | `kl_kg > 0` và `dongia` null/trống | Alert: "CẢNH BÁO: Có dòng Khối lượng > 0 nhưng Đơn giá đang trống" |

### 5.5. Nút Xuất dữ liệu Import

Nút **"Xuất dữ liệu Import"** (`fn5bExportImportTemplate`) xuất file Excel chứa dữ liệu hiện tại trên lưới theo format template import, giúp user có thể chỉnh sửa offline rồi import lại.

---

## 6. Dữ liệu mẫu (`fn5bData`)

| ID | Mã NV | Họ Tên | Mã BP | Bộ phận | Ka | Ngày NL | Lô | Nhóm KS | KL Bơ | Quy cách SX | Mã NB | Size NB | QC TL | Ngày LV | TG BD | Ngày cân | Giờ cân | KL (kg) | DVT | NS Làm | Line.Bơ | Đơn giá |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1022909958 | Phạm Thị Trúc Ly | PTO101 | PTO tải 01 | 1 | 2026-05-31 | P0 | N1 | 276 | Lặt xẻ PTO | 50524494 | VM 13/15 | WTHLXPTOHV0015 | 2026-06-01 | 13:00 | 2026-06-01 | 13:42 | 2.42 | kg | 1 | 8 | 1200 |
| 2 | 1022909959 | Nguyễn Văn An | PTO102 | PTO tải 02 | 1 | 2026-05-31 | P1 | N2 | 150 | Nobashi | 50524445 | VM 16/20 | WTHLXPTOHV0016 | 2026-06-01 | 14:00 | 2026-06-01 | 14:30 | 5.00 | kg | 1 | 9 | null |

### Bảng nhân viên mẫu (`nhanVienDB`)

| Mã NV | Họ và Tên |
|---|---|
| 1022909958 | Phạm Thị Trúc Ly |
| 1022909959 | Nguyễn Văn An |
| 1022909960 | Trần Thị Bích Nga |
