# Hệ số điều chỉnh lần 3

**File:** `lsp/pg5-nhap-nv.html`  
**Menu:** Lương sản phẩm > Thiết lập > Hệ số điều chỉnh lần 3

---

## 1. Trường thông tin (Empheader)

Bố cục 4 dòng, CSS grid 10 cột.

### Dòng 1: Thông tin nhân viên

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Mã nhân viên | `txtMaNV` | Text + nút [...] | Không | Nút browse mở popup tìm NV |
| Tên nhân viên | `txtTenNV` | Text + nút [...] | Không | |
| Công ty | `txtCongTy` | Text (readonly) | — | Mặc định: "Công Ty CP Thủy Sản", nền xám |
| Đơn vị cấp 1 | `cboDv1` | Select | Không | Khối Sản Xuất, Khối Văn Phòng |

### Dòng 2: Đơn vị cấp 2–5

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Đơn vị cấp 2 | `cboDv2` | Select | Không | Nhà máy 1, 2 |
| Đơn vị cấp 3 | `cboDv3` | Select | Không | Phân xưởng A, B |
| ĐV cấp 4 | `cboDv4` | Select | Không | Xưởng 1, 2 |
| Đơn vị cấp 5 | `cboDv5` | Select | Không | Tổ Phile 1, 2, Tổ Đóng Gói |

### Dòng 3: Bộ lọc tháng

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Từ tháng | `txtTuThang` | Text (MM/yyyy) | Không | Label **màu đen** (không bắt buộc) |
| Đến tháng | `txtDenThang` | Text (MM/yyyy) | Không | |

### Dòng 4: Tình trạng

| Trường | Kiểu | Ghi chú |
|---|---|---|
| Tình trạng | Radio group | 3 lựa chọn: Hiện diện / Thôi việc / **Tất cả** (mặc định) |

## 2. Nút chức năng

| Nút | Hành động |
|---|---|
| Tìm kiếm | `pg5Search()` – Lọc lưới theo khoảng tháng (Từ tháng – Đến tháng) |
| Làm mới | `pg5Clear()` – Reset Mã NV, Tên NV |
| Thêm mới | `pg5ShowAddPopup()` – Mở popup nhập dữ liệu mới |
| Lưu dữ liệu | `pg5Save()` – Lưu toàn bộ thay đổi trên lưới |
| Xóa | `pg5Delete()` – Xóa dòng checkbox, confirm |
| Xuất Excel | (Chưa implement) |

## 3. Lưới dữ liệu

| Cột | Kiểu | Cho phép sửa |
|---|---|---|
| Checkbox | Checkbox, header "Chọn tất cả" | — |
| STT | Tự động | Readonly |
| Mã NV | Text | Readonly |
| Họ và Tên | Text, căn trái | Readonly |
| Đơn vị cấp 3 | Text, căn trái | Readonly |
| Đơn vị cấp 4 | Text, căn trái | Readonly |
| Đơn vị cấp 5 | Text, căn trái | Readonly |
| Nhóm lương | Text, căn trái | Readonly |
| Tháng | **Input text** (70px, căn giữa) | **Có** – `pg5UpdateThang()` |
| Đủ công | **Checkbox** (20x20) | **Có** – `pg5UpdateDuCong()` |
| Số tiền (VNĐ) | Text, số âm hiển thị **đỏ đậm** | Readonly |
| Ghi chú | Text, căn trái, font 11px | Readonly |

## 4. Popup Thêm mới (`pg5AddPopup`)

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Tháng | `popThang` | Text (MM/yyyy) | **Có** (label đỏ #d32f2f) | Mặc định: 06/2026 |
| Mã NV | `popMaNV` | Text | **Có** (label đỏ #d32f2f) | |
| Họ và Tên | `popTenNV` | Text (readonly) | Không | Placeholder "Tự động hiển thị", nền xám |
| Đơn vị cấp 3 | `popDv3` | Text | Không | |
| Đơn vị cấp 4 | `popDv4` | Text | Không | |
| Đơn vị cấp 5 | `popDv5` | Text | Không | |
| Nhóm lương | `popNhomLuong` | Select | Không | Hệ số, Bình quân, Năng suất |
| Đủ công | `popDuCong` | Checkbox | Không | |
| Số tiền (VNĐ) | `popSoTien` | Text | Không | |
| Ghi chú | `popGhiChu` | Text | Không | |

**Nút popup:** Lưu (xanh) / Hủy (đỏ)

## 5. Logic & ràng buộc

- **Validation popup Thêm mới:** Bắt buộc nhập Tháng và Mã NV. Thiếu → alert.
- **Tìm kiếm theo tháng:** So sánh chuỗi MM/yyyy giữa Từ tháng – Đến tháng. Rỗng cả hai → hiển thị tất cả.
- **Xóa:** Phải chọn ít nhất 1 checkbox. Confirm trước khi xóa.
- **Cột editable:** Chỉ Tháng (text input) và Đủ công (checkbox) được sửa trực tiếp trên lưới. Các cột còn lại readonly.
- **Số tiền âm:** Hiển thị đỏ đậm (`color:red; font-weight:bold`) khi giá trị chứa dấu `-`.

## 6. Bảng tham khảo

Cuối trang có bảng công thức tính lương sản phẩm với các cột: %, Công thực tế, Tiền LSP lần 2, Công đủ, LSP lần 2 quy công đủ, Điều chỉnh lần 3, % điều chỉnh lần 3, Quỹ tiền lương tăng giảm.
