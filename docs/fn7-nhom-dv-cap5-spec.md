# THIẾT LẬP NHÓM TÍNH LƯƠNG NĂNG SUẤT — ĐẶC TẢ CHI TIẾT

> **File HTML:** `lns/fn7-nhom-dv-cap5.html`
> **Ngày cập nhật:** 29/06/2026
> **Phiên bản:** v4 — Master-Detail + Nhóm NS + Vai trò SX/PV

---

## MỤC LỤC

1. [MASTER — Bộ lọc tìm kiếm](#1-master--bộ-lọc-tìm-kiếm)
2. [MASTER — Thẻ thống kê](#2-master--thẻ-thống-kê)
3. [MASTER — Thanh nút thao tác](#3-master--thanh-nút-thao-tác)
4. [MASTER — Lưới dữ liệu](#4-master--lưới-dữ-liệu)
5. [MASTER — Popup Thêm master mới](#5-master--popup-thêm-master-mới)
6. [MASTER — Popup Sao chép](#6-master--popup-sao-chép)
7. [DETAIL — Header thông tin master (readonly)](#7-detail--header-thông-tin-master-readonly)
8. [DETAIL — Thanh khóa & kiểm tra](#8-detail--thanh-khóa--kiểm-tra)
9. [DETAIL — Progress bar](#9-detail--progress-bar)
10. [DETAIL — Tabs phân loại](#10-detail--tabs-phân-loại)
11. [DETAIL — Bộ lọc 3 lớp](#11-detail--bộ-lọc-3-lớp)
12. [DETAIL — Thanh gán nhanh (Bulk bar)](#12-detail--thanh-gán-nhanh-bulk-bar)
13. [DETAIL — Thanh nút thao tác](#13-detail--thanh-nút-thao-tác)
14. [DETAIL — Lưới Level 5](#14-detail--lưới-level-5)
15. [DETAIL — Popup Gán nhóm](#15-detail--popup-gán-nhóm)
16. [DETAIL — Popup Quản lý Nhóm NS](#16-detail--popup-quản-lý-nhóm-ns)
17. [DETAIL — Popup Import](#17-detail--popup-import)
18. [DETAIL — Popup Lịch sử](#18-detail--popup-lịch-sử)
19. [DETAIL — Validation nâng cao](#19-detail--validation-nâng-cao)
20. [DETAIL — Card view Nhóm NS](#20-detail--card-view-nhóm-ns)
21. [DATA MODEL — Bảng dữ liệu](#21-data-model--bảng-dữ-liệu)

---

## 1. MASTER — Bộ lọc tìm kiếm

### Danh sách trường

| # | Trường | ID | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả xử lý |
|---|--------|----|---------------|----------|----------|--------------|
| 1 | **Tháng** | `fn7-f-thang` | `text` (MM/YYYY) | Có | Tháng hiện tại +1 | Nhập theo format MM/YYYY. Validate: tháng 01–12, năm 2020–2099. Dùng để lọc danh sách master theo tháng. |
| 2 | **Công ty** | `fn7-f-cty` | `select` (dropdown) | Có | MPHG | Danh sách công ty từ hệ thống. Khi đổi công ty → reset Level 1–3 về mặc định. |
| 3 | **Level 1** | `fn7-f-l1` | `select` (dropdown) | Có | Bộ phận PTO | Phụ thuộc Công ty. Khi đổi → reset Level 2–3. |
| 4 | **Level 2** | `fn7-f-l2` | `select` (dropdown) | Có | Ka | Phụ thuộc Level 1. Khi đổi → reset Level 3. |
| 5 | **Level 3** | `fn7-f-l3` | `select` (dropdown) | Không | — Tất cả — | Phụ thuộc Level 2. Cho phép chọn "Tất cả" để hiển thị tất cả master của Level 2 đó. |

### Ràng buộc

- Khi đổi Công ty → cascade reset Level 1, 2, 3 về giá trị đầu tiên.
- Khi đổi Level 1 → cascade reset Level 2, 3.
- Format Tháng: chỉ cho phép `MM/YYYY`, tự thêm `0` nếu nhập `7/2026` → `07/2026`.

---

## 2. MASTER — Thẻ thống kê

| # | Thẻ | ID | Mô tả |
|---|-----|----|-------|
| 1 | **Tổng master** | `fn7-stat-master` | Đếm số dòng master hiển thị trong lưới (sau khi lọc). |
| 2 | **Tổng Level 5** | `fn7-stat-l5` | Tổng `total_l5` của tất cả master trong lưới. |
| 3 | **Đã gán** | `fn7-stat-assigned` | Tổng `assigned` của tất cả master. Màu xanh lá. |
| 4 | **Chưa gán** | `fn7-stat-unassigned` | Tổng `unassigned` của tất cả master. Màu đỏ. |

Thẻ thống kê cập nhật realtime khi lưới master thay đổi (thêm/xóa/sửa).

---

## 3. MASTER — Thanh nút thao tác

| # | Nút | Mô tả logic | Xử lý | Ràng buộc |
|---|-----|-------------|-------|-----------|
| 1 | **🔍 Tìm kiếm** | Lọc lưới master theo bộ lọc phía trên | Gọi API lấy danh sách master theo Tháng + Công ty + L1 + L2 + L3. Render lại lưới và cập nhật thẻ thống kê. | Tháng và Công ty bắt buộc. Nếu thiếu → hiện cảnh báo. |
| 2 | **➕ Thêm mới** | Mở popup Thêm master mới | Mở `fn7-modal-add-master`. Pre-fill Tháng, Công ty, L1–L3 từ bộ lọc hiện tại. Kiểm tra tháng trước có thiết lập → hiện gợi ý "Áp dụng từ tháng trước". | Không cho tạo trùng: cùng Tháng + Công ty + L1 + L2 + L3 + L4. Nếu trùng → báo lỗi "Đã tồn tại master cho tổ hợp này". |
| 3 | **📋 Sao chép** | Mở popup Sao chép thiết lập | Mở `fn7-modal-copy`. Nếu không có dòng nào được chọn trong lưới → sao chép từ dòng đầu tiên (hoặc yêu cầu chọn). | Chỉ sao chép master đã có detail (assigned > 0). Nếu master trống → cảnh báo "Không có dữ liệu để sao chép". |
| 4 | **🗑 Xóa** | Xóa master đang chọn (checkbox) | Confirm trước khi xóa. Xóa master + toàn bộ detail (Level 5 gán). | Không cho xóa master đã khóa (`locked = true`). Không cho xóa nếu master có detail đã gán (assigned > 0) → yêu cầu bỏ gán hết trước. |
| 5 | **📥 Xuất DL** | Xuất toàn bộ danh sách master ra file Excel | Export file `.xlsx` chứa thông tin master + tổng hợp detail (bao nhiêu L5, bao nhiêu đã gán, trạng thái). | Xuất theo bộ lọc hiện tại. |

---

## 4. MASTER — Lưới dữ liệu

### Cột lưới

| # | Cột | Kiểu | Sắp xếp | Mô tả |
|---|-----|------|---------|-------|
| 1 | ☐ | Checkbox | — | Tick chọn dòng để xóa hoặc sao chép hàng loạt. Header checkbox = chọn tất cả. |
| 2 | **STT** | Số tự tăng | — | Số thứ tự hiển thị, đánh lại khi filter/sort. |
| 3 | **Tháng** | Text (MM/YYYY) | Có | Tháng thiết lập. |
| 4 | **Công ty** | Text | Có | Mã công ty. |
| 5 | **Level 1** | Text | Có | Tên Level 1 (Bộ phận). |
| 6 | **Level 2** | Text | Có | Tên Level 2 (Ka). |
| 7 | **Level 3** | Text | Có | Tên Level 3 (Ka Sáng / Ka Chiều / Ka Đêm). In đậm, màu xanh dương. |
| 8 | **Level 4** | Text | Có | Tên Level 4. Nếu trống hiển thị "—". |
| 9 | **L5** | Số | Có | Tổng số Level 5 thuộc master này. In đậm. |
| 10 | **Gán** | Số | Có | Số Level 5 đã được gán nhóm TH. Màu xanh lá, in đậm. |
| 11 | **Thiếu** | Số | Có | Số Level 5 chưa gán = L5 − Gán. Màu đỏ, in đậm. |
| 12 | **Trạng thái** | Badge | Có | Tính từ dữ liệu: xem bảng trạng thái bên dưới. |
| 13 | **Thao tác** | Nút | — | 3 nút: Chi tiết, Sao chép, Sửa. |

### Trạng thái master

| Trạng thái | Điều kiện | Badge | Màu |
|------------|-----------|-------|-----|
| **Đã khóa** | `locked = true` | 🔒 Đã khóa | Xám `#d1d1d1` |
| **Đã gán hết** | `locked = false` AND `unassigned = 0` | ✅ Đã gán hết | Xanh lá `#d4edda` |
| **Còn thiếu** | `locked = false` AND `assigned > 0` AND `unassigned > 0` | ⚠ Còn thiếu | Vàng `#fff3cd` |
| **Chưa gán** | `locked = false` AND `assigned = 0` | ❌ Chưa gán | Đỏ `#f8d7da` |

### Nút trên mỗi dòng lưới

| # | Nút | Mô tả logic | Xử lý | Ràng buộc |
|---|-----|-------------|-------|-----------|
| 1 | **📋 Chi tiết** | Mở popup Detail (fullscreen) | Load danh sách Level 5 thuộc master. Hiện thông tin master readonly ở header. Cập nhật progress bar, tabs, lưới detail. | Luôn hiển thị. Nếu master đã khóa → detail mở ở chế độ readonly (ẩn nút Gán, Đổi, Bỏ gán). |
| 2 | **📋 Sao chép** | Mở popup Sao chép với nguồn = dòng này | Pre-fill thông tin nguồn từ master hiện tại. Hiện preview mapping Level 5 nguồn → đích. | Chỉ active khi `assigned > 0`. |
| 3 | **✏ Sửa** | Mở popup sửa thông tin master | Cho phép sửa Level 3, Level 4. Không cho sửa Tháng, Công ty, Level 1, Level 2 (thuộc khóa chính). | Không cho sửa nếu `locked = true`. |

---

## 5. MASTER — Popup Thêm master mới

### Danh sách trường

| # | Trường | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả xử lý |
|---|--------|---------------|----------|----------|--------------|
| 1 | **Tháng** | `text` (MM/YYYY) | Có | Từ bộ lọc | Validate format MM/YYYY. |
| 2 | **Công ty** | `select` | Có | Từ bộ lọc | Danh sách công ty. |
| 3 | **Level 1** | `select` | Có | Từ bộ lọc | Phụ thuộc Công ty. |
| 4 | **Level 2** | `select` | Có | Từ bộ lọc | Phụ thuộc Level 1. |
| 5 | **Level 3** | `select` | Không | Từ bộ lọc | Phụ thuộc Level 2. |
| 6 | **Level 4** | `select` | Không | — | Phụ thuộc Level 3. |

### Gợi ý từ tháng trước

- Khi chọn xong tổ hợp Tháng + Công ty + L1–L4, hệ thống kiểm tra **tháng trước** (M−1) có thiết lập cho cùng tổ hợp không.
- Nếu có → hiện thanh gợi ý: "Tháng 06/2026 có thiết lập cho tổ hợp này (380 Level 5 đã gán)".
- Hai lựa chọn:
  - **📋 Áp dụng từ tháng trước:** Tạo master mới + copy toàn bộ detail (Level 5 + nhóm TH + Nhóm NS + vai trò) từ tháng trước.
  - **❌ Bỏ qua, tạo trống:** Tạo master rỗng, detail trống.

### Nút

| Nút | Xử lý | Ràng buộc |
|-----|-------|-----------|
| **Hủy** | Đóng popup, không lưu. | — |
| **💾 Lưu** | Validate trường bắt buộc → kiểm tra trùng → tạo master. | Nếu trùng Tháng + Công ty + L1 + L2 + L3 + L4 → báo lỗi. |

---

## 6. MASTER — Popup Sao chép

### Phần Nguồn sao chép (readonly)

Hiển thị thông tin master nguồn: Tháng, Công ty, Level 1–3, số L5 đã gán.

### Phần Đích sao chép

| # | Trường | Kiểu | Bắt buộc | Mô tả xử lý |
|---|--------|------|----------|--------------|
| 1 | **Tháng đích** | `text` (MM/YYYY) | Có | Mặc định = tháng nguồn +1. |
| 2 | **Công ty đích** | `select` | Có | Mặc định = cùng công ty nguồn. |
| 3 | **Level 1 đích** | `select` | Có | Phụ thuộc Công ty đích. |
| 4 | **Level 2 đích** | `select` | Có | Phụ thuộc Level 1 đích. |
| 5 | **Level 3 đích** | `select` | Có | Highlight khác nguồn. Đây là trường thường dùng nhất (sao chép Ka Sáng → Ka Chiều). |
| 6 | **Level 4 đích** | `select` | Không | Phụ thuộc Level 3 đích. |

### Tùy chọn

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|----------|------|----------|-------|
| Sao chép toàn bộ details | Checkbox | ✅ Checked | Copy Level 5 + nhóm TH + Nhóm NS + vai trò SX/PV. |
| Ghi đè nếu đích đã có | Checkbox | ☐ Unchecked | Nếu checked: xóa detail cũ ở đích trước khi copy. Nếu unchecked: báo lỗi nếu đích đã có master. |

### Preview mapping

- Hệ thống tự map Level 5 nguồn → đích bằng cách thay tên bộ phận (VD: "Ka Sáng" → "Ka Chiều").
- Hiển thị bảng preview: L5 nguồn → L5 đích (tự map) + Nhóm TH.
- L5 không map được → highlight đỏ, yêu cầu chọn thủ công sau sao chép.

### Nút

| Nút | Xử lý | Ràng buộc |
|-----|-------|-----------|
| **Hủy** | Đóng popup. | — |
| **📋 Thực hiện sao chép** | Validate đích → tạo master đích + copy detail + mapping L5. | Nếu đích đã tồn tại và không check "Ghi đè" → báo lỗi. |

---

## 7. DETAIL — Header thông tin master (readonly)

Hiển thị dạng grid 6 cột, không cho sửa:

| # | Trường | ID | Mô tả |
|---|--------|----|-------|
| 1 | **Tháng** | `fn7-d-thang` | MM/YYYY |
| 2 | **Công ty** | `fn7-d-cty` | Mã công ty |
| 3 | **Level 1** | `fn7-d-l1` | Tên Level 1 |
| 4 | **Level 2** | `fn7-d-l2` | Tên Level 2 |
| 5 | **Level 3** | `fn7-d-l3` | Tên Level 3 |
| 6 | **Level 4** | `fn7-d-l4` | Tên Level 4, hiển thị "—" nếu trống |

---

## 8. DETAIL — Thanh khóa & kiểm tra

| # | Nút | Mô tả logic | Xử lý | Ràng buộc |
|---|-----|-------------|-------|-----------|
| 1 | **✅ Kiểm tra** | Chạy validation nâng cao | Hiện checklist validation (xem [mục 19](#19-detail--validation-nâng-cao)). Scroll đến checklist. | Luôn hiển thị. |
| 2 | **🔒 Khóa thiết lập** | Khóa/mở khóa master | **Khóa:** set `locked = true`, chuyển detail sang readonly (ẩn nút sửa, gán, bỏ gán). Ghi audit log. **Mở khóa:** set `locked = false`, bật lại các nút. | Không cho khóa nếu `unassigned > 0` → chạy validation trước, hiện cảnh báo "Còn X Level 5 chưa gán". |
| 3 | **🕐 Lịch sử** | Mở popup lịch sử thay đổi | Hiện danh sách hành động: thời gian + user + mô tả. | Luôn hiển thị. |
| 4 | **🔄 So sánh tháng trước** | Toggle hiện/ẩn diff view | So sánh detail tháng hiện tại vs tháng M−1 cùng tổ hợp. Hiện 3 loại: thêm mới, thay đổi, đã xóa. | Ẩn nếu tháng trước không có thiết lập. |

### Trạng thái hiển thị

| Trạng thái | Text | Hành vi |
|------------|------|---------|
| Đang mở | "🔓 Đang mở — có thể chỉnh sửa" | Tất cả nút hoạt động bình thường. |
| Đã khóa | "🔒 Đã khóa — chỉ xem, không chỉnh sửa" | Ẩn: Gán nhóm, Đổi nhóm, Bỏ gán, Gán nhanh (bulk bar), inline assign dropdown. Nút đổi thành "🔓 Mở khóa". |

---

## 9. DETAIL — Progress bar

Thanh tiến trình hình chữ nhật chia thành 5 đoạn theo tỷ lệ:

| Đoạn | Màu | Mô tả |
|------|-----|-------|
| **TH1** | Xanh lá `#28a745` | Năng suất riêng |
| **TH2** | Xanh dương `#007bff` | NS chung 1 ĐV |
| **TH3** | Vàng `#ffc107` | NS chung nhiều ĐV |
| **TH4** | Hồng `#e91e63` | Tách phụ |
| **Chưa gán** | Xám `#adb5bd` | Chưa gán nhóm |

- Mỗi đoạn hiển thị số lượng bên trong (nếu > 0).
- Bên dưới: legend hiển thị `TH1: X | TH2: X | TH3: X | TH4: X | Chưa gán: X`.
- Cập nhật realtime khi gán/bỏ gán/đổi nhóm.

---

## 10. DETAIL — Tabs phân loại

| # | Tab | Data-tab | Mô tả | Badge màu |
|---|-----|----------|-------|-----------|
| 1 | **Tất cả** | `all` | Hiển thị toàn bộ Level 5 | Xanh dương |
| 2 | **Đã gán** | `assigned` | Level 5 có `th != ''` | Xanh lá |
| 3 | **Chưa gán** | `unassigned` | Level 5 có `th = ''` | Đỏ |
| 4 | **TH1** | `TH1` | Level 5 có `th = 'TH1'` | Xanh lá nhạt |
| 5 | **TH2** | `TH2` | Level 5 có `th = 'TH2'` | Xanh dương nhạt |
| 6 | **TH3** | `TH3` | Level 5 có `th = 'TH3'` | Vàng nhạt |
| 7 | **TH4** | `TH4` | Level 5 có `th = 'TH4'` | Hồng nhạt |

- Mỗi tab hiển thị badge đếm số lượng.
- Khi chuyển tab → reset checkbox chọn dòng, render lại lưới theo filter.

---

## 11. DETAIL — Bộ lọc 3 lớp

### Lớp 1: Tabs (đã mô tả ở mục 10)

### Lớp 2: Filter row

| # | Trường | ID | Kiểu | Mô tả xử lý |
|---|--------|----|------|--------------|
| 1 | **Tìm nhanh** | `fn7-d-search` | `text` (free-text) | Tìm theo tên Level 5, mã Level 5, hoặc tên nhóm. Case-insensitive, tìm substring. Trigger khi `oninput`. |
| 2 | **Nhóm NS** | `fn7-d-filter-group` | `select` | Dropdown danh sách Nhóm NS (NS-001, NS-002...) thuộc master hiện tại. Chọn → lọc chỉ L5 thuộc nhóm đó. |
| 3 | **Bộ phận (cross-Ka)** | `fn7-d-filter-bp` | `select` | Dropdown: Tất cả / Ka Sáng / Ka Chiều / Ka Đêm. Dùng để lọc L5 theo bộ phận gốc khi có cross-Ka. |

### Lớp 3: Column filter (Telerik built-in)

Telerik grid hỗ trợ `filterable: true` trên từng cột header → user có thể filter thêm trực tiếp trên cột.

### Nút lọc

| Nút | Xử lý |
|-----|-------|
| **🔍 Lọc** | Apply tất cả filter, render lại lưới. |
| **❌** | Reset toàn bộ filter row về mặc định, render lại. |

---

## 12. DETAIL — Thanh gán nhanh (Bulk bar)

> Hiển thị khi có >= 1 dòng được tick checkbox.

| # | Thành phần | Mô tả |
|---|------------|-------|
| 1 | **Label** | "⚡ Gán nhanh — Đã chọn: **X** dòng" |
| 2 | **Dropdown TH** | Chọn nhóm tính lương: TH1 / TH2 / TH3 / TH4. |
| 3 | **Nút ✅ Gán X dòng** | Gán nhóm TH đã chọn cho tất cả dòng đang tick. |
| 4 | **Nút Chọn tất cả chưa gán** | Tự động tick tất cả dòng có `th = ''` trong tab hiện tại. |

### Xử lý nút Gán

1. Lấy danh sách `ma` từ `selectedDetailRows`.
2. Với mỗi dòng: set `th = <giá trị dropdown>`.
3. Nếu chọn TH3/TH4: cần chọn thêm Nhóm NS → nếu chưa có nhóm → mở popup Gán nhóm thay vì gán trực tiếp.
4. Clear selection, render lại, cập nhật master counts.

### Ràng buộc

- Chỉ gán cho dòng có `th = ''` (chưa gán). Dòng đã gán bị bỏ qua.
- Ẩn toàn bộ bulk bar khi master đã khóa.

---

## 13. DETAIL — Thanh nút thao tác

| # | Nút | Mô tả logic | Xử lý | Ràng buộc |
|---|-----|-------------|-------|-----------|
| 1 | **➕ Gán nhóm** | Mở popup gán nhóm TH cho L5 | Mở `fn7-modal-assign`. Nếu có dòng đang tick → gán cho dòng đó. Nếu không → yêu cầu chọn dòng. | Ẩn khi `locked = true`. |
| 2 | **🔄 Đổi nhóm** | Đổi nhóm TH/Nhóm NS cho L5 đang chọn | Yêu cầu tick dòng trước. Mở popup tương tự Gán nhóm nhưng pre-fill giá trị hiện tại. | Chỉ active khi tick dòng đã gán (`th != ''`). Ẩn khi locked. |
| 3 | **🔗 Bỏ gán** | Xóa gán nhóm TH + Nhóm NS + vai trò | Confirm → set `th = ''`, `nhom_id = ''`, `vai_tro = ''` cho các dòng đang tick. Cập nhật master counts. | Chỉ active khi tick dòng đã gán. Ẩn khi locked. |
| 4 | **📚 Quản lý Nhóm NS** | Mở popup quản lý Nhóm NS | Mở `fn7-modal-nhomns`. Xem/tạo/xóa nhóm NS. | Luôn hiển thị (kể cả khi locked, ở chế độ readonly). |
| 5 | **Toggle: Danh sách / Nhóm NS** | Chuyển đổi view | **Danh sách:** hiện lưới table. **Nhóm NS:** hiện card view trực quan. | Luôn hiển thị. |
| 6 | **📤 Import** | Mở popup Import | Mở `fn7-modal-import`. | Ẩn khi locked. |
| 7 | **📥 Export** | Xuất tab hiện tại ra Excel | Export Level 5 đang hiển thị (sau filter + tab) ra `.xlsx`. Bao gồm: Mã, Tên, Bộ phận, Nhóm TL, Nhóm NS, Vai trò, Ghi chú. | Luôn hiển thị. |

---

## 14. DETAIL — Lưới Level 5

### Cột lưới

| # | Cột | Kiểu | Sắp xếp | Lọc cột | Mô tả |
|---|-----|------|---------|---------|-------|
| 1 | ☐ | Checkbox | — | — | Tick chọn dòng. Header checkbox = chọn tất cả trong trang hiện tại. |
| 2 | **STT** | Số tự tăng | — | — | Đánh lại theo filter/page. |
| 3 | **Level 5 (Bàn)** | Text | Có | Có | Tên đầy đủ Level 5. In đậm. Align trái. |
| 4 | **Mã** | Text (monospace) | Có | Có | Mã hệ thống của Level 5. Font nhỏ `9px`, màu xám. |
| 5 | **Bộ phận** | Text | Có | Có | Bộ phận gốc của Level 5 (Ka Sáng / Ka Chiều / Ka Đêm). |
| 6 | **Nhóm TL** | Badge | Có | Có | Hiển thị badge: `TH1` (xanh lá), `TH2` (xanh dương), `TH3` (vàng), `TH4` (hồng), `Chưa gán` (xám). |
| 7 | **Nhóm NS** | Text (monospace) | Có | Có | Mã Nhóm NS (VD: `NS-001`). Click vào → chuyển sang Card view và scroll đến nhóm đó. Hiển thị "—" nếu trống. Chỉ có giá trị khi `th = TH3` hoặc `th = TH4`. |
| 8 | **Vai trò** | Badge | Có | Có | Chỉ hiển thị khi `th = TH4`: badge `SX` (xanh lá) hoặc `PV` (hồng). Hiển thị "—" nếu trống hoặc TH1/TH2/TH3. |
| 9 | **Ghi chú** | Text | — | Có | Text tự do. Align trái. |
| 10 | **Gán nhanh** | Dropdown | — | — | Chỉ hiển thị cho dòng chưa gán (`th = ''`). Dropdown: -- Chọn -- / TH1 / TH2 / TH3 / TH4. Khi chọn → gán trực tiếp (nếu TH1/TH2 → gán luôn; nếu TH3/TH4 → mở popup Gán nhóm). |
| 11 | **Thao tác** | Nút | — | — | Nút ➕ (nếu chưa gán) hoặc ✏ (nếu đã gán) → mở popup Gán nhóm cho dòng đó. |

### Highlight dòng

| Loại | Điều kiện | Màu nền |
|------|-----------|---------|
| Chưa gán | `th = ''` | Vàng nhạt `#fff3cd` |
| Đang chọn | Checkbox ticked | Xanh nhạt `#cce5ff` |
| Hover | Mouse hover | Xanh rất nhạt `#f1f8ff` |

### Phân trang

| Thành phần | Mô tả |
|------------|-------|
| Hiển thị range | "1–50 / 400" |
| Chọn size | 50 / 100 / 200 dòng/trang |
| Nút page | « 1 2 3 ... 8 » |

---

## 15. DETAIL — Popup Gán nhóm

### Phần 1: Thông tin Level 5 (readonly)

| Trường | Mô tả |
|--------|-------|
| **Tên Level 5** | Hiển thị tên đầy đủ. |
| **Mã Level 5** | Hiển thị mã trong ngoặc đơn. |

### Phần 2: Chọn nhóm tính lương

| # | Radio | Value | Mô tả |
|---|-------|-------|-------|
| 1 | **TH1** | `TH1` | Năng suất riêng — Level 5 tự tính NS độc lập. |
| 2 | **TH2** | `TH2` | NS chung - 1 ĐV cấp 5 — Tính NS cho 1 ĐV duy nhất. |
| 3 | **TH3** | `TH3` | NS chung - Nhiều ĐV cấp 5 — Gom nhiều L5 chia chung NS. |
| 4 | **TH4** | `TH4` | NS chung - Tách cho phụ — Gom nhiều L5 + phân vai trò SX/PV. |

**Khi đã gán:** chỉ hiện radio của TH hiện tại (ẩn các TH khác) — tránh chọn nhầm. Muốn đổi → dùng nút "Đổi nhóm".

### Phần 3: Chọn Nhóm NS (ẩn khi TH1/TH2, hiện khi TH3/TH4)

| # | Trường | Kiểu | Bắt buộc | Mô tả |
|---|--------|------|----------|-------|
| 1 | **Dropdown Nhóm NS** | `select` | Có (khi TH3/TH4) | Danh sách Nhóm NS đã có, filter theo `loai = TH3` hoặc `TH4`. Hiển thị: `NS-001 — Nhóm Lặt đầu + Phân cỡ KS (3 L5)`. |
| 2 | **Tên nhóm mới** | `text` + nút **➕ Tạo** | — | Nhập tên → bấm Tạo → tạo Nhóm NS mới, tự sinh mã `NS-xxx`. Auto-select nhóm vừa tạo. |

### Phần 4: Vai trò (ẩn khi TH1/TH2/TH3, hiện khi TH4)

| # | Radio | Value | Mô tả |
|---|-------|-------|-------|
| 1 | **SX — Sản xuất** | `SX` | Trực tiếp tạo ra năng suất. Lương tính theo NS sản xuất. |
| 2 | **PV — Phục vụ** | `PV` | Hỗ trợ, phục vụ cho nhóm SX. Lương tính theo công thức phục vụ riêng. |

### Nút

| Nút | Xử lý | Ràng buộc |
|-----|-------|-----------|
| **Hủy** | Đóng popup. | — |
| **💾 Lưu** | Gán `th`, `nhom_id`, `vai_tro` cho Level 5 đã chọn. Cập nhật master counts, progress bar, lưới. | TH3/TH4 bắt buộc chọn Nhóm NS. TH4 bắt buộc chọn vai trò SX/PV. Kiểm tra L5 chưa thuộc nhóm khác. |

---

## 16. DETAIL — Popup Quản lý Nhóm NS

### Header

Tiêu đề: "📚 Quản lý Nhóm năng suất (Nhóm NS)"

### Phần tạo nhóm mới

| # | Trường | Kiểu | Bắt buộc | Mô tả |
|---|--------|------|----------|-------|
| 1 | **Tên nhóm** | `text` | Có | VD: "Nhóm Lặt đầu + Phân cỡ KS". |
| 2 | **Loại** | `select` | Có | TH3 - Chung nhiều ĐV / TH4 - Tách phụ. |
| 3 | **Nút ➕ Tạo nhóm** | Button | — | Validate tên → tạo Nhóm NS mới với mã tự sinh. |

### Danh sách nhóm

Mỗi nhóm hiển thị:

| Thành phần | Mô tả |
|------------|-------|
| **Mã nhóm** | VD: `NS-001`. Monospace, badge. |
| **Badge loại** | `TH3` hoặc `TH4`. |
| **Tên nhóm** | In đậm. |
| **Số L5** | Đếm member. |
| **SX + PV** | (Chỉ TH4) Đếm vai trò. |
| **Danh sách member** | Pill badges: mỗi L5 là 1 pill, TH4 có prefix SX/PV. |
| **Cảnh báo cross-Ka** | Nếu member từ >1 bộ phận → hiện warning vàng. |
| **Cảnh báo < 2 member** | Nếu chỉ có 0–1 L5 → hiện error đỏ. |
| **Cảnh báo TH4 thiếu vai trò** | Nếu thiếu SX hoặc PV → hiện error đỏ. |
| **Nút 🗑 Xóa** | Xóa nhóm NS. Chỉ cho xóa khi nhóm không có member (phải bỏ gán L5 trước). |

---

## 17. DETAIL — Popup Import

### Quy trình 3 bước

| Bước | Mô tả |
|------|-------|
| **① Tải template** | 2 nút: "Tải template trống (.xlsx)" và "Export tab chưa gán". Template gồm cột: Mã L5, Tên, Bộ phận, **Mã TH**, **Mã Nhóm NS**, **Vai trò (SX/PV)**. |
| **② Chọn file** | Drag & drop hoặc click chọn file `.xlsx` / `.csv`. |
| **③ Xem trước** | Parse file → hiện summary: số dòng mới, số dòng cập nhật, số dòng lỗi. |

### Preview tags

| Tag | Mô tả |
|-----|-------|
| `Mới` (xanh lá) | Dòng L5 chưa có TH → sẽ được gán. |
| `Cập nhật` (vàng) | Dòng L5 đã có TH → sẽ đổi. |
| `Lỗi` (đỏ) | Mã L5 không tồn tại hoặc Mã TH không hợp lệ. |

### Tùy chọn import

| Tùy chọn | Kiểu | Mặc định | Mô tả |
|----------|------|----------|-------|
| Bỏ qua dòng lỗi | Checkbox | ✅ | Import phần hợp lệ, skip dòng lỗi. |
| Ghi đè dòng đã gán | Checkbox | ☐ | Nếu checked: đổi TH/Nhóm NS/Vai trò cho dòng đã gán. Nếu unchecked: skip dòng đã gán. |

### Nút

| Nút | Xử lý | Ràng buộc |
|-----|-------|-----------|
| **Hủy** | Đóng popup. | — |
| **📤 Import X dòng hợp lệ** | Gán TH + Nhóm NS + Vai trò cho các dòng hợp lệ. Cập nhật master counts. | Số X = dòng hợp lệ (trừ dòng lỗi và dòng bị skip). |

---

## 18. DETAIL — Popup Lịch sử

Hiển thị danh sách hành động audit:

| Cột | Mô tả |
|-----|-------|
| **Thời gian** | `dd/MM HH:mm`. |
| **User** | Tên người thực hiện. |
| **Hành động** | Mô tả chi tiết: tạo master, gán nhóm, đổi nhóm, import, khóa/mở khóa, sao chép. |

Sắp xếp mới nhất trên cùng.

---

## 19. DETAIL — Validation nâng cao

Khi bấm **✅ Kiểm tra**, chạy 4 nhóm kiểm tra:

### ① Gán nhóm tính lương

| Rule | Loại | Mô tả |
|------|------|-------|
| Tất cả L5 đã gán | ✅ OK | "X/X Level 5 đã được gán nhóm tính lương" |
| Còn L5 chưa gán | ❌ Lỗi | "Còn X Level 5 chưa được gán nhóm" + liệt kê mã L5 |

### ② Nhóm NS — TH3

| Rule | Loại | Mô tả |
|------|------|-------|
| Mỗi nhóm >= 2 L5 | ❌ Lỗi | "NS-xxx: chỉ có Y L5 — TH3 cần ít nhất 2 L5" |
| Nhóm hợp lệ | ✅ OK | "NS-xxx: Y L5 chia chung NS" |
| L5 thuộc TH3 không có nhóm | ❌ Lỗi | "X L5 thuộc TH3 nhưng chưa gán Nhóm NS" |

### ③ Nhóm NS — TH4

| Rule | Loại | Mô tả |
|------|------|-------|
| Thiếu vai trò SX | ❌ Lỗi | "NS-xxx: thiếu vai trò SX — TH4 bắt buộc có ít nhất 1 SX" |
| Thiếu vai trò PV | ❌ Lỗi | "NS-xxx: thiếu vai trò PV — TH4 bắt buộc có ít nhất 1 PV" |
| Hợp lệ | ✅ OK | "NS-xxx: X SX + Y PV" |
| L5 chưa gán vai trò | ⚠ Cảnh báo | "NS-xxx: Z L5 chưa gán vai trò SX/PV" |
| Nhóm < 2 L5 | ❌ Lỗi | "NS-xxx: chỉ có Y L5 — nhóm cần ít nhất 2" |
| L5 thuộc TH4 không có nhóm | ❌ Lỗi | "X L5 thuộc TH4 nhưng chưa gán Nhóm NS" |

### ④ Cross-Ka & trùng lặp

| Rule | Loại | Mô tả |
|------|------|-------|
| Nhóm có L5 từ nhiều bộ phận | ⚠ Cảnh báo | "NS-xxx chứa L5 từ nhiều bộ phận: Ka Sáng, Ka Chiều — kiểm tra cross-Ka?" |
| Không có cross-Ka | ✅ OK | "Không có nhóm cross-Ka" |
| L5 nằm trong >1 nhóm | ❌ Lỗi | "DVS_xxx xuất hiện trong 2 nhóm: NS-001, NS-002 — mỗi L5 chỉ thuộc 1 nhóm" |
| Không trùng lặp | ✅ OK | "Không có L5 trùng lặp giữa các nhóm" |

---

## 20. DETAIL — Card view Nhóm NS

Toggle qua nút **"🎲 Nhóm NS"** trên toolbar. Khi active: ẩn lưới table + phân trang, hiện card view.

### Layout card

**TH1 — Năng suất riêng:**
- Hiển thị dạng pill badges gom lại, mỗi L5 là 1 pill xanh lá.

**TH2 — NS chung 1 ĐV:**
- Hiển thị dạng pill badges, mỗi L5 là 1 pill xanh dương.

**TH3 — Chung nhiều ĐV:**
- Mỗi Nhóm NS là 1 card.
- Header card: mã nhóm, badge TH3, tên nhóm, số L5.
- Body card: danh sách member (tên + mã + bộ phận).
- Footer card: nút "✏ Sửa nhóm".
- Cảnh báo: cross-Ka (vàng), < 2 member (đỏ).

**TH4 — Tách phụ:**
- Mỗi Nhóm NS là 1 card.
- Header card: mã nhóm, badge TH4, tên nhóm, số SX + PV.
- Body card chia 2 khu:
  - **Sản xuất:** label "SẢN XUẤT", mỗi member có badge `SX` xanh lá.
  - **Phục vụ:** label "PHỤC VỤ", mỗi member có badge `PV` hồng.
- Cảnh báo: thiếu SX/PV (đỏ), cross-Ka (vàng), chưa gán vai trò (vàng).
- Footer: thống kê + nút sửa.

**Chưa gán:**
- Pill badges đỏ, hiển thị cuối cùng.

---

## 21. DATA MODEL — Bảng dữ liệu

### Bảng MASTER

| Trường | Kiểu | PK | Bắt buộc | Mô tả |
|--------|------|----|----------|-------|
| `id` | INT (auto) | ✅ | Có | ID tự tăng. |
| `thang` | VARCHAR(7) | — | Có | Format MM/YYYY. |
| `cty` | VARCHAR(10) | — | Có | Mã công ty. |
| `l1` | VARCHAR(50) | — | Có | Tên/mã Level 1. |
| `l2` | VARCHAR(50) | — | Có | Tên/mã Level 2. |
| `l3` | VARCHAR(50) | — | Không | Tên/mã Level 3. |
| `l4` | VARCHAR(50) | — | Không | Tên/mã Level 4. |
| `locked` | BOOLEAN | — | Có | `false` = đang mở, `true` = đã khóa. |

**Unique constraint:** `(thang, cty, l1, l2, l3, l4)` — mỗi tổ hợp chỉ 1 dòng master/tháng.

**Trường tính toán (không lưu DB):**
- `total_l5` = COUNT detail where `master_id = id`
- `assigned` = COUNT detail where `master_id = id AND th != ''`
- `unassigned` = `total_l5 - assigned`

### Bảng NHOM_NS

| Trường | Kiểu | PK | Bắt buộc | Mô tả |
|--------|------|----|----------|-------|
| `id` | VARCHAR(10) | ✅ | Có | Mã tự sinh format `NS-xxx` (VD: NS-001). |
| `ten` | VARCHAR(200) | — | Có | Tên mô tả nhóm. VD: "Nhóm Lặt đầu + Phân cỡ KS". |
| `loai` | VARCHAR(3) | — | Có | `TH3` hoặc `TH4`. |
| `master_id` | INT (FK) | — | Có | FK → MASTER.id. |

**Business rules:**
- Mỗi nhóm NS phải có >= 2 Level 5 (cảnh báo nếu < 2, không block lưu).
- TH4: nhóm phải có >= 1 SX + >= 1 PV (cảnh báo nếu thiếu, block khi khóa master).

### Bảng DETAIL (Level 5)

| Trường | Kiểu | PK | Bắt buộc | Mô tả |
|--------|------|----|----------|-------|
| `ma` | VARCHAR(20) | ✅ | Có | Mã Level 5. VD: DVS_LAT_KS. |
| `ten` | VARCHAR(200) | — | Có | Tên Level 5. VD: Lặt đầu tôm Ka Sáng. |
| `bp` | VARCHAR(50) | — | Có | Bộ phận gốc. VD: Ka Sáng. |
| `th` | VARCHAR(3) | — | Không | Nhóm tính lương: `TH1`, `TH2`, `TH3`, `TH4`, hoặc `''` (chưa gán). |
| `nhom_id` | VARCHAR(10) (FK) | — | Không | FK → NHOM_NS.id. Chỉ có giá trị khi `th = TH3` hoặc `th = TH4`. |
| `vai_tro` | VARCHAR(2) | — | Không | `SX` (sản xuất) hoặc `PV` (phục vụ). Chỉ có giá trị khi `th = TH4`. |
| `ghi_chu` | VARCHAR(500) | — | Không | Ghi chú tự do. |
| `master_id` | INT (FK) | — | Có | FK → MASTER.id. |

**Business rules:**
- 1 Level 5 chỉ thuộc 1 TH (TH1/TH2/TH3/TH4).
- 1 Level 5 chỉ thuộc 1 Nhóm NS.
- Khi `th = TH1` hoặc `th = TH2`: `nhom_id = ''`, `vai_tro = ''`.
- Khi `th = TH3`: `nhom_id` bắt buộc, `vai_tro = ''`.
- Khi `th = TH4`: `nhom_id` bắt buộc, `vai_tro` bắt buộc (`SX` hoặc `PV`).
- Khi `th = ''`: `nhom_id = ''`, `vai_tro = ''`.

### Bảng AUDIT_LOG (Lịch sử)

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `id` | INT (auto) | PK. |
| `master_id` | INT (FK) | FK → MASTER.id. |
| `thoi_gian` | DATETIME | Thời điểm hành động. |
| `user_name` | VARCHAR(100) | Tên user thực hiện. |
| `hanh_dong` | VARCHAR(500) | Mô tả hành động (VD: "Gán DVS_LAT_KS vào TH3 nhóm NS-001"). |

---

## PHỤ LỤC: Bảng tổng hợp 4 trường hợp tính lương

| TH | Tên | Mô tả | Nhóm NS | Vai trò | Cách tính lương |
|----|-----|-------|---------|---------|-----------------|
| **TH1** | Năng suất riêng | 1 Level 5 tự tính NS độc lập | Không | Không | Lương = NS riêng × đơn giá |
| **TH2** | NS chung 1 ĐV | 1 Level 5, tính NS chung cho đơn vị | Không | Không | Lương = NS chung ĐV × đơn giá |
| **TH3** | NS chung nhiều ĐV | Nhiều L5 gom 1 nhóm, chia chung NS | **Bắt buộc** | Không | Lương = NS nhóm ÷ số L5 × đơn giá (hoặc theo tỷ lệ) |
| **TH4** | NS chung tách phụ | Nhiều L5 gom 1 nhóm, phân SX + PV | **Bắt buộc** | **Bắt buộc** | SX: Lương = NS SX ÷ số SX × đơn giá. PV: Lương = NS PV × hệ số phục vụ |
