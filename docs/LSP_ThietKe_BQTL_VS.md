# PHÂN TÍCH & THIẾT KẾ: TÍNH BÌNH QUÂN TLSP (BQTL) VÀ BẢNG TÍNH LƯƠNG VỆ SINH (VS)

**Nguồn nghiệp vụ:** `PhanRa_CongThuc_Report_LSP.docx` – sheet `Report2_BQTL` và `Report3_BangTinhVS` (file Report.xlsx MPHG)
**Prototype:** `lsp/pg10-bq-tlsp.html`, `lsp/pg11-bang-tinh-vs.html`
**Ngày:** 02/07/2026

---

## 1. Bài toán thiết kế

Hai nghiệp vụ mới cần bổ sung sau khi Bảng tính TLSP chế biến (Report1, hiện là `pg2-tinh-lsp.html`) hoàn tất:

1. **Tính bình quân lương sản phẩm (BQTL – Report2):** tổng hợp quỹ lương / công / lao động theo từng **Bộ phận × Ka**, tính lương bình quân 1 người đủ công, và tính các **dòng bình quân tổng hợp theo nhóm** (dòng 40/52/54 trên Excel) làm **đơn giá trả lương cho các nhóm phụ trợ**.
2. **Bảng tính lương Vệ sinh (VS – Report3):** NV vệ sinh không có sản lượng cá nhân, hưởng theo **đơn giá bình quân** của cụm bộ phận sản xuất (lấy từ Report2) × định mức % × công thực tế.

**Câu hỏi cần chốt:** Bảng VS *tính chung kỳ* với LSP, vậy nên gộp vào function Tính LSP hiện có (pg2) hay **tách thành function riêng** như Dev đề xuất? Và function BQ đứng ở đâu khi output của nó là input của VS?

## 2. Phân tích 2 phương án

| Tiêu chí | PA1 – Gộp vào pg2 (thêm bước 4, 5) | PA2 – Tách 2 function riêng (Dev đề xuất) |
|---|---|---|
| Granularity dữ liệu | Trộn 3 loại đối tượng (NV chế biến / BP×Ka / NV vệ sinh) trong 1 màn hình, khó kiểm soát | Mỗi function 1 đối tượng dữ liệu rõ ràng |
| Phạm vi BQ | BQ chỉ đúng khi **toàn bộ** BP sản xuất của kỳ đã tính & khóa; pg2 chạy theo từng lần lọc bộ phận → dễ tính BQ trên dữ liệu thiếu | BQ có bước Validate riêng (BQ-00): kiểm tra 100% BP đã khóa mới cho tính |
| Tái sử dụng output BQ | BQ nằm trong luồng VS → nhóm **Bốc xếp bao bì, Giặt đồ, VS khuôn viên** (cùng dùng BQ nhưng khác bảng lương) không dùng lại được | BQ là function độc lập, output là **bảng đơn giá BQ theo nhóm hưởng** phục vụ nhiều bảng phụ trợ |
| Người vận hành / thời điểm | Cùng 1 người 1 lúc | Thực tế: TLSP chốt trước → nghiệp vụ duyệt BQ → mới trả các bảng phụ trợ. Tách cho phép phân quyền + chốt theo giai đoạn |
| Trace / audit | Khó biết bảng VS đã tính bằng BQ phiên nào | VS lưu snapshot `bq_run_id` → truy vết được |
| Rủi ro của phương án | Màn hình pg2 phình to, chạy lại 1 bước kéo theo tất cả | Phải quản lý **phụ thuộc trạng thái** giữa 3 function (giải quyết ở mục 4) |

## 3. Khuyến nghị (đã hiện thực trong prototype)

**Đồng ý với đề xuất của Dev: tách thành 2 function mới**, với 2 ràng buộc quan trọng:

1. **Không tạo kỳ riêng.** Cả BQTL và VS đều chạy trên **kỳ LSP hiện có** (`LSP_yyyymm`). "Tính chung kỳ" là ràng buộc dữ liệu, không phải lý do gộp màn hình. Kỳ LSP trở thành trục xuyên suốt của pipeline 3 bước.
2. **BQ là một "điểm chốt" (checkpoint) có trạng thái riêng** trong kỳ: `Chưa tính → Đã tính (Preview) → Đã khóa`. Bảng VS (và sau này Bốc xếp, Giặt đồ) **chỉ được tính khi BQ của kỳ ở trạng thái Đã khóa**.

