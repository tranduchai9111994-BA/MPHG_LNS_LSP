# Nhập năng suất chung theo bộ phận

**File:** `lns/fn5-khoa-cong.html`  
**Menu:** Lương › Tính Lương năng suất › Nhập năng suất chung theo bộ phận  
**Breadcrumb:** Lương › Tính Lương năng suất › Nhập năng suất chung theo bộ phận

---

## 1. Trường thông tin (Bộ lọc)

Bố cục 2 cột (`grid-template-columns: 1fr 1fr`), gap 12px × 40px.

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| Từ ngày | `input[type=date]` | **Có** (label đỏ `lbl-red`) | Mặc định: `2025-07-01` |
| Đến ngày | `input[type=date]` | **Có** (label đỏ `lbl-red`) | Mặc định: `2025-07-31` |
| Bộ phận | Select | Không | Options: Tất cả, May mặc, Hoàn thiện |
| Ka/Bàn | Select | Không | Options: Tất cả, Ka A, Ka B |
| Công đoạn | Select | Không | Options: Tất cả, May thân trước, May tay áo, Hoàn thiện |
| Quy cách tính lương | Select | Không | Options: Tất cả, WTHLXPTOHV0015, WTHLXPTOHV0016, WTHLXPTOHV0017 |
| Mã nội bộ | Select | Không | Options: Tất cả, 50524494 - VM 13/15, 50524445 - VM 16/20, 50524492 - VM 21/25 |
| Đơn vị tính | Select | Không | Options: Tất cả, kg, con |

---

## 2. Nút chức năng

| Nút | Class | Hành động | Mô tả |
|---|---|---|---|
| Tìm kiếm | `btn-search` | (chưa implement) | Lọc lưới theo các bộ lọc trên |
| Làm mới | `btn-refresh` | (chưa implement) | Reset toàn bộ bộ lọc về mặc định |
| Thêm mới | `btn-add` | `fn5NewRow()` | Mở popup thêm mới, clear form, title = "THÊM NĂNG SUẤT THEO CÔNG ĐOẠN" |
| Nhập dữ liệu | `btn-import` | `showModal('fn5-imp')` | Mở modal import Excel |
| Xóa | `btn-delete` | `fn5DeleteChecked()` | Xóa các dòng checkbox đã chọn, confirm trước khi xóa, đánh lại STT |
| Xuất Excel | `btn-export` | (chưa implement) | Xuất dữ liệu lưới ra file Excel |

### Logic nút Xóa (`fn5DeleteChecked`)

1. Kiểm tra có dòng nào được chọn → nếu không: `alert('Vui lòng chọn dòng cần xóa.')`
2. `confirm()` xác nhận → nếu Hủy: dừng
3. Xóa các `<tr>` tương ứng khỏi DOM
4. Bỏ chọn checkbox header (`fn5ChkAll`)
5. Đánh lại STT cho các dòng còn lại (cells[2])

---

## 3. Lưới dữ liệu

### 3.1. Cấu trúc cột

| # | Cột | Width | Kiểu hiển thị | Ghi chú |
|---|---|---|---|---|
| 0 | Checkbox | 30px | `<input type="checkbox">` | Header: checkbox toggle-all (`fn5ChkAll`), mỗi dòng: class `fn5-chk` với `data-id` |
| 1 | Sửa | — | Icon ✎ | Click → `fn5EditRow(this)` mở popup sửa |
| 2 | STT | — | Text | Tự động đánh số |
| 3 | Mã bộ phận | — | Text | VD: CB101, CB102, CB103 |
| 4 | Ka LV | — | Text | Ka làm việc (1, 2) |
| 5 | Ngày NL | — | Text (DD/MM/YYYY) | Ngày nhập liệu |
| 6 | Lô | — | Text | VD: P0, P1, P2 |
| 7 | Nhóm KS | — | Text | VD: N1, N2, N3 |
| 8 | KL Bơ | — | Text | Khối lượng bơ |
| 9 | Quy cách SX | — | Text | VD: LX PTO, Nobashi, Sushi |
| 10 | Mã nội bộ | — | Text monospace bold | VD: 50524494 |
| 11 | Size nội bộ | — | Text | VD: VM 13/15, VM 16/20 |
| 12 | Quy cách tính lương | — | Text | VD: WTHLXPTOHV0015 |
| 13 | Ngày LV | — | Text (DD/MM/YYYY) | Ngày làm việc |
| 14 | TG bắt đầu | — | Text (HH:mm) | Thời gian bắt đầu |
| 15 | Ngày cân | — | Text (DD/MM/YYYY) | |
| 16 | Giờ cân | — | Text (HH:mm) | |
| 17 | gr/con | — | Number (2 decimals) | |
| 18 | con/khay | — | Number (2 decimals) | |
| 19 | **Trong giờ** | — | Number, class `ns-val` | Sản lượng ca 1. Nền xanh nhạt, chữ xanh đậm, bold |
| 20 | **Ca đêm** | — | Number | Sản lượng ca 2 |
| 21 | **Tăng ca** | — | Number, class `ns-val` | Sản lượng ca 3 |
| 22 | **Tăng ca đêm** | — | Number | Sản lượng ca 4 |
| 23 | **Ngày nghỉ** | — | Number | Sản lượng ca 5 |
| 24 | **Đêm ngày nghỉ** | — | Number | Sản lượng ca 6 |
| 25 | **Ngày lễ** | — | Number | Sản lượng ca 7 |
| 26 | **Đêm ngày lễ** | — | Number | Sản lượng ca 8 |
| 27 | Đơn vị tính | — | Text, đỏ đậm | VD: kg, con |
| 28 | Line.Bơ | — | Text | Số line bơ |
| 29 | Ghi chú | — | Text, căn trái | Ghi chú tự do |

