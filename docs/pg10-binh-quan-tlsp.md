# Tính bình quân Lương Sản Phẩm (BQTL)

**File:** `lsp/pg10-bq-tlsp.html`
**Menu:** Lương sản phẩm > Chức năng > Tính bình quân LSP (BQTL)
**Nghiệp vụ gốc:** Sheet `Report2_BQTL` – Report.xlsx MPHG
**Vị trí pipeline:** Bước B, sau "Tính Lương Sản Phẩm" (pg2) và trước "Bảng tính lương Vệ sinh" (pg11). Xem `LSP_ThietKe_BQTL_VS.md`.

---

## 1. Khối kiểm tra nguồn (BQ-00)

Banner đầu trang hiển thị kết quả validate: toàn bộ Bảng tính TLSP (Report1) của kỳ đã tính & khóa. Nếu còn bộ phận chưa khóa → chặn tính, liệt kê danh sách BP.

## 2. Bộ lọc / tham số

| Trường | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| Kỳ / Tháng lương | Select | **Có** | Kỳ LSP dùng chung (`LSP_01_2026`) |
| Phạm vi bình quân | Radio | Không | Tất cả NV (mặc định) / Chỉ NV thâm niên > 3 tháng. Đổi phạm vi khi đã tính → tự tính lại |
| Công đủ K1 / K2 | Number (readonly) | — | 27 / 26, lấy từ cấu hình kỳ |

## 3. Nút chức năng

| Nút | Hành động |
|---|---|
| [1] Tính bình quân | `clickTinhBQ()` – chạy BQ-01→BQ-06, đổ 2 lưới, enable nút [2] |
| [2] Khóa Bình quân | `clickKhoaBQ()` – confirm → chốt đơn giá BQ làm đầu vào các bảng phụ trợ; cảnh báo ảnh hưởng dây chuyền |
| Làm mới | reload trang |
| Xuất Excel | (giả lập) |

## 4. Collapsible các bước tính BQ-00 → BQ-06

Bảng steps-table mô tả từng bước: validate nguồn, gom quỹ lương theo BP×Ka, gom công & lao động, BQ theo công, BQ >3T, BQ công đủ gia quyền theo SL bàn, tính các nhóm BQ.

## 5. Lưới 1 – Bình quân theo Bộ phận × Ka

| Cột | Nguồn / công thức |
|---|---|
| TT, Bộ phận, Ka | `MOCK.lsp.bqBoPhan` |
| Công đủ | 27 (K1) / 26 (K2) / 26.5 (gộp 2 Ka) |
| Tổng công, Tổng LĐ | Từ bảng công |
| LĐ mới <3T | Hiển thị đỏ đậm nếu > 0 |
| QTL theo bảng tính | Quỹ lương từ kết quả Report1 |
| SL bàn | Trọng số gia quyền |
| BQ theo công | `QTL / TổngCông × CôngĐủ` |
| BQ theo công >3T | `(QTL − QTL LĐ mới) / (Công − Công LĐ mới) × CôngĐủ` |

Footer: dòng **BQ TẤT CẢ** – BQ công đủ gia quyền, tổng công/LĐ/QTL toàn nhà máy, BQ chung.

## 6. Lưới 2 – Các nhóm bình quân tổng hợp

Nguồn cấu hình: `MOCK.lsp.nhomBQ` (thay các dòng 40/52/54 hardcode trên Excel).

| Cột | Diễn giải |
|---|---|
| Nhóm bình quân | Tên + tham chiếu dòng Excel gốc |
| Thành phần | Danh sách mã BP×Ka thuộc nhóm |
| BQ công đủ | Gia quyền theo SL bàn của thành viên |
| Tổng QTL / Tổng công | Tử số / mẫu số để trace |
| **BQ tháng** | `SUM(QTL)/SUM(Công) × BQCôngĐủ` – đơn giá trả lương phụ trợ (hàm dùng chung `computeBQNhomLSP()` trong utils.js) |
| Dùng trả lương cho | Badge nhóm hưởng: Bốc xếp bao bì / VS khuôn viên + cây xanh / VS MPHG, VS PXTB, Giặt đồ |

## 7. Logic & ràng buộc

- Chưa bấm [1] → nút [2] disabled.
- Khóa BQ → `MOCK.lsp.bqRun.trangThai = 'Locked'`; pg11 kiểm tra trạng thái này tại VS-00.
- Hàm `computeBQNhomLSP(maNhom, phamVi)` đặt tại `shared/utils.js` để pg10 và pg11 luôn ra cùng con số.
- Mở khóa TLSP (pg3) sau khi BQ đã tính → BQ chuyển Stale (thiết kế; prototype thể hiện qua cảnh báo trong confirm).
