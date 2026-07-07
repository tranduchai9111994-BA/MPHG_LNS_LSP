# LƯƠNG NĂNG SUẤT (LNS) – Tài liệu Logic & Chức năng

> Hệ thống: MINH PHU (MPHG / MPCA) | Module: Lương › Tính Lương Năng Suất

---

## 1. TỔNG QUAN MODULE

Module LNS (Lương Năng Suất) tính toán năng suất tính lương (Kg/Con) cho từng nhân viên sản xuất theo kỳ tháng. Kết quả NS_FINAL là **đầu vào bắt buộc** cho module Lương Sản Phẩm (LSP).

### Luồng xử lý chính
```
TẠO KỲ (fn1)
    ↓
THIẾT LẬP NHÓM ĐV (fn7)  ←  DM hệ số, BSPV, Nhóm loại tôm...
    ↓
NHẬP DỮ LIỆU ĐẦU VÀO
  ├─ fn2: Công thực tế (lấy từ chấm công)
  ├─ fn3: % Hệ số NV theo tháng
  ├─ fn4: % Bổ sung phục vụ (BSPV)
  ├─ fn5: Năng suất chung theo bộ phận (NSTT Bàn)
  └─ fn5b: Năng suất riêng theo nhân viên
    ↓
TÍNH NĂNG SUẤT (fn6) – Engine 7 bước CALC-NEW-01 → 07
    ↓
KHÓA / MỞ KHÓA (fn8)
    ↓
OUTPUT → NS_FINAL → LSP
```

---

## 2. DANH MỤC CHỨC NĂNG

| Mã file | Tên chức năng | Nhóm |
|---------|---------------|------|
| fn1 | Tạo kỳ tính năng suất | Quản lý kỳ |
| fn2 | Công thực tế | Dữ liệu đầu vào |
| fn3 | % Hệ số NV theo tháng | Dữ liệu đầu vào |
| fn4 | % Bổ sung phục vụ (BSPV) | Dữ liệu đầu vào |
| fn5 | Năng suất chung theo bộ phận | Dữ liệu đầu vào |
| fn5b | Năng suất riêng theo nhân viên | Dữ liệu đầu vào |
| fn6 | Tính lương năng suất (Engine chính) | Tính toán |
| fn7 | Thiết lập nhóm tính lương NS | Cấu hình |
| fn8 | Mở khóa lương năng suất | Quản lý khóa |
| bc0 | Báo cáo công năng suất | Báo cáo |
| bc1 | Chi tiết công NS | Báo cáo |
| bc2 | Chi tiết NV theo ngày | Báo cáo |
| bc3 | Chi tiết NV theo tháng | Báo cáo |
| bc4 | Tổng hợp thành phẩm | Báo cáo |
| sys1 | Cấu hình HSLD / tiêu chí tìm kiếm | Hệ thống |
| sys2/3/4 | BSPV theo tháng | Hệ thống |

---

## 3. CHI TIẾT TỪNG CHỨC NĂNG

### 3.1 FN1 – Tạo kỳ tính năng suất

**Breadcrumb:** Lương › Tính Lương năng suất › Tạo kỳ tính năng suất

**Ràng buộc quan trọng:** Kỳ LNS phải được tạo TRƯỚC KHI nhập bất kỳ dữ liệu đầu vào nào.

#### Trường dữ liệu
| Trường | Bắt buộc | Rule |
|--------|----------|------|
| Tháng tính | ✅ | Format MM/yyyy |
| Từ ngày | ✅ | Mặc định = ngày 1 của tháng (auto-fill) |
| Đến ngày | ✅ | Phải ≥ Từ ngày; mặc định = ngày cuối tháng |
| Ghi chú | ❌ | Tùy chọn |

#### Logic nghiệp vụ
- **Auto-fill:** Khi nhập Tháng hợp lệ → tự động điền Từ ngày và Đến ngày.
- **Validate khi lưu:**
  - Thiếu Tháng / Từ ngày / Đến ngày → lỗi.
  - Tháng sai format → lỗi.
  - Từ ngày > Đến ngày → lỗi.