### Pipeline trong 1 kỳ LSP

```
┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────────────┐
│ BƯỚC A (pg2)     │    │ BƯỚC B (pg10 – mới)  │    │ BƯỚC C (pg11 – mới)      │
│ Tính TLSP        │───▶│ Tính BQ TLSP         │───▶│ Bảng tính lương VS       │
│ chế biến         │khóa│ (Report2_BQTL)       │khóa│ (Report3_BangTinhVS)     │
│ (Report1)        │    │ Output: đơn giá BQ    │    │ + Bốc xếp / Giặt đồ /    │
│                  │    │ theo NHÓM HƯỞNG      │    │   VS khuôn viên (sau này)│
└──────────────────┘    └──────────────────────┘    └──────────────────────────┘
```

## 4. Data contract giữa 2 function

### 4.1 Output của F-BQ (bảng `LSP_BQ_NhomResult` – "đơn giá bình quân theo nhóm hưởng")

| Trường | Diễn giải |
|---|---|
| `ky` | Kỳ LSP (chung với Report1) |
| `bq_run_id` | Mã phiên tính BQ (tăng mỗi lần tính lại) |
| `ma_nhom` | `BQ_LSP_KO_XHTP` / `BQ_MPHG` / `BQ_CB_XQ_PTO` (cấu hình được, xem 4.2) |
| `bq_cong_du` | BQ công đủ gia quyền theo SL bàn của nhóm |
| `tong_qtl`, `tong_cong` | Tử số / mẫu số để trace |
| `bq_thang` | **Đơn giá bình quân tháng** – giá trị VS sử dụng |
| `pham_vi` | ALL / >3T |
| `trang_thai` | Preview / Locked |

### 4.2 Danh mục NHÓM BÌNH QUÂN (thay hardcode dòng 40/52/54 của Excel)

| Mã nhóm | Thành phần (BP×Ka) | Nhóm hưởng | Excel ref |
|---|---|---|---|
| `BQ_LSP_KO_XHTP` | Tất cả BP LSP trừ Xuất hàng TP | Bốc xếp bao bì | Report2 dòng 40/50 |
| `BQ_MPHG` | Nhóm BP chính MPHG (PV, Băng chuyền, Cấp đông, Xếp hộp) | VS khuôn viên + cây xanh | dòng 52 |
| `BQ_CB_XQ_PTO` | CB, Xiên que, PTO, PX Tẩm bột (CBTB), Tẩm bột | **VS MPHG, VS PXTB, Giặt đồ** | dòng 54 |

Mỗi NV phụ trợ được gán 1 `ma_nhom` hưởng theo (trường `nhomBQ` trong hồ sơ NV VS) → giải quyết Open Point #7 của tài liệu phân rã bằng **danh mục cấu hình** thay vì mapping cứng.

### 4.3 Snapshot ở phía VS

Khi tính VS, hệ thống lưu vào từng dòng kết quả: `bq_run_id`, `bq_thang`, `bq_cong_du` tại thời điểm tính. Màn hình VS luôn hiển thị **nguồn BQ + trạng thái + thời điểm khóa** (card đầu trang pg11).

## 5. Quy tắc phụ thuộc & invalidation (điểm mấu chốt khi tách function)

| Sự kiện | Hành vi hệ thống |
|---|---|
| Tính BQ khi còn BP chưa khóa TLSP | **BQ-00 chặn**, liệt kê BP chưa khóa |
| Tính VS khi BQ chưa khóa | **VS-00 chặn** ("BQ của kỳ chưa được khóa") |
| Mở khóa TLSP (pg3) sau khi BQ đã tính | BQ của kỳ chuyển **Stale** (cần tính lại) + cảnh báo |
| Tính lại / mở khóa BQ sau khi VS đã tính | Toàn bộ bảng VS (và Bốc xếp, Giặt đồ) của kỳ chuyển **Stale**; so sánh `bq_run_id` snapshot ≠ `bq_run_id` hiện hành |
| VS đã chốt sang Lương tháng | Muốn tính lại phải mở khóa VS trước (theo luồng mở khóa hiện có, kèm lý do + audit log) |

