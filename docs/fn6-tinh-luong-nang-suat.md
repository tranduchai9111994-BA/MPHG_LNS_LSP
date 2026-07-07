# Chức năng: Tính Lương Năng Suất (fn6)

**Mã chức năng:** fn6  
**File:** `lns/fn6-tinh-lns.html`  
**Menu:** LNS · Chức năng → Tính Lương Năng Suất  
**Breadcrumb:** Lương › Tính Lương năng suất › Tính lương năng suất

---

## 1. Mô tả tổng quan

Chức năng tính lương năng suất (NS) cho nhân viên theo 3 trường hợp: **TH2, TH3, TH4** (TH1 dùng hệ thống riêng, không hiển thị).

- **Bán tự động:** Dữ liệu Công NS sẵn sàng từ fn9 (Công năng suất). User chọn bộ lọc → bấm "Tính lương NS".
- **Tích hợp Khóa/Mở khóa** theo từng nhóm NS (thay thế form fn8 đã xóa).
- **Popup chi tiết logic:** Fullscreen, hiển thị toàn bộ NV trong nhóm với công thức từng bước giống Excel.
- **Xuất phiếu NS cá nhân:** PDF preview cho từng NV.
- **Cảnh báo bất thường:** Tự động phát hiện anomaly.

### Các trường hợp tính NS

| TH | Tên | Mô tả | Công thức |
|----|-----|-------|-----------|
| TH2 | Chung 1 ĐV cấp 5 | Tất cả NV cùng 1 ĐV chia NS theo CNS | `NS_TL = NSTT × (CNS_NV / CNS_Tổng)` |
| TH3 | Chung nhiều ĐV cấp 5 | Nhiều ĐV cấp 5 chung 1 nhóm NS | `NS_TL = NSTT × (CNS_NV / CNS_Tổng)` |
| TH4 | Tách Phục vụ | SX nhận NS sau trích PV, PV nhận phần trích | SX: `NS_TL = NS_Sau_Giảm × (CNS_NV / CNS_SX)`, PV: `NS_TL = NS_Giảm_PV × (CNS_NV / CNS_PV)` |

### Thuật ngữ

| Viết tắt | Ý nghĩa |
|----------|---------|
| CTT | Công thực tế (từ chấm công) |
| HST | Hệ số tay lương (%) |
| BSPV | % Bổ sung phục vụ |
| CNS | Công năng suất = CTT × (HST/100). PV có HST≥100: CNS = CTT × (HST/100 + BSPV/100) |
| NSTT | Năng suất thực tế nhóm (Kg) — sản lượng tổng nhập cho nhóm NS |
| NS_TL | Năng suất tính lương (Kg) — phần chia cho từng NV |
| NS_FINAL | Kết quả NS cuối cùng (= NS_TL) |
| Nhóm NS | Nhóm tính lương NS (từ fn7), VD: NS-001, NS-002... |

---

## 2. Bộ lọc (Filter Panel)

### 2.1. Hàng 1 (Grid 4 cột)

| # | Trường | ID | Loại | Bắt buộc | Mô tả | Giá trị mặc định |
|---|--------|----|------|----------|-------|-------------------|
| 1 | **Tháng** | `fn6-thang` | Text input | **Có** ★ | Tháng tính lương, format MM/YYYY | `07/2026` |
| 2 | Công ty | `fn6-cty` | Dropdown | Có | Mã công ty | `MPHG` |
| 3 | Level 1 | `fn6-l1` | Dropdown | Có | Bộ phận cấp 1 | `Bộ phận PTO` |
| 4 | Level 2 | `fn6-l2` | Dropdown | Có | Bộ phận cấp 2 | `Ka` |

### 2.2. Hàng 2 (Flex row)

