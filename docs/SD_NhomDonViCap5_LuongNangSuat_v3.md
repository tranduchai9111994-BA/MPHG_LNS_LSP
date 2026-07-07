# PHƯƠNG ÁN NÂNG CẤP: THIẾT LẬP NHÓM TÍNH LƯƠNG NĂNG SUẤT & MÀN HÌNH TÍNH TOÁN

> **Phiên bản:** v3.0 – Dựa trên review Prototype Demo
> **Ngày:** 24/06/2026
> **Input:** 3 ảnh prototype (Màn hình thiết lập + Popup thêm mới + Màn hình tính lương NS)

---

## PHẦN A: MÀN HÌNH THIẾT LẬP NHÓM ĐV CẤP 5

### A.1 ĐÁNH GIÁ PROTOTYPE HIỆN TẠI

Prototype đã thể hiện đúng ý tưởng chính: 1 màn hình thiết lập duy nhất gồm filter + summary cards + grid + popup thêm mới. Tuy nhiên có 3 điểm cần nâng cấp:

| # | Vấn đề | Mô tả | Mức độ |
|---|--------|-------|--------|
| 1 | **Popup: ĐV cấp 5 bị lock theo cấp 4** | Hiện tại cascade cấp 1→2→3→4 rồi mới chọn cấp 5. Nghĩa là user phải chọn đúng 1 Ka (cấp 4) → chỉ thấy ĐV cấp 5 con của Ka đó. Nếu muốn gán ĐV cấp 5 thuộc Ka khác thì phải đóng popup → chọn lại cấp 4 → mở popup lại. Yêu cầu: cho phép gán ĐV cấp 5 từ **nhiều cấp 4 khác nhau** (cross-Ka) trong cùng 1 lần thao tác | Cao |
| 2 | **Popup: Checkbox list "Làm dùm cho" quá dài** | Với 400+ ĐV cấp 5, danh sách checkbox sẽ cuộn rất dài. Hiện prototype chỉ hiện 6 item flat list. Cần cơ chế tìm kiếm, phân nhóm, hoặc dual-list | Cao |
| 3 | **Grid: Cột "Làm dùm cho" hiển thị multi-line** | Prototype dòng 5 hiện "→ Lặt đầu tôm Ka Sáng..." nhưng khi 1 Bàn HT hỗ trợ 9 Bàn SX thì cột này rất dài. Cần cơ chế collapse/expand hoặc popup xem chi tiết | Trung bình |

---

### A.2 NÂNG CẤP 1: POPUP THÊM MỚI – HỖ TRỢ CROSS-KA VÀ MULTI-SELECT CẤP 5

#### A.2.1 Thay đổi cách chọn ĐV cấp 5

**Hiện tại (Prototype):**
```
ĐV cấp 1 → cấp 2 → cấp 3 → cấp 4 → [1 combobox cấp 5]
→ Chỉ chọn được 1 ĐV cấp 5 / 1 lần
→ Phải cùng cha cấp 4
```

**Đề xuất nâng cấp – Phương án "Search + Tag":**

