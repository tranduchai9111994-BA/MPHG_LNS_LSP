# LNS – PHÂN RÃ TIÊU CHÍ ĐỂ SEED DATA PROTOTYPE

> Hệ thống: **MINH PHU (MPHG)** | Module: **Lương › Tính Lương Năng Suất (LNS)**
> Nguồn dữ liệu: `MPHG_LNS_Function_Param_Catalog_v3_1.xlsx` (sheet `01_LNS_TieuChi`, `02_Functions`, `00_ThamSo_HeThong`, `03_OpenPoints`)
> Mục đích: Nhập (fake/seed) dữ liệu vào prototype cho **3 màn hình**:
> 1. **Tiêu chí hệ thống** (Lớp 2 – HT)
> 2. **Tiêu chí tính toán** (Lớp 3 – TT)
> 3. **Tạo công thức lương** (OUTPUT cuối)

---

## 0. KIẾN TRÚC 3 LỚP & THỨ TỰ SEED

Engine LNS tính theo 3 lớp xếp chồng. **Phải seed đúng thứ tự** vì lớp sau tham chiếu lớp trước:

```
Lớp 1 – TK (Tiêu chí tìm kiếm)   → Scalar function, trả nvarchar/datetime → CHỈ dùng trong CASE WHEN
        ↓ (đã có màn riêng "Tiêu chí tìm kiếm")
Lớp 2 – HT (Tiêu chí hệ thống)   → Scalar function, trả float → MỌI SUM/GROUP BY ở đây
        ↓
Lớp 3 – TT (Tiêu chí tính toán)  → KHÔNG gọi function, chỉ gọi lại TK/HT/TT + CASE WHEN + (+ − × ÷)
        ↓
OUTPUT – Tạo công thức lương     → TT_NS_TinhLuong → ghi NS_Result.productivity_salary
```

| Bước seed | Màn hình prototype | Lớp | Số tiêu chí | Ghi chú |
|-----------|--------------------|-----|-------------|---------|
| (1) | Tiêu chí tìm kiếm *(đã có sẵn)* | Lớp 1 – TK | 7 | Xem **Phụ lục A** – cần seed trước vì TT tham chiếu |
| (2) | **Tiêu chí hệ thống** | Lớp 2 – HT | 14 | Mục **1** |
| (3) | **Tiêu chí tính toán** | Lớp 3 – TT | 17 | Mục **2** |
| (4) | **Tạo công thức lương** | OUTPUT | 1 | Mục **3** |

---

## QUY ƯỚC ÁNH XẠ CATALOG → FIELD PROTOTYPE

Mỗi tiêu chí trong catalog map sang form prototype như sau:

| Field prototype | Lấy từ catalog | Quy ước |
|-----------------|----------------|---------|
| **Mã tiêu chí** | Cột `Tên tiêu chí` | Đây là **token được tham chiếu trong công thức** (vd `HT_TS_CongThucTe`). PHẢI khớp tuyệt đối. |
| **Tên tiếng Anh** | = `Mã tiêu chí` (tên kỹ thuật) | Dùng làm label kỹ thuật |
| **Tên tiếng Việt** | Rút gọn từ cột `Mô tả nghiệp vụ` | Label hiển thị |
| **Thứ tự** | STT trong lớp (HT: 1→14; TT: theo Rank rồi STT) | Số nguyên |
| **Dùng fn table** | `(Không dùng)` cho HT/TT | HT gọi scalar function qua SQL, không map view; TT là biểu thức |
| **Công thức (SQL)** | Cột `Công thức / Cách xác định` | Copy nguyên văn |
| **Kiểu dữ liệu** | Cột `Kiểu trả về` | HT = `float`, TT = `float`, TK = `nvarchar/datetime` |
| **Ghi chú** | Gộp `NULL/Default` + `Ghi chú/Need Confirm` | |
| **Sử dụng?** | `Có` (tick) trừ khi BLOCKING | Tiêu chí BLOCKING vẫn tạo nhưng đánh dấu Need Confirm |
| **Mã catalog (tham chiếu nội bộ)** | Cột `Mã` (vd `NS-HT01`) | KHÔNG nhập vào prototype, chỉ để trace |

