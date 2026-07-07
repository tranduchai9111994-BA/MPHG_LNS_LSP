# Hệ số điều chỉnh lần 2

**File:** `lsp/pg9-he-so-hs123.html?lan=2`  
**Menu:** Lương sản phẩm > Thiết lập > Hệ số điều chỉnh lần 2

---

## Tổng quan

Form dùng chung file `pg9-he-so-hs123.html` với lần 1, phân biệt qua tham số `?lan=2`. Cấu trúc empheader, nút, lưới, logic validation đều giống lần 1.

## Khác biệt so với lần 1

| Hạng mục | Lần 1 | Lần 2 |
|---|---|---|
| Tiêu đề trang | "HỆ SỐ ĐIỀU CHỈNH LẦN 1" | "HỆ SỐ ĐIỀU CHỈNH LẦN 2" |
| Breadcrumb | Hệ số điều chỉnh lần 1 | Hệ số điều chỉnh lần 2 |
| Hướng Giảm | Bật | **Bật** (giống lần 1) |
| Dữ liệu mẫu | 4 dòng (Phile 1, Phile 2, Kho Lạnh, Đóng Gói 2) | 4 dòng (Sơ chế, Đóng Gói 1, Tổ Kho, Phile 2) |
| Dữ liệu mẫu có Đến tháng | Có | Không (chưa có `denThang` trong mock) |

## Chi tiết trường, nút, lưới, logic

Xem tài liệu **[Hệ số điều chỉnh lần 1](pg9-he-so-dieu-chinh-lan1.md)** – tất cả cấu trúc, validation, searchable dropdown, hệ số quy đổi đều áp dụng giống nhau.

## Dữ liệu mẫu (lan=2)

| STT | Tháng | Đơn vị | Nhóm TL | Loại | Hướng | Giá trị | HS quy đổi |
|---|---|---|---|---|---|---|---|
| 1 | 06/2026 | Khối Sản Xuất | Tổ Sơ chế | % | Tăng | 10 | 10% |
| 2 | 06/2026 | Khối Sản Xuất | Tổ Đóng Gói 1 | % | Giảm | 5 | -5% |
| 3 | 06/2026 | Nhà máy 1 | Tổ Kho | $ | Tăng | 300,000 | (+) 300,000 đ |
| 4 | 06/2026 | Khối Sản Xuất | Tổ Phile 2 | $ | Giảm | 500,000 | (-) 500,000 đ |