```
┌──────────────────────────────────────────────────────────────────┐
│  ✚ THÊM THIẾT LẬP NHÓM ĐV CẤP 5                           ✕  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ── Bộ lọc hỗ trợ (không bắt buộc, chỉ để thu hẹp DS) ──      │
│  Công ty *  [MPHG ▼]                                            │
│  ĐV cấp 3  [-- Tất cả -- ▼]   ĐV cấp 4  [-- Tất cả -- ▼]     │
│                                                                  │
│  ── Chọn đơn vị cấp 5 * ──────────────────────────────────      │
│  🔍 [Tìm theo tên hoặc mã ĐV cấp 5...              ]           │
│                                                                  │
│  ┌── Danh sách ĐV cấp 5 (filter theo bộ lọc trên) ──────┐     │
│  │ ☐  Chọn tất cả (15 đơn vị)                            │     │
│  │ ─── Ka Sáng ──────────────────────────────────────     │     │
│  │ ☑  Lặt đầu tôm Ka Sáng (DV5_LAT_KS)                  │     │
│  │ ☑  Phân cỡ tay Ka Sáng (DV5_PHANC_KS)                 │     │
│  │ ☐  Tẩm bột Ka Sáng (DV5_TAM_KS)                       │     │
│  │ ─── Ka Chiều ─────────────────────────────────────     │     │
│  │ ☐  Lặt đầu tôm Ka Chiều (DV5_LAT_KC)                  │     │
│  │ ☑  Phân cỡ tay Ka Chiều (DV5_PHANC_KC)                 │     │
│  │ ─── Ka Đêm ──────────────────────────────────────     │     │
│  │ ☐  Lặt đầu tôm Ka Đêm (DV5_LAT_KD)                    │     │
│  │ ...                                                     │     │
│  └────── Hiện: 15/400 │ Đã chọn: 3 ─────────────────────┘     │
│                                                                  │
│  Đã chọn: [Lặt đầu tôm KS ✕] [Phân cỡ tay KS ✕]              │
│            [Phân cỡ tay KC ✕]                                    │
│                                                                  │
│  ── Ngày hiệu lực * ──                                          │
│  [01/07/2026 📅]                                                 │
│                                                                  │
│  ── Nhóm tính lương * ──                                        │
│  (●) A – Trực tiếp                                              │
│  ( ) B – Chia nhóm    → [% Giữ lại: ___] [% Chia: auto]        │
│  ( ) C – Làm dùm      → [Chọn Bàn SX làm dùm cho...]          │
│                                                                  │
│                                         [Hủy]  [💾 Lưu]         │
└──────────────────────────────────────────────────────────────────┘
```

**Điểm chính của phương án:**

| Thay đổi | Chi tiết | Lý do |
|----------|----------|-------|
| Bộ lọc cấp 3/4 là **optional, chỉ để filter** | Không cascade bắt buộc. User có thể bỏ trống cấp 4 → thấy tất cả ĐV cấp 5 của công ty. Hoặc chọn cấp 4 = "Ka Sáng" → chỉ thấy ĐV cấp 5 thuộc Ka Sáng | Cho phép cross-Ka: chọn ĐV từ nhiều Ka khác nhau |
| Danh sách cấp 5 **group theo cấp 4 (Ka)** | Hiển thị dạng grouped checkbox list, có header nhóm theo Ka. Có thanh cuộn bên trong vùng cố định (~250px height) | Với 400 ĐV, group theo Ka giúp user dễ tìm. Không hiện flat 400 dòng |
| **Ô tìm kiếm** đầu danh sách | Gõ "phân cỡ" → chỉ hiện ĐV chứa "phân cỡ" trong tất cả Ka | 400 ĐV thì search nhanh hơn cuộn |
| **Tag bar** hiển thị ĐV đã chọn | Dạng chip/tag có nút ✕ để bỏ chọn. Hiện phía dưới danh sách | User thấy ngay đã chọn được gì, dễ review trước khi Lưu |
| **"Chọn tất cả" per nhóm Ka** | Mỗi nhóm Ka có checkbox "Chọn tất cả" riêng | User muốn gán toàn bộ Ka Sáng vào Loại A = 1 click |
| Counter | "Hiện: 15/400 | Đã chọn: 3" | User biết đang filter bao nhiêu, chọn bao nhiêu |

#### A.2.2 Khi chọn Loại C – Section "Làm dùm cho" cũng dùng pattern tương tự

Khi radio chọn `C – Làm dùm`, hiện thêm section:

```
│  ── Chọn Bàn SX mà Bàn này "Làm dùm cho" * ──                  │
│  (Chỉ hiện ĐV cấp 5 đã gán Loại A hoặc B)                      │
│                                                                   │
│  🔍 [Tìm theo tên hoặc mã...                      ]              │
│  ☐ Chọn tất cả cùng Ka với Bàn HT đang chọn (6 bàn)             │
│                                                                   │
│  ┌── Cùng Ka (Ka Sáng) ──────────────────────────────┐           │
│  │ ☑  Lặt đầu tôm Ka Sáng       [A]                  │           │
│  │ ☑  Phân cỡ tay Ka Sáng        [A]                  │           │
│  │ ☑  Tẩm bột Ka Sáng            [A]                  │           │
│  │ ... (6 bàn)                                         │           │
│  ├── Khác Ka (nếu OP-NEW-01 cho phép cross-Ka) ──────┤           │
│  │ ☐  Lặt đầu tôm Ka Chiều      [A]                  │           │
│  │ ☐  Phân cỡ tay Ka Chiều       [B]                  │           │
│  └────────────────────────────────────────────────────┘           │
```

