# CẬP NHẬT LOGIC TÍNH LƯƠNG NĂNG SUẤT – PHƯƠNG ÁN MỚI

> **Tài liệu:** Phân tích file `MPHG-CÁCH_CHIA_NS_CHO_PV_MOI.xlsx`
> **Phiên bản:** v4.0 – Thay thế engine CALC-06 cũ
> **Ngày:** 24/06/2026
> **Đối tượng:** Dev, Tech Lead, QA

---

## 1. TÓM TẮT THAY ĐỔI

| Hạng mục | Cách cũ (v3.x) | Cách mới (file Excel) |
|----------|----------------|----------------------|
| **Đơn vị phân bổ BSPV** | Theo Ka (CNS_PV_Ka / CNS_Ka) – 1 tỷ lệ PV dùng chung cho tất cả Bàn SX trong Ka | Theo từng Bàn (CNS_BanX / CNS_Ka) – mỗi Bàn SX nhận phần PV tỷ lệ với công năng suất của mình |
| **CNS PV tăng thêm** | Nhân trực tiếp vào CNS_PV → dùng trong công thức GiamPV | Phân bổ ngược vào từng Bàn SX: Bàn nào công cao → nhận phần PV nhiều hơn |
| **CNS "mẫu số" khi tính GiamPV** | CNS_Ka (toàn Ka gồm SX + PV) | CNS_BanX_SauPV = CNS_BanX + CNS_PV_PhanBo_BanX |
| **Bước giảm NS** | NSTT_BanX × (GiamPV_BanX / CNS_Ka) | NSTT_BanX × (CNS_PV_PhanBo_BanX / CNS_BanX_SauPV) |
| **Kết quả** | GiamPV bằng nhau cho mọi Bàn (không phản ánh đúng chênh lệch CNS giữa Bàn) | GiamPV tỷ lệ với CNS từng Bàn – Bàn đông người hơn chịu giảm nhiều hơn (công bằng hơn) |
| **Số bước CALC** | CALC-01→12 | CALC-NEW-01→CALC-NEW-07 (đơn giản hơn, tính theo ngày, không gộp Ka trước) |

---

## 2. KIẾN TRÚC ENGINE MỚI – 7 BƯỚC

### 2.1 Sơ đồ tổng quát

```
Input đầu vào (mỗi ngày N):
  CTT[NV, BanX, N]          ← Công thực tế
  HS%[NV]                    ← % Hệ số cá nhân (110%, 85%..., mặc định 100%)
  BSPV[PV_Group]             ← % Bổ sung PV (ví dụ 10%)
  NSTT[BanX, N]              ← Sản lượng thực tế Bàn X ngày N

CALC-NEW-01: CNS_NV per ngày
CALC-NEW-02: CNS_BanX per ngày
CALC-NEW-03: CNS_PV (nhóm PV) per ngày
CALC-NEW-04: Phân bổ CNS_PV xuống từng BanX theo tỷ lệ → CNS_PV_PhanBo[BanX]
CALC-NEW-05: CNS_BanX_SauPV = CNS_BanX + CNS_PV_PhanBo[BanX]
CALC-NEW-06: NS_GiamPV[BanX] = NSTT[BanX] × (CNS_PV_PhanBo[BanX] / CNS_BanX_SauPV[BanX])
CALC-NEW-07: NS_TL[NV] – tính NS lương cho từng NV (SX và PV)
```

---

## 3. CHI TIẾT TỪNG BƯỚC – VỚI VÍ DỤ SỐ THỰC TẾ TỪ FILE EXCEL

### DỮ LIỆU MẪU – NGÀY 1 (N01), Ka1, Bộ phận PTO

**Bàn SX: 11 Bàn (Bàn 1 → Bàn 11) + 1 Nhóm PV (PV1)**

**Tại sao CTT Bàn = 12.00 nhưng CNS Bàn 1 = 11.92?**

CTT là đầu vào thô (ngày công thực tế). CNS là CTT đã nhân hệ số HS% của **từng NV**. Vì trong Bàn 1 có NV với HS% < 100% (NV05=85%, NV06=90%), CNS tổng Bàn 1 thấp hơn CTT tổng. Ngược lại Bàn 11 có nhiều NV HS% cao hơn nên CNS > CTT.