**Lưu ý token tham chiếu trong công thức TT:** tiền tố `PRT.` đứng trước tiêu chí TK (vd `PRT.TK_HR_LoaiNhanVien`) là alias dòng dữ liệu chứa kết quả các tiêu chí TK của 1 NV. Các token `HT_xxx`, `TT_xxx` tham chiếu trực tiếp tiêu chí cùng kỳ.

---

# 1. MÀN HÌNH: TIÊU CHÍ HỆ THỐNG (Lớp 2 – HT)

**14 tiêu chí** – tất cả là **Scalar function trả `float`**. Mọi phép `SUM/GROUP BY` nằm bên trong function (không nằm ở Lớp 3).

## 1.1 Bảng seed nhanh (copy thẳng vào prototype)

| Thứ tự | Mã tiêu chí | Tên tiếng Việt | Kiểu DL | Dùng fn table | Công thức (SQL) | Sử dụng? |
|--------|-------------|----------------|---------|---------------|-----------------|----------|
| 1 | HT_TS_CongThucTe | Công thực tế (ngày công) | float | (Không) | `dbo.PTS_fnGetCongChiTietNgay(PR.EmpID, PR.FromDate, PR.ToDate, 1)` | Có |
| 2 | HT_PR_HeSoNangSuatThang | % Hệ số NS tháng theo NV | float | (Không) | `dbo.PR_fnGetHeSoNangSuatThang(PR.EmpID, PR.PRMonth)` | Có |
| 3 | HT_PR_PhanTramBoSungPhucVu | % Bổ sung phục vụ (BSPV) | float | (Không) | `dbo.PR_fnGetPhanTramBoSungPhucVu(PR.BanID, PR.PRMonth)` | Có |
| 4 | HT_PR_NangSuatThucTe | NSTT Bàn × CĐ (tất cả ca) | float | (Không) | `dbo.PR_fnGetNangSuatThucTe(PR.BanID, PR.StageID, PR.FromDate, PR.ToDate)` | Có |
| 5 | HT_PR_NSTT_TrongCa | NSTT ca thường (LoaiCa=1) | float | (Không) | `dbo.PR_fnGetNangSuatThucTe_LoaiCa(PR.BanID, PR.StageID, PR.FromDate, PR.ToDate, 1)` | Có |
| 6 | HT_PR_NSTT_CaDem | NSTT ca đêm (LoaiCa=2) | float | (Không) | `dbo.PR_fnGetNangSuatThucTe_LoaiCa(PR.BanID, PR.StageID, PR.FromDate, PR.ToDate, 2)` | Có |
| 7 | HT_PR_NSTT_TangCa | NSTT tăng ca (LoaiCa=3) | float | (Không) | `dbo.PR_fnGetNangSuatThucTe_LoaiCa(PR.BanID, PR.StageID, PR.FromDate, PR.ToDate, 3)` | Có |
| 8 | HT_PR_NSTT_TangCaDem | NSTT tăng ca đêm (LoaiCa=4) | float | (Không) | `dbo.PR_fnGetNangSuatThucTe_LoaiCa(PR.BanID, PR.StageID, PR.FromDate, PR.ToDate, 4)` | Có |
| 9 | HT_PR_CNS_Ban | Tổng CNS scope Bàn/Nhóm gom | float | (Không) | `dbo.PR_fnGetCNS_Ban(PR.BanID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.FromDate, PR.ToDate)` | Có |
| 10 | HT_PR_CNS_PV_Scope | Tổng CNS phục vụ trong scope | float | (Không) | `dbo.PR_fnGetCNS_PV_Scope(PR.KaID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.FromDate, PR.ToDate)` | Có |
| 11 | HT_PR_CNS_TongScope | Tổng CNS toàn scope (Ka/nhóm gom) | float | (Không) | `dbo.PR_fnGetCNS_TongScope(PR.KaID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.FromDate, PR.ToDate)` | Có |
| 12 | HT_PR_NSTT_Scope | Tổng NSTT toàn scope × CĐ | float | (Không) | `dbo.PR_fnGetNSTT_Scope(PR.KaID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.StageID, PR.FromDate, PR.ToDate)` | Có |
| 13 | HT_PR_NS_SauChiaPV_Scope | Tổng NS sau chia PV toàn scope | float | (Không) | `dbo.PR_fnGetNS_SauChiaPV_Scope(PR.KaID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.StageID, PR.FromDate, PR.ToDate)` | Có |
| 14 | HT_PR_NangSuatTinhLuong | KẾT QUẢ LNS đã khóa (cho LSP đọc) | float | (Không) | `dbo.PR_fnGetNangSuatTinhLuong(PR.EmpID, PR.StageID, PR.PRMonth)` | Có |

