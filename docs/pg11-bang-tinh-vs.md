# Bảng tính lương Vệ sinh (hưởng bình quân)

**File:** `lsp/pg11-bang-tinh-vs.html`
**Menu:** Lương sản phẩm > Chức năng > Bảng tính lương Vệ sinh
**Nghiệp vụ gốc:** Sheet `Report3_BangTinhVS` – Report.xlsx MPHG
**Vị trí pipeline:** Bước C, chạy **sau khi "Tính bình quân LSP" (pg10) đã khóa** trong cùng kỳ. Xem `LSP_ThietKe_BQTL_VS.md`.

---

## 1. Card nguồn bình quân (VS-00)

Đầu trang hiển thị nguồn đơn giá đang dùng, load tự động khi mở trang:

| Chỉ tiêu | Nguồn |
|---|---|
| Nhóm BQ hưởng theo | `BQ (CB, XQ, PTO, BCtb, CBTB, TB)` – từ `MOCK.lsp.nhomBQ` |
| BQ TLSP tháng | `computeBQNhomLSP('BQ_CB_XQ_PTO')` – cùng hàm với pg10 |
| BQ công đủ | Cùng kết quả trên (K) |
| Trạng thái BQ kỳ | Badge Đã khóa / Chưa khóa từ `MOCK.lsp.bqRun` |
| Thời điểm tính/khóa | `bqRun.thoiGian` + người tính |

**Ràng buộc:** BQ chưa khóa → bấm Tính báo lỗi chặn (VS-00). Khi tính, lưu snapshot `bq_run_id` + đơn giá vào kết quả.

## 2. Bộ lọc / tham số

| Trường | ID | Kiểu | Ghi chú |
|---|---|---|---|
| Kỳ / Tháng lương | — | Select | Kỳ LSP dùng chung |
| Khu vực VS | `cboKhuVuc` | Select | Đổ tự động từ danh sách NV (VS Bến NL Ka1/Ka2, VS Phân Cỡ Ka1/Ka2, VS PTO Ka1...); đổi → tính lại |
| % ĐC Lần 1 (M) | `txtDcL1` | Number | Mặc định 100% |
| % Hỗ trợ L4 (R) | `txtHtL4` | Number | Mặc định 2%; NV có `htL4Pct` riêng thì ưu tiên giá trị NV |
| Chỉ hiện NV công > 0 | `chkCong0` | Checkbox | Ẩn dòng P = 0 |
| Định mức % hưởng | — | Bảng readonly | VS thường 90% / Kiểm đầu vỏ 95% (danh mục "Tạo định mức") |

## 3. Nút chức năng

| Nút | Hành động |
|---|---|
| [1] Tính lương Vệ sinh | `clickTinhVS()` – VS-00→VS-06, đổ lưới theo khu vực |
| [2] Khóa / Chốt lương VS | `clickKhoaVS()` – confirm (hiển thị đơn giá snapshot) → đồng bộ Lương tháng PRM |
| Làm mới / Xuất Excel | reload / giả lập |

## 4. Collapsible các bước tính VS-00 → VS-06

| Bước | Công thức |
|---|---|
| VS-00 | Validate BQ kỳ đã khóa, lưu snapshot |
| VS-01 | `L` = BQ tháng nhóm hưởng; `K` = BQ công đủ nhóm |
| VS-02 | `N = L × M` |
| VS-03 | `O` = định mức % theo loại VS |
| VS-04 | `Q = (O>0 ? N×O : N) / K × P`; P=0 → Q=0 |
| VS-05 | `S = Q × %HT L4`; `T = Q + S` |
| VS-06 | `W = T + U + V` (U, V để trống trong kỳ thường) |

## 5. Lưới dữ liệu

Nhóm theo **khu vực vệ sinh** (dòng tiêu đề xanh) + dòng tổng từng khu + tổng cộng toàn bộ (tfoot).

| Cột | Ký hiệu Report3 | Ghi chú |
|---|---|---|
| TT, Mã NV, Họ tên, Loại VS | A, I, J | Từ `MOCK.lsp.vsNhanVien` |
| BQ công | K | 26.5 (BQ công đủ nhóm) |
| BQ TLSP | L | Đơn giá nhóm |
| %ĐC / BQ TLSP L1 | M / N | |
| Định mức | O | 90% / 95% |
| Công TT | P | Từ bảng công |
| Thực lãnh | Q | Nền vàng nhạt |
| %HT / Hỗ trợ | R / S | 2% |
| TỔNG TLSP | T | Nền xanh nhạt |
| HT LĐ+VR / ĐH Chiên | U / V | Hiển thị "-" (để trống trong kỳ) |
| TỔNG CUỐI | W | = T + U + V |
| Ghi chú | Y | |

## 6. Logic & ràng buộc

- BQ chưa khóa → chặn tính (alert error, không auto-hide).
- Chưa tính → nút Khóa disabled; Khóa xong → nút chuyển "Đã chốt lương VS".
- Số liệu kiểm chứng (khớp file Excel gốc với BQ = 10.509.676): công 26 → Q ≈ 9.280.242; công 27 → Q ≈ 9.637.174; công 21.5 → Q ≈ 7.674.046.
- Thiết kế invalidation: BQ tính lại sau khi VS đã tính → VS chuyển Stale (so sánh `bq_run_id`).