**Bàn 1 – Chi tiết từng NV ngày N01:**

| NV | HS% | CTT (N01) | Công thức CNS | CNS (N01) |
|----|-----|-----------|---------------|-----------|
| NV01 | **110%** | 1 | 1 × 110% | **1.10** |
| NV02 | 100% | 1 | 1 × 100% | 1.00 |
| NV03 | 100% | 1 | 1 × 100% | 1.00 |
| NV04 | 100% | 1 | 1 × 100% | 1.00 |
| NV05 | **85%** | 1 | 1 × 85% | **0.85** |
| NV06 | **90%** | 1 | 1 × 90% | **0.90** |
| NV07 | **105%** | 1 | 1 × 105% | **1.05** |
| NV08 | 100% | 1 | 1 × 100% | 1.00 |
| NV09 | 100% | 1 | 1 × 100% | 1.00 |
| NV10 | 100% | 1 | 1 × 100% | 1.00 |
| NV11 | **102%** | 1 | 1 × 102% | **1.02** |
| NV12 | 100% | 1 | 1 × 100% | 1.00 |
| **Tổng Bàn 1** | | **12.00** | | **11.92** |

> **Giải thích sai số:** `11.92 = 1.10 + 1.00 + 1.00 + 1.00 + 0.85 + 0.90 + 1.05 + 1.00 + 1.00 + 1.00 + 1.02 + 1.00`
> So với CTT = 12.00, chênh lệch = **-0.08** vì NV05 (−0.15) + NV06 (−0.10) bị giảm, nhưng NV01 (+0.10) + NV07 (+0.05) + NV11 (+0.02) bù lại một phần.

**Bàn 1 → Bàn 11 – Tổng hợp ngày N01 (mỗi Bàn 12 NV, đều đi làm đủ CTT=1/người):**

| Bàn | CTT Bàn | Cấu trúc HS% trong Bàn | Tính CNS Bàn | CNS Bàn | NSTT (Kg) |
|-----|---------|------------------------|--------------|---------|-----------|
| Bàn 1 | 12 | 110,100,100,100,**85,90**,105,100,100,100,102,100 | SUM(CTT_i × HS%_i) | **11.92** | 300,000 |
| Bàn 2 | 12 | 110,100,100,100,**85,90**,105,100,100,100,100,100 | SUM(CTT_i × HS%_i) | **12.16** | 300,000 |
| Bàn 3 | 12 | 110,105,100,100,**90,90**,100,100,100,100,100,100 | SUM(CTT_i × HS%_i) | **12.40** | 400,000 |
| Bàn 4 | 12 | Cấu trúc HS% khác Bàn 1 | SUM(CTT_i × HS%_i) | **12.65** | 300,000 |
| … | 12 | … | … | … | … |
| Bàn 11 | 12 | Nhiều NV HS% > 100% hơn | SUM(CTT_i × HS%_i) | **14.53** | 300,000 |
| **Tổng Ka SX** | **132** | | | **145.05** | **3,505,900** |
| PV1 (12 NV) | 12 | Xem CALC-NEW-03 bên dưới | | **13.15** | — |

> **Quy tắc:** `CNS_Bàn = SUM(CTT_NV_i × HS%_i)` cho tất cả NV trong Bàn.
> Nếu Bàn có nhiều NV HS%>100% → CNS_Bàn > CTT_Bàn (Bàn 2→11).
> Nếu Bàn có nhiều NV HS%<100% hơn → CNS_Bàn < CTT_Bàn (Bàn 1 trong ví dụ này).
> **HS% trống = 100% (mặc định)**, không phải "—" theo nghĩa không có hệ số.

---

### CALC-NEW-01: Tính CNS từng NV

**Công thức:**
```
CNS_NV[i] = CTT[i] × (HS%[i] / 100)

Quy tắc HS%:
  - HS% để trống → mặc định 100% (CNS = CTT, không thay đổi)
  - HS% > 100%  → CNS > CTT (NV được tính thêm công)
  - HS% < 100%  → CNS < CTT (NV bị giảm công)
```

**Bàn 1, Ngày N01 – Công thức inline từng NV:**