## 1.2 Chi tiết từng tiêu chí HT

---
**HT_TS_CongThucTe** `(NS-HT01)` — Nhóm Công
- **Tên tiếng Việt:** Công thực tế NV trong giai đoạn (ngày công)
- **Mô tả:** Lấy từ bảng công chi tiết theo ngày, `@Type=1` = ngày công.
- **Công thức:** `dbo.PTS_fnGetCongChiTietNgay(PR.EmpID, PR.FromDate, PR.ToDate, 1)`
- **Ví dụ kết quả:** `22.0`
- **NULL/Default:** NULL → `0` + WARNING "CTT=0"
- **Ghi chú:** Function CÓ SẴN.

---
**HT_PR_HeSoNangSuatThang** `(NS-HT02)` — Nhóm Hệ số
- **Tên tiếng Việt:** % Hệ số NS tháng cho từng NV
- **Mô tả:** Nhập tại màn hình chấm công. Mỗi NV giá trị khác nhau (110% = 1.10; 85% = 0.85). Không nhập = 100%.
- **Công thức:** `dbo.PR_fnGetHeSoNangSuatThang(PR.EmpID, PR.PRMonth)`
- **Ví dụ:** `1.10`
- **NULL/Default:** NULL → `1.0`
- **Ghi chú:** Có sẵn. Lưu dạng thập phân.

---
**HT_PR_PhanTramBoSungPhucVu** `(NS-HT03)` — Nhóm Hệ số
- **Tên tiếng Việt:** % Bổ sung công NS cho bộ phận PV theo tháng
- **Mô tả:** Chỉ áp dụng NV có `LoaiNV = PV`.
- **Công thức:** `dbo.PR_fnGetPhanTramBoSungPhucVu(PR.BanID, PR.PRMonth)`
- **Ví dụ:** `0.10` (tức 10%)
- **NULL/Default:** NULL → `0`
- **Ghi chú:** Có sẵn. Nhập bởi Nhân sự.

---
**HT_PR_NangSuatThucTe** `(NS-HT04)` — Nhóm NSTT
- **Tên tiếng Việt:** Tổng NSTT (Kg/Con) Bàn × CĐ – SUM tất cả loại ca
- **Công thức:** `dbo.PR_fnGetNangSuatThucTe(PR.BanID, PR.StageID, PR.FromDate, PR.ToDate)`
- **Ví dụ:** `500.0`
- **NULL/Default:** NULL → `0` + WARNING
- **Ghi chú:** Có sẵn. Nhập bởi bộ phận Lương.

---
**HT_PR_NSTT_TrongCa / CaDem / TangCa / TangCaDem** `(NS-HT05→08)` — Nhóm NSTT (Ca)
- **Tên tiếng Việt:** NSTT theo từng loại ca
- **Công thức:** `dbo.PR_fnGetNangSuatThucTe_LoaiCa(PR.BanID, PR.StageID, PR.FromDate, PR.ToDate, @LoaiCa)` với `@LoaiCa = 1/2/3/4`
- **Ví dụ:** TrongCa=`400.0`, CaDem=`60.0`, TangCa=`30.0`, TangCaDem=`10.0`
- **NULL/Default:** NULL → `0`
- **Ghi chú:** Function MỚI (cần tạo). `@LoaiCa`: 1=Trong ca, 2=Ca đêm, 3=Tăng ca, 4=Tăng ca đêm.

---
**HT_PR_CNS_Ban** `(NS-HT09)` 🔵 MỚI — Aggregate CNS
- **Tên tiếng Việt:** Tổng CNS tất cả NV thuộc scope Bàn / Nhóm gom
- **Mô tả:** TH2 → SUM CNS theo 1 ĐV cấp 5 (PR.BanID). TH3/TH4 → SUM CNS theo nhóm gom (PR.NhomGomID).
- **Công thức:** `dbo.PR_fnGetCNS_Ban(PR.BanID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.FromDate, PR.ToDate)`
- **Logic trong function:**
  - `IF NhomTinhNS = NSC_1DV → SUM(CNS_NV) WHERE BanID = @BanID`
  - `IF NhomTinhNS IN (NSC_NHIEU_DV, NSC_TACH_PV) → SUM(CNS_NV) WHERE NhomGomID = @NhomGomID`
