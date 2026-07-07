# TÀI LIỆU LOGIC NGHIỆP VỤ - LƯƠNG SẢN PHẨM (MPHG)

Tài liệu này tổng hợp toàn bộ các quy tắc, công thức tính toán và ràng buộc nghiệp vụ (Business Logic) áp dụng cho phân hệ Lương Sản Phẩm.

---

## 1. QUY TRÌNH CHUNG & RÀNG BUỘC KỲ LƯƠNG
*   **Tạo kỳ lương:** Kỳ Lương Sản Phẩm (LSP) phải được tạo **TRƯỚC** khi thực hiện tính toán.
*   **Xác thực (Validation):** Ngay tại thời điểm tạo kỳ, hệ thống sẽ tự động kiểm tra và xác thực xem Lương Năng Suất (LNS) và Đơn giá của kỳ tương ứng đã sẵn sàng hay chưa.

---

## 2. ENGINE TÍNH TOÁN LƯƠNG CÁ NHÂN (10 BƯỚC)
Hệ thống sử dụng Engine tính toán gồm 10 bước (từ `CALC-00` đến `CALC-10`) áp dụng cho các nhân viên trực tiếp sản xuất:

| Bước | Mã | Tên Bước | Đầu vào (Input) | Đầu ra / Công thức (Output) | Xử lý Ngoại lệ (Exception) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | `CALC-00` | Validate kỳ & đầu vào | Kỳ, bộ phận | Pass/Fail. | Kỳ không tồn tại &rarr; Dừng và báo lỗi. |
| **1** | `CALC-01` | Lấy LNS đã khóa | Kỳ, NV, CĐ | `NS_Result` (đã khóa, `is_locked=1`). | Không có &rarr; Đánh dấu `IsPreview=1`. |
| **2** | `CALC-02` | Lấy đơn giá | Mã CĐ, tháng | `UnitPrice` từ bảng Đơn giá công đoạn. | Không có &rarr; Cảnh báo (WARNING), Đơn giá = 0. |
| **3** | `CALC-03` | Tính Lương Cơ bản | NS, ĐG | `LSP_Base` = NS &times; UnitPrice *(làm tròn về đồng)*. | Đơn giá = 0 &rarr; Cảnh báo (WARNING). |
| **4** | `CALC-04` | Áp dụng HS1 | LSP_Base, HS1 | `LSP_HS1_Amt` = LSP_Base &times; (HS1 / 100). | HS1 trống &rarr; Mặc định 100%. |
| **5** | `CALC-05` | Áp dụng HS2 | LSP_HS1_Amt, HS2 | `LSP_HS2_Amt` = LSP_HS1_Amt &times; (HS2 / 100). | HS2 trống &rarr; Mặc định 100%. |
| **6** | `CALC-06` | Áp dụng HS3 | LSP_HS2_Amt, HS3 | `LSP_HS3_Amt` = LSP_HS2_Amt &times; (HS3 / 100). | HS3 trống &rarr; Mặc định 100%. |
| **7** | `CALC-07` | Hỗ trợ Bộ phận | LSP_HS3_Amt, %HTBP | `DeptSupport` = LSP_HS3_Amt &times; (%HoTroBP / 100). | % trống &rarr; 0. |
| **8** | `CALC-08` | Hỗ trợ Công đoạn | LSP_Base, %HTCĐ, Tổng HS | `StageSupport` = LSP_Base &times; (%HoTroCDoan / 100) &times; `TongHS`.<br>*(TongHS = HS1 &times; HS2 &times; HS3 &times; (1 + %HoTroBP))* | % trống &rarr; 0. |
| **9** | `CALC-09` | Phụ cấp độc hại | Phụ cấp NV (ADD01) | `HazardAmt` (VD: Phụ cấp chiên...). | Không có &rarr; 0. |
| **10** | `CALC-10` | **Tổng LSP_Total** | Các khoản ở B6, B7, B8, B9 | `LSP_Total` = LSP_HS3_Amt + DeptSupport + StageSupport + HazardAmt. | LSP_Total < 0 &rarr; Cảnh báo (WARNING). |

---

## 3. LOGIC THIẾT LẬP CÁC HỆ SỐ & HỖ TRỢ

### 3.1. Hệ số HS1, HS2, HS3 theo Bộ phận
*   **Ý nghĩa:**
    *   `HS1 (%)`: Hệ số điều chỉnh theo **năng suất / sản lượng** (Cao điểm có thể > 100%, thấp điểm < 100%).
    *   `HS2 (%)`: Hệ số điều chỉnh theo **chất lượng / ca làm việc** (Giảm khi nghỉ ca nhiều hoặc lỗi chất lượng tăng).
    *   `HS3 (%)`: Hệ số điều chỉnh theo **tỉ lệ lỗi / kỷ luật** (Thường giảm khi lỗi sản phẩm vượt ngưỡng, VD: > 3%).