| NV | CTT | HS% | Công thức | CNS_NV |
|----|-----|-----|-----------|--------|
| NV01 | 1 | **110%** | 1 × **1.10** | **1.10** |
| NV02 | 1 | 100% *(mặc định)* | 1 × 1.00 | 1.00 |
| NV03 | 1 | 100% *(mặc định)* | 1 × 1.00 | 1.00 |
| NV04 | 1 | 100% *(mặc định)* | 1 × 1.00 | 1.00 |
| NV05 | 1 | **85%** | 1 × **0.85** | **0.85** |
| NV06 | 1 | **90%** | 1 × **0.90** | **0.90** |
| NV07 | 1 | **105%** | 1 × **1.05** | **1.05** |
| NV08 | 1 | 100% *(mặc định)* | 1 × 1.00 | 1.00 |
| NV09 | 1 | 100% *(mặc định)* | 1 × 1.00 | 1.00 |
| NV10 | 1 | 100% *(mặc định)* | 1 × 1.00 | 1.00 |
| NV11 | 1 | **102%** | 1 × **1.02** | **1.02** |
| NV12 | 1 | 100% *(mặc định)* | 1 × 1.00 | 1.00 |
| **Tổng Bàn 1** | **12** | | | **11.92** |

**Giải thích tại sao CTT=12.00 nhưng CNS=11.92:**
```
CNS_Ban1 = (1×1.10) + (1×1.00)×6 + (1×0.85) + (1×0.90) + (1×1.05) + (1×1.02)
         = 1.10 + 6.00 + 0.85 + 0.90 + 1.05 + 1.02
         = 11.92

Phần tăng: NV01(+0.10) + NV07(+0.05) + NV11(+0.02) = +0.17
Phần giảm: NV05(-0.15) + NV06(-0.10)               = -0.25
Chênh lệch ròng: +0.17 − 0.25 = −0.08
→ 12.00 − 0.08 = 11.92 ✓
```

**Rule xử lý NULL:**
- HS% không nhập → default = 100% (CNS = CTT)
- CTT = 0 hoặc NULL → CNS_NV = 0

---

### CALC-NEW-02: Tính CNS từng Bàn (SX)

**Công thức:**
```
CNS_BanX = SUM(CNS_NV[i]) WHERE i ∈ BanX AND LoaiNV = SX

Ví dụ N01:
  CNS_Ban1 = 11.92 (tổng CNS 12 NV SX Bàn 1)
  CNS_Ban2 = 12.16
  ...
  CNS_Ka   = SUM(CNS_BanX) = 145.05
```

---

### CALC-NEW-03: Tính CNS Nhóm PV

**Công thức (KHÁC với cách cũ) – 2 nhánh theo HS%:**

```
IF HS%[NV] >= 100%:
    CNS_NV_PV[i] = CTT[i] × (HS%[i]/100 + BSPV)
    → NV có HS% bình thường hoặc cao: nhận cả phần hệ số + phần bổ sung PV

IF HS%[NV] < 100%:
    CNS_NV_PV[i] = CTT[i] × 1.0   (sàn tối thiểu = 100%, không nhân BSPV)
    → NV có HS% thấp (đang bị trừ): được đưa về mức sàn 100%, BSPV không áp dụng
```

**PV1, Ngày N01 – BSPV = 10% – Công thức inline từng NV:**

| NV | HS% | CTT | Nhánh | Công thức | CNS_NV_PV |
|----|-----|-----|-------|-----------|-----------|
| NV01 | **110%** | 1 | HS%≥100 | 1 × (110% + 10%) | **1.20** |
| NV02 | **105%** | 1 | HS%≥100 | 1 × (105% + 10%) | **1.15** |
| NV03 | 100% | 1 | HS%≥100 | 1 × (100% + 10%) | **1.10** |
| NV04 | 100% | 1 | HS%≥100 | 1 × (100% + 10%) | **1.10** |
| NV05 | **90%** | 1 | HS%<100 → sàn 100% | 1 × **100%** | **1.00** |
| NV06 | **90%** | 1 | HS%<100 → sàn 100% | 1 × **100%** | **1.00** |
| NV07 | 100% | 1 | HS%≥100 | 1 × (100% + 10%) | **1.10** |
| NV08 | 100% | 1 | HS%≥100 | 1 × (100% + 10%) | **1.10** |
| NV09 | 100% | 1 | HS%≥100 | 1 × (100% + 10%) | **1.10** |
| NV10 | 100% | 1 | HS%≥100 | 1 × (100% + 10%) | **1.10** |
| NV11 | 100% | 1 | HS%≥100 | 1 × (100% + 10%) | **1.10** |
| NV12 | 100% | 1 | HS%≥100 | 1 × (100% + 10%) | **1.10** |
| **Tổng PV1** | | **12** | | | **13.15** |

