# Nhóm Năng Suất (Nhóm NS) — Mô tả chi tiết nghiệp vụ

## 1. Định nghĩa

**Nhóm NS** là đơn vị nhóm các Level 5 (đơn vị sản xuất cấp 5) lại với nhau để chia sẻ hoặc phân tách năng suất trong tháng. Nhóm NS chỉ tồn tại cho **TH3** và **TH4**; không áp dụng cho TH1 và TH2.

Mỗi nhóm gắn với một **master** (tổ hợp Tháng + Công ty + Level 1–4). Trong cùng một master, một Nhóm NS có thể chứa nhiều Level 5 từ nhiều bộ phận (Ka Sáng, Ka Chiều, Ka Đêm) — gọi là trường hợp **Cross-Ka**.

---

## 2. Cấu trúc dữ liệu

### 2.1 Bảng NHOM_NS
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `id` | string | Mã định danh duy nhất, dạng `NS-001` |
| `ten` | string | Tên nhóm, người dùng có thể sửa trực tiếp (inline) |
| `loai` | `'TH3'` \| `'TH4'` | Loại nhóm |
| `master_id` | number | Liên kết với bản ghi Master |

### 2.2 Trường liên quan trong DETAILS (Level 5)
| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `nhom_id` | string | Mã nhóm NS mà Level 5 này thuộc về |
| `vai_tro` | `'SX'` \| `'PV'` \| `''` | Chỉ có giá trị khi `th = 'TH4'`; TH3 để trống |

---

## 3. View "Nhóm NS" (Card view)

Truy cập bằng nút toggle **"Nhóm NS"** trong toolbar của màn hình Chi tiết Level 5.

### 3.1 Bố cục
- **TH1 block**: Hiển thị danh sách pill (badge tròn màu xanh lá) tên Level 5 thuộc TH1. Không có nhóm, không có hàng mở rộng.
- **TH2 block**: Hiển thị danh sách pill (badge tròn màu xanh dương) tên Level 5 thuộc TH2. Không có nhóm.
- **Bảng TH3 + TH4 gộp chung** (một bảng duy nhất): Có header phân tách `TH3 — Chung nhiều ĐV` và `TH4 — Tách phụ`.
- **Chưa gán block**: Pill đỏ liệt kê Level 5 chưa được gán TH nào.

### 3.2 Bảng TH3/TH4 — Cột

| Cột | Nội dung |
|-----|----------|
| **Trường hợp** | Badge `TH3` (vàng) hoặc `TH4` (hồng); icon ❌ đỏ nếu nhóm có lỗi nghiệp vụ |
| **Nhóm NS** | Mã nhóm dạng monospace (ví dụ `NS-001`), màu nền theo loại TH3/TH4 |
| **Tên nhóm** | Input inline — click để sửa, border xanh xuất hiện khi focus, lưu ngay khi blur vào `NHOM_NS[].ten` |
| **Level 5** | Hyperlink dạng `▶ N Level 5 (X SX, Y PV)` — bấm để mở rộng / thu gọn hàng chi tiết |
| **Bộ phận** | Danh sách bộ phận của các L5 trong nhóm; nếu nhiều bộ phận → cảnh báo Cross-Ka ngay dưới tên nhóm |
| **Ghi chú** | Placeholder cho ghi chú nhóm (hiện hiển thị `—`) |

### 3.3 Hàng mở rộng (Detail rows)

- Ẩn mặc định, mở/thu bằng cách bấm link Level 5.
- Mỗi hàng tương ứng 1 Level 5 trong nhóm.
- Hiển thị: badge vai trò (SX xanh lá / PV hồng), tên Level 5, mã Level 5, bộ phận, ghi chú.

---

## 4. Modal Quản lý Nhóm NS

Mở bằng nút **"Quản lý Nhóm NS"** (màu cam) trong toolbar Chi tiết.

### 4.1 Tạo nhóm mới
- Input **Tên nhóm** + dropdown chọn loại (`TH3 - Chung nhiều ĐV` / `TH4 - Tách phụ`) + nút **+ Tạo nhóm**.
- Mã nhóm tự sinh: `NS-` + số thứ tự 3 chữ số (`NS-005`, `NS-006`...).

### 4.2 Danh sách nhóm hiện có
Mỗi nhóm hiển thị:
- Mã nhóm (monospace badge) + badge loại TH3/TH4 + tên nhóm + số lượng L5.
- TH4: thêm dòng `X SX + Y PV`.
- Danh sách pill Level 5 trong nhóm (có badge vai trò SX/PV nếu TH4).
- Cảnh báo:
  - `⚠ Cross-Ka` nếu nhóm chứa L5 từ nhiều bộ phận.
  - `❌ Nhóm cần ít nhất 2 Level 5` nếu thiếu.
  - `❌ TH4 cần ít nhất 1 SX + 1 PV` nếu thiếu vai trò.
- Nút **🗑 Xóa**: chỉ xóa được khi nhóm không còn Level 5 nào.

---

## 5. Inline Rename (Sửa tên nhóm)

- Tên nhóm trong bảng TH3/TH4 là thẻ `<input type="text">`.
- Mặc định: không có border, nền trong suốt — trông như text tĩnh.
- Khi focus: border xanh `#0056b3` + nền trắng xuất hiện.
- Khi blur: gọi `fn7RenameGroup(id, newName)` → cập nhật `NHOM_NS[].ten`.
- Nếu người dùng xóa trắng tên → giữ nguyên tên cũ (tránh để tên rỗng).

---

## 6. Ràng buộc nghiệp vụ

| Ràng buộc | Mô tả |
|-----------|-------|
| Nhóm TH3 cần ≥ 2 L5 | Dưới 2 L5 không có ý nghĩa chia chung NS |
| Nhóm TH4 cần ≥ 1 SX và ≥ 1 PV | Phải đủ 2 vai trò để phân tách phụ |
| Mỗi L5 chỉ thuộc 1 nhóm | Không được trùng nhóm NS giữa các nhóm |
| Nhóm chứa L5 từ nhiều bộ phận | Hợp lệ nhưng cảnh báo Cross-Ka |
| Không xóa nhóm có L5 | Phải bỏ gán L5 trước khi xóa nhóm |

---

## 7. Tích hợp với luồng Gán nhóm

- Khi mở modal **Gán nhóm** (TH3/TH4): dropdown "Chọn Nhóm NS" lọc theo loại TH.
- Có thể **tạo nhóm mới ngay trong modal** bằng input tên + nút **+ Tạo** (mã tự sinh, nhóm mới tự chọn trong dropdown).
- Sau khi lưu gán (`fn7SaveAssign`): L5 được cập nhật `nhom_id`, `vai_tro`.

---

## 8. Validation (Kiểm tra trước khi khóa)

Chạy khi bấm nút **Khóa** (hoặc từ `fn7Validate()`). Các mục kiểm tra liên quan đến Nhóm NS:

- **TH3**: mỗi nhóm có ≥ 2 L5; không có L5 thuộc TH3 mà thiếu `nhom_id`.
- **TH4**: mỗi nhóm có ≥ 1 SX + ≥ 1 PV; không có L5 thuộc TH4 mà thiếu vai trò hoặc `nhom_id`.
- **Cross-Ka**: cảnh báo (không chặn) nếu nhóm có L5 từ nhiều bộ phận.
- **Trùng nhóm**: phát hiện nếu cùng 1 mã L5 xuất hiện trong nhiều nhóm.