> Nguyên tắc: hệ thống **không tự xóa** kết quả bước sau, chỉ đánh dấu Stale + chặn chốt lương tháng cho tới khi tính lại — tránh mất dấu vết đối chiếu.

## 6. Thiết kế function F-BQ – Tính bình quân TLSP (`pg10-bq-tlsp.html`)

**Tham số:** Kỳ lương (bắt buộc); Phạm vi BQ (Tất cả / chỉ NV >3 tháng); Công đủ K1/K2 (từ cấu hình kỳ).

**Các bước:**

| Bước | Công thức / xử lý |
|---|---|
| BQ-00 | Validate: toàn bộ TLSP (Report1) của kỳ đã tính & khóa |
| BQ-01 | `QTL_bp = SUM(Tổng TLSP của NV thuộc BP×Ka)` từ kết quả Report1 |
| BQ-02 | Gom `TổngCông_bp`, `TổngLĐ_bp`, `LĐmới<3T_bp` từ bảng công |
| BQ-03 | `BQ_bp = QTL_bp / TổngCông_bp × CôngĐủ_Ka` |
| BQ-04 | BQ >3T: loại QTL & công của LĐ mới <3T khỏi cả tử số và mẫu số |
| BQ-05 | `BQCôngĐủ = SUMPRODUCT(CôngĐủ × SLbàn) / SUM(SLbàn)` (gia quyền theo số bàn) |
| BQ-06 | `BQ_nhóm = SUM(QTL thành viên) / SUM(Công thành viên) × BQCôngĐủ` cho từng nhóm trong danh mục 4.2 |

**Hành động:** [1] Tính bình quân → [2] Khóa BQ (chốt đơn giá cho các bảng phụ trợ).

## 7. Thiết kế function F-VS – Bảng tính lương Vệ sinh (`pg11-bang-tinh-vs.html`)

**Tham số:** Kỳ lương; Khu vực VS (lọc); %ĐC Lần 1 (M, mặc định 100%); %Hỗ trợ L4 (mặc định 2%); danh mục Định mức % hưởng theo loại VS (VS thường 90%, Kiểm đầu vỏ 95% – "Tạo định mức", Open Point #6).

**Các bước (ký hiệu cột theo Report3):**

| Bước | Công thức |
|---|---|
| VS-00 | Validate BQ kỳ đã khóa; lưu snapshot `bq_run_id` |
| VS-01 | `L = BQ_thang` của nhóm hưởng gán cho NV; `K = BQCôngĐủ` nhóm |
| VS-02 | `N = L × M` |
| VS-03 | `O` = định mức % theo loại công việc VS |
| VS-04 | `Q = (O > 0 ? N × O : N) / K × P`; `P = 0 → Q = 0` |
| VS-05 | `S = Q × %HT L4`; `T = Q + S` |
| VS-06 | `W = T + U + V` (U = HT LĐ+VR, V = ĐH chiên – để trống trong kỳ thường, chờ chốt OP #4) |

**Hành động:** [1] Tính lương VS → [2] Khóa/Chốt → đồng bộ Lương tháng (PRM).

## 8. Open points cần chốt với nghiệp vụ

1. **Mẫu số BQ công đủ của nhóm:** Excel dòng 39 dùng gia quyền theo SL bàn (SUMPRODUCT), dòng 52 lại dùng AVERAGE thường. Prototype thống nhất dùng **gia quyền theo SL bàn** – cần confirm.
2. **BQ trả cho VS dùng phạm vi nào:** Tất cả NV hay chỉ >3T? (Excel dòng 54 tính trên tất cả). Prototype để tham số.
3. Cột U (HT LĐ+VR) và V (ĐH chiên) của VS: điều kiện phát sinh và nguồn nhập (liên quan OP #4 tài liệu phân rã).
4. Mapping chính thức **nhóm hưởng ↔ nhóm BQ** cho đủ các đối tượng: Bốc xếp bao bì, VS khuôn viên + cây xanh, VS MPHG, VS PXTB, Giặt đồ (OP #7) – prototype đã đưa thành danh mục cấu hình.
5. Khi 1 BP có công nhưng QTL = 0 (cả nhóm nghỉ/điều chuyển): có loại khỏi nhóm BQ không?
