# LOGIC CHI TIẾT CHỨC NĂNG: TÍNH LƯƠNG SẢN PHẨM

Màn hình **Tính Lương Sản Phẩm** (Tương ứng màn hình số 6 trên Menu) là chức năng tính toán trung tâm, thực hiện các thuật toán lương sản phẩm. Màn hình được chia làm 2 Tab phục vụ hai quy trình tính toán khác nhau.

---

## TAB 1: TÍNH LƯƠNG SẢN PHẨM (CÁ NHÂN)

### 1. Mục đích
Tính toán tiền lương sản phẩm chi tiết cho từng cá nhân (nhân viên trực tiếp sản xuất) đối với từng công đoạn, dựa trên năng suất đầu vào và đơn giá, kết hợp các hệ số điều chỉnh và khoản hỗ trợ.

### 2. Các tham số lọc đầu vào
*   **Cơ cấu tổ chức & Nhân sự:** Mã nhân viên, Tên nhân viên, Công ty, Đơn vị cấp 1 đến 6.
*   **Trạng thái nhân sự:** Tình trạng làm việc (Hiện diện / Thôi việc / Tất cả).
*   **Kỳ tính lương:** Chọn theo Mã kỳ hoặc Tháng lương hiện hành.
*   **Trạng thái dữ liệu:** Khóa lương (Đã khóa / Chưa khóa / Tất cả).

### 3. Logic Engine Tính Toán (10 Bước)
*Hệ thống sử dụng engine tính toán gồm 10 bước mặc định (từ CALC-00 đến CALC-10) nếu người dùng không định nghĩa công thức tùy chỉnh:*
1.  **CALC-00 (Validate đầu vào):** Kiểm tra sự tồn tại và hợp lệ của Kỳ lương. Nếu lỗi &rarr; Dừng tiến trình.
2.  **CALC-01 (Lấy Năng Suất):** Truy xuất Năng Suất từ phân hệ LNS. Bắt buộc LNS phải đã chốt (`is_locked=1`). Nếu LNS vẫn đang nháp &rarr; Đánh dấu cờ `IsPreview=1`.
3.  **CALC-02 (Lấy đơn giá):** Áp dụng đơn giá theo cặp Công đoạn + Tháng. Không tìm thấy đơn giá &rarr; Giá trị = 0, báo WARNING.
4.  **CALC-03 (LSP Base):** `LSP_Base` = Năng suất &times; Đơn giá (Kết quả làm tròn về số nguyên đồng).
5.  **CALC-04 (Hệ số 1):** `LSP_HS1_Amt` = LSP_Base &times; (HS1 / 100). *(HS1 phản ánh năng suất)*
6.  **CALC-05 (Hệ số 2):** `LSP_HS2_Amt` = LSP_HS1_Amt &times; (HS2 / 100). *(HS2 phản ánh chuyên cần)*
7.  **CALC-06 (Hệ số 3):** `LSP_HS3_Amt` = LSP_HS2_Amt &times; (HS3 / 100). *(HS3 phản ánh chất lượng/lỗi)*
8.  **CALC-07 (Hỗ trợ Bộ phận):** `DeptSupport` = LSP_HS3_Amt &times; (%HoTroBP / 100).
9.  **CALC-08 (Hỗ trợ Công đoạn):** `StageSupport` = LSP_Base &times; (%HoTroCDoan / 100) &times; TongHS.<br>*(Lưu ý OP-16: `TongHS` là tổng hợp của HS1, HS2, HS3 và %HTBP. Cần xác nhận với BA để tránh double-count).*
10. **CALC-09 (Phụ cấp độc hại):** Bổ sung phụ cấp đặc biệt (VD: khoản thêm ADD01 cho công nhân Chiên).
11. **CALC-10 (Tổng lương):** `LSP_Total` = LSP_HS3_Amt + DeptSupport + StageSupport + Phụ cấp độc hại.