**Rule quan trọng:**
- Danh sách chỉ hiện ĐV cấp 5 **đã được gán Loại A hoặc B** (đã lưu trong grid). Nếu chưa gán → không hiện
- Mặc định ưu tiên hiện ĐV cùng Ka trước (group "Cùng Ka"), sau đó mới hiện "Khác Ka"
- Có option "Chọn tất cả cùng Ka" để nhanh chóng mapping 9 bàn SX cho 1 bàn HT

---

### A.3 NÂNG CẤP 2: GRID – CỘT "LÀM DÙM CHO / TỶ LỆ" HIỂN THỊ GỌN

**Vấn đề:** Bàn HT mapping 9 Bàn SX → cột quá dài, grid khó đọc.

**Đề xuất:**

| Loại | Cột "Làm dùm cho / Tỷ lệ" hiển thị | Thao tác |
|------|-------------------------------------|----------|
| A – Trực tiếp | `—` | Không có gì |
| B – Chia nhóm | `▲ Giữ lại: 70%` / `▼ Chia nhóm: 30%` (2 dòng, color-coded) | Click Sửa → popup |
| C – Làm dùm | `→ Lặt đầu tôm KS, Phân cỡ KS ... (+7)` (1 dòng, truncate) | **Click vào text "(+7)"** → expand inline hoặc popup xem đầy đủ |

**Chi tiết hiển thị Loại C trong grid:**

```
Trường hợp ≤ 3 bàn SX:
  "→ Lặt đầu tôm KS, Phân cỡ KS, Tẩm bột KS"

Trường hợp > 3 bàn SX:
  "→ Lặt đầu tôm KS, Phân cỡ KS, Tẩm bột KS (+6 bàn)"
   ↑ phần (+6 bàn) là link, click → tooltip hoặc popover hiện danh sách đầy đủ
```

**Dev note:** Cột này nên set `max-width: 350px` + `overflow: hidden` + `text-overflow: ellipsis`. Khi hover hoặc click → tooltip/popover chứa full list.

---

### A.4 NÂNG CẤP 3: THÊM CỘT "ĐV CẤP 4 (Ka)" VÀO GRID

Prototype hiện tại grid không có cột Ka (cấp 4). Khi cross-Ka, user cần biết mỗi ĐV cấp 5 thuộc Ka nào.

**Grid mới đề xuất:**

| STT | Sửa | Ngày HLực | Công ty | **ĐV cấp 4 (Ka)** | Đơn vị cấp 5 (Bàn) | Nhóm TL | Làm dùm cho / Tỷ lệ | Ghi chú | Ngày KT |
|-----|-----|-----------|---------|--------------------|---------------------|---------|----------------------|---------|---------|
| 1 | ✎ | 01/07/2026 | MPHG | Ka Sáng | Lặt đầu tôm Ka Sáng | A–Trực tiếp | — | | — |
| 2 | ✎ | 01/07/2026 | MPHG | Ka Sáng | Phân cỡ tay Ka Sáng | A–Trực tiếp | — | | — |
| 3 | ✎ | 01/07/2026 | MPHG | Ka Chiều | Bàn chia nhóm Ka Chiều | B–Chia nhóm | ▲70% ▼30% | | — |
| 4 | ✎ | 01/07/2026 | MPHG | Ka Sáng | Rửa/Vệ sinh Ka Sáng | C–Làm dùm | → Lặt đầu tôm KS, Phân cỡ KS (+7) | Phục vụ 9 bàn | — |
| 5 | ✎ | 01/07/2026 | MPHG | Ka Sáng | Vận chuyển Ka Sáng | C–Làm dùm | → Lặt đầu tôm KS, Phân cỡ KS (+1) | | — |

**Lý do thêm cột Ka:** Khi filter theo Ka = "Ka Sáng" trên filter panel, user chỉ thấy dòng thuộc Ka Sáng. Cột Ka giúp phân biệt khi xem "Tất cả".

---

### A.5 SUMMARY – THAY ĐỔI MÀN HÌNH THIẾT LẬP