| # | Trường | ID | Loại | Bắt buộc | Mô tả | Giá trị mặc định |
|---|--------|----|------|----------|-------|-------------------|
| 5 | Level 3 | `fn6-l3` | Dropdown | Không | Ca làm việc | `-- Tất cả --` |
| 6 | Level 4 | `fn6-l4` | Dropdown | Không | Phân nhóm cấp 4 | `-- Tất cả --` |
| 7 | Level 5 | `fn6-l5` | Dropdown | Không | Đơn vị cấp 5 | `-- Tất cả --` |
| 8 | Nhân viên | `fn6-nv` | Text input | Không | Tìm theo mã hoặc tên NV | Trống |
| 9 | Trường hợp | `fn6-th` | Dropdown | Không | Lọc theo TH | `-- Tất cả --` (TH2, TH3, TH4) |
| 10 | Trạng thái | `fn6-lock-filter` | Dropdown | Không | Lọc theo trạng thái khóa | `-- Tất cả --` (Đã khóa, Chưa khóa) |

### 2.3. Ràng buộc bộ lọc

- **Tháng bắt buộc** — nếu trống, bấm "Tính lương NS" hoặc "Xem dữ liệu" sẽ hiện alert lỗi.
- Level 1 → 2 → 3 → 4 → 5: cascade phụ thuộc.
- Trường hợp: chỉ lọc hiển thị, không ảnh hưởng engine.
- Trạng thái: lọc theo nhóm NS đã khóa / chưa khóa.

---

## 3. Thanh hành động (Action Bar)

| # | Nút | Class | Mô tả | Validate |
|---|-----|-------|-------|----------|
| 1 | **⚡ Tính lương NS** | `btn-calc` | Chạy engine tính NS cho tất cả NV theo bộ lọc. Render kết quả. | Tháng bắt buộc |
| 2 | **🔍 Xem dữ liệu** | `btn-view` | Load kết quả đã tính gần nhất (không tính lại) | Tháng bắt buộc |
| 3 | **🔄 Làm mới** | `btn-refresh` | Reset toàn bộ: xóa dữ liệu, stat cards, anomaly, grid | Không |
| 4 | **🔒 Khóa tất cả** | `btn-lock` | Khóa tất cả nhóm NS | Phải có dữ liệu |
| 5 | **🔓 Mở khóa tất cả** | `btn-unlock` | Mở khóa tất cả nhóm NS | Phải có dữ liệu |
| 6 | **📥 Xuất Excel** | `btn-export` | Xuất toàn bộ grid kết quả ra Excel | Phải có dữ liệu |
| 7 | **📄 Xuất phiếu NS** | `btn-pdf` | Xuất phiếu NS cá nhân cho tất cả NV (batch) | Phải có dữ liệu |

---

## 4. Thanh trạng thái (Status Bar)

| Trạng thái | Class | Mô tả |
|------------|-------|-------|
| Chưa tính | `empty` | Nền vàng, icon ⏳. "Chưa tính. Vui lòng chọn bộ lọc và bấm Tính lương NS." |
| Đã tính | `ready` | Nền xanh, icon ✅. "Đã tính xong lúc HH:MM:SS. Tổng X NV." |
| Xem dữ liệu | `ready` | Nền xanh, icon 📋. "Hiển thị dữ liệu đã tính. Tổng X NV." |

---

## 5. Bảng cảnh báo bất thường (Anomaly Panel)

Hiển thị khi có anomaly sau khi tính. Nền vàng, tự động ẩn khi không có.

### Các loại cảnh báo

| Loại | Tag | Điều kiện | Message |
|------|-----|-----------|---------|
| LỖI | 🔴 | NV có CTT > 0 nhưng NS_FINAL = 0 | "NS_FINAL = 0 nhưng CTT = X. Kiểm tra HST%." |
| CẢNH BÁO | 🟡 | NS_FINAL > 150% so với TB nhóm | "NS_FINAL = X Kg, cao hơn 50% so với TB nhóm (Y Kg)." |
| LỖI | 🔴 | NSTT nhóm ≠ Σ NS_FINAL (chênh > 1 Kg) | "Mất cân bằng: NSTT = X, Σ NS_FINAL = Y, chênh lệch Z Kg." |