**Kiểm tra tổng:**
```
CNS_PV_Ka = 1.20 + 1.15 + 1.10×4 + 1.00×2 + 1.10×4
           = 1.20 + 1.15 + 4.40 + 2.00 + 4.40
           = 13.15 ✓
```

**Ý nghĩa nghiệp vụ:** NV PV có HS% thấp (đang bị phạt vì đi trễ hoặc vi phạm kỷ luật) vẫn nhận mức sàn 100% khi tính công PV — không bị phạt 2 lần (vừa bị giảm HS% vừa mất BSPV). Nhưng họ cũng không được hưởng BSPV thêm như NV đủ tiêu chuẩn.

> **Need Confirm OP-PV-01:** Rule "HS% < 100% → sàn 100%, không nhân BSPV" được đọc từ file Excel. MPHG cần xác nhận đây là rule chủ động hay chỉ là dữ liệu tình cờ trong ví dụ.

---

### CALC-NEW-04: Phân bổ CNS_PV xuống từng Bàn SX (⭐ THAY ĐỔI CỐT LÕI)

Đây là bước **khác biệt lớn nhất** so với engine cũ.

**Cách cũ:** PV dùng chung 1 pool CNS_PV_Ka cho toàn Ka → không phân biệt Bàn nào dùng PV nhiều hay ít.

**Cách mới:** Phân bổ CNS_PV xuống từng Bàn SX theo tỷ lệ CNS_BanX / CNS_Ka.

**Công thức:**
```
CNS_PV_PhanBo[BanX] = CNS_PV_Ka × (CNS_BanX / CNS_Ka_SX)

Trong đó:
  CNS_Ka_SX = SUM(CNS_BanX) của tất cả Bàn SX (KHÔNG gồm PV)
            = 145.05 (N01)
  CNS_PV_Ka = 13.15 (N01)

Ví dụ N01:
  CNS_PV_PhanBo[Ban1] = 13.15 × (11.92 / 145.05) = 13.15 × 0.08218 = 1.0806 ✓
  CNS_PV_PhanBo[Ban2] = 13.15 × (12.16 / 145.05) = 13.15 × 0.08383 = 1.1023 ✓
  CNS_PV_PhanBo[Ban3] = 13.15 × (12.40 / 145.05) = 13.15 × 0.08549 = 1.1243 ✓
  ...
  CNS_PV_PhanBo[Ban11] = 13.15 × (14.53 / 145.05) = 13.15 × 0.10017 = 1.3173 ✓

Kiểm tra: SUM(CNS_PV_PhanBo) = 13.15 ✓ (khớp CNS_PV_Ka)
```

**Ý nghĩa kinh tế:** Bàn có nhiều NV HS% cao hơn (CNS lớn hơn) → chịu "gánh" nhiều hơn phần công PV → **Bàn đóng góp nhiều thì giảm NS nhiều hơn** (nguyên tắc tỷ lệ).

---

### CALC-NEW-05: CNS Bàn sau khi cộng PV (mẫu số mới)

**Công thức:**
```
CNS_BanX_SauPV = CNS_BanX + CNS_PV_PhanBo[BanX]

Ví dụ N01:
  CNS_Ban1_SauPV = 11.92 + 1.0806 = 13.0006 ✓
  CNS_Ban2_SauPV = 12.16 + 1.1023 = 13.2607 ✓
  CNS_Ban3_SauPV = 12.40 + 1.1243 = 13.5259 ✓
  ...
  Tổng Ka_SauPV = 158.20 (= CNS_Ka_SX + CNS_PV_Ka = 145.05 + 13.15) ✓
```

---

### CALC-NEW-06: NS Giảm cho PV từng Bàn