- **Ví dụ:** `297.253` (12 NV Bàn 1)
- **NULL/Default:** `0` → WARNING
- **Ghi chú:** Function aggregate quan trọng nhất. CẦN TẠO MỚI.

---
**HT_PR_CNS_PV_Scope** `(NS-HT10)` 🔵 MỚI — Aggregate CNS
- **Tên tiếng Việt:** Tổng CNS các NV Phục vụ (LoaiNV=PV) trong scope
- **Mô tả:** TH2 → SUM theo Ka. TH4 → SUM theo nhóm gom. TH3 → 0 (không có PV).
- **Công thức:** `dbo.PR_fnGetCNS_PV_Scope(PR.KaID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.FromDate, PR.ToDate)`
- **Logic:** `NSC_1DV → WHERE KaID=@KaID AND LoaiNV=PV` · `NSC_TACH_PV → WHERE NhomGomID=@NhomGomID AND LoaiNV=PV` · `NSC_NHIEU_DV → RETURN 0`
- **Ví dụ:** `48.4`
- **NULL/Default:** `0` nếu không có PV
- **Ghi chú:** CẦN TẠO MỚI.

---
**HT_PR_CNS_TongScope** `(NS-HT11)` 🔵 MỚI — Aggregate CNS
- **Tên tiếng Việt:** Tổng CNS tất cả NV trong scope (Ka hoặc nhóm gom)
- **Công thức:** `dbo.PR_fnGetCNS_TongScope(PR.KaID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.FromDate, PR.ToDate)`
- **Logic:** `NSC_1DV → WHERE KaID=@KaID` · `NSC_NHIEU_DV/NSC_TACH_PV → WHERE NhomGomID=@NhomGomID`
- **Ví dụ:** `909.71`
- **NULL/Default:** `0` → WARNING "Scope CNS=0"
- **Ghi chú:** CẦN TẠO MỚI. Là mẫu số chia → chú ý chống chia 0 ở Lớp 3.

---
**HT_PR_NSTT_Scope** `(NS-HT12)` 🔵 MỚI — Aggregate NSTT
- **Tên tiếng Việt:** Tổng NSTT tất cả Bàn trong scope × CĐ
- **Công thức:** `dbo.PR_fnGetNSTT_Scope(PR.KaID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.StageID, PR.FromDate, PR.ToDate)`
- **Ví dụ:** `1794000` (Ka1, ngày N02)
- **NULL/Default:** `0` → WARNING
- **Ghi chú:** Dùng tính `NS_KetQuaPhucVu = NSTT_Scope - SUM(NS_SauChiaPV)`. CẦN TẠO MỚI.

---
**HT_PR_NS_SauChiaPV_Scope** `(NS-HT13)` 🔵 MỚI — Aggregate NS PV
- **Tên tiếng Việt:** Tổng NS sau khi chia PV của tất cả Bàn trong scope
- **Mô tả:** `= SUM(NSTT_Ban × SauGiamPV / CNS_TongScope)` theo scope.
- **Công thức:** `dbo.PR_fnGetNS_SauChiaPV_Scope(PR.KaID, PR.NhomGomID, PR.NhomTinhNS_ID, PR.StageID, PR.FromDate, PR.ToDate)`
- **Ví dụ:** `284.46`
- **NULL/Default:** `0`
- **Ghi chú:** Chỉ cần khi TH2/TH4 (có PV). CẦN TẠO MỚI.

---
**HT_PR_NangSuatTinhLuong** `(NS-HT14)` ⭐ OUTPUT → LSP
- **Tên tiếng Việt:** KẾT QUẢ CUỐI LNS – `productivity_salary` từ `NS_Result` đã KHÓA (`is_locked=1`)
- **Mô tả:** LSP đọc lại tiêu chí này. Là điểm giao LNS → LSP.
- **Công thức:** `dbo.PR_fnGetNangSuatTinhLuong(PR.EmpID, PR.StageID, PR.PRMonth)`
- **Ví dụ:** `53.65`
- **NULL/Default:** NULL → `0` + `IsPreview=1`
- **Ghi chú:** Có sẵn.

