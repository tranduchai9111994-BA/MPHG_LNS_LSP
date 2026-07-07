# CẤU TRÚC MÃ NGUỒN DỰ ÁN PROTOTYPE LSP

Dự án này là bản nguyên mẫu (Prototype) cho phân hệ Tính Lương Sản Phẩm (LSP) của nhà máy thủy sản MPHG, được xây dựng dựa trên HTML, CSS và JavaScript thuần để phục vụ mục đích thẩm định nghiệp vụ với khách hàng.

## 📂 Cấu trúc thư mục

```text
MPHG_LNS_LSP/
│
├── docs/                       # Thư mục chứa tài liệu logic và cấu trúc
│   ├── BUSINESS_LOGIC.md       # Tổng hợp quy tắc, công thức tính toán
│   ├── LOGIC_TAB_TINH_LUONG.md # Phân tích logic chuyên sâu của Màn hình tính lương
│   ├── SD_NhomDonViCap5_LuongNangSuat_v2.md  # [CŨ] SD Nhóm ĐV cấp 5 – phiên bản 2
│   ├── SD_NhomDonViCap5_LuongNangSuat_v3.md  # [MỚI v3] SD bổ sung: Data Model, Flow Diagram, Tech Checklist
│   └── SOURCE_CODE_STRUCTURE.md # Giải thích cấu trúc mã nguồn (chính là file này)
│
├── lns/                        # Màn hình thuộc phân hệ Lương Năng Suất (Input của LSP)
│   ├── fn1-tao-ky.html         # Tạo kỳ Lương Năng Suất
│   ├── fn4-chot-san-luong.html # % Bổ sung Phục vụ (BSPV)
│   ├── fn5-khoa-cong.html      # Nhập NS thực tế theo từng công đoạn, từng ngày
│   ├── fn6-tinh-lns.html       # Tính Lương Năng Suất – Engine 7 bước mới (CALC-NEW-01→07)
│   ├── fn7-nhom-dv-cap5.html   # [MỚI] Thiết lập nhóm tính lương năng suất (A/B/C)
│   ├── fn8-mo-khoa.html        # Mở khóa Lương NS
│   ├── sys1-cau-hinh-hsld.html # Cấu hình tiêu chí
│   ├── sys2-bspv.html          # Thiết lập BSPV
│   ├── sys3-hsld-thang.html    # HSLD theo tháng
│   ├── sys4-bspv-thang.html    # BSPV theo tháng
│   ├── tl2-mapping-ma.html     # Mapping mã
│   └── dm1..dm6-*.html         # Danh mục: Tiến trình, Công đoạn, Loại Tôm, Loại NL, Mã Size, Mã nội bộ
│
├── lsp/                        # Màn hình thuộc phân hệ Lương Sản Phẩm (Core)
│   ├── pg2-tinh-lsp.html       # Prototype màn hình cốt lõi: Tính lương sản phẩm Tab 1 & Tab 2
│   └── ...                     # Các màn hình thiết lập hệ số, danh mục (tuỳ mở rộng)
│
├── shared/                     # Thư mục dùng chung (Master Data, CSS, JS Utilities)
│   ├── mockdata.js             # Dữ liệu giả lập (Mock Data) dùng làm bộ nhớ trạng thái (State)
│   ├── style.css               # Chứa CSS, class màu sắc, freeze column, badge, modal...
│   └── utils.js                # Chứa các hàm tiện ích (formatNumber, show alert, tính modal 4 ca...)
│
├── nav-config.js               # Cấu hình Sidebar Navigation (danh sách menu → src iframe)
└── index.html                  # Màn hình Shell chứa Sidebar Navigation và Iframe
```

## 🔄 Luồng dữ liệu (Data Flow)

1. **State Management:** Toàn bộ dữ liệu được quản lý tập trung tại `window.MOCK` nằm trong `shared/mockdata.js`. Nó đóng vai trò như một kho lưu trữ trạng thái (Store). Mọi cập nhật đều làm thay đổi state này.
2. **Màn hình Tính Lương (Tab 1):** 
   - Logic được xử lý tại `lsp/pg2-tinh-lsp.html`. Hàm `renderTableTab1()` duyệt qua dữ liệu và vẽ ra giao diện (DOM).
   - Hàm `clickTinhTab1()` chịu trách nhiệm chạy chuỗi Engine tính lương theo nhiều bước từ cơ bản đến tổng cuối cùng.
   - **Inline Edit:** Khi người dùng thay đổi các cột `% Đ.chỉnh`, sự kiện `onblur` sẽ lấy dữ liệu ghi ngược vào mảng `window.MOCK.lsp.ketQua`, sau đó kích hoạt lại tính toán giúp giao diện cập nhật Realtime ngay lập tức.
3. **Màn hình Tính Lương Phụ Trợ (Tab 2):**
   - Hoạt động phụ thuộc vào kết quả của Tab 1. Khi ấn "Tính Bình Quân Bộ Phận", hàm `clickTinhTab2()` lọc danh sách Tab 1 theo `ma_bp`, tính toán mẫu số và tử số.
   - Kết quả cuối cùng được áp cho nhân viên gián tiếp nằm trong mảng `window.MOCK.lsp.nhanVienPhuTro`.
4. **Logic 4 ca kíp & Làm giùm:**
   - Dữ liệu ở Tab 1 phản ánh tổng quát. Khi cần chi tiết, hàm `moModal4Ca(rowId)` nằm trong `shared/utils.js` sẽ kích hoạt để bóc tách sản lượng và tiền lương của 4 ca (Trong giờ, Ca đêm, Tăng ca, Tăng ca đêm).
5. **[MỚI] Thiết lập Nhóm ĐV Cấp 5 (`fn7-nhom-dv-cap5.html`):**
   - Cho phép gán từng Bàn (ĐV cấp 5) vào Loại A (Trực tiếp) / B (Chia nhóm) / C (Làm dùm).
   - Kết quả gán được Engine LNS dùng để xác định luồng tính 7 bước (CALC-NEW-01 → 07).
   - Tài liệu nghiệp vụ đầy đủ: `docs/SD_NhomDonViCap5_LuongNangSuat_v3.md`