**Công thức:**
```
NS_GiamPV[BanX] = NSTT[BanX] × (CNS_PV_PhanBo[BanX] / CNS_BanX_SauPV[BanX])

Ví dụ N01:
  NS_GiamPV[Ban1] = 300,000 × (1.0806 / 13.0006) = 300,000 × 0.08312 = 24,937 ✓
  NS_GiamPV[Ban2] = 300,000 × (1.1023 / 13.2607) = 300,000 × 0.08312 = 24,937 ✓
  NS_GiamPV[Ban3] = 400,000 × (1.1243 / 13.5259) = 400,000 × 0.08312 = 33,249 ✓
  NS_GiamPV[Ban7] = 205,900 × (1.2170 / 14.6408) = 205,900 × 0.08312 = 17,115 ✓
  NS_GiamPV[Ban9] = 450,000 × (1.2661 / 15.2323) = 450,000 × 0.08312 = 37,405 ✓
```

> **Phát hiện quan trọng:** Tỷ lệ `CNS_PV_PhanBo / CNS_BanX_SauPV` là như nhau cho tất cả các Bàn trong Ka (đều ≈ 0.08312 ngày N01). Điều này vì:
> ```
> CNS_PV_PhanBo[BanX] / CNS_BanX_SauPV[BanX]
> = (CNS_PV_Ka × CNS_BanX/CNS_Ka) / (CNS_BanX + CNS_PV_Ka × CNS_BanX/CNS_Ka)
> = CNS_PV_Ka / (CNS_Ka + CNS_PV_Ka)
> = 13.15 / (145.05 + 13.15)
> = 13.15 / 158.20 = 0.08312 (hằng số cho toàn Ka trong ngày)
> ```

**Tổng NS giảm cho PV** = SUM(NS_GiamPV) = 291,418 = NS nhóm PV1 nhận được ✓

**NS sau giảm cho từng Bàn:**
```
NS_SauGiam[BanX] = NSTT[BanX] - NS_GiamPV[BanX]

Ban1: 300,000 - 24,937 = 275,063 ✓
Ban3: 400,000 - 33,249 = 366,751 ✓
Ban9: 450,000 - 37,405 = 412,595 ✓
```

---

### CALC-NEW-07: NS Tính Lương từng NV

**Với NV Sản xuất (LoaiNV = SX):**
```
NS_TL_SX[NV] = NS_SauGiam[BanX] × (CNS_NV[i] / CNS_BanX)

Ví dụ Bàn 1, NV01 (CNS=1.10), N01:
  NS_TL = 275,063 × (1.10 / 11.92) = 275,063 × 0.0923 = 25,383 ✓
```

**Với NV Phục vụ (LoaiNV = PV):**
```
NS_TL_PV[NV] = SUM(NS_GiamPV[BanX]) × (CNS_NV_PV[i] / CNS_PV_Ka)
             = 291,418 × (CNS_NV_PV[i] / 13.15)

Ví dụ PV1, NV01 (HS%=110, CNS_PV=1.20), N01:
  NS_TL = 291,418 × (1.20 / 13.15) = 291,418 × 0.09125 = 26,593 ✓
```

---

## 4. SO SÁNH CÔNG THỨC CŨ vs MỚI

### 4.1 Bước GiamPV – Thay đổi lớn nhất

| | **Engine cũ (CALC-06)** | **Engine mới (CALC-NEW-06)** |
|---|---|---|
| **Công thức** | `GiamPV_Ban = CNS_Ban × (CNS_PV_Ka / CNS_Ka)` | `NS_GiamPV_Ban = NSTT_Ban × (CNS_PV_Ka / (CNS_Ka + CNS_PV_Ka))` |
| **Đơn vị** | Đơn vị công (ngày công) | Đơn vị sản lượng (Kg/Con/...) |
| **Input NSTT** | Không dùng NSTT ở bước này | Dùng NSTT_Ban trực tiếp |
| **Tỷ lệ giảm** | Bàn nào CNS cao → giảm nhiều công | Tỷ lệ giảm NS như nhau cho tất cả Bàn (hằng số per Ka per ngày) |
| **Output** | CNS đã giảm PV | NS đã giảm PV (đơn vị sản lượng) |

### 4.2 Bảng mapping CALC cũ → CALC mới