---

# 2. MÀN HÌNH: TIÊU CHÍ TÍNH TOÁN (Lớp 3 – TT)

**17 tiêu chí** – tất cả trả `float`. **KHÔNG gọi function**; chỉ tham chiếu lại TK/HT/TT và dùng `CASE WHEN` + `+ − × ÷`. Seed theo **Rank tăng dần** (Rank 1 → 7) để engine resolve đúng phụ thuộc.

## 2.1 Bảng seed nhanh (copy thẳng vào prototype)

| Thứ tự | Rank | Mã tiêu chí | Tên tiếng Việt | Kiểu DL | Công thức (SQL) |
|--------|------|-------------|----------------|---------|-----------------|
| 1 | 1 | TT_NS_CongThucTe | Công thực tế NV | float | `= HT_TS_CongThucTe` |
| 2 | 1 | TT_NS_HeSoThang | Hệ số tháng sau xử lý NULL | float | `= ISNULL(HT_PR_HeSoNangSuatThang, 1.0)` |
| 3 | 1 | TT_NS_BoSungPV | % bổ sung PV sau xử lý NULL | float | `= ISNULL(HT_PR_PhanTramBoSungPhucVu, 0)` |
| 4 | 1 | TT_NS_NSTT_Ban | NSTT Bàn × CĐ | float | `= HT_PR_NangSuatThucTe` |
| 5 | 2 | TT_NS_CNS_SanXuat | CNS NV Sản xuất | float | `= TT_NS_CongThucTe * TT_NS_HeSoThang` |
| 6 | 2 | TT_NS_CNS_PhucVu | CNS NV Phục vụ | float | `= TT_NS_CongThucTe * TT_NS_HeSoThang * (1 + TT_NS_BoSungPV)` |
| 7 | 2 | TT_NS_CNS_NhanVien | CNS 1 NV (tự chọn nhánh SX/PV) | float | `= CASE WHEN PRT.TK_HR_LoaiNhanVien = 'SX' THEN TT_NS_CNS_SanXuat ELSE TT_NS_CNS_PhucVu END` |
| 8 | 3 | TT_NS_CNS_Ban | Tổng CNS Bàn/Nhóm gom | float | `= HT_PR_CNS_Ban` |
| 9 | 3 | TT_NS_CNS_PV_Scope | Tổng CNS PV trong scope | float | `= HT_PR_CNS_PV_Scope` |
| 10 | 3 | TT_NS_CNS_TongScope | Tổng CNS toàn scope | float | `= HT_PR_CNS_TongScope` |
| 11 | 4 | TT_NS_GiamChoPhucVu | Phần CNS Bàn bị giảm cho PV | float | `= CASE WHEN TT_NS_CNS_TongScope = 0 THEN 0 ELSE TT_NS_CNS_Ban * (TT_NS_CNS_PV_Scope / TT_NS_CNS_TongScope) END` |
| 12 | 4 | TT_NS_SauGiamPV | CNS Bàn sau khi giảm PV | float | `= TT_NS_CNS_Ban - TT_NS_GiamChoPhucVu` |
| 13 | 5 | TT_NS_SauChiaPV | NS Bàn sau chia PV | float | `= CASE WHEN TT_NS_CNS_TongScope = 0 THEN 0 ELSE TT_NS_NSTT_Ban * (TT_NS_SauGiamPV / TT_NS_CNS_TongScope) END` |
| 14 | 5 | TT_NS_KetQuaPhucVu | NS quy về cho PV | float | `= CASE WHEN PRT.TK_PR_NhomTinhNangSuat = 'NSC_NHIEU_DV' THEN 0 ELSE HT_PR_NSTT_Scope - HT_PR_NS_SauChiaPV_Scope END` |
| 15 | 6 | TT_NS_TinhLuong_SX | NS tính lương NV SX | float | `= CASE WHEN TT_NS_CNS_Ban = 0 THEN 0 ELSE (TT_NS_SauChiaPV / TT_NS_CNS_Ban) * TT_NS_CNS_NhanVien END` |
| 16 | 6 | TT_NS_TinhLuong_PV | NS tính lương NV PV | float | `= CASE WHEN TT_NS_CNS_Ban = 0 THEN 0 ELSE (TT_NS_GiamChoPhucVu / TT_NS_CNS_Ban) * TT_NS_CNS_NhanVien END` |
| 17 | 7 ⭐ | TT_NS_TinhLuong | KẾT QUẢ CUỐI LNS (OUTPUT) | float | `= CASE WHEN PRT.TK_HR_LoaiNhanVien = 'SX' THEN TT_NS_TinhLuong_SX ELSE TT_NS_TinhLuong_PV END` |