| Hạng mục | Prototype hiện tại | Nâng cấp | Effort |
|----------|-------------------|----------|--------|
| Filter panel | Có Ngày HLực, Công ty, BP, Ka, ĐV cấp 5, Nhóm | Giữ nguyên + thêm filter text search ĐV cấp 5 | Low |
| Summary cards | 4 card: Tổng, Loại A, B, C | Giữ nguyên | — |
| Grid cột | Thiếu cột Ka | Thêm cột "ĐV cấp 4 (Ka)" | Low |
| Grid cột "Làm dùm cho" | Multi-line dài | Truncate + "(+N bàn)" link xem đầy đủ | Medium |
| Popup: Chọn ĐV cấp 5 | Cascade bắt buộc → single-select | Grouped checkbox + search + tag bar + cross-Ka | **High** |
| Popup: Làm dùm cho | Flat checkbox 6 items | Grouped checkbox + search + "Chọn tất cả cùng Ka" | Medium |
| Buttons | Tìm kiếm, Làm mới, Thêm mới, Xóa, Xuất DL, Import | Giữ nguyên | — |

---

## PHẦN B: MÀN HÌNH TÍNH LƯƠNG NĂNG SUẤT

### B.1 ĐÁNH GIÁ PROTOTYPE HIỆN TẠI

| # | Vấn đề | Mô tả |
|---|--------|-------|
| 1 | **Dữ liệu hiện trước khi bấm Tính** | Grid đã có số liệu (NV001–NV006 với CTT, CNS, GiamPV...) dù user chưa bấm "Tính lương NS". Sai flow: đúng ra phải chọn kỳ → bấm Tính → mới hiện kết quả |
| 2 | **Thiếu cột Nhóm tính lương** | Grid không có cột cho biết NV/Bàn thuộc Loại A/B/C. Dev và user không biết engine đã route nhánh nào |
| 3 | **Chưa có case Loại B và C** | Grid chỉ hiện case mặc định (NV SX và PV). Không thể hiện kết quả redistribution (Loại B) hay NS từ mapping (Loại C) |
| 4 | **2 Tab hay 1 Tab** | Prototype chia 2 tab: Tab 1 (CALC-NEW-01→06: Tính CNS + Phân chia PV), Tab 2 (CALC-NEW-07: NS tính lương). Cần đánh giá best practice |
| 5 | **Nút "Nhập điều chỉnh"** | Mục đích nút này chưa rõ. Cần xác nhận: cho phép override kết quả tính? hay nhập manual adjustment? |

---

### B.2 NÂNG CẤP: FLOW ĐÚNG – CHỌN KỲ → BẤM TÍNH → HIỆN KẾT QUẢ

**Trạng thái ban đầu khi vào màn hình:**

```
┌──────────────────────────────────────────────────────────────────┐
│  TÍNH LƯƠNG NĂNG SUẤT                                            │
├──────────────────────────────────────────────────────────────────┤
│  Kỳ lương NS *  [-- Chọn kỳ -- ▼]   Bộ phận  [-- Tất cả --▼]  │
│  Ka              [-- Tất cả -- ▼]    Bàn      [-- Tất cả --▼]  │
│  Công đoạn       [-- Tất cả -- ▼]    Mã NV    [           ]    │
│  Tình trạng khóa (●) Chưa khóa ( ) Đã khóa ( ) Tất cả         │
│  ☐ Khóa tất cả sau khi tính                                     │
│                                                                  │
│  [🔵 Tính lương NS]  [Xem dữ liệu]  [Làm mới]                 │
│  [Khóa dữ liệu]  [Nhập điều chỉnh]  [Xuất dữ liệu]           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ⓘ Vui lòng chọn Kỳ lương NS và bấm "Tính lương NS"  │    │
│  │    hoặc "Xem dữ liệu" để hiển thị kết quả.            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  (Grid rỗng – không hiện dữ liệu cho đến khi bấm nút)          │
└──────────────────────────────────────────────────────────────────┘
```

**Phân tách hành vi nút:**