- **Xóa:** Yêu cầu xác nhận; xóa kỳ đồng thời xóa toàn bộ dữ liệu tính toán liên quan.
- **Sửa:** Tháng trở thành read-only khi sửa (không được đổi tháng).

---

### 3.2 FN2 – Công thực tế (CTT)

**Breadcrumb:** Lương › Tính lương năng suất › Nhập dữ liệu › Công thực tế

- Dữ liệu được **kéo tự động từ module Chấm công** (không nhập tay).
- Hiển thị: Mã NV, Họ tên, Bộ phận / Ka / Bàn, **Ngày công thực tế (CTT)**, Nguồn kỳ chấm công.
- Có nút "Cập nhật dữ liệu chấm công" để đồng bộ lại.
- CTT là đầu vào của CALC-NEW-01 (tính CNS_NV).

---

### 3.3 FN3 – % Hệ số NV theo tháng (HST)

**Breadcrumb:** Lương › Tính Lương năng suất › Nhập dữ liệu › % Hệ số

#### Trường dữ liệu
| Trường | Bắt buộc | Rule |
|--------|----------|------|
| Tháng (Kỳ NS) | ✅ | Format MM/yyyy |
| Mã nhân viên | ✅ | Tự động tra cứu tên sau khi blur |
| % Hệ số (HST) | ❌ | 0–200%; để trống = mặc định 100% |
| Ghi chú | ❌ | |

#### Logic nghiệp vụ
- **Default:** Không nhập HST → hệ thống dùng 100%.
- **Validate:** HST ngoài 0–200% → cảnh báo, hỏi xác nhận trước khi lưu.
- **CRUD:** Thêm mới, Sửa, Xóa, Import Excel (upsert theo Mã NV + Kỳ).
- **Import rule:** Cột bắt buộc = Mã NV + Tháng; HST để trống = bỏ qua (không ghi đè NULL).
- HST được dùng trong CALC-NEW-01 & CALC-NEW-03.

---

### 3.4 FN4 – % Bổ sung phục vụ (BSPV)

**Breadcrumb:** Lương › Tính Lương năng suất › % Bổ sung Phục vụ

#### Trường dữ liệu
| Trường | Bắt buộc | Rule |
|--------|----------|------|
| Tháng (kỳ NS) | ✅ | |
| Đơn vị cấp 1–7 | tuỳ | Cascade dropdown |
| Bộ phận tính lương | | |
| % Bổ sung PV (BSPV) | ✅ | Nhập số % |
| Ghi chú | ❌ | |

- BSPV được dùng trong CALC-NEW-03 cho nhân viên Phục vụ (PV).
- Cấu hình theo đơn vị, áp dụng cho tất cả NV PV trong đơn vị đó.

---

### 3.5 FN5 – Năng suất chung theo bộ phận (NSTT Bàn)

**Breadcrumb:** Lương › Tính Lương năng suất › Nhập năng suất chung theo bộ phận

Đây là **sản lượng thực tế (NSTT) của cả bàn** – dùng cho Loại A và B.

#### Các trường dữ liệu chính
| Trường | Bắt buộc | Mô tả |
|--------|----------|-------|
| Mã bộ phận | ✅ | |
| Ka LV | ✅ | Ca làm việc |
| Ngày LV | ✅ | Ngày làm việc |
| Mã nội bộ | ✅ | Mã sản phẩm |
| Khối lượng (KL) | ✅ | Sản lượng thực tế |
| Đơn vị tính | ✅ | kg / con / khay / thung |
| NS Làm | ✅ | 1=Trong ca, 2=Ca đêm, 3=Tăng ca, 4=Tăng ca đêm |
| Quy cách SX / Quy cách TL | | Mã quy cách để mapping đơn giá |

#### Validate
- Đơn vị tính không khớp cấu hình công đoạn → **Lỗi chặn lưu**.
- Ví dụ: công đoạn "May tay áo" yêu cầu đơn vị "con"; nếu nhập "kg" → lỗi.

---

### 3.6 FN5B – Năng suất riêng theo nhân viên

**Breadcrumb:** Lương › Tính Lương năng suất › Nhập năng suất riêng theo nhân viên

Tương tự FN5 nhưng ở mức **từng nhân viên** (không phải bàn).