*   **Quy tắc áp dụng:**
    *   Mặc định tất cả các hệ số là **100%**.
    *   Mỗi cặp **Bộ phận + Tháng** chỉ được thiết lập 1 bộ hệ số duy nhất.
    *   Nếu hệ số nhập vào = 0 &rarr; Lương bằng 0 (Hệ thống sẽ hiện cảnh báo).
    *   Nếu hệ số nhập vào > 200% &rarr; Hệ thống yêu cầu xác nhận đặc biệt.

### 3.2. % Hỗ trợ theo Bộ phận
*   **Công thức:** `DeptSupport = LSP_HS3_Amt * %HoTroBP` (Tính dựa trên số tiền lương SAU khi đã nhân HS3).
*   **Quy tắc:**
    *   Mỗi **Bộ phận + Tháng** thiết lập 1 mức %.
    *   Áp dụng đồng loạt cho toàn bộ nhân viên thuộc bộ phận.
    *   Mức hỗ trợ tối đa không quá 100%.

### 3.3. % Hỗ trợ theo Công đoạn / Tổ thao tác
*   **Công thức:** `StageSupport = LSP_Base * %HoTroCDoan * TongHS`
*   **Quy tắc:**
    *   Thiết lập riêng cho các Công đoạn hoặc Tổ thao tác có tính chất đặc thù.
    *   Tính dựa trên Lương cơ bản ban đầu (`LSP_Base`) nhân với tổng hợp các hệ số `TongHS`.

---

## 4. TÍNH LƯƠNG SẢN PHẨM TRUNG BÌNH (BỘ PHẬN CHỨC NĂNG/PHỤ TRỢ)
**Mục đích:** Tính mức lương bình quân ngày công của bộ phận trực tiếp sản xuất, từ đó làm cơ sở tính lương cho các nhân viên phụ trợ (VD: Thủ kho, KCS) ăn theo lương sản phẩm.

*   **Điều kiện tiên quyết:** Bảng lương LSP cá nhân (`LSP_Result`) của bộ phận đó phải ở trạng thái **Đã tính chính thức** (`IsPreview=0`). Nếu đang là bản nháp (Preview), hệ thống sẽ cảnh báo số liệu chưa chính thức.
*   **Công thức FR.25:**
    1.  `Mức lương SP bình quân ngày` = (Tổng `LSP_Total` của bộ phận) / (Tổng ngày công của bộ phận)
    2.  `Mức lương SP bình quân tháng` = `Mức lương SP bình quân ngày` &times; `Công chuẩn` (Thường là 26 ngày)
    3.  `Tiền lương SP NV Phụ trợ` = `Bậc lương của NV` &times; `Mức lương SP bình quân tháng`
*   **Open Points (Đang chờ chốt):**
    *   Việc lấy Tổng `LSP_Total` và Tổng ngày công làm mẫu số có loại trừ các nhân viên Kho/KCS đang tính hay không?
    *   Mẫu số ngày công sử dụng "Ngày công thực tế" hay "Công chuẩn &times; Tổng số nhân viên"?

---

## 5. LOGIC CHI TIẾT 4 CA KÍP & LÀM GIÙM (FR.31)
*   **Mục đích:** Xử lý các tình huống một công nhân làm nhiều ca hoặc luân chuyển làm hộ tại tổ khác trong cùng ngày.
*   **Cơ chế lưu trữ:** Tổng sản lượng hiển thị trên lưới là tổng của 4 ca: `Trong giờ` + `Ca đêm` + `Tăng ca` + `Tăng ca đêm`.
*   **Quy tắc "Làm giùm":** Khi công nhân thuộc Tổ A sang làm phụ cho Tổ B, bản ghi sẽ được sinh ra ở Tổ B với cờ `lam_gium = true`. Bản ghi này không đếm vào định biên nhân sự của Tổ B nhưng lương sẽ được hạch toán vào Tổ B và nhân viên vẫn nhận đủ lương cho phần việc làm giùm này.

---

## 6. LOGIC KHÓA SỔ VÀ ĐỒNG BỘ LƯƠNG THÁNG (FR.32)
*   **Mục đích:** Đảm bảo toàn vẹn dữ liệu trước khi đẩy sang phân hệ Lương tháng (PRM).
*   **Quy tắc:** Nút "Khóa / Chốt Lương" chỉ thực thi khi 100% các dòng trong bộ phận đều ở trạng thái `is_locked = 1`. Nếu tồn tại dòng chưa khóa, hệ thống từ chối đồng bộ để tránh tình trạng số liệu bị trôi và thay đổi sau khi chốt sổ. Sau khi đồng bộ thành công, nút Khóa sẽ bị vô hiệu hóa (disabled).