---

## 6. Thẻ thống kê (Stat Cards)

7 thẻ, cập nhật tự động sau khi tính:

| # | Thẻ | ID | Mô tả | Màu |
|---|-----|----|-------|-----|
| 1 | Tổng NV | `fn6-s-nv` | Tổng số nhân viên | Xanh dương |
| 2 | NV Sản xuất | `fn6-s-sx` | Số NV có vai trò SX | Xanh lá |
| 3 | NV Phục vụ | `fn6-s-pv` | Số NV có vai trò PV | Tím |
| 4 | TH2 | `fn6-s-th2` | Số NV thuộc TH2 + label "NV" | Cam |
| 5 | TH3 | `fn6-s-th3` | Số NV thuộc TH3 + label "NV" | Xanh cyan |
| 6 | TH4 | `fn6-s-th4` | Số NV thuộc TH4 + label "NV" | Đỏ |
| 7 | Tổng NS_FINAL | `fn6-s-ns` | Σ NS_FINAL tất cả NV + " Kg" | Đen |

---

## 7. Tabs

3 tab chính:

| Tab | ID | Tên | Mô tả |
|-----|----|-----|-------|
| `result` | `fn6-tab-result` | ⭐ Kết quả NS tính lương | Grid chi tiết NS từng NV. **Tab mặc định** |
| `group` | `fn6-tab-group` | 📊 Tổng hợp theo nhóm NS | Card view, mỗi thẻ = 1 nhóm NS |
| `lock` | `fn6-tab-lock` | 🔒 Khóa / Mở khóa | Grid quản lý khóa/mở khóa theo nhóm |

---

## 8. Tab 1: Kết quả NS tính lương

### 8.1. Header lưới (2 dòng)

