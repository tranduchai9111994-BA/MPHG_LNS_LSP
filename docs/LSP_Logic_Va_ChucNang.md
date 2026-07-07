# TÀI LIỆU LOGIC VÀ CHỨC NĂNG LƯƠNG SẢN PHẨM (LSP)

## 1. Tổng quan hệ thống LSP
Hệ thống tính Lương Sản Phẩm (LSP) của Minh Phú bao gồm các chức năng quản lý kỳ, thiết lập định mức (đơn giá, hệ số, hỗ trợ) và tính toán lương sản phẩm cho từng công nhân trực tiếp sản xuất. Đồng thời, hệ thống thực hiện phân bổ tính lương cho nhân viên phụ trợ (Kho, KCS) dựa trên mức lương bình quân.

## 2. Cấu trúc các chức năng (Màn hình)
- **Quản lý kỳ lương**:
  - `pg1-tao-ky.html`: Tạo kỳ Lương Sản Phẩm.
  - `pg3-mo-khoa.html`: Mở/Khóa dữ liệu Lương Sản Phẩm.
- **Tính toán và Xem lương**:
  - `pg2-tinh-lsp.html`: Tính Lương Sản Phẩm (Đây là chức năng cốt lõi để tính lương qua 3 bước).
  - `pg4-xem-ca-nhan.html`: Xem Lương Sản Phẩm Cá Nhân.
- **Thiết lập Đơn giá và Hệ số**:
  - `pg5-don-gia.html`: Thiết lập Đơn giá tính cho từng Công đoạn.
  - `pg9-he-so-hs123.html`, `pg5-nhap-nv.html`: Thiết lập các hệ số điều chỉnh (HS1 do Phòng Nhân sự nhập, HS2 do Phó TGĐ Sản xuất nhập, HS3 do Trưởng ca nhập).
- **Thiết lập Hỗ trợ và Phụ cấp**:
  - `pg6-ho-tro-he-so.html`: Thiết lập % Hỗ trợ và Hệ số chung.
  - `pg8-ho-tro-cd.html`, `pg8-ho-tro-cd-chien.html`: Thiết lập % hỗ trợ quy cách tính lương và phụ cấp độc hại (ví dụ: khu vực Chiên).
- **Cấu hình Hệ số Lao động (HSLĐ) & Bổ sung phục vụ (BSPV)**:
  - `sys1-cau-hinh-hsld.html`, `sys2-bspv.html`: Cấu hình danh mục HSLĐ và BSPV.
  - `sys3-hsld-thang.html`, `sys4-bspv-thang.html`: Cập nhật cấu hình theo từng tháng.
- **Báo cáo**:
  - `bc-che-bien.html`: Báo cáo đánh giá công và năng suất chế biến.

## 3. Logic Tính Lương Sản Phẩm (Core Logic)
Quy trình tính toán chính tập trung tại `pg2-tinh-lsp.html`, được chia làm 3 bước tính toán toàn diện:

### Bước 1: Tính Lương Sản Phẩm Cá Nhân (Trực tiếp sản xuất)
Tính toán dựa trên công thức qua 10 bước hệ thống (CALC-00 đến CALC-10):
1. **Lấy Sản lượng (NS)**: Lấy tổng sản lượng thực tế (trong giờ + ca đêm + tăng ca + tăng ca đêm) đã được khóa từ Lương Năng Suất (LNS).
2. **Lấy Đơn giá**: Tra cứu đơn giá của từng Công đoạn (`UnitPrice`).
3. **Tính LSP Gốc (LSP_Base)**: `LSP_Base = Sản lượng × Đơn giá`.
4. **Áp dụng Hệ số điều chỉnh (L1, L2, L3)**: 
   - `Tiền L1 = LSP_Base × (HS1 / 100)`
   - `Tiền L2 = Tiền L1 × (HS2 / 100)`
   - `Tiền L3 = Tiền L2 × (HS3 / 100)`
5. **Tính Hỗ trợ Bộ phận (DeptSupport)**:
   - `DeptSupport = Tiền L3 × (% Hỗ trợ Bộ phận / 100)`.
6. **Tính Hỗ trợ Công đoạn (StageSupport)**:
   - Hệ số tổng (Tổng HS) = `(HS1/100) × (HS2/100) × (HS3/100)`.
   - `StageSupport = Tiền L3 × Tổng HS × (% Hỗ trợ Công đoạn / 100)`.
7. **Phụ cấp độc hại (HazardAmt)**: Khoản tiền cộng thêm trực tiếp dành riêng cho các công đoạn có tính chất độc hại (nếu có).
8. **Tổng Lương Sản Phẩm (LSP_Total)**:
   - `LSP_Total = Tiền L3 + DeptSupport + StageSupport + HazardAmt`.

### Bước 2: Tính Mức Lương Bình Quân Theo Bộ Phận
Dùng làm cơ sở để trả lương cho nhân viên phụ trợ hoặc các trường hợp đặc biệt không tính trực tiếp bằng sản lượng.
- **Tổng tiền BP** = Tổng LSP_Total của tất cả nhân viên trong Bộ phận.
- **Tổng công BP** = Tổng Ngày công của tất cả nhân viên trong Bộ phận.
- **Bình quân ngày (VND)** = Tổng tiền BP / Tổng công BP.
- **Bình quân tháng (VND)** = Bình quân ngày × Công chuẩn (thường là 26 ngày).
*(Lưu ý: Hệ thống tự động loại trừ những nhân viên có ngày công thực tế < 50% công chuẩn khỏi mẫu số tính bình quân).*

### Bước 3: Tính Lương Nhân Viên Phụ Trợ (Nhà Kho / KCS)
- Mỗi nhân viên phụ trợ sẽ được gắn liền với một "Bộ phận hưởng theo" và có một "Hệ số bậc lương" riêng biệt.
- **Tiền lương SP cuối cùng** = Mức lương SP BQ tháng (của Bộ phận hưởng theo tính ở Bước 2) × Hệ số bậc lương.

## 4. Quy trình vận hành (Workflow)
1. Dữ liệu năng suất thực tế từ phân hệ LNS (Lương Năng Suất) được xác nhận và chuyển sang trạng thái "Đã khóa".
2. Đội ngũ Quản trị/Phòng ban thiết lập Đơn giá, Hệ số điều chỉnh (1, 2, 3), các phần trăm hỗ trợ bộ phận, hỗ trợ công đoạn.
3. Người dùng vào chức năng "Tính lương sản phẩm" (`pg2-tinh-lsp.html`) thực hiện bấm chạy qua tuần tự 3 bước: Tính lương cá nhân -> Tính bình quân bộ phận -> Tính lương NV phụ trợ.
4. Màn hình tính toán hỗ trợ chỉnh sửa trực tiếp (Inline Edit) các hệ số nếu cần, hệ thống sẽ tự động tính lại (Recalculate).
5. Cuối cùng, thực hiện Khóa/Chốt lương để đồng bộ dữ liệu LSP hoàn chỉnh sang phân hệ Lương tháng (PRM).