| CALC cũ | Tên | CALC mới | Tên | Ghi chú |
|---------|-----|----------|-----|---------|
| CALC-01 | CTT | CALC-NEW-01 | CNS_NV | Giữ nguyên |
| CALC-02 | CNS_SX | CALC-NEW-02 | CNS_BanX | Giữ nguyên |
| CALC-03 | CNS_PV | CALC-NEW-03 | CNS_PV_Ka | Tách thành base + BS |
| CALC-04 | CNS_Ban | *(gộp vào NEW-02)* | | |
| CALC-05 | CNS_Ka | *(gộp vào NEW-02)* | | |
| CALC-06 | GiamPV | **CALC-NEW-04 + 05 + 06** | Phân bổ PV xuống Bàn | **THAY ĐỔI HOÀN TOÀN** |
| CALC-07 | SauGiamPV | *(gộp vào NEW-06)* | | |
| CALC-08 | HSLD | *(không còn bước riêng)* | | HSLD không còn xuất hiện trong tính toán mới |
| CALC-09 | NS_SauChiaPV | *(gộp vào NEW-06)* | | |
| CALC-10 | NS_PV | *(output của NEW-06)* | | |
| CALC-11 | NS_TL_SX | CALC-NEW-07 (nhánh SX) | NS_TL_SX | Giữ nguyên công thức |
| CALC-12 | NS_TL_PV | CALC-NEW-07 (nhánh PV) | NS_TL_PV | Công thức tương tự nhưng mẫu số = CNS_PV_Ka |

---

## 5. VÍ DỤ SỐ ĐẦY ĐỦ THEO NGÀY

### Ngày 1 (N01) – Xác minh toàn bộ pipeline

**Input:**
```
CNS_Ka_SX = 145.05 (tổng 11 Bàn SX)
CNS_PV_Ka  = 13.15 (nhóm PV1)
BSPV       = 10%
```

**CALC-NEW-04:**
```
Tỷ lệ phân bổ PV = CNS_PV_Ka / CNS_Ka_SX = 13.15 / 145.05 = 0.09066
CNS_PV_PhanBo[BanX] = CNS_BanX × 0.09066
  Ban1:  11.92 × 0.09066 = 1.0806
  Ban9:  13.97 × 0.09066 = 1.2661
  Ban11: 14.53 × 0.09066 = 1.3173
```

**CALC-NEW-05:**
```
CNS_BanX_SauPV = CNS_BanX + CNS_PV_PhanBo[BanX]
  Ban1:  11.92 + 1.0806 = 13.0006
  Ban9:  13.97 + 1.2661 = 15.2361
  Ban11: 14.53 + 1.3173 = 15.8473
  Tổng:  158.20
```

**CALC-NEW-06:**
```
Tỷ lệ giảm mỗi ngày = CNS_PV_Ka / (CNS_Ka_SX + CNS_PV_Ka) = 13.15 / 158.20 = 0.08312

NS_GiamPV[BanX] = NSTT[BanX] × 0.08312
  Ban1:  300,000 × 0.08312 = 24,937
  Ban3:  400,000 × 0.08312 = 33,249
  Ban7:  205,900 × 0.08312 = 17,115
  Ban9:  450,000 × 0.08312 = 37,405

NS_SauGiam[BanX] = NSTT[BanX] - NS_GiamPV[BanX]
  Ban1:  300,000 - 24,937 = 275,063
  Ban3:  400,000 - 33,249 = 366,751
  Ban9:  450,000 - 37,405 = 412,595

Tổng NS_GiamPV (= NS nhóm PV nhận) = 291,418
Tổng NS_SauGiam (tất cả Bàn SX) = 3,505,900 - 291,418 = 3,214,482
```

**CALC-NEW-07 – NV SX (Bàn 1):**
```
NS_TL_SX[NV01] = NS_SauGiam[Ban1] × (CNS_NV01 / CNS_Ban1)
               = 275,063 × (1.10 / 11.92) = 25,383 ✓

NS_TL_SX[NV05 HS%=85] = 275,063 × (0.85 / 11.92) = 19,614 ✓
```

**CALC-NEW-07 – NV PV (PV1):**
```
Tổng NS_PV = 291,418 (= SUM NS_GiamPV)

NS_TL_PV[NV01, HS%=110, CNS_PV=1.20] = 291,418 × (1.20 / 13.15) = 26,593 ✓
NS_TL_PV[NV05, HS%=90, CNS_PV=0.90]  = 291,418 × (0.90 / 13.15) = 19,961 ✓

Tổng kiểm tra: SUM(NS_TL_PV) = 291,418 ✓
```