### 3.2. Cơ chế 8 cột sản lượng theo ca

Mỗi dòng dữ liệu có 1 cột NS Làm (giá trị 1–8) xác định sản lượng thuộc ca nào. Trên lưới, giá trị KL chỉ hiển thị ở cột tương ứng, 7 cột còn lại hiển thị `0.00`.

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

### 3.3. Style đặc biệt

- Cột sản lượng có giá trị > 0: class `ns-val` → `background:#e3f2fd; color:#1565c0; font-weight:bold`
- Cột Đơn vị tính: `color:#d32f2f; font-weight:bold`
- Cột Mã nội bộ: `font-family:monospace; font-weight:bold`

---

## 4. Popup Thêm mới / Sửa (`fn5-add`)

### 4.1. Bố cục

- Full width: `width:98%; max-width:none; margin:10px`
- Body: CSS grid 4 cột (`grid-template-columns: 1fr 1fr 1fr 1fr`), gap 12px
- Tiêu đề thay đổi: "THÊM NĂNG SUẤT THEO CÔNG ĐOẠN" hoặc "SỬA NĂNG SUẤT THEO CÔNG ĐOẠN"

### 4.2. Danh sách trường

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Mã bộ phận | `fn5_mabp` | Text | **Có** (*) | VD: CB101 |
| Ka LV | `fn5_kalv` | Text | **Có** (*) | VD: 1 |
| Ngày NL | `fn5_ngaynl` | Date | Không | |
| Lô | `fn5_lo` | Text | Không | VD: P0 |
| Nhóm KS | `fn5_nhomks` | Text | Không | |
| KL Bơ | `fn5_klbo` | Number (step 0.01) | Không | |
| Quy cách SX | `fn5_qcsx` | Text | Không | |
| Mã nội bộ | `fn5_manb` | Text | **Có** (*) | VD: 50524494 |
| Size nội bộ | `fn5_sizenb` | Text | Không | |
| Quy cách tính lương | `fn5_qctl` | Text | Không | |
| Ngày LV | `fn5_ngaylv` | Date | **Có** (*) | |
| TG bắt đầu | `fn5_tgbd` | Time | Không | |
| Ngày cân | `fn5_ngaycan` | Date | Không | |
| Giờ cân | `fn5_giocan` | Time | Không | |
| gr/con | `fn5_grcon` | Number (step 0.01) | Không | |
| con/khay | `fn5_conkhay` | Number (step 0.01) | Không | |
| Công đoạn | `fn5_congdoan` | Select | **Có** (*) | Options: May thân trước, May tay áo, Hoàn thiện. Khi chọn → tự động set Đơn vị tính |
| Khối lượng (KL) | `fn5_kl` | Number (step 0.01) | **Có** (*) | |
| Đơn vị tính | `fn5_dvt` | Select | **Có** (*) | Options: kg, con, Thùng, Lít, Miếng, Khay |
| NS Làm | `fn5_nslam` | Select | **Có** (*) | Options: 1–8 (Trong giờ → Đêm ngày lễ) |
| Line.Bơ | `fn5_linebo` | Text | Không | |
| Ghi chú | `fn5_ghichu` | Text | Không | Span 4 cột, full width |

### 4.3. Logic Công đoạn → Đơn vị tính

Khi chọn Công đoạn:
- "May tay áo" → Đơn vị tính tự động chuyển thành `con`
- Các công đoạn khác → Đơn vị tính tự động chuyển thành `kg`

### 4.4. Validation khi Lưu (`saveFn5Form`)

1. Kiểm tra Công đoạn đã chọn và Đơn vị tính có khớp không
2. Nếu sai: `alert("LỖI NGHIỆP VỤ: Đơn vị tính [X] không khớp với cấu hình của công đoạn [Y] (Z).")`
3. Nếu đúng: đóng modal, alert thành công