> Tất cả: `Dùng fn table = (Không)`, `Sử dụng? = Có`.

## 2.2 Chi tiết từng tiêu chí TT (kèm ví dụ & xử lý NULL)

| Mã catalog | Mã tiêu chí | Ví dụ kết quả | NULL/Default & Ghi chú |
|------------|-------------|---------------|------------------------|
| NS-TT01 | TT_NS_CongThucTe | `22.0` | NULL → 0 |
| NS-TT02 | TT_NS_HeSoThang | `1.10` | NULL → 1.0. Mỗi NV khác nhau |
| NS-TT03 | TT_NS_BoSungPV | `0.10` | NULL → 0 |
| NS-TT04 | TT_NS_NSTT_Ban | `500.0` | NULL → 0 |
| NS-TT05 | TT_NS_CNS_SanXuat | `22 × 1.10 = 24.2` | 0 nếu CTT=0. Áp dụng LoaiNV=SX |
| NS-TT06 | TT_NS_CNS_PhucVu | `22 × 1.10 × 1.1 = 26.62` | 0 nếu CTT=0. Áp dụng LoaiNV=PV |
| NS-TT07 | TT_NS_CNS_NhanVien | `24.2 (SX) / 26.62 (PV)` | 0 nếu CTT=0 |
| NS-TT08 | TT_NS_CNS_Ban | `297.253` | 0 → WARNING. HT đã xử lý TH2 vs TH3/TH4 |
| NS-TT09 | TT_NS_CNS_PV_Scope | `48.4` | TH3 (ko PV) → 0 |
| NS-TT10 | TT_NS_CNS_TongScope | `909.71` | 0 → WARNING. **Là mẫu số chia** |
| NS-TT11 | TT_NS_GiamChoPhucVu | `24.53` | TongScope=0 → 0 + WARNING. TH3 tự = 0 |
| NS-TT12 | TT_NS_SauGiamPV | `39.67` | ≥ 0; nếu âm → ghi ERROR log |
| NS-TT13 | TT_NS_SauChiaPV | `156.65` | TongScope=0 → 0 |
| NS-TT14 | TT_NS_KetQuaPhucVu | `635.54` | ≥ 0. TH3 → 0; TH2/TH4 tính bình thường |
| NS-TT15 | TT_NS_TinhLuong_SX | `53.65` | CNS_Ban=0 → 0 + WARNING |
| NS-TT16 | TT_NS_TinhLuong_PV | `9.23` | CNS_Ban=0 → 0 |
| NS-TT17 ⭐ | TT_NS_TinhLuong | `53.65 (SX) / 9.23 (PV)` | 0 nếu upstream=0. Đầu ra duy nhất |

---

# 3. MÀN HÌNH: TẠO CÔNG THỨC LƯƠNG (OUTPUT)

Màn này **ghép tiêu chí thành công thức lương cuối cùng** ghi vào `NS_Result.productivity_salary`. Với cụm LNS, công thức lương = đầu ra `TT_NS_TinhLuong`.

## 3.1 Bản ghi công thức lương cần seed

| Field prototype | Giá trị seed |
|-----------------|--------------|
| **Mã công thức** | `CT_LNS_NangSuatTinhLuong` |
| **Tên tiếng Việt** | Năng suất tính lương (kết quả LNS) |
| **Tên tiếng Anh** | LNS_Productivity_Salary |
| **Tiêu chí kết quả** | `TT_NS_TinhLuong` (NS-TT17) |
| **Công thức (SQL)** | `= TT_NS_TinhLuong` |
| **Kiểu dữ liệu** | float |
| **Ghi vào** | `NS_Result.productivity_salary` |
| **Điều kiện khóa** | Chỉ ghi chính thức khi `is_locked = 1`; nếu chưa khóa → `IsPreview = 1` |
| **LSP đọc lại qua** | `HT_PR_NangSuatTinhLuong` (NS-HT14) |
| **Sử dụng?** | Có |