| Nút | Hành vi | Khi nào enable |
|-----|---------|----------------|
| **Tính lương NS** | Chạy engine 7 bước (CALC-NEW-01→07) cho tất cả NV trong scope filter. Lưu kết quả vào DB. Sau đó hiện grid | Kỳ đã chọn + Kỳ đã tạo + chưa khóa toàn bộ |
| **Xem dữ liệu** | Chỉ load và hiện dữ liệu đã tính trước đó (SELECT từ DB). Không chạy engine | Kỳ đã chọn |
| Làm mới | Reset filter + clear grid | Luôn enable |
| Khóa dữ liệu | Khóa dữ liệu đã tính | Có dữ liệu đã tính chưa khóa |
| Nhập điều chỉnh | Cho phép override NS_TL cho NV cụ thể (manual adjustment) | Kỳ đã chọn + dữ liệu đã tính + chưa khóa |
| Xuất dữ liệu | Export grid ra Excel | Có dữ liệu hiển thị |

**Rule quan trọng:**
- Bấm "Tính lương NS" khi **chưa chọn Kỳ** → Blocking: "Vui lòng chọn Kỳ lương NS trước."
- Bấm "Tính lương NS" khi kỳ **đã khóa toàn bộ** → Blocking: "Kỳ này đã khóa. Mở khóa trước khi tính lại."
- Bấm "Tính lương NS" khi **thiếu thiết lập nhóm** cho 1 số ĐV cấp 5 → Warning: "[N] đơn vị cấp 5 chưa gán nhóm tính lương. Mặc định Loại A. Tiếp tục?"

---

### B.3 NÂNG CẤP: 1 TAB HAY 2 TAB – KHUYẾN NGHỊ

**Phân tích:**

| Tiêu chí | 2 Tab (Prototype hiện tại) | 1 Tab gộp |
|----------|---------------------------|-----------|
| Số cột grid | Tab 1: ~13 cột. Tab 2: ~10 cột. Mỗi tab vừa viewport | 1 grid ~20+ cột. Phải cuộn ngang nhiều |
| Mục đích sử dụng khác nhau | Tab 1: kiểm tra CNS input. Tab 2: xem kết quả NS tính lương (output) | Mọi thứ trộn lẫn, khó focus |
| Đối tượng quan tâm | Payroll Admin kiểm tra Tab 1 (input đúng chưa), rồi sang Tab 2 (kết quả) | |
| Nút Tính áp dụng | Tính xong → cả 2 tab đều có dữ liệu | Tính xong → 1 grid duy nhất |

**Khuyến nghị: Giữ 2 Tab nhưng điều chỉnh tên và nội dung**

| Tab | Tên mới | Nội dung | Mục đích |
|-----|---------|----------|----------|
| **Tab 1** | **Dữ liệu đầu vào & Phân chia PV** (CALC-NEW-01→06) | Cột: STT, Khóa, Mã NV, Họ tên, **Nhóm TL (A/B/C)**, Loại NV (SX/PV), Ka, Bàn, CTT, HST%, BSPV%, CNS_NV, CNS_Ban, GiamPV, SauGiamPV, CNS_Ka | Kiểm tra input + chia PV đúng chưa |
| **Tab 2** | **Kết quả NS tính lương** (CALC-NEW-07) | Cột: STT, Khóa, Mã NV, Họ tên, **Nhóm TL (A/B/C)**, Ka, Bàn, CĐ, NSTT, HSLD, NS_SauChiaPV, **NS_TL (trước redistribute)**, **NS_FINAL (sau redistribute)**, **Nguồn NS (Trực tiếp/Pool/Mapping)**, Đơn giá, Tiền NS | Xem kết quả cuối cùng + phân biệt A/B/C |

**Điểm thay đổi quan trọng so với prototype:**

1. **Thêm cột "Nhóm TL" (A/B/C) ở cả 2 tab** – Để user và Dev nhìn ngay biết engine route nhánh nào
2. **Tab 2 thêm cột "NS_FINAL"** – Khác với NS_TL: NS_FINAL là kết quả sau redistribution (Loại B) hoặc sau mapping (Loại C)
3. **Tab 2 thêm cột "Nguồn NS"** – Giá trị: `Trực tiếp` (Loại A), `Pool 70/30` (Loại B), `Mapping từ Bàn SX` (Loại C). Giúp audit

**Về nút Tính:** Bấm 1 nút "Tính lương NS" → engine chạy 7 bước (CALC-NEW-01→07) toàn bộ → kết quả hiện ở cả 2 tab. Không cần nút tính riêng cho mỗi tab.