### 4.5. Logic Sửa (`fn5EditRow`)

1. Đọc tất cả cells từ dòng được click (offset +1 do cột checkbox)
2. Xác định NS Làm bằng cách duyệt 8 cột sản lượng (cells[19]–cells[26]), cột nào > 0 → lấy giá trị đó làm KL
3. Load ngược giá trị vào popup: convert ngày DD/MM/YYYY → YYYY-MM-DD qua `fn5ToISODate()`
4. Đổi title thành "SỬA NĂNG SUẤT THEO CÔNG ĐOẠN"

---

## 5. Import dữ liệu từ Excel (`fn5-imp`)

### 5.1. Giao diện modal

- Tiêu đề: **"NHẬP DỮ LIỆU TỪ EXCEL"** (header xanh cyan)
- Nội dung:
  - Input file: `accept=".xlsx,.xls"`
  - Link: "Tải template mẫu" (tải file Excel template)
- Nút:
  - **Đóng** (`btn-cancel`): đóng modal
  - **Import** (`btn-ok`): thực hiện import và đóng modal

### 5.2. Template Import

File Excel template gồm các cột tương ứng với lưới:

| STT cột | Tên cột | Bắt buộc | Kiểu dữ liệu | Ghi chú |
|---|---|---|---|---|
| 1 | Mã bộ phận | **Có** | Text | |
| 2 | Ka LV | **Có** | Number | |
| 3 | Ngày NL | Không | Date (DD/MM/YYYY) | |
| 4 | Lô | Không | Text | |
| 5 | Nhóm KS | Không | Text | |
| 6 | KL Bơ | Không | Number | |
| 7 | Quy cách SX | Không | Text | |
| 8 | Mã nội bộ | **Có** | Text | |
| 9 | Size nội bộ | Không | Text | |
| 10 | Quy cách tính lương | Không | Text | |
| 11 | Ngày LV | **Có** | Date (DD/MM/YYYY) | |
| 12 | TG bắt đầu | Không | Time (HH:mm) | |
| 13 | Ngày cân | Không | Date | |
| 14 | Giờ cân | Không | Time | |
| 15 | gr/con | Không | Number | |
| 16 | con/khay | Không | Number | |
| 17 | Công đoạn | **Có** | Text | May thân trước / May tay áo / Hoàn thiện |
| 18 | Khối lượng (KL) | **Có** | Number | |
| 19 | Đơn vị tính | **Có** | Text | kg / con / Thùng / Lít / Miếng / Khay |
| 20 | NS Làm | **Có** | Number (1–8) | 1: Trong giờ → 8: Đêm ngày lễ |
| 21 | Line.Bơ | Không | Text | |
| 22 | Ghi chú | Không | Text | |

### 5.3. Quy trình Import

1. User tải template mẫu về, điền dữ liệu
2. User chọn file Excel đã điền → bấm **Import**
3. Hệ thống đọc file, validate:
   - Các cột bắt buộc không được trống
   - Đơn vị tính phải khớp cấu hình Công đoạn
4. Dữ liệu hợp lệ được append vào lưới
5. Dữ liệu lỗi hiển thị cảnh báo, dòng lỗi không import

### 5.4. Validation sau Import

- **Error (chặn lưu):** Đơn vị tính không nằm trong danh sách hợp lệ → ô highlight đỏ
- **Warning (cho lưu, cảnh báo):** Khối lượng > 0 nhưng Đơn giá trống

---

## 6. Dữ liệu mẫu

| STT | Mã BP | Ka | Ngày NL | Lô | Nhóm KS | KL Bơ | Quy cách SX | Mã NB | Size NB | QC TL | Ngày LV | TG BD | Ngày cân | Giờ cân | Trong giờ | Ca đêm | Tăng ca | DVT | Line.Bơ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | CB101 | 1 | 30/05/2026 | P0 | N1 | 222 | LX PTO | 50524494 | VM 13/15 | WTHLXPTOHV0015 | 15/07/2025 | 13:00 | 15/07/2025 | 13:24 | **520** | 0 | 0 | kg | 2226029.15 |
| 2 | CB102 | 1 | 30/05/2026 | P1 | N2 | 100 | Nobashi | 50524445 | VM 16/20 | WTHLXPTOHV0016 | 15/07/2025 | 14:00 | 15/07/2025 | 14:30 | 0 | **450** | 0 | con | 2226029.16 |
| 3 | CB103 | 2 | 31/05/2026 | P2 | N3 | 150 | Sushi | 50524492 | VM 21/25 | WTHLXPTOHV0017 | 16/07/2025 | 08:00 | 16/07/2025 | 08:45 | 0 | 0 | **390** | kg | 2226029.17 |