## 3.2 Diễn giải logic OUTPUT (cho Dev/QA)

```
TT_NS_TinhLuong = CASE WHEN LoaiNV = 'SX' THEN TT_NS_TinhLuong_SX
                                          ELSE TT_NS_TinhLuong_PV END

trong đó:
  TT_NS_TinhLuong_SX = (NS_SauChiaPV / CNS_Ban) × CNS_NhanVien
  TT_NS_TinhLuong_PV = (GiamChoPhucVu / CNS_Ban) × CNS_NhanVien
```

- **Edge case bắt buộc seed/test:** `CNS_Ban = 0` → kết quả `0` + WARNING; mọi mẫu số = 0 → trả `0` (không để `#DIV/0!`).
- **Acceptance:** Đạt khi với NV SX có đủ dữ liệu, `TT_NS_TinhLuong = TT_NS_TinhLuong_SX`; với NV PV thì `= TT_NS_TinhLuong_PV`; khi kỳ đã khóa, `HT_PR_NangSuatTinhLuong` trả đúng giá trị `TT_NS_TinhLuong` đã ghi.

---

# PHỤ LỤC A – TIÊU CHÍ TÌM KIẾM (Lớp 1 – TK) cần seed trước

Các tiêu chí TT/HT tham chiếu 2 tiêu chí TK quan trọng (`TK_HR_LoaiNhanVien`, `TK_PR_NhomTinhNangSuat`). Nếu màn "Tiêu chí tìm kiếm" chưa có, seed các dòng sau:

| Mã catalog | Mã tiêu chí | Tên tiếng Việt | Kiểu DL | Công thức (SQL) | NULL/Default |
|------------|-------------|----------------|---------|-----------------|--------------|
| NS-TK01 | TK_HR_DonViCap3 | Đơn vị cấp 3 (Bộ phận tính lương) | nvarchar(100) | `dbo.HR_fnGetDonVi(PR.EmpID, PR.ToDate, 3)` | NULL → WARNING |
| NS-TK02 | TK_HR_DonViCap4 | Đơn vị cấp 4 (Ka) | nvarchar(100) | `dbo.HR_fnGetDonVi(PR.EmpID, PR.ToDate, 4)` | NULL → WARNING |
| NS-TK03 | TK_HR_DonViCap5 | Đơn vị cấp 5 (Bàn) | nvarchar(100) | `dbo.HR_fnGetDonVi(PR.EmpID, PR.ToDate, 5)` | NULL → WARNING |
| NS-TK04 ⚠️ | TK_HR_LoaiNhanVien | Loại NV: SX / PV | nvarchar(10) | `dbo.HR_fnGetLoaiNhanVien(PR.EmpID, PR.FromDate, PR.ToDate)` | NULL → 'SX' + WARNING. **BLOCKING OP-02** |
| NS-TK05 ⚠️ | TK_PR_NhomTinhNangSuat | Nhóm tính NS: NSR/NSC_1DV/NSC_NHIEU_DV/NSC_TACH_PV | nvarchar(30) | `dbo.PR_fnGetNhomTinhNangSuat(PR.BanID, PR.PRMonth)` | NULL → BLOCKING |
| NS-TK06 | TK_PR_NhomGomDonVi | Mã nhóm gom ĐV (TH3/TH4) | nvarchar(50) | `dbo.PR_fnGetNhomGomDonVi(PR.BanID, PR.PRMonth)` | NULL khi TH2 |
| NS-TK07 | TK_HR_LoaiHopDong | Loại hợp đồng | nvarchar(50) | `dbo.HR_fnGetLoaiHopDong(PR.EmpID, PR.FromDate, PR.ToDate)` | NULL → '' |

---

# PHỤ LỤC B – THAM SỐ HỆ THỐNG (PR.) engine inject

Các token `PR.xxx` trong công thức là tham số engine tự bơm, **không phải tiêu chí cần seed**, nhưng cần có để công thức chạy:

