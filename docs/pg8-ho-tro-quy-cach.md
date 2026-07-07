# Hỗ trợ (%) quy cách tính lương theo thông báo

**File:** `lsp/pg8-ho-tro-cd.html`  
**Menu:** Lương sản phẩm > Thiết lập > Thiết lập % Hỗ trợ và Hệ số HS1/HS2/HS3

---

## 1. Trường thông tin (Empheader)

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Tiến trình | `cboTienTrinh` | Select (dropdown chuẩn) | **Có** (label đỏ) | Danh sách: TT01 - Tẩm bột, TT02 - Hấp - Xuất khẩu, TT03 - Sơ chế – Đóng gói |
| Quy cách tính lương | `cboQuyCach` | Select (dropdown chuẩn) | **Có** (label đỏ) | Danh sách: QC01, QC02 |
| % Hỗ trợ | `txtMucHoTro` | Text | **Có** (label đỏ) | VD: "15%" |
| Ngày hiệu lực | `txtNgayHL` | Text (dd/mm/yyyy) | **Có** (label đỏ) | Mặc định: 01/06/2026 |
| Ngày kết thúc | `txtNgayKT` | Text (dd/mm/yyyy) | Không | |
| Ghi chú | `txtGhiChu` | Textarea | Không | |
| Ghi chú 2 | `txtGhiChu2` | Textarea | Không | |
| Số thông báo | `txtSoThongBao` | Text | Không | |
| File đính kèm | `fileDinhKem` | File input | Không | Accept: .doc, .docx, .xls, .xlsx, .jpg, .jpeg, .pdf |

## 2. Nút chức năng

| Nút | Hành động |
|---|---|
| Làm mới | `clearForm()` – Reset tất cả trường về mặc định |
| Lưu | `saveData()` – Thêm mới hoặc cập nhật. Validate trường bắt buộc trước khi lưu |
| Xóa | `deleteData()` – Xóa các dòng được chọn checkbox, yêu cầu confirm |
| Xuất DL | (Chưa implement) |
| Nhập DL | (Chưa implement) |

## 3. Lưới dữ liệu

| Cột | Kiểu hiển thị |
|---|---|
| Checkbox (chọn) | Checkbox, header có "Chọn tất cả" |
| Sửa (✎) | Icon click → load dữ liệu lên form |
| STT | Tự động đánh số |
| Ngày hiệu lực | Text, căn giữa |
| Ngày kết thúc | Text, căn giữa |
| Tiến trình | Text, căn trái, in đậm màu xanh |
| Quy cách tính lương | Text, căn trái |
| % Hỗ trợ | Text, căn phải |
| Ghi chú | Text, căn trái |
| Ghi chú 2 | Text, căn trái |

## 4. Logic & ràng buộc

- **Validation khi lưu:** Phải nhập đủ: Ngày hiệu lực, Tiến trình, Quy cách tính lương, % Hỗ trợ. Thiếu → hiển thị cảnh báo lỗi.
- **Chế độ sửa:** Click ✎ → load dữ liệu lên form, `txtEditId` lưu ID dòng đang sửa. Nếu `txtEditId` có giá trị → cập nhật; nếu rỗng → thêm mới.
- **Xóa:** Phải chọn ít nhất 1 checkbox. Hiển thị confirm trước khi xóa.
- **Dữ liệu mock:** Load từ `MOCK.lsp.hoTroCD` trong mockdata.js.