---

### B.4 GRID CHI TIẾT – TAB 2 VỚI ĐẦY ĐỦ 4 TÌNH HUỐNG

Sau khi bấm "Tính lương NS" cho Ka Sáng, tháng 01/2026:

```
Tab 2: Kết quả NS tính lương (CALC-NEW-07)
Bộ phận PTO, Ka Sáng, CĐ: Lặt đầu tôm (PTO), tháng 01/2026

┌────┬─────┬───────┬──────────────┬────────┬───────┬────────┬──────┬──────┬───────┬─────────────┬──────────┬─────────┬──────────┬────────┐
│STT │Khóa │Mã NV  │Họ tên        │Nhóm TL │Loại NV│Ka      │Bàn   │NSTT  │NS_TL  │NS_FINAL     │Chênh lệch│Nguồn NS │Đơn giá  │Tiền NS │
│    │     │       │              │        │       │        │      │(Ban) │(CALC  │(Sau điều    │          │         │(VND/Kg) │(VND)   │
│    │     │       │              │        │       │        │      │      │-11/12)│chỉnh A/B/C) │          │         │         │        │
├────┼─────┼───────┼──────────────┼────────┼───────┼────────┼──────┼──────┼───────┼─────────────┼──────────┼─────────┼─────────┼────────┤
│  1 │  ✕  │NV001  │Nguyễn Văn An │  A     │ SX    │KaSáng  │Bàn 1 │ 500  │ 39.99 │   39.99     │   0.00   │Trực tiếp│  2,500  │ 99,975 │
│  2 │  ✕  │NV002  │Trần Minh Hải │  A     │ SX    │KaSáng  │Bàn 1 │ 500  │ 36.37 │   36.37     │   0.00   │Trực tiếp│  2,500  │ 90,925 │
├────┼─────┼───────┼──────────────┼────────┼───────┼────────┼──────┼──────┼───────┼─────────────┼──────────┼─────────┼─────────┼────────┤
│  3 │  ✕  │NV004  │Phạm Thị Lan  │  B     │ SX    │KaSáng  │Bàn 2 │ 400  │ 32.82 │   32.22     │  -0.60   │Pool     │  2,500  │ 80,550 │
│    │     │       │              │        │       │        │      │      │       │             │          │70/30    │         │        │
│  4 │  ✕  │NV005  │Đặng Hoàng Nam│  B     │ SX    │KaSáng  │Bàn 2 │ 400  │ 26.85 │   28.05     │  +1.20   │Pool     │  2,500  │ 70,125 │
│    │     │       │              │        │       │        │      │      │       │             │          │70/30    │         │        │
├────┼─────┼───────┼──────────────┼────────┼───────┼────────┼──────┼──────┼───────┼─────────────┼──────────┼─────────┼─────────┼────────┤
│  5 │  ✕  │NV003  │Lê Quốc Dũng  │  C     │ PV    │KaSáng  │BànHT │  —   │  —    │   19.04     │    —     │Mapping  │  2,500  │ 47,600 │
│    │     │       │              │        │       │        │      │      │       │             │          │9 bàn SX │         │        │
│  6 │  ✕  │NV006  │Võ Minh Trang  │  C     │ PV    │KaSáng  │BànHT │  —   │  —    │   17.29     │    —     │Mapping  │  2,500  │ 43,225 │
│    │     │       │              │        │       │        │      │      │       │             │          │9 bàn SX │         │        │
└────┴─────┴───────┴──────────────┴────────┴───────┴────────┴──────┴──────┴───────┴─────────────┴──────────┴─────────┴─────────┴────────┘

Tổng hợp theo Bàn:
┌────────┬────────┬───────┬─────────┬──────────┬──────────────┐
│ Bàn    │Nhóm TL │NSTT   │Tổng CNS │Tổng NS_TL│Tổng NS_FINAL │
├────────┼────────┼───────┼─────────┼──────────┼──────────────┤
│ Bàn 1  │ A      │ 500   │ 64.20   │  76.36   │   76.36      │
│ Bàn 2  │ B      │ 400   │ 62.40   │  59.67   │   60.27 (*)  │
│ Bàn 3  │ A      │ 300   │ 44.00   │  ...     │   ...        │
│ Bàn HT │ C      │  —    │ 46.20   │   —      │   36.33      │
├────────┼────────┼───────┼─────────┼──────────┼──────────────┤
│ TỔNG   │        │ 1,200 │ 216.80  │          │  ≈ 1,200 ✓   │
└────────┴────────┴───────┴─────────┴──────────┴──────────────┘
(*) Loại B: NS_FINAL ≠ NS_TL vì có redistribution
```

