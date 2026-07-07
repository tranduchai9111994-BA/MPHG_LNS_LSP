# Danh sách Cảnh Báo Lương Năng Suất (LNS)

Hệ thống cung cấp 2 màn hình cảnh báo (Cảnh báo năng suất riêng và Cảnh báo năng suất chung) nhằm phát hiện các trường hợp bất thường trước khi thực hiện **Tính năng suất**. Các cảnh báo này thực hiện đối chiếu chéo giữa dữ liệu *Tổng hợp chấm công* / *Chấm công chi tiết* và dữ liệu *Nhập năng suất theo ngày*.

---

## 1. Cảnh báo Năng suất riêng (cb1)
*   **Mục đích:** Cảnh báo các trường hợp nhân viên (thuộc nhóm có năng suất riêng) có phát sinh công làm việc nhưng chưa được ghi nhận sản lượng, hoặc ngược lại có sản lượng nhưng thiếu dữ liệu công.
*   **Các cột trên lưới hiển thị:**
    *   **STT**
    *   **Mã nhân viên**
    *   **Họ và tên**
    *   **Đơn vị cấp 1**, **Đơn vị cấp 2**, **Đơn vị cấp 3**, **Đơn vị cấp 4** (Thông tin phòng ban/bộ phận)
    *   **Loại hợp đồng**
    *   **Từ ngày**, **Đến ngày** (Khoảng thời gian đối soát)
    *   **Tổng công** (Lấy từ module chấm công)
    *   **Tổng NS (Kg/Con)** (Lấy từ chức năng nhập năng suất riêng)
    *   **Chi tiết cảnh báo** (Ví dụ nội dung cảnh báo: *Có năng suất nhưng không có công*, *Có công nhưng không có năng suất*)

## 2. Cảnh báo Năng suất chung (cb2)
*   **Mục đích:** Cảnh báo các trường hợp cấp Tổ/Bàn sản xuất (thuộc nhóm năng suất chung) có tổng công của các nhân viên nhưng chưa được nhập tổng sản lượng chung của Tổ, hoặc có nhập sản lượng cho Tổ nhưng lại không có dữ liệu công của các thành viên.
*   **Các cột trên lưới hiển thị:**
    *   **STT**
    *   **Đơn vị cấp 3**, **Đơn vị cấp 4**, **Đơn vị cấp 5** (Thông tin Tổ/Bàn/Băng chuyền)
    *   **Từ ngày**, **Đến ngày** (Khoảng thời gian đối soát)
    *   **Tổng công** (Tổng hợp ngày công của tất cả nhân viên trong Tổ)
    *   **Tổng NS (Kg/Con)** (Tổng sản lượng chung của toàn Tổ)
    *   **Chi tiết cảnh báo** (Ví dụ nội dung cảnh báo: *Có năng suất chung nhưng không có công*, *Có công nhưng không có năng suất chung*)