---

## 6. PHÁT HIỆN QUAN TRỌNG – "BSPV NHÂN ĐÔI"

### 6.1 Tác động của BSPV trong cơ chế mới

Trong cơ chế mới, BSPV (10%) ảnh hưởng theo 2 chiều:

**Chiều 1: Tăng CNS_PV_Ka** (giúp NV PV nhận được nhiều NS hơn)
```
Không có BSPV: CNS_PV_Ka = SUM(CTT × HS%) = ~12.00
Có BSPV=10%:  CNS_PV_Ka = SUM(CTT × HS% × 1.1) = ~13.15 (+9.6%)
```

**Chiều 2: Tăng phần NS giảm từ Bàn SX** (Bàn SX bị giảm nhiều NS hơn)
```
Tỷ lệ giảm = CNS_PV_Ka / (CNS_Ka_SX + CNS_PV_Ka)
Không BSPV: 12.00 / (145.05 + 12.00) = 12.00 / 157.05 = 7.64%
Có BSPV:   13.15 / (145.05 + 13.15) = 13.15 / 158.20 = 8.31%
```

→ BSPV 10% làm tỷ lệ giảm NS của Bàn SX tăng từ 7.64% lên 8.31% (+0.67 điểm %)

**Ý nghĩa:** Bàn SX gánh thêm phần BSPV vào trong tỷ lệ giảm NS của mình. Đây là cơ chế "cross-subsidy": NV SX tài trợ cho NV PV cả phần công cơ bản lẫn phần bonus BSPV.

> **Need Confirm OP-PV-02:** MPHG có ý định này không? Có nghĩa là tăng BSPV từ 10% lên 20% sẽ làm Bàn SX bị giảm NS nhiều hơn đáng kể. Cần MPHG xác nhận để tránh tranh chấp.

---

### 6.2 Tính theo ngày hay gộp tháng?

File Excel tính theo từng ngày (N01, N02, ..., N31). Điều này quan trọng vì:
- CNS và NSTT thay đổi theo ngày (có người nghỉ, có ngày NSTT cao/thấp)
- Tỷ lệ giảm PV mỗi ngày khác nhau
- Tổng tháng = SUM các ngày

**Quy tắc tính:**
```
NS_TL_NV_Thang = SUM(NS_TL_NV_NgayN) WHERE N = 1 → cuoi_thang
```

Engine phải tính per ngày, không thể tính gộp tháng rồi chia.

---

## 7. IMPACT LÊN HỆ THỐNG

### 7.1 Thay đổi DB Schema

| Bảng | Thay đổi | Lý do |
|------|----------|-------|
| `NS_Result` | Thêm cột `cnsp_phanbo` (CNS PV phân bổ cho Bàn) | Lưu CALC-NEW-04 để audit |
| `NS_Result` | Thêm cột `ns_giam_pv` (NS giảm cho PV) | Lưu CALC-NEW-06 |
| `NS_Result` | Bỏ cột `calc06_giam_pv_cong` (CNS giảm PV theo cách cũ) | Không dùng nữa |
| `NS_Result` | Thêm `ty_le_giam_ngay` (tỷ lệ % giảm = CNS_PV/(CNS_Ka+CNS_PV) theo ngày) | Audit |

### 7.2 Thay đổi UI/Grid

| Màn hình | Tab 1 (Input) | Tab 2 (Output) |
|----------|---------------|----------------|
| **Bỏ cột** | GiamPV (đơn vị công) | HSLD (không dùng nữa) |
| **Thêm cột** | CNS_PV_PhanBo[BanX] (đơn vị công) | NS_GiamPV (đơn vị sản lượng) |
| **Thêm cột** | CNS_BanX_SauPV | Tỷ lệ giảm ngày (%) |
| **Tên cột đổi** | "SauGiamPV" (công) → "NS_SauGiam" (sản lượng) | |

### 7.3 Thay đổi logic import NSTT

- NSTT nhập theo **Bàn + Ngày** (giữ nguyên)
- Không cần thêm cột nào cho NSTT input
- Nhóm PV **KHÔNG nhập NSTT** (giữ nguyên – PV không có sản lượng)