**Giải thích từng tình huống trong grid:**

| Tình huống | NV | Nhóm | Cách đọc kết quả |
|------------|-----|------|-------------------|
| **A – Trực tiếp** | NV001, NV002 | A | NS_FINAL = NS_TL. Chênh lệch = 0. Nguồn = "Trực tiếp". Làm bao nhiêu hưởng bấy nhiêu |
| **B – Chia nhóm** | NV004 | B | NS_TL = 32.82 → NS_FINAL = 32.22. **Chênh lệch = -0.60** (bị giảm vì chia 30% vào pool). Nguồn = "Pool 70/30" |
| **B – Chia nhóm** | NV005 | B | NS_TL = 26.85 → NS_FINAL = 28.05. **Chênh lệch = +1.20** (được bù thêm từ pool). Nguồn = "Pool 70/30" |
| **C – Làm dùm** | NV003, NV006 | C | NSTT = "—" (không nhập sản lượng). NS_TL = "—" (không tính trực tiếp). **NS_FINAL = 19.04** (nhận từ mapping 9 bàn SX). Nguồn = "Mapping 9 bàn SX" |

---

### B.5 CÔNG THỨC CALC CHI TIẾT – TỪ DỮ LIỆU MẪU

#### CALC-00: Xác định loại Bàn

```sql
-- Pseudo-code
FOR EACH ban IN ka_scope:
    SELECT salary_type
    FROM UNIT_GROUP_ASSIGNMENT uga
    JOIN UNIT_GROUP_CATEGORY ugc ON uga.group_id = ugc.id
    WHERE uga.org_unit_id = ban.id
      AND uga.effective_date <= ky.end_date
      AND (uga.end_date IS NULL OR uga.end_date >= ky.start_date)
    ORDER BY uga.effective_date DESC LIMIT 1

    IF NOT FOUND → salary_type = 'A' + WARNING
```

Kết quả: Bàn 1 = A, Bàn 2 = B, Bàn 3 = A, Bàn HT = C

#### CALC-01→07: Không thay đổi (chạy cho tất cả Bàn A + B)

(Giữ nguyên như v4.1: CTT → CNS_SX/PV → CNS_Ban → CNS_Ka → GiamPV → SauGiamPV)

#### CALC-08→11: Không thay đổi

(HSLD → NS_SauChiaPV → NS_TL_SX cho từng NV)

**Lưu ý:** Bàn Loại C **KHÔNG chạy** CALC-08→11 vì không có NSTT.

#### CALC-13 (MỚI): Redistribution – Chỉ cho Bàn Loại B

```
Input:  NS_TL_SX[] từ CALC-11, pct_keep từ thiết lập
Output: NS_FINAL[]

FOR EACH ban WHERE salary_type = 'B':
    pct_keep = config.pct_keep (VD: 70)
    pct_share = 100 - pct_keep (VD: 30)
    
    Pool = 0
    FOR EACH nv IN ban:
        NS_Keep[nv] = NS_TL_SX[nv] × pct_keep / 100
        Pool += NS_TL_SX[nv] × pct_share / 100
    
    N = COUNT(nv IN ban)
    NS_Share = Pool / N    -- Need Confirm: chia đều hay theo hệ số?
    
    FOR EACH nv IN ban:
        NS_FINAL[nv] = NS_Keep[nv] + NS_Share
    
    -- Validate
    ASSERT SUM(NS_FINAL) ≈ SUM(NS_TL_SX)  -- tolerance 0.01
```

#### CALC-14 (MỚI): NS cho Bàn Loại C