#### Validate khi lưu
| Rule | Hành động |
|------|-----------|
| Đơn vị tính không hợp lệ (không thuộc kg/con/khay/thung) | **Lỗi chặn lưu** – highlight ô đỏ |
| KL > 0 nhưng Đơn giá để trống | **Cảnh báo** (không chặn) |

- Auto-fill Họ Tên khi nhập Mã NV.
- Import Excel (24 cột), validate realtime sau import.

---

### 3.7 FN7 – Thiết lập nhóm tính lương NS

**Breadcrumb:** Lương › Tính lương năng suất › Thiết lập nhóm tính lương năng suất

Xác định từng **Đơn vị cấp 5 (Bàn)** thuộc nhóm tính lương nào.

#### 4 nhóm tính lương
| Nhóm | Tên | Mô tả |
|------|-----|-------|
| **TH1** | Năng suất riêng | Bàn có NSTT riêng. Tương đương Loại A trong engine. |
| **TH2** | Năng suất chung – 1 đơn vị | Một bàn dùng chung NSTT. |
| **TH3** | Năng suất chung – Nhiều đơn vị | Bàn "Làm dùm" cho nhiều bàn SX khác. Tương đương Loại C. |
| **TH4** | Năng suất chung – Tách cho phụ | Bàn phục vụ được tách NS riêng từ các bàn SX. |

#### Logic nghiệp vụ
- **Ngày hiệu lực:** Cấu hình có hiệu lực từ ngày X.
- **TL-R01 / TL-R02:** Nếu ĐV cấp 5 đã có cấu hình, hệ thống hỏi xác nhận trước khi ghi đè → set `ngay_ket_thuc` của cấu hình cũ = ngày hiệu lực mới − 1 ngày.
- **TL-R03:** Nhóm C (TH3/TH4) phải chọn ít nhất 1 Bàn SX "Làm dùm cho".
- **TL-R05:** Phải chọn ít nhất 1 ĐV cấp 5 trước khi lưu.
- **TL-R06:** Không được xóa nếu đã có dữ liệu tính lương trong kỳ.
- **Cross-Ka (OP-NEW-01):** Cho phép mapping bàn từ Ka khác nhau.

---

### 3.8 FN6 – Tính lương năng suất (Engine chính)

**Breadcrumb:** Lương › Tính lương năng suất › Tính năng suất theo từng người, từng ngày

Engine chạy **7 bước CALC-NEW** để ra NS_FINAL cho từng NV.

#### 3 loại nhân viên trong engine

| Loại | Mã | Định nghĩa |
|------|----|------------|
| **Loại A** | TH1 | Trực tiếp – làm bao nhiêu hưởng bấy nhiêu |
| **Loại B** | TH2/TH3 | Chia nhóm – giữ lại X%, chia đều Y% còn lại |
| **Loại C** | TH4 | Làm dùm – nhận NS từ các bàn SX được mapping |

#### Phân loại NV trong bàn

| Loại NV | Ký hiệu | Đặc điểm |
|---------|---------|----------|
| Sản xuất | SX | Có CNS đóng góp vào bàn |
| Phục vụ | PV | Hỗ trợ, nhận NS từ quỹ PV |

---

#### BƯỚC 1: CALC-NEW-01 – Công NS từng NV (CNS_NV)

```
NV SX:   CNS_NV = CTT × (HST / 100)
NV PV:   Xem CALC-NEW-03
```

**Ví dụ:** NV SX có HST 110%, CTT = 1 ngày → CNS_NV = 1 × 1.1 = **1.10**

---

#### BƯỚC 2: CALC-NEW-02 – Công NS từng Bàn (CNS_BanX)

```
CNS_BanX   = SUM(CNS_NV) của tất cả NV SX trong Bàn X
CNS_Ka_SX  = SUM(CNS_BanX) của tất cả Bàn SX (không tính Bàn C)
```

**Ví dụ:** Bàn 1 có CNS_BanX = 11.92; tổng Ka = **145.05**

---

#### BƯỚC 3: CALC-NEW-03 – Công NS NV Phục vụ (CNS_PV)