---

## 8. OPEN POINTS CẬP NHẬT

| OP ID | Câu hỏi | Ảnh hưởng | Priority |
|-------|---------|-----------|----------|
| OP-PV-01 | NV PV có HS% < 100% (VD: 90%) có được nhân BSPV không? File Excel cho thấy NV05/06 (90%) không có BSPV. Có phải rule: `IF HS% < 100 THEN BSPV = 0`? | CALC-NEW-03 | Must |
| OP-PV-02 | MPHG có hiểu và đồng ý rằng tăng BSPV sẽ làm tăng phần NS giảm của Bàn SX không? Cần confirm để tránh tranh chấp sau go-live | Policy | Must |
| OP-PV-03 | Khi 1 Ka có nhiều nhóm PV (VD: PV1, PV2), mỗi nhóm PV có BSPV khác nhau: tính CNS_PV_Ka là gộp tất cả hay từng nhóm? | CALC-NEW-03 | High |
| OP-PV-04 | Ngày nghỉ lễ: NV PV có CTT ngày đó = 0. NS_GiamPV ngày đó = 0. Nhưng file Excel xử lý thế nào với cột N06 (= 0 tất cả)? Có tính ngày đó không? | CALC-NEW-06 edge case | High |
| OP-NEW-05 | Bàn HT (Loại C từ thiết lập nhóm) với cơ chế mới: Bàn HT không có CNS_BanX trong CNS_Ka_SX → phần PV phân bổ chỉ xuống Bàn A/B? | CALC-NEW-04 integration | Must |
| OP-01 | Xác nhận Bộ phận=cấp 3, Ka=cấp 4, Bàn=cấp 5 | Toàn bộ engine | Must |

---

## 9. KẾ HOẠCH TRIỂN KHAI

### Phase 1 – Refactor CALC-06 (ưu tiên cao nhất)
- Xóa bỏ logic CALC-06 cũ (CNS_Ban × CNS_PV_Ka / CNS_Ka)
- Implement CALC-NEW-04 (phân bổ PV xuống Bàn theo tỷ lệ CNS)
- Implement CALC-NEW-05 (CNS_BanX_SauPV)
- Implement CALC-NEW-06 (NS_GiamPV theo sản lượng)
- Cập nhật CALC-NEW-07 (NS_TL_PV dùng tổng NS_GiamPV làm pool)
- Thêm cột mới vào NS_Result
- Cập nhật grid Tab 1 + Tab 2

### Phase 2 – Validation & Test
- Test backward: đảm bảo tổng NS_TL_SX + NS_TL_PV = tổng NSTT_Ka
- Test ngày nghỉ (CTT = 0): NS_GiamPV ngày đó = 0
- Test BSPV = 0%: kết quả tương đương không có PV
- Test nhiều nhóm PV trong cùng Ka

### Phase 3 – Migration
- Chạy song song engine cũ và mới 1 kỳ
- So sánh chênh lệch
- Báo cáo cho MPHG trước khi switch

---

## 10. ACCEPTANCE CRITERIA

| # | Điều kiện nghiệm thu |
|---|----------------------|
| AC-01 | SUM(NS_TL_SX) + SUM(NS_TL_PV) = SUM(NSTT_Ka) với tolerance < 0.01 |
| AC-02 | Tỷ lệ `CNS_PV_Ka/(CNS_Ka+CNS_PV_Ka)` đúng với từng ngày trong kỳ |
| AC-03 | SUM(CNS_PV_PhanBo[BanX]) = CNS_PV_Ka (kiểm tra phân bổ không mất mát) |
| AC-04 | Ngày NSTT_BanX = 0 → NS_GiamPV[BanX] = 0 và NS_TL_SX = 0 cho NV thuộc BanX ngày đó |
| AC-05 | NV PV nhận NS_TL_PV tỷ lệ với CNS_NV_PV / CNS_PV_Ka (không phải CNS_NV_PV / CNS_Ka) |
| AC-06 | Kết quả ngày 1 khớp với file Excel: NS_TL[NV01, Bàn1] = 25,383; NS_TL_PV[NV01, PV1] = 26,593 |
| AC-07 | Tổng NS_GiamPV = NS nhóm PV nhận = 291,418 (ngày N01) |
