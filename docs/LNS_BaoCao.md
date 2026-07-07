# Danh sách Báo cáo Lương Năng Suất (LNS)

Tài liệu này mô tả chi tiết 5 báo cáo phân tích và tổng hợp thuộc phân hệ Lương năng suất.

---

## 1. Báo cáo công năng suất (bc0)
*   **Mục đích:** Tổng hợp công năng suất (CNS) của từng nhân viên theo bộ phận và kỳ lương/tháng.
*   **Các cột trên lưới hiển thị:** 
    *   **STT**, **Đơn vị**, **Bộ phận**, **Nhóm tính lương**, **MÃ NV**, **Họ và tên**, **%** (Hệ số cá nhân)
    *   **Cột từ 1 đến 31:** (Thể hiện công năng suất từng ngày trong tháng)
    *   **T.C N.Suất:** Tổng công năng suất
    *   **TC T.Tế:** Tổng công thực tế
*   **Ứng dụng:** Cung cấp cái nhìn tổng quan cho Quản lý bộ phận và Nhân sự về quỹ công năng suất đã được ghi nhận trong kỳ, phục vụ cho việc chuẩn bị tính lương.

## 2. Chi tiết công năng suất (bc1)
*   **Mục đích:** Xem chi tiết việc phân bổ và ghi nhận công năng suất (CNS) theo từng ngày làm việc cho mỗi nhân viên.
*   **Các cột trên lưới hiển thị:** 
    *   **STT**, **Mã BP**, **Nhóm tính lương**, **Ngày LV**, **Tổng**
    *   **Năng suất:** Trong ca, Ca đêm, Tăng ca, Tăng ca đêm
    *   **Các cột phân bổ/thưởng chi tiết theo mã (CB, PTO, BEN, NO):** Thưởng Phụ vụ, Đóng Phụ vụ, Chống Phụ vụ, Đóng Phụ vụ CĐ, TH*VCD, Thưởng Cắt kềm, Đóng lột vỏ rong, Lột rong Mũi Lãnh, Thưởng Khác, Đóng PV Rút chỉ lưng, Lột vỏ rút chỉ, Rút chỉ màng bụng, Lột vỏ rong Tưng xé...
*   **Ứng dụng:** Dùng để đối soát và giải trình trực tiếp khi có khiếu nại hoặc thắc mắc từ nhân viên về việc tính ngày công hay hệ số công năng suất hàng ngày.

## 3. Chi tiết nhân viên theo ngày (bc2 / 03)
*   **Mục đích:** Thống kê chi tiết các khoản lương năng suất, số lượng sản phẩm và tỷ lệ phân bổ của nhân viên phát sinh trong từng ngày cụ thể.
*   **Các cột trên lưới hiển thị:** 
    *   **STT**, **Mã NV**, **Họ và Tên**, **Mã BP**, **Nhóm tính lương**, **%**, **Công TT**, **Công NS**, **Ngày LV**, **Tổng**
    *   **Năng suất:** Trong ca, Ca đêm, Tăng ca, Tăng ca đêm
    *   **Các cột phụ cấp/thưởng (CB, PTO, BEN, NO):** Tương tự bc1 (Thưởng Phụ vụ, Đóng Phụ vụ, v.v...)
*   **Ứng dụng:** Giám sát hiệu suất hàng ngày của cá nhân, đánh giá sự biến động về thu nhập và sản lượng theo từng ca làm việc để kịp thời điều chỉnh sản xuất.

## 4. Chi tiết nhân viên theo tháng (bc3)
*   **Mục đích:** Báo cáo tổng hợp toàn bộ thu nhập từ lương năng suất của từng nhân viên trong một tháng.
*   **Các cột trên lưới hiển thị:** 
    *   **STT**, **Mã NV**, **Họ và Tên**, **Mã BP**, **Nhóm tính lương**, **%**, **T.Công TT**, **T.Công NS**, **Tổng**
    *   **Năng suất:** Trong ca, Ca đêm, Tăng ca, Tăng ca đêm, TH*VCB
    *   **Các cột phụ cấp/thưởng (CB, PTO, BEN, NO):** Được tổng hợp số liệu của cả tháng (Thưởng Phụ vụ, Đóng Phụ vụ, v.v...)
*   **Ứng dụng:** Đây là báo cáo chốt số liệu cuối cùng, làm cơ sở dữ liệu để đẩy sang phân hệ tính Lương Tháng (PRM) và dùng để in phiếu lương năng suất cho nhân viên.

## 5. Tổng hợp thành phẩm (bc4)
*   **Mục đích:** Báo cáo tổng hợp sản lượng thành phẩm đạt được của các Tổ/Bàn sản xuất theo một khoảng thời gian (ngày, tuần, tháng).
*   **Các cột trên lưới hiển thị:** 
    *   **STT**
    *   **Mã tiến trình**
    *   **QC tính lương**, **Tên QC tính lương**
    *   **ĐVT** (Đơn vị tính)
    *   **TRONG CA**, **CA ĐÊM**, **TĂNG CA**, **TĂNG CA ĐÊM**
    *   **TỔNG**
    *   **Ghi chú 1**, **Ghi chú 2**
*   **Ứng dụng:** Phục vụ công tác quản trị sản xuất, giúp ban giám đốc và quản lý xưởng đánh giá tiến độ thực hiện đơn hàng và hiệu suất thực tế của từng chuyền/bàn sản xuất so với định mức.