```
Nếu HST >= 100%:  CNS_PV = CTT × (HST/100 + BSPV/100)
Nếu HST < 100%:   CNS_PV = CTT × 1.0
```

```
CNS_PV_Ka = SUM(CNS_PV) của tất cả NV PV trong Ka
```

**Ví dụ:** PV1 có HST=110%, BSPV=10%, CTT=1 → CNS_PV = 1 × (1.1+0.1) = **1.20**

---

#### BƯỚC 4: CALC-NEW-04 – Phân bổ PV cho từng Bàn (CNS_PV_PhanBo)

```
CNS_PV_PhanBo[BanX] = CNS_PV_Ka × (CNS_BanX / CNS_Ka_SX)
```

**Ví dụ:** CNS_PV_Ka=13.15, Bàn1=11.92, Ka_SX=145.05
→ CNS_PV_PhanBo[Bàn1] = 13.15 × (11.92 / 145.05) = **1.08**

---

#### BƯỚC 5: CALC-NEW-05 – CNS Bàn sau phân bổ PV (CNS_BanX_SauPV)

```
CNS_BanX_SauPV = CNS_BanX + CNS_PV_PhanBo[BanX]
```

**Ví dụ:** Bàn 1: 11.92 + 1.08 = **13.00**

---

#### BƯỚC 6: CALC-NEW-06 – NS giảm cho PV từng Bàn (NS_GiamPV)

```
NS_GiamPV[BanX]  = NSTT[BanX] × (CNS_PV_PhanBo[BanX] / CNS_BanX_SauPV[BanX])
NS_SauGiam[BanX] = NSTT[BanX] - NS_GiamPV[BanX]
Tỷ lệ giảm (%)  = CNS_PV_PhanBo / CNS_BanX_SauPV × 100
```

**Ví dụ:** NSTT[Bàn1]=300,000; CNS_PV_PhanBo=1.08; CNS_SauPV=13.00
→ NS_GiamPV = 300,000 × (1.08 / 13.00) = **24,937**
→ NS_SauGiam = 300,000 - 24,937 = **275,063**

> Bàn Loại C: NS_GiamPV = 0 (không có NSTT gốc)

---

#### BƯỚC 7: CALC-NEW-07 – NS tính lương trước Redistribution (NS_TL)

```
NV SX (Loại A/B):  NS_TL = NS_SauGiam[BanX] × (CNS_NV / CNS_BanX)
NV PV:             NS_TL = Tổng_NS_GiamPV_KaX × (CNS_NV_PV / CNS_PV_Ka)
Loại C:            NS_TL = 0 (tính sau ở bước Mapping)
```

**Ví dụ NV SX:** NS_SauGiam=275,063; CNS_NV=1.10; CNS_BanX=11.92
→ NS_TL = 275,063 × (1.10 / 11.92) = **25,383**

---

#### Redistribution – Loại B (Chia nhóm)

```
Giữ lại   = NS_TL × (Pct_keep / 100)
Vào Pool  = NS_TL × (1 - Pct_keep / 100)
Pool_avg  = Tổng_Pool / Số_NV_trong_Bàn
NS_FINAL  = Giữ lại + Pool_avg
```

**Ví dụ:** Bàn 2 có 2 NV, Pct_keep = 70%:
- NV1: NS_TL=32.82 → Giữ=22.97, Pool=9.85
- NV2: NS_TL=26.85 → Giữ=18.80, Pool=8.05
- Tổng Pool = 17.90 → Pool_avg = 8.95
- NV1: NS_FINAL = 22.97 + 8.95 = **31.92**
- NV2: NS_FINAL = 18.80 + 8.95 = **27.75**

---

#### Mapping – Loại C (Làm dùm)

```
Total_GiamPV = Σ NS_GiamPV từ các Bàn SX được mapping
Total_CNS_C  = Σ CNS_NV của NV trong Bàn C
NS_FINAL_NV  = Total_GiamPV × (CNS_NV / Total_CNS_C)
```

**Ví dụ:** Bàn HT "Làm dùm" cho Bàn 1 (24,937) + Bàn 2 (24,937) = 49,874
- Bàn HT: 2 NV, NV1 (CNS=1.1), NV2 (CNS=1.0), Total_CNS=2.1
- NV1: NS_FINAL = 49,874 × (1.1 / 2.1) = **26,124**
- NV2: NS_FINAL = 49,874 × (1.0 / 2.1) = **23,750**

