# Hỗ trợ quy cách tính lương - Độc hại chiên

**File:** `lsp/pg8-ho-tro-cd-chien.html`  
**Menu:** Lương sản phẩm > Thiết lập > Hỗ trợ quy cách tính lương - Độc hại chiên

---

## 1. Trường thông tin (Empheader)

| Trường | ID | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|---|
| Tiến trình | `cboTienTrinh` / `txtTienTrinh` | **Searchable dropdown** | **Có** (label đỏ) | Dữ liệu: PG8_TIEN_TRINH (TT01–TT05). Gõ để lọc, click chọn |
| Quy cách tính lương | `cboQuyCach` / `txtQuyCach` | **Searchable dropdown** | **Có** (label đỏ) | Dữ liệu: PG8_QUY_CACH (QC01–QC03). Gõ để lọc, click chọn |
| Mức hỗ trợ (%) | `txtMucHoTro` | Text (có ký hiệu % cố định bên phải) | **Có** (label đỏ) | Chỉ nhập số. Ký hiệu % hiển thị bằng CSS `.pg8-pct-wrap` |
| Ngày hiệu lực | `txtNgayHL` | Text (dd/mm/yyyy) | **Có** (label đỏ) | Mặc định: 01/06/2026 |
| Ngày kết thúc | `txtNgayKT` | Text (dd/mm/yyyy) | Không | |
| Ghi chú | `txtGhiChu` | Textarea | Không | |
| Ghi chú 2 | `txtGhiChu2` | Textarea | Không | |
| Số thông báo | `txtSoThongBao` | Text | Không | |
| File đính kèm | `fileDinhKem` | File input | Không | Accept: .doc, .docx, .xls, .xlsx, .jpg, .jpeg, .pdf |

## 2. Nút chức năng

| Nút | Hành động |
|---|---|
| Làm mới | `clearForm()` – Reset form, xóa cả dropdown text |
| Lưu | `pg8SaveWithConfirm()` – Validate trường bắt buộc → hiển thị **popup xác nhận lưu** → nếu đồng ý → `saveData()` |
| Xóa | `deleteData()` – Xóa dòng được checkbox, yêu cầu confirm |
| Tìm kiếm | `pg8Search()` – Hiện prompt nhập từ khóa, lọc theo Tiến trình / Quy cách / Ghi chú / Mức HT |
| Xuất DL | (Chưa implement) |
| Import Excel | `pg8ImportExcel()` – Demo alert |

## 3. Lưới dữ liệu

| Cột | Kiểu hiển thị |
|---|---|
| Checkbox | Checkbox, header "Chọn tất cả" (`chkAll`) |
| Sửa (✎) | Click → **popup xác nhận chỉnh sửa** → nếu đồng ý → load dữ liệu lên form |
| STT | Tự động |
| Ngày hiệu lực | Text, căn giữa |
| Ngày kết thúc | Text, căn giữa |
| Tiến trình | Text, căn trái, **in đậm màu xanh** (#0d47a1) |
| Quy cách tính lương | Text, căn trái |
| Mức hỗ trợ (%) | Text, căn giữa, **in đậm màu đỏ** (#d32f2f) |
| Ghi chú | Text, căn trái |
| Ghi chú 2 | Text, căn trái |
| File đính kèm | Nút xem/tải file nếu có, hiển thị "—" nếu không |

## 4. Popup xác nhận

### Popup xác nhận chỉnh sửa (`pg8ConfirmEdit`)
- Hiển thị khi click ✎ trên lưới
- Nội dung: "Bạn có chắc chắn muốn chỉnh sửa dòng [Tiến trình]?"
- Nút: **Đồng ý** (xanh) / **Hủy** (đỏ)

### Popup xác nhận lưu (`pg8ConfirmSave`)
- Hiển thị sau khi validate thành công, trước khi lưu thực sự
- Nội dung: "Bạn có chắc chắn muốn lưu dữ liệu này?"
- Nút: **Đồng ý** (xanh) / **Hủy** (đỏ)

## 5. Logic & ràng buộc

- **Validation khi lưu:** Phải nhập đủ: Ngày hiệu lực, Tiến trình, Quy cách tính lương, Mức hỗ trợ. Thiếu → cảnh báo lỗi, không hiện popup xác nhận.
- **Tự động thêm %:** Khi lưu, nếu giá trị mức hỗ trợ chưa có ký tự `%` ở cuối → tự động thêm.
- **File đính kèm:** Khi cập nhật, chỉ cập nhật fileName nếu user chọn file mới.
- **Dữ liệu mock:** Load từ `MOCK.lsp.hoTroCD`, mapping field: `doiTuong` → `tienTrinh`, `loaiText` → `quyCach`, `'01/'+thang` → `ngayHL`.
- **Searchable dropdown:** Gõ text để lọc danh sách, click ngoài để đóng. Giá trị thực lưu trong hidden input (`cboTienTrinh`, `cboQuyCach`).
