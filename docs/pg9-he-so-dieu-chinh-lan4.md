# Hệ số điều chỉnh lần 4

**File:** `lsp/pg9-he-so-hs123.html?lan=4`  
**Menu:** Lương sản phẩm > Thiết lập > Hệ số điều chỉnh lần 4

---

## Tổng quan

Form dùng chung file `pg9-he-so-hs123.html` với lần 1/2, phân biệt qua tham số `?lan=4`. Cấu trúc empheader, nút, lưới, searchable dropdown đều giống lần 1.

## Khác biệt so với lần 1

| Hạng mục | Lần 1 | Lần 4 |
|---|---|---|
| Tiêu đề trang | "HỆ SỐ ĐIỀU CHỈNH LẦN 1" | "HỆ SỐ ĐIỀU CHỈNH LẦN 4" |
| **Hướng Giảm** | Bật | **Bị khóa (disabled)**, chữ xám (#ccc) |
| Ghi chú hướng giảm | Ẩn | Hiển thị dòng đỏ italic: "Hiện tại Minh Phú chỉ nhập các điều chỉnh Hướng Tăng (+). Chiều Giảm đang được tạm khóa trên giao diện." |
| Dữ liệu mẫu | 4 dòng | 2 dòng (chỉ có hướng Tăng) |

## Ràng buộc đặc biệt lần 4

- **Radio "Giảm (–)" bị disabled:** `radHuongGiam.disabled = true`. User chỉ có thể chọn Tăng (+).
- **Label Giảm màu xám:** `lblHuongGiam.style.color = '#ccc'` để thể hiện trạng thái không khả dụng.
- **Ghi chú cảnh báo:** Div `noteHuongGiam` hiển thị (`display:block`) chỉ khi `lan=4`.

## Chi tiết trường, nút, lưới, logic

Xem tài liệu **[Hệ số điều chỉnh lần 1](pg9-he-so-dieu-chinh-lan1.md)** – tất cả cấu trúc, validation, searchable dropdown, hệ số quy đổi đều áp dụng giống nhau (trừ hướng Giảm bị khóa).

## Dữ liệu mẫu (lan=4)

| STT | Tháng | Đơn vị | Nhóm TL | Loại | Hướng | Giá trị | HS quy đổi |
|---|---|---|---|---|---|---|---|
| 1 | 06/2026 | Khối Sản Xuất | Tổ Sơ chế | % | Tăng | 5 | 5% |
| 2 | 06/2026 | Nhà máy 1 | Tổ Kho | $ | Tăng | 150,000 | (+) 150,000 đ |