```
Input:  GiamPV[] từ CALC-06, SUPPORT_UNIT_MAPPING, CNS_NV từ CALC-03
Output: NS_FINAL[] cho NV trong Bàn HT

FOR EACH ban_ht WHERE salary_type = 'C':
    -- Lấy danh sách Bàn SX được mapping
    sx_list = SELECT target_unit_id FROM SUPPORT_UNIT_MAPPING
              WHERE support_unit_id = ban_ht.id
              AND effective_date <= ky.end_date
    
    -- Tổng NS từ các Bàn SX
    TotalGiamPV = SUM(GiamPV[ban_sx]) FOR ban_sx IN sx_list
    
    -- Chia cho NV trong Bàn HT theo tỷ lệ CNS
    Total_CNS_HT = SUM(CNS_NV[nv]) FOR nv IN ban_ht
    
    FOR EACH nv IN ban_ht:
        NS_FINAL[nv] = TotalGiamPV × (CNS_NV[nv] / Total_CNS_HT)
    
    -- Validate
    ASSERT SUM(NS_FINAL) ≈ TotalGiamPV  -- tolerance 0.01
```

#### Trường hợp Bàn chưa gán nhóm (Default)

```
IF salary_type NOT FOUND:
    salary_type = 'A'  -- default Trực tiếp
    NS_FINAL[nv] = NS_TL_SX[nv]  -- không thay đổi
    LOG WARNING: "ĐV cấp 5 [X] chưa gán nhóm, mặc định Loại A"
```

---

### B.6 SUMMARY CARDS NÂNG CẤP

Prototype hiện tại: `Tổng NV: 6 | NV SX: 4 | NV PV: 2 | Tổng NS TL: 194.15 Kg | Đã khóa: 0`

**Đề xuất bổ sung:**

```
Tổng NV    NV SX    NV PV    Loại A    Loại B    Loại C    Tổng NS_FINAL    Đã khóa
  6          4        2        2 NV      2 NV      2 NV     194.15 Kg          0
```

Thêm 3 card phân theo Loại (A/B/C) số NV, giúp user nhanh chóng verify thiết lập.

---

## PHẦN C: OPEN POINTS CẬP NHẬT

| OP ID | Câu hỏi | Ngữ cảnh | Priority |
|-------|---------|----------|----------|
| OP-NEW-01 | Bàn HT (Loại C) có được mapping Bàn SX **khác Ka** không? | Ảnh hưởng filter "Làm dùm cho" trong popup + CALC-14 | Must |
| OP-NEW-02 | Pool Loại B chia **đều** hay chia **theo hệ số CNS**? | Ảnh hưởng CALC-13 bước chia Pool | Must |
| OP-NEW-03 | 1 Bàn SX bị nhiều Bàn HT mapping: chia GiamPV thế nào? | Ảnh hưởng CALC-06 + CALC-14 | Must |
| OP-NEW-04 | Cơ chế chia nhóm Loại B: % cụ thể? Thay đổi theo tháng? Xin ví dụ số thực tế | CALC-13 | Must (Blocking) |
| OP-NEW-05 | Bàn HT (Loại C) thay thế hoàn toàn OP-21b PA1 (NV PV không có Bàn)? | Kiến trúc CALC | Must |
| OP-NEW-06 | 400 ĐV chưa gán: default Loại A hay block tính? | Migration | High |
| OP-NEW-08 | Nút "Nhập điều chỉnh" cho phép override giá trị NS_FINAL nào? Chỉ admin? Có lưu log? | UI + Permission | Should |
| OP-01 | Xác nhận Bộ phận=cấp 3, Ka=cấp 4, Bàn=cấp 5 | Toàn bộ engine | Must |

---

## PHẦN D: PLAN THỰC HIỆN

| Sprint | Deliverable | Estimate |
|--------|-------------|----------|
| **S1** | Popup nâng cấp (grouped checkbox, search, cross-Ka) + Grid cải tiến (cột Ka, truncate Loại C) + Import | 3 tuần |
| **S2** | Xác định loại (A/B/C) + Điều chỉnh 7 bước mới + Grid Tab 2 thêm cột Nhóm TL, NS_FINAL, Nguồn NS | 3 tuần |
| **S3** | Flow "Tính → Xem" đúng (grid rỗng ban đầu) + Summary cards nâng cấp | 2 tuần |
| **S4** | Integration test + Migration 400 ĐV + Chạy song song 1 kỳ + Fix edge cases | 2 tuần |