### 4. Quy tắc hiển thị & UX/UI
*   **Trạng thái LNS**: Các bản ghi chưa được chốt (Preview LNS) sẽ được hiển thị màu đỏ để nhận diện rủi ro dữ liệu thay đổi.
*   **Highlight ngoại lệ**: Các dòng dữ liệu áp dụng Hệ số làm giảm lương (VD: HS < 100%) sẽ được highlight đỏ ở cột thành tiền để phục vụ đối soát.
*   **Nhập liệu trực tiếp (Inline Edit):** Hỗ trợ kế toán chỉnh sửa hệ số trực tiếp trên lưới (cột % Đ.chỉnh 1, 2, 3) với cơ chế tự động ràng buộc giá trị (0-100%). Sau khi Blur chuột, Engine tính toán sẽ tự động chạy lại ngầm và Realtime Update toàn bộ lưới và dòng Tổng cộng mà không cần reload trang.
*   **Tooltip Việt Hóa:** Headers của các cột phần trăm được dán nhãn Tooltip hướng dẫn chi tiết (Ví dụ: "Do phòng nhân sự nhập") để giải thích rõ luồng quy trình phân quyền cho người dùng cuối.
*   **Ma trận 4 Ca (Modal):** Lưới chính chỉ hiển thị tổng số sản lượng, nhưng người dùng có thể nhấp vào biểu tượng 👁️ "Mắt thần" để mở Modal bóc tách khối lượng và tiền chi tiết của 4 ca (Trong giờ, Ca đêm, Tăng ca, Tăng ca đêm). Dòng phụ của nhân sự luân chuyển có gắn kèm Badge vàng `Làm giùm` nổi bật.

---

## TAB 2: TÍNH LƯƠNG SẢN PHẨM TRUNG BÌNH (BỘ PHẬN)

### 1. Mục đích
Sử dụng kết quả tổng `LSP_Total` từ Tab 1 để tính ra mức lương bình quân cho bộ phận. Sau đó lấy định mức bình quân này làm cơ sở tính lương cho nhóm **nhân viên phụ trợ** (Ví dụ: Thủ kho, KCS) ăn lương sản phẩm theo kết quả của bộ phận đó.

### 2. Điều kiện thực thi
*   Dữ liệu lương cá nhân của bộ phận (ở Tab 1) phải ở trạng thái **Đã tính chính thức** (`IsPreview=0`). 
*   Nếu dữ liệu đang nháp, hệ thống sẽ bật cảnh báo không cho phép tính hoặc dán nhãn kết quả chưa chính thức.

### 3. Thuật toán (Công thức FR.25)
Hệ thống chia làm 2 giai đoạn chạy:

**Giai đoạn 1: Tính Bình Quân Bộ Phận**
*   `Mức lương SP bình quân ngày` = (Tổng `LSP_Total` của toàn bộ phận) / (Tổng ngày công của toàn bộ phận)
*   `Mức lương SP bình quân tháng` = `Mức lương SP bình quân ngày` &times; Công chuẩn. *(Công chuẩn mặc định = 26 ngày, cho phép ghi đè trên UI).*

**Giai đoạn 2: Tính Lương Nhân Viên Phụ Trợ**
*   `Tiền lương SP NV` = `Bậc lương NV` (lấy từ Master Data) &times; `Mức lương SP bình quân tháng` (của bộ phận tương ứng).

### 4. Các Ràng buộc & Cải tiến Logic Đặc thù (Đã chốt)
Nhằm đảm bảo mức lương bình quân phản ánh đúng thực tế, hệ thống áp dụng các quy tắc nâng cao sau:

*   **Tách bạch Tử số và Mẫu số (Giải quyết OP-25):** 
    Để tránh làm méo mó mức bình quân, hệ thống mặc định **loại trừ** hoàn toàn các nhân viên thuộc nhóm hưởng lương bình quân (Thủ kho, KCS) ra khỏi cả `Tổng LSP` và `Tổng ngày công`. Chỉ lấy dữ liệu của nhân viên có hình thức lương là `SanPhamTrucTiep` để chia trung bình. Có cung cấp Checkbox trên UI để user linh hoạt tắt/bật tham số này.
*   **Lọc bình quân theo Tiến trình (Giải quyết OP-26):**
    Đối với các bộ phận đảm nhận nhiều tiến trình (VD: PTO làm cả Tôm Sú và Tôm Thẻ), UI cung cấp thêm tùy chọn Dropdown **"Tiến trình"**. Người dùng có thể tính bình quân cào bằng (Tất cả) hoặc tính bình quân bóc tách riêng rẽ cho từng tiến trình để trả đúng cho Thủ kho phục vụ tiến trình đó.
*   **Loại trừ nhân viên mới/Nghỉ việc giữa tháng (Giải quyết OP-42):**
    Nhân viên mới làm vài ngày sẽ làm tăng mẫu số "Tổng nhân viên" hoặc làm loãng "Tổng ngày công", gây thiệt thòi cho KCS. Hệ thống tự động loại trừ các nhân viên có *Ngày công thực tế < 50% Công chuẩn* ra khỏi Mẫu số chia bình quân (Cấu hình bằng tham số `MIN_WORKING_DAY_PCT_FOR_BQ`), và có in dòng ghi chú (Log) để kế toán dễ đối soát.