---

#### Kết quả tổng hợp fn6

Tab 1 – Dữ liệu đầu vào & Phân chia PV (CALC-NEW-01 → 05):

| Cột | Mô tả |
|-----|-------|
| CTT | Công thực tế |
| HST% | Hệ số tháng |
| BSPV% | % Bổ sung PV |
| CNS_NV | Công NS từng NV |
| CNS_Ban | Công NS bàn |
| CNS_PV_PhanBo | PV phân bổ cho bàn |
| CNS_Ban_SauPV | CNS bàn sau phân bổ |
| CNS_Ka_SX | CNS Ka sản xuất |

Tab 2 – Kết quả NS tính lương (CALC-NEW-06 → 07 + Redir/Mapping):

| Cột | Mô tả |
|-----|-------|
| NSTT (Bàn) | Sản lượng thực tế của bàn |
| NS_GiamPV | NS đã trừ cho PV |
| NS_SauGiam | NS còn lại sau trừ PV |
| Tỷ lệ giảm (%) | % NS bị trừ |
| NS_TL | NS tính lương (trước Redir) |
| **NS_FINAL (Kg) ⭐** | Kết quả cuối – đầu vào cho LSP |
| Chênh lệch | NS_FINAL − NS_TL |
| Nguồn NS | Trực tiếp / Pool B / Quỹ PV / Mapping |
| Đơn giá | Đơn giá áp dụng |

#### Validate fn6
- Phải chọn Kỳ lương NS trước khi tính (B.2).
- Nút "Tính lương NS" → chạy toàn bộ engine.
- Nút "Xem dữ liệu" → load kết quả cũ từ DB (không chạy lại engine).
- Nút "Khóa dữ liệu" → khóa kết quả đã tính.

---

### 3.9 FN8 – Mở khóa lương năng suất

**Breadcrumb:** Lương › Tính Lương năng suất › Mở khóa năng suất

#### Logic nghiệp vụ
- Tìm kiếm NV theo: Mã NV, Tên, Công ty, Đơn vị 1–7, Bộ phận TL, Vị trí, Tình trạng làm việc, Tháng/Năm, Trạng thái khóa.
- Chọn NV cụ thể hoặc tick "Mở khóa tất cả theo điều kiện lọc".
- **Bắt buộc nhập Lý do** trước khi xác nhận → ghi nhận log.
- **Cảnh báo:** Nếu kỳ đã được LSP sử dụng → cảnh báo mở khóa ảnh hưởng kết quả LSP.
- Chỉ mở được dòng có trạng thái "Đã khóa"; dòng "Chưa khóa" sẽ bỏ qua.

---

## 4. DANH MỤC HỆ THỐNG (System)

### sys1 – Định nghĩa tiêu chí tìm kiếm (HSLD)
- Quản lý các tiêu chí tìm kiếm dùng trong báo cáo.
- Mỗi tiêu chí có: Mã, Tên VN/EN, Công thức SQL, Fn table, Kiểu dữ liệu.

### sys2/3/4 – BSPV theo tháng
- Cấu hình % Bổ sung Phục vụ theo Tháng, theo đơn vị.

---

## 5. DANH MỤC DỮ LIỆU (DM)

| File | Tên | Mô tả |
|------|-----|-------|
| dm1 | Tiến trình | Cấu hình tiến trình xử lý |
| dm1b | Đơn vị tính | kg, con, khay, thung, lít, miếng |
| dm2 | Công đoạn | Các công đoạn SX (May thân trước, May tay áo, Hoàn thiện...) |
| dm3 | Loại tôm | |
| dm4 | Loại nguyên liệu | |
| dm5 | Mã size | Size tôm (VM 13/15, VM 16/20...) |
| dm6 | Mã SAP | Mã SAP sản phẩm |
| dm7 | Quy cách | Quy cách sản xuất (LX PTO, Nobashi, Sushi...) |

---

## 6. DANH MỤC TRA CỨU (TL)

