# Hệ số điều chỉnh lần 1

**File:** `lsp/pg9-he-so-hs123.html?lan=1`  
**Menu:** Lương sản phẩm > Thiết lập > Hệ số điều chỉnh lần 1

---

## 1. Trường thông tin (Empheader)

Bố cục 2 cột trái-phải:

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Từ tháng | `txtThang` | Text (MM/yyyy) | **Có** (label đỏ) | Mặc định: 06/2026 |
| Đến tháng | `txtDenThang` | Text (MM/yyyy) | Không | Dùng kết hợp "Từ tháng" để lọc |
| Công ty | `cboCongTy` / `txtCongTy` | **Searchable dropdown** | **Có** (label đỏ) | Dữ liệu: PG9_CONGTY. Mặc định: MPHG |
| Đơn vị cấp 1 | `cboDv1` / `txtDv1` | Searchable dropdown | Không | Có option "-- Tất cả --" |
| Đơn vị cấp 2 | `cboDv2` / `txtDv2` | Searchable dropdown | Không | Có option "-- Tất cả --" |
| Đơn vị cấp 3 | `cboDv3` / `txtDv3` | Searchable dropdown | Không | Có option "-- Tất cả --" |
| Đơn vị cấp 4 | `cboDv4` / `txtDv4` | Searchable dropdown | Không | Có option "-- Tất cả --" |
| Đơn vị cấp 5 | `cboDv5` / `txtDv5` | Searchable dropdown | Không | Có option "-- Tất cả --" |
| Đơn vị cấp 6 | `cboDv6` / `txtDv6` | Searchable dropdown | Không | Có option "-- Tất cả --" |
| Nhóm tính lương | `cboBoPhan` / `txtBoPhan` | Searchable dropdown | Không | Dữ liệu: PG9_NHOM_TL (Hệ số, Bình quân, Năng suất) |

### Hàng tham số điều chỉnh (hs-row)

| Trường | ID | Kiểu | Ghi chú |
|---|---|---|---|
| Loại ĐC | `loaiHS1` (radio) | Radio: `%` / `Tiền` | Mặc định: % |
| Hướng | `huongHS1` (radio) | Radio: `Tăng (+)` / `Giảm (–)` | Mặc định: Tăng. **Lần 1: cả hai hướng đều bật** |
| Giá trị điều chỉnh | `txtHS1` | Number (min=0, step=any) | Chỉ nhập số dương, tự loại ký tự không hợp lệ |
| Hệ số quy đổi | `lblHsQuyDoi` | Label (readonly) | Tự tính từ Loại + Hướng + Giá trị. Màu xanh nếu Tăng, đỏ nếu Giảm |
| Ghi chú | `txtGhiChu` | Text | |

## 2. Nút chức năng

| Nút | Hành động |
|---|---|
| Tìm kiếm | `timKiem()` – Lọc lưới theo khoảng tháng (Từ tháng – Đến tháng) |
| Làm mới | `clearForm()` – Reset form |
| Lưu dữ liệu | `saveData()` – Validate → Lưu |
| Xóa | `deleteData()` – Xóa dòng checkbox, confirm |
| Xuất dữ liệu | (Chưa implement) |
| Nhập dữ liệu | (Chưa implement) |

## 3. Lưới dữ liệu

| Cột | Kiểu hiển thị |
|---|---|
| Checkbox | Checkbox, header "Chọn tất cả" |
| Sửa (✎) | Click → load dữ liệu lên form |
| STT | Tự động |
| Từ tháng | Text, căn giữa |
| Đến tháng | Text, căn giữa |
| Công ty / Đơn vị | Text, căn trái |
| Nhóm tính lương | Text, căn trái, in đậm |
| Loại | "%" hoặc "Tiền" |
| Hướng | "Tăng" (xanh) hoặc "Giảm" (đỏ), in đậm |
| Giá trị điều chỉnh | Số, căn phải |
| HS quy đổi | Text, căn phải, in đậm, màu theo hướng |
| Ghi chú / Lý do | Text, căn trái |

## 4. Logic & ràng buộc

- **Validation khi lưu:**
  - Bắt buộc: "Từ tháng" (trường duy nhất bắt buộc)
  - Giá trị < 0 → lỗi blocking
  - Loại % + Hướng Giảm + Giá trị > 100 → lỗi blocking ("lương âm")
  - Giá trị = 0 → cảnh báo confirm ("không tạo ra điều chỉnh")
- **Trùng lặp:** Nếu đã tồn tại hệ số cùng nhóm + cùng tháng → confirm ghi đè.
- **Hệ số quy đổi:** Tự tính realtime khi thay đổi Loại/Hướng/Giá trị. VD: Tăng 15% → "15%", Giảm 5% → "-5%", Tăng tiền 500000 → "(+) 500,000 đ".
- **Tìm kiếm theo tháng:** So sánh chuỗi MM/yyyy. Nếu cả Từ tháng và Đến tháng rỗng → hiển thị toàn bộ.

## 5. Dữ liệu mẫu (lan=1)

4 dòng mẫu bao gồm cả 4 trường hợp: Tăng %, Giảm %, Tăng tiền, Giảm tiền.