**Dòng 1 — Cột thông tin (nền vàng #f4d03f):**

| # | Cột | Min width | Mô tả |
|---|-----|-----------|-------|
| 1 | STT | 30px | Số thứ tự |
| 2 | (nút 🔍) | 30px | Nút xem chi tiết logic — mở popup fullscreen |
| 3 | (nút 📄) | 30px | Nút xuất phiếu NS cá nhân — mở popup PDF |
| 4 | Mã NV | 55px | Mã nhân viên |
| 5 | Họ tên | 120px | Họ tên, căn trái. Kèm icon ⚠️ nếu có anomaly |
| 6 | TH | 45px | Badge trường hợp: TH2 (xanh lá), TH3 (xanh dương), TH4 (đỏ nhạt) |
| 7 | Loại | 35px | Badge loại: A (xanh) hoặc B (vàng) |
| 8 | Vai trò | 30px | Badge vai trò: SX (xanh) hoặc PV (tím) |
| 9 | Nhóm NS | 75px | Mã nhóm NS + tên nhóm (dòng nhỏ bên dưới) |
| 10 | Level 5 | 45px | Mã ĐV cấp 5 |
| 11 | Khóa | 35px | Badge: ✓ (đã khóa, xanh) hoặc — (chưa khóa, vàng) |

**Dòng 1 — Cột Công NS cá nhân (nền xanh dương #2980b9):**

| # | Cột | Dòng 2 header | Mô tả |
|---|-----|---------------|-------|
| 12 | CTT | CTT | Công thực tế |
| 13 | % | % | Hệ số tay lương (HST%) |
| 14 | CNS | CNS | Công năng suất = CTT × (HST/100). **Bold** |

**Dòng 1 — Cột Sản lượng (nền cam #e67e22):**

| # | Cột | Dòng 2 header | Mô tả |
|---|-----|---------------|-------|
| 15 | NSTT nhóm | NSTT nhóm | Sản lượng tổng nhóm NS (Kg) |
| 16 | NS giảm PV | NS giảm PV | Phần trích cho PV (chỉ TH4, còn lại "—") |
| 17 | NS sau giảm | NS sau giảm | Sản lượng sau trích PV |

**Cột kết quả (nền đỏ #c0392b):**

| # | Cột | Mô tả |
|---|-----|-------|
| 18 | **NS_FINAL (Kg) ⭐** | Kết quả cuối cùng. **Bold, đỏ, font lớn 12px** |

**Cột nguồn:**

| # | Cột | Mô tả |
|---|-----|-------|
| 19 | Nguồn | Mô tả nguồn: "Chia theo ĐV", "Chia nhiều ĐV", "SX (sau trích PV)", "PV (nhận trích)" |

### 8.2. Row styles

| Điều kiện | Class | Style |
|-----------|-------|-------|
| Có anomaly | `row-anomaly` | Nền vàng nhạt |
| Đã khóa | `row-locked` | Nền xám nhạt |
| Bình thường | — | Nền trắng, hover xanh nhạt |

### 8.3. Nút hành động trên mỗi dòng

| Nút | Vị trí | Hành động |
|-----|--------|-----------|
| 🔍 | Cột 2 | Mở popup chi tiết logic fullscreen cho NV đó |
| 📄 | Cột 3 | Mở popup phiếu NS cá nhân (PDF preview) |

---

## 9. Tab 2: Tổng hợp theo nhóm NS

Hiển thị dạng **card grid** (auto-fill, min 280px/card).

### Mỗi thẻ nhóm NS chứa:

| Thành phần | Mô tả |
|------------|-------|
| Header | Mã nhóm — Tên nhóm + Badge TH |
| Border left | Màu theo TH: TH2=xanh lá, TH3=xanh dương, TH4=đỏ |
| Số NV | X (Y SX + Z PV) |
| Level 5 | Danh sách mã L5, phân cách bằng dấu phẩy |
| NSTT | Sản lượng tổng nhóm (Kg) |
| Σ NS_FINAL | Tổng NS_FINAL tất cả NV trong nhóm (Kg) |
| Cân bằng | ✅ OK (xanh) nếu chênh < 1 Kg, ❌ Chênh X Kg (đỏ) nếu > 1 Kg |
| NS giảm PV | Chỉ hiển thị với TH4 |
| Lock status | "Đã khóa ✓" hoặc "Chưa khóa" |
| Nút khóa/mở | 🔒 Khóa hoặc 🔓 Mở khóa |

---

## 10. Tab 3: Khóa / Mở khóa

### 10.1. Lưới quản lý khóa

| # | Cột | Mô tả |
|---|-----|-------|
| 1 | ☑ | Checkbox chọn nhóm. Header có "check all" |
| 2 | Nhóm NS | Mã nhóm, bold |
| 3 | Tên nhóm | Tên đầy đủ, căn trái |
| 4 | TH | Badge TH2/TH3/TH4 |
| 5 | Số NV | Số nhân viên trong nhóm |
| 6 | NSTT (Kg) | Sản lượng tổng nhóm |
| 7 | Σ NS_FINAL | Tổng NS cuối cùng |
| 8 | Cân bằng | ✅ OK hoặc ❌ + giá trị chênh |
| 9 | Trạng thái | Badge "✓ Đã khóa" (xanh) hoặc "— Chưa khóa" (vàng) |
| 10 | Thao tác | Nút 🔒 Khóa / 🔓 Mở |

### 10.2. Nút dưới grid

| Nút | Mô tả |
|-----|-------|
| 🔒 Khóa nhóm đã chọn | Khóa các nhóm được tick checkbox |
| 🔓 Mở khóa nhóm đã chọn | Mở khóa các nhóm được tick |

### 10.3. Ràng buộc khóa/mở khóa

- Nhóm đã khóa: NV thuộc nhóm không cho phép tính lại.
- Mở khóa: cần quyền quản lý.
- Khi khóa/mở khóa: tự động cập nhật trạng thái ở Tab 1 (cột Khóa, row style) và Tab 2 (thẻ nhóm).

---

## 11. Popup chi tiết logic (Fullscreen Modal)

**Kích thước:** 95vw × 92vh, overlay tối.

### 11.1. Header

- Nền xanh dương, tiêu đề: "🔍 Chi tiết logic — {Nhóm NS} — [{TH}] — Đang xem: {Mã NV} {Tên}"
- Nút đóng ×

### 11.2. Body — Các section theo TH

#### Chung cho tất cả TH:

| Section | Badge | Nội dung |
|---------|-------|----------|
| Thông tin nhóm NS | INFO | Nhóm NS, TH, Level 5, Số NV (SX+PV), NSTT, NV đang xem (highlight vàng) |
| Bước 1: CNS tất cả NV | CALC-01 | Bảng liệt kê **tất cả NV** trong nhóm: STT, Mã NV, Họ tên, Level 5, Vai trò, CTT, HST%, BSPV%, Công thức, CNS. Dòng tổng CNS nhóm. NV đang xem được **highlight nền vàng**. |
| Kết quả NS_FINAL | FINAL | Giá trị lớn (28px, đỏ), nguồn, tỷ trọng % |
| Kiểm chứng tổng nhóm | VERIFY | NSTT vs Σ NS_FINAL, OK/Chênh lệch, NS NV đang xem |

#### TH2 / TH3 thêm:

| Section | Badge | Nội dung |
|---------|-------|----------|
| Bước 2: Chia NS theo CNS | CALC-02 | Bảng tất cả NV: STT, Mã NV, Họ tên, Level 5, Vai trò, CNS, CNS/Tổng, Công thức, NS_TL. Dòng tổng. NV đang xem highlight. |

#### TH4 thêm:

| Section | Badge | Nội dung |
|---------|-------|----------|
| Bước 2: Trích PV | CALC-02 | Công thức NS_Giảm_PV, NS_Sau_Giảm. Bảng hạng mục giá trị. |
| Bước 3a: Chia NS cho SX | CALC-03a | Bảng NV SX: STT, Mã NV, Họ tên, Level 5, CNS, CNS/CNS_SX, Công thức, NS_TL. Dòng tổng SX. |
| Bước 3b: Chia NS cho PV | CALC-03b | Bảng NV PV: STT, Mã NV, Họ tên, Level 5, CNS, CNS/CNS_PV, Công thức, NS_TL. Dòng tổng PV. |

### 11.3. Footer

| Nút | Mô tả |
|-----|-------|
| 📥 Xuất Excel chi tiết | Xuất file CSV chi tiết nhóm NS đang xem (UTF-8 BOM, mở được bằng Excel) |
| 📄 Xuất phiếu PDF | Đóng popup chi tiết |
| Đóng | Đóng popup |

### 11.4. Phím tắt

- **Escape:** Đóng popup

---

## 12. Popup phiếu NS cá nhân (PDF Preview)

**Kích thước:** 800px width, max 90vh height.

### Nội dung phiếu

| Phần | Nội dung |
|------|----------|
| Tiêu đề | "PHIẾU NĂNG SUẤT CÁ NHÂN" |
| Phụ đề | Tên công ty + Tháng |
| Thông tin NV | Mã NV, Họ tên, TH, Vai trò, Nhóm NS, Level 5 |
| Chi tiết tính toán | CTT, HST%, BSPV%, CNS, CNS tổng nhóm, NSTT, NS giảm PV (TH4), NS sau giảm (TH4) |
| Kết quả | NS_FINAL (font lớn, đỏ, bold), Nguồn, Tỷ trọng % |
| Ký tên | 3 ô: Người lập, Quản lý bộ phận, Nhân viên xác nhận |

### Footer popup

| Nút | Mô tả |
|-----|-------|
| 🖨️ In / Lưu PDF | Gọi `window.print()` |
| Đóng | Đóng popup |

---

## 13. Phân trang (Pager)

| Thành phần | Mô tả |
|------------|-------|
| Showing | "Hiển thị X / Y nhân viên" |
| Số dòng | Dropdown: 50, **100** (mặc định), 200, Tất cả |

---

## 14. Engine tính NS (fn6CalcEngine)

### 14.1. Luồng tính

```
Bước 1: Generate mock NV → gắn nhóm NS, vai trò (SX/PV), Level 5
Bước 2: Tính CNS cho từng NV
         - SX: CNS = CTT × (HST / 100)
         - PV (HST ≥ 100): CNS = CTT × (HST/100 + BSPV/100)
         - PV (HST < 100): CNS = CTT × 1.0
Bước 3: Tổng hợp CNS theo nhóm (cns_sx, cns_pv, cns_total)
Bước 4: Gán NSTT cho từng nhóm (từ nhập sản lượng)
Bước 5: TH4 — Tính trích PV
         - NS_Giảm_PV = NSTT × (CNS_PV / CNS_Tổng)
         - NS_Sau_Giảm = NSTT − NS_Giảm_PV
Bước 6: Chia NS cho từng NV
         - TH2/TH3: NS_TL = NSTT × (CNS_NV / CNS_Tổng)
         - TH4-SX: NS_TL = NS_Sau_Giảm × (CNS_NV / CNS_SX)
         - TH4-PV: NS_TL = NS_Giảm_PV × (CNS_NV / CNS_PV)
Bước 7: NS_FINAL = NS_TL
Bước 8: Cross-check — NSTT phải = Σ NS_FINAL
Bước 9: Anomaly detection
```

### 14.2. Ràng buộc kinh doanh

| Rule | Mô tả |
|------|-------|
| NSTT = Σ NS_FINAL | Tổng NS cuối cùng phải bằng NSTT nhóm (chênh < 1 Kg chấp nhận do làm tròn) |
| PV chỉ nhận trích từ TH4 | TH2/TH3 không có bước trích PV |
| HST < 100 PV dùng CNS = CTT | PV có HST thấp không được bonus BSPV |
| Nhóm đã khóa không tính lại | Engine check trạng thái khóa trước khi tính |

---

## 15. Validate tổng hợp

| Rule | Điều kiện | Xử lý |
|------|-----------|-------|
| Tháng bắt buộc | `fn6-thang` trống | Alert error, không chạy engine |
| Phải có dữ liệu | Bấm Khóa/Xuất khi chưa tính | Không thực hiện (FN6_DATA = null) |
| HST trong khoảng hợp lý | HST = 0 → CNS = 0 → NS = 0 | Anomaly alert |
| Cross-check mất cân bằng | NSTT ≠ Σ NS_FINAL > 1 Kg | Anomaly error |

---

## 16. Luồng nghiệp vụ tổng thể

```
1. fn9: Công NS sẵn sàng (CTT × % = CNS)
2. fn7: Thiết lập nhóm NS (gắn ĐV cấp 5 vào nhóm, xác định TH)
3. fn5/fn5b: Nhập sản lượng (NSTT) theo nhóm NS
4. fn6: User chọn bộ lọc → bấm "Tính lương NS"
   4.1. Engine lấy CNS từ fn9, NSTT từ fn5
   4.2. Tính NS_TL theo TH2/TH3/TH4
   4.3. Kiểm tra anomaly
   4.4. Hiển thị kết quả
5. User kiểm tra: popup chi tiết, xuất Excel, đối chiếu
6. User khóa nhóm NS → không cho tính lại
7. Kết quả NS_FINAL dùng cho module tính lương
```

---

## 17. Báo cáo check NS (bc5)

**File:** `lns/bc5-check-ns.html`  
**Menu:** LNS · Báo cáo → Báo cáo check NS tính lương

Báo cáo riêng để kiểm tra, có 3 tab cho TH2/TH3/TH4, mỗi tab hiển thị đầy đủ cột trung gian giống Excel. Hỗ trợ xuất CSV từng TH hoặc tất cả để đối chiếu.