| File | Tên | Mô tả |
|------|-----|-------|
| tl1 | Ngày làm việc | Cấu hình lịch làm việc |
| tl2 | Mapping mã | Mapping mã sản phẩm nội bộ ↔ mã tính lương |

---

## 7. CỬA BẢNG CHUẨN BỊ (CB)

| File | Tên | Mô tả |
|------|-----|-------|
| cb1 | NS riêng | Bảng chuẩn bị năng suất riêng |
| cb2 | NS chung | Bảng chuẩn bị năng suất chung |

---

## 8. BÁO CÁO

| File | Tên | Nội dung |
|------|-----|---------|
| bc0 | Báo cáo công năng suất | Tổng hợp công NS theo NV, bộ phận, kỳ |
| bc1 | Chi tiết công NS | Chi tiết từng dòng NS theo ngày/NV |
| bc2 | Chi tiết NV theo ngày (03) | |
| bc3 | Chi tiết NV theo tháng | |
| bc4 | Tổng hợp thành phẩm | Tổng hợp sản lượng thành phẩm |

---

## 9. BẢNG THUẬT NGỮ

| Ký hiệu | Tên đầy đủ | Đơn vị |
|---------|-----------|--------|
| CTT | Công thực tế | ngày công |
| HST | Hệ số tháng | % |
| BSPV | % Bổ sung Phục vụ | % |
| CNS_NV | Công Năng Suất từng NV | ngày quy đổi |
| CNS_BanX | Công Năng Suất Bàn X | ngày quy đổi |
| CNS_Ka_SX | Công NS Ka Sản xuất | ngày quy đổi |
| CNS_PV_Ka | Công NS Phục vụ Ka | ngày quy đổi |
| CNS_PV_PhanBo | PV phân bổ cho Bàn X | ngày quy đổi |
| CNS_BanX_SauPV | CNS Bàn sau phân bổ PV | ngày quy đổi |
| NSTT | Năng suất thực tế Bàn | Kg / Con |
| NS_GiamPV | NS giảm dành cho PV | Kg / Con |
| NS_SauGiam | NS còn lại sau trừ PV | Kg / Con |
| NS_TL | NS tính lương (trước Redir) | Kg / Con |
| **NS_FINAL** | **NS tính lương cuối cùng** | **Kg / Con** |
| Pct_keep | Tỷ lệ giữ lại (Loại B) | % |
| SX | Nhân viên sản xuất | |
| PV | Nhân viên phục vụ | |

---

## 10. QUY TẮC VALIDATE TỔNG HỢP

| Mã rule | Mô tả | Hành động |
|---------|-------|-----------|
| TL-R01 | ĐV cấp 5 đã có cấu hình nhóm → trùng ngày hiệu lực | Yêu cầu xác nhận ghi đè |
| TL-R02 | Đóng cấu hình cũ khi tạo mới | Set ngay_ket_thuc = ngay_hieu_luc_moi − 1 |
| TL-R03 | Nhóm C/TH3/TH4 phải có Bàn SX mapping | Lỗi chặn lưu |
| TL-R05 | Phải chọn ít nhất 1 ĐV cấp 5 | Lỗi chặn lưu |
| TL-R06 | Không xóa nếu đã có dữ liệu tính lương | Lỗi chặn xóa |
| B.2 | Phải chọn Kỳ NS trước khi tính/xem | Lỗi chặn |
| DVT-ERR | Đơn vị tính sai theo cấu hình công đoạn | Lỗi chặn lưu |
| DVT-WARN | KL > 0 nhưng Đơn giá trống | Cảnh báo |

---

## 11. LUỒNG DỮ LIỆU SANG LSP

```
NS_FINAL (Kg/Con) từ fn6
    ↓
Lương Sản Phẩm (LSP)
    ↓
pg2-tinh-lsp.html
```

NS_FINAL là kết quả bắt buộc của LNS và là đầu vào của module LSP (Lương Sản Phẩm). Nếu LNS bị mở khóa sau khi LSP đã sử dụng → kết quả LSP cần tính lại.

---

*Tài liệu được tổng hợp từ toàn bộ file HTML prototype module LNS – MINH PHU HRM System.*