| Token | Mô tả | Ví dụ |
|-------|-------|-------|
| PR.EmpID | Mã NV đang xử lý | `NV001` |
| PR.PRMonth | Kỳ tính MM/yyyy | `06/2026` |
| PR.FromDate / PR.ToDate | Cặp ngày giai đoạn tính | `2026-06-01` / `2026-06-30` |
| PR.StageID | Mã Công đoạn (output per NV × CĐ) | `CD001` |
| PR.BanID | Mã Bàn (ĐV cấp 5) | `PTO101` |
| PR.KaID | Mã Ka (ĐV cấp 4) | `KA1` |
| PR.DeptID | Mã Bộ phận (ĐV cấp 3) | `PTO` |
| PR.NhomTinhNS_ID | Nhóm tính NS của Bàn trong tháng | `NSC_1DV` |
| PR.NhomGomID | Mã nhóm gom (TH3/TH4), NULL nếu TH2 | `GOM_CB_KA1` |

---

# PHỤ LỤC C – FUNCTION PHỤ THUỘC (trạng thái)

| Function | Trạng thái | Dùng cho tiêu chí |
|----------|-----------|-------------------|
| HR_fnGetDonVi | 🔵 CẦN TẠO MỚI | TK01/02/03 |
| HR_fnGetLoaiNhanVien | ⚠️ CẬP NHẬT (BLOCKING OP-02) | TK04 |
| PR_fnGetNhomTinhNangSuat | 🔵 CẦN TẠO MỚI | TK05 |
| PR_fnGetNhomGomDonVi | 🔵 CẦN TẠO MỚI | TK06 |
| PTS_fnGetCongChiTietNgay | ✅ CÓ SẴN | HT01 |
| PR_fnGetHeSoNangSuatThang | ✅ CÓ SẴN | HT02 |
| PR_fnGetPhanTramBoSungPhucVu | ✅ CÓ SẴN | HT03 |
| PR_fnGetNangSuatThucTe | ✅ CÓ SẴN | HT04 |
| PR_fnGetNangSuatThucTe_LoaiCa | 🔵 CẦN TẠO MỚI | HT05/06/07/08 |
| PR_fnGetCNS_Ban | 🔵 CẦN TẠO MỚI | HT09 |
| PR_fnGetCNS_PV_Scope | 🔵 CẦN TẠO MỚI | HT10 |
| PR_fnGetCNS_TongScope | 🔵 CẦN TẠO MỚI | HT11 |
| PR_fnGetNSTT_Scope | 🔵 CẦN TẠO MỚI | HT12 |
| PR_fnGetNS_SauChiaPV_Scope | 🔵 CẦN TẠO MỚI | HT13 |
| PR_fnGetNangSuatTinhLuong | ✅ CÓ SẴN | HT14 |

---

# PHỤ LỤC D – OPEN POINTS / NEED CONFIRM (trước khi seed thật)

| Mã OP | Tiêu chí ảnh hưởng | Cần xác nhận | Mức độ |
|-------|--------------------|--------------|--------|
| OP-02 | TK_HR_LoaiNhanVien (TK04) | Field nào trong Quá trình làm việc xác định NV là SX hay PV? | 🔴 BLOCKING |
| OP-NEW-01 | TK_PR_NhomTinhNangSuat (TK05) | UI "Thiết lập nhóm tính LNS" cần thêm combobox Loại tính NS + grid chọn ĐV cấp 5 cùng nhóm gom | 🟡 NEED CONFIRM |
| OP-NEW-02 | 5 function aggregate HT09-13 | Dev tạo 5 function theo spec sheet 02_Functions | 🟡 DEV ACTION |
| OP-NEW-03 | TH1 – NSR | Format/mapping/validate template import kết quả NS từ ngoài | 🟡 NEED CONFIRM |
| OP-NEW-06 | 5 function aggregate (performance) | ~3000 NV × SUM/function → đánh giá performance (precompute / view materialized) | 🟡 DEV REVIEW |

---

*Ghi chú seed prototype:* nhập theo thứ tự **TK → HT → TT → Tạo công thức lương**. Trong từng màn, nhập theo cột **Thứ tự** (TT theo Rank) để token tham chiếu luôn tồn tại trước khi được gọi.
