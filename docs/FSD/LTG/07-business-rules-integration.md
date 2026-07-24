# 07 — Business Rules Consolidated & Integration Points

## Phần A — Business Rules (8 rules chính)

### BR-01 · Cross-row BH (Bảo hiểm)

**Rule**: Khi 1 NV có N dòng lương trong 1 kỳ (multi-BPTL/QTLV), BH chỉ trích **1 lần ở dòng lương MAX** (`TotalIncome` cao nhất).

**Configuration**: Tiêu chí `TT_TruBHXH`, `TT_TruBHYT`, `TT_TruBHTN` cấu hình ở set3 với `Allocation = MaxSalaryRow`.

**Cap semantics (QUAN TRỌNG)**:
- Cap `min(LuongMax, PR_fnGetTranBHVung)` **chỉ tính trên `TotalIncome` của DÒNG lương MAX** — **KHÔNG cộng tổng thu nhập cả kỳ rồi cap**. Base BH = min(dòng MAX, trần vùng); các dòng còn lại trả `0`.
- `@Date` truyền cho `PR_fnGetTranBHVung` = **`sliceToDate` của dòng lương MAX** (không phải `@ToDate` cả kỳ). Nếu NV chuyển vùng giữa kỳ (VD 15/05 chuyển từ vùng III sang vùng II), engine dùng vùng tại thời điểm cuối của dòng MAX — đảm bảo trần khớp với vùng NV thực sự thuộc khi phát sinh lương MAX đó.

**Engine flow (per-row via function)**:
```sql
-- Pha 2 · Trích BH per-row (function tự biết dòng nào MAX; @Date = sliceToDate của dòng MAX)
UPDATE BangTinhLuong
  SET TruBH = dbo.PR_fnGetTrichBH_RowV2(empId, kyId, luotDong)
WHERE kyId = @KyID AND empId = @EmpID;
-- Function trả 0 cho mọi dòng không phải MAX,
-- trả trichBH cho dòng MAX (đã auto-cap theo trần vùng tại sliceToDate của chính dòng MAX).
```

**Function chain**:
- `PR_LSP_fnGetMaxLuongGopKy(@EmpID, @KyID)` → **giá trị TotalIncome lớn nhất** trong kỳ (dùng làm base tính BH). Return `decimal(18,2)`.
- `PR_fnGetTranBHVung(@EmpID, @Date)` → **trần lương đóng BH** theo vùng của NV tại `@Date` (LTT vùng × 20). Return `decimal(18,2)`. `@Date` = `sliceToDate` của dòng MAX. KHÔNG hardcode.
- `PR_fnGetTrichBH_RowV2(@EmpID, @KyID, @LuotDong)` → return `> 0` chỉ khi row là dòng MAX; auto cap `min(LuongMaxRow, PR_fnGetTranBHVung(@EmpID, sliceToDate_MAX))`, các row khác trả `0`. Return `decimal(18,2)`.
  - **V1 legacy** `PR_fnGetTrichBH_Row(@EmpID, @PRMonth, @PRYear, @RowIndex)` giữ nguyên cho LSP/LNS backward-compat — LTG engine chỉ gọi V2.

**Trần BH (configurable)**:
- Engine gọi `PR_fnGetTranBHVung` — function ngầm lookup: NV → Đơn vị → Vùng (I/II/III/IV) → LTT vùng tại `@Date` × 20.
- KH cấu hình mức trần và LTT vùng ở màn **HR data / Salary Config** (ngoài scope LTG core). LTT vùng thay đổi (thường 1/7 hằng năm) → chỉ update ở HR data, engine tự nhận ở kỳ kế tiếp không cần redeploy.
- Ví dụ tại 2026-05-31: vùng III → LTT `3,640,000` × 20 = trần `72,800,000` (giá trị này KH có thể sửa runtime, không cứng trong code).

**Edge case**:
- 2 dòng bằng nhau `TotalIncome` → chọn dòng có `sliceToDate` xa hơn (giai đoạn cuối hơn); nếu vẫn bằng → `rowId` lớn hơn. Logic tiebreaker đặt trong `PR_fnGetTrichBH_RowV2`.
- NV chuyển vùng giữa kỳ (vùng III → vùng II 15/05) mà dòng MAX rơi vào GĐ sau → dùng vùng II (theo `sliceToDate.MAX = 31/05`); nếu dòng MAX rơi vào GĐ trước (kết thúc 14/05) → dùng vùng III.

---

### BR-02 · Cross-row Thuế TNCN (TẠM TRÍCH THÁNG)

**Bản chất**: Thuế TNCN trong LTG là **THUẾ TẠM TRÍCH THÁNG** — không phải quyết toán năm. Engine chỉ xét thu nhập trong THÁNG hiện tại, KHÔNG cộng dồn các tháng trước, KHÔNG tự động phân bổ ngược năm.

**Cuối năm KH có thể quyết toán riêng** — làm module riêng, out of scope LTG core. Nếu KH cần, mở FSD riêng cho module "Quyết toán thuế TNCN năm".

**Rule tạm trích**:
1. Engine gộp mọi dòng lương của NV trong 1 kỳ (tháng) → **tổng thu nhập chịu thuế tháng**.
2. Trừ **giảm trừ tháng**: bản thân `11,000,000` + `4,400,000` × N phụ thuộc + BH bắt buộc trong tháng (BHXH 8% + BHYT 1.5% + BHTN 1% đã cap trần vùng).
3. Còn lại = **Thu nhập tính thuế tháng** → áp bậc thuế lũy tiến 7 bậc VN (chỉ trên thu nhập tháng, KHÔNG cộng dồn năm).
4. Kết quả `TruThue` dồn vào **dòng cuối** (`Allocation = LastStageRow`, `AllowSumPrev = Y`) hoặc phân bổ ngược per-row proportional theo `TotalIncome` (tùy config KH).

**Engine flow**:
```sql
-- Pha 2 · Tính thuế TNCN TẠM TRÍCH THÁNG
DECLARE @TongTNCT_Thang FLOAT = dbo.PR_LSP_fnGetSumTNChiuThueKy(@EmpID, @KyID);
DECLARE @SumBH_Thang    FLOAT = (SELECT SUM(TruBH) FROM BangTinhLuong
                                 WHERE kyId=@KyID AND empId=@EmpID);
DECLARE @SoPhuThuoc     INT   = dbo.HR_fnGetSoNguoiPhuThuoc(@EmpID, @ToDate);
DECLARE @GiamTru_Thang  FLOAT = 11000000 + 4400000 * @SoPhuThuoc + @SumBH_Thang;
DECLARE @TNTinhThue     FLOAT = @TongTNCT_Thang - @GiamTru_Thang;

-- Bậc 7 lũy tiến ÁP TRÊN THU NHẬP THÁNG (không cộng dồn năm)
DECLARE @ThueTNCN_Thang FLOAT = dbo.PIT_fnCalcThue(@TNTinhThue, @SoPhuThuoc);

-- Dồn vào dòng cuối
DECLARE @LastRowID BIGINT = (
  SELECT TOP 1 rowId FROM BangTinhLuong
  WHERE kyId = @KyID AND empId = @EmpID
  ORDER BY sliceToDate DESC, luotDong DESC
);
UPDATE BangTinhLuong SET TruThue = @ThueTNCN_Thang WHERE rowId = @LastRowID;
UPDATE BangTinhLuong SET TruThue = 0
  WHERE kyId = @KyID AND empId = @EmpID AND rowId <> @LastRowID;
```

**Function**:
- `PR_LSP_fnGetSumTNChiuThueKy(@EmpID, @KyID)` — tổng TN chịu thuế toàn kỳ (base gộp mọi dòng).
- `PIT_fnGetGiamTru(@EmpID, @Date)` — giảm trừ tháng (bản thân + phụ thuộc). BH bắt buộc lấy từ `SUM(TruBH)` sau khi BR-01 xong.
- `PIT_fnCalcThue(TNChiuThue_Thang, SoNguoiPhuThuoc)` — bậc 7 lũy tiến VN (5%/10%/15%/20%/25%/30%/35%) áp **chỉ trên thu nhập tháng**.

**Bậc thuế 7 mức áp cho thu nhập chịu thuế THÁNG** (2026):
| Bậc | TN chịu thuế/tháng | Suất |
|-----|-----|-----|
| 1 | ≤ 5tr | 5% |
| 2 | 5-10tr | 10% |
| 3 | 10-18tr | 15% |
| 4 | 18-32tr | 20% |
| 5 | 32-52tr | 25% |
| 6 | 52-80tr | 30% |
| 7 | > 80tr | 35% |

**Edge case**:
- Kỳ 13 thưởng Tết → là **1 kỳ lương riêng** trong tháng nhận → tính thuế tạm trích như kỳ thường (áp bậc trên số thu nhập tháng đó).
- KHÔNG có option "Rải đều 12 tháng" (đã bỏ do bản chất tạm trích tháng — xem BR-07).
- Nếu tháng có nhiều kỳ (VD tháng có LTG + Kỳ 13) → mỗi kỳ tính thuế tạm trích riêng, đóng thuế riêng; quyết toán năm KH tự làm ở module riêng.

---

### BR-03 · Multi-page phiếu lương (Legal ND145)

**Rule**: NV có N dòng lương → in **N phiếu A4 độc lập**, mỗi phiếu là 1 phiếu hợp lệ pháp lý theo Điều 22 Nghị định 145/2020/NĐ-CP.

**Simplification (đã chốt)**: Bỏ Pattern B (gộp N dòng vào 1 phiếu tổng) và Pattern C (chỉ in dòng MAX). **Chỉ áp dụng Pattern A** — 1 dòng = 1 phiếu.

**Implementation**:
- Viewer set-xem-phieu-luong render N page với indicator `Trang X / N`.
- Mỗi page tự chứa đủ: header, meta, chi tiết, thu nhập, khấu trừ, NET, chữ ký, legal footer.
- Dòng có BH = 0 (do BR-01 dồn dòng MAX) → phiếu vẫn hiển thị "BHXH: 0" để rõ ràng.
- Dòng có Thuế = 0 (do BR-02 dồn dòng cuối) → tương tự.

---

### BR-04 · Rank + Dependency (Topological order)

**Rule**: Tiêu chí `TT_` có `Rank` từ 1 → N; `Rank` thấp chạy trước `Rank` cao. Trong cùng Rank, xét `Priority` (ở set3). `@Prev_<Mã>` inject kết quả tiêu chí Rank thấp hơn vào SQL của tiêu chí Rank cao.

**Algorithm**:
```
1. Parse SQL của mọi TT_ để build dependency graph:
   regex /@Prev_[A-Z]+_[A-Za-z0-9_]+/gi
2. Group theo Rank; trong Rank sort theo Priority ASC.
3. Chạy topological — nếu detect cycle → engine reject config (báo ở set3 khi save).
4. Rank cùng nhau chạy PARALLEL (multi-thread trong SQL Server ~ MAXDOP 4).
```

**Sample dependency**:
```
TT_LuongCoBan (Rank 1, Priority 10) — không dep
TT_TLTGTrongGio (Rank 2, Priority 20) — dep: HT_TG_TrongGio, HT_DonGiaGio
TT_TongTNCT (Rank 3, Priority 30) — dep: @Prev_TT_TLTGTrongGio + @Prev_TT_PhuCap
TT_TruBHXH (Rank 5, Priority 100) — dep: @Prev_TT_TongTNCT (cross-row MaxSalaryRow)
TT_TruThueTNCN (Rank 7, Priority 200) — dep: SUM(@Prev_TT_TongTNCT) - GiamTru
TT_NetIncome (Rank 8, Priority 300) — dep: @Prev_TT_TongTNCT - @Prev_TT_TruBHXH - @Prev_TT_TruThueTNCN
```

---

### BR-05 · Filter cascade (ĐV & NTL)

**Rule**: Cascade filter được áp dụng ở set5, set6, set7, set13:
- ĐV cấp 1 → 2 → 3 → 4 → 5 (nested organization)
- NTL cấp 1 → 2 → 3 (nested pay group)

**Behavior**:
- Chọn cấp cha → filter list cấp con.
- Không chọn cấp cha (giá trị `-- Tất cả --`) → cấp con hiển thị full options.
- Xóa cấp cha đã chọn → reset toàn bộ cấp con về `-- Tất cả --`.

**Implementation**: Client-side (dropdown JS) hoặc AJAX per level tùy screen. Ưu tiên client-side khi số options < 500.

---

### BR-06 · Khóa lương & Audit trail

**Rule**: 4 hành động khóa/mở lương ở set7:

| Hành động | Scope | Confirmation | Permission |
|-----------|-------|--------------|-----------|
| Khóa dòng chọn | Selected rows | Không | HR-Payroll |
| Mở khóa dòng chọn | Selected rows | Không | HR-Payroll |
| Khóa tất cả (theo filter) | Filter matches | Confirm 1 lần | HR-Payroll |
| Mở khóa tất cả | Filter matches | Confirm 2 lần | Admin only |

**Audit trail** — ghi log mọi hành động khóa/mở:
```sql
INSERT INTO AuditLog_KhoaLuong (rowId, action, actionBy, actionAt, oldValue, newValue, reason)
VALUES (@RowID, 'LOCK', @UserID, GETDATE(), 0, 1, @Reason);
```

**Bảng `AuditLog_KhoaLuong`**:
| Field | Type | Sample |
|-------|------|--------|
| logId | bigint IDENTITY | 1001 |
| rowId | bigint FK | 90001 |
| action | enum | `LOCK` / `UNLOCK` |
| actionBy | varchar(50) | `HR_PAYROLL_01` |
| actionAt | datetime | 2026-06-05 09:15:22 |
| oldValue | bit | 0 |
| newValue | bit | 1 |
| reason | nvarchar(500) | Optional cho unlock |

---

### BR-07 · Kỳ 13 & Kỳ điều chỉnh (retro)

**Rule**: Kỳ 13 (thưởng Tết) và Kỳ điều chỉnh (retro) là các kỳ đặc biệt:
- Kỳ 13: 1 lần/năm, `loaiKy=Ky13`, `thang=<tháng nhận>` (thường 1 hoặc 12), tính thưởng dựa trên bình quân 12 tháng.
- Kỳ điều chỉnh: `loaiKy=DieuChinh`, tham chiếu 1 kỳ nguồn, chỉ tính delta.

**Business impact**:
- **Thuế TNCN**: Kỳ 13 = **1 kỳ lương riêng trong tháng nhận** → tính thuế TẠM TRÍCH THÁNG như kỳ bình thường (áp bậc lũy tiến trên số thu nhập tháng đó). **KHÔNG còn option "Rải đều 12 tháng"** — vì bản chất LTG chỉ tạm trích tháng, không cộng dồn năm (xem BR-02). Nếu KH cần bù trừ cuối năm → làm ở module Quyết toán thuế TNCN năm (out of scope LTG core).
- **BH**: Kỳ 13 KHÔNG trích BH (chỉ thưởng thuần, không phải lương làm căn cứ đóng BH).
- **Retro**: Chỉ ghi delta, không tạo phiếu mới, cộng vào phiếu kỳ hiện tại. Thuế delta cũng tạm trích theo tháng ghi nhận, không hồi tố các tháng cũ.

---

### BR-08 · Validation Publish kỳ

**Rule**: Trước khi Publish kỳ (chuyển `trangThai: Đã tính → Đã khóa` toàn kỳ), engine chạy validation:

| Check | Rule | Action |
|-------|------|--------|
| CK-01 | Mọi NV trong DS phải có ≥1 dòng lương | Reject + list NV thiếu |
| CK-02 | Không có `NetIncome < 0` | Warning, cho Publish nếu Admin confirm |
| CK-03 | Cross-row BH: mỗi NV chỉ 1 dòng có TruBH > 0 | Reject nếu vi phạm |
| CK-04 | Cross-row Thuế: mỗi NV chỉ 1 dòng có TruThue > 0 | Reject nếu vi phạm |
| CK-05 | Sum(NetIncome) khớp Sum(TotalIncome) - Sum(TruBH) - Sum(TruThue) | Reject nếu lệch |
| CK-06 | Mọi tiêu chí function scalar `trangThai = Đã có` (không có Đề xuất/Đang PT) | Reject |
| CK-07 | Kỳ có Template phiếu gán cho mọi cơ cấu (set13) | Warning |

## Phần B — Integration Points (5 nhóm)

### INT-01 · Millennium Core (SQL Server on-prem)

Millennium là core cũ do FPT triển khai, chứa 7 module chính. LTG **chỉ READ**, không WRITE.

| Module | Bảng chính | Function scalar sử dụng |
|--------|-----------|-------------------------|
| NHÂN SỰ | `HR_NhanSu`, `HR_QuaTrinh` | `HR_fnGetHoTen`, `HR_fnGetDonVi`, `HR_fnGetChucVu`, `HR_fnGetBPTL`, `HR_fnGetVungMien`, `HR_fnGetSoNguoiPhuThuoc` |
| THỜI VIỆC | `HR_ThoiViec` | `HR_fnGetNgayThoiViec`, `HR_fnGetLyDoNghi` |
| CHẤM CÔNG | `PTS_ChamCong`, `PTS_Ca` | `PTS_fnGetCaChinh`, `PTS_fnGetCongTrongGio`, `PTS_fnGetCongNgoaiGio`, `PTS_fnGetChoTienAn`, `PTS_fnGetCongLe` |
| BẢO HIỂM | `BH_ThamGia`, `BH_MucLuong` | `BH_fnGetMucBH`, `PR_fnGetTrichBH_RowV2` (LTG) / `PR_fnGetTrichBH_Row` (V1 legacy LSP/LNS) |
| LƯƠNG | `PR_KyLuong`, `PR_KetQua` | Legacy — không dùng cho LTG mới |
| THƯỞNG | `PR_Thuong` | `PR_fnGetThuongThang` |
| THUẾ | `PIT_ThueSuat`, `PIT_GiamTru` | `PIT_fnGetGiamTru`, `PIT_fnCalcThue`, `PIT_fnGetThueBac` |

**Contract**: LTG chỉ gọi function scalar (SCHEMABINDING) — không SELECT trực tiếp bảng để dễ maintain khi Millennium đổi schema.

---

### INT-02 · HR Data (thông tin nhân sự)

Cần cho toàn bộ tiêu chí TK_ và filter set6/set7.

**Function chính**:
```sql
dbo.HR_fnGetHoTen(@EmpID varchar(20)) RETURNS nvarchar(255)
dbo.HR_fnGetDonVi(@EmpID varchar(20), @Date date, @Cap tinyint) RETURNS nvarchar(255)
dbo.HR_fnGetSoNguoiPhuThuoc(@EmpID varchar(20), @Date date) RETURNS int
dbo.HR_fnGetNgayVaoLam(@EmpID varchar(20)) RETURNS date
dbo.HR_fnGetTaiKhoanATM(@EmpID varchar(20)) RETURNS varchar(50)
```

**Data quality**: HR update trạng thái Nghỉ việc muộn → có thể sinh NV nghỉ trong DS tính lương. Xử lý ở set6 (row-nghi vàng).

---

### INT-03 · Chấm công

Nguồn tính `HT_TG_TrongGio`, `HT_TG_NgoaiGio`, `HT_ChoTienAn`, `HT_CongLe`, `HT_CongDem`.

**Function chính**:
```sql
dbo.PTS_fnGetCaChinh(@EmpID, @Date) RETURNS varchar(20)
dbo.PTS_fnGetCongTrongGio(@EmpID, @FromDate, @ToDate) RETURNS float
dbo.PTS_fnGetCongNgoaiGio(@EmpID, @FromDate, @ToDate) RETURNS float
dbo.PTS_fnGetChoTienAn(@EmpID, @FromDate, @ToDate) RETURNS int
dbo.PTS_fnGetCongSlice(@EmpID, @SliceFromDate, @SliceToDate) RETURNS float
```

**SLA**: Chấm công phải chốt trước ngày 3 tháng sau; nếu chưa chốt → set7 chạy sẽ có warning `Công chưa chốt cho N NV`.

---

### INT-04 · Thuế TNCN

**Function**:
```sql
dbo.PIT_fnGetGiamTru(@EmpID, @TaxYear)          -- 11tr bản thân + 4.4tr × N phụ thuộc
dbo.PIT_fnCalcThue(@ThuNhapTinhThue)           -- bậc 7 lũy tiến
dbo.PIT_fnGetThueBac(@ThuNhapTinhThue)         -- return bậc (1-7)
```

**Bậc thuế 7 mức (2026, chưa thay đổi)**:
| Bậc | TN chịu thuế/tháng | Thuế suất |
|-----|-----|-----|
| 1 | ≤5tr | 5% |
| 2 | 5-10tr | 10% |
| 3 | 10-18tr | 15% |
| 4 | 18-32tr | 20% |
| 5 | 32-52tr | 25% |
| 6 | 52-80tr | 30% |
| 7 | >80tr | 35% |

---

### INT-05 · Bảo hiểm

**Function** (return `decimal(18,2)` — tiền tệ chính xác 2 chữ số, tránh xấp xỉ float ở cận biên trần vùng):
```sql
dbo.PR_LSP_fnGetMaxLuongGopKy(@EmpID, @KyID) → decimal(18,2)
  -- TotalIncome MAX của NV trong kỳ
dbo.PR_fnGetTranBHVung(@EmpID, @Date) → decimal(18,2)
  -- Trần lương đóng BH theo vùng (LTT × 20). @Date = sliceToDate của dòng MAX.
dbo.PR_fnGetTrichBH_RowV2(@EmpID, @KyID, @LuotDong) → decimal(18,2)
  -- Return > 0 chỉ khi row là dòng MAX; các row khác trả 0.
  -- Auto cap min(LuongMaxRow, PR_fnGetTranBHVung(@EmpID, sliceToDate_MAX)).
  -- KHÔNG cộng tổng thu nhập cả kỳ rồi cap — chỉ cap trên dòng MAX.
  -- Nội bộ tính BHXH 8% + BHYT 1.5% + BHTN 1%.
  -- V1 legacy dbo.PR_fnGetTrichBH_Row(@EmpID,@PRMonth,@PRYear,@RowIndex) giữ nguyên cho LSP/LNS backward-compat.
dbo.BH_fnGetMucBH(@EmpID, @Date)                -- mức đóng BH quy đổi (nếu cần chi tiết)
```

**Trần BH — CONFIGURABLE** (không hardcode trong engine):
- Engine gọi `PR_fnGetTranBHVung(@EmpID, @Date)` — function tự lookup NV → Đơn vị → Vùng → LTT vùng × 20.
- KH cấu hình mức trần và LTT vùng ở màn **HR data / Salary Config** (module riêng, ngoài scope LTG core).
- Ví dụ giá trị hiện hành 2026 (chỉ minh họa, không cứng trong code):
  - Vùng I ≈ 93.600.000 · Vùng II ≈ 83.200.000 · Vùng III ≈ 72.800.000 (MPHG Hậu Giang) · Vùng IV ≈ 65.000.000
- Khi LTT vùng thay đổi (thường 1/7 hằng năm) → KH chỉ update ở HR data, engine tự áp dụng ở kỳ kế tiếp không cần deploy.

---

### INT-06 · ESS/Mobile app MPHG (Giai đoạn 2)

**Scope Giai đoạn 2**:
- Publish phiếu lương từ set-xem-phieu-luong → push notification.
- Biometric auth (FaceID/TouchID) → decrypt phiếu tại device.
- Offline cache 3 kỳ gần nhất.
- QR code hoặc PIN 6 số fallback.

**API Contract chuẩn bị sẵn (Giai đoạn 1)**:
```json
GET /api/ess/phieuluong/{empId}/{kyId}
Response: {
  "empId": "1022907668",
  "kyId": "KY_202605_LTG",
  "totalPages": 2,
  "pages": [
    { "pageIndex": 1, "html": "<div>...</div>", "encryptedPdfUrl": "..." },
    { "pageIndex": 2, "html": "<div>...</div>", "encryptedPdfUrl": "..." }
  ]
}
```

**Snapshot**: khi Publish, freeze data → `PhieuLuongData` (không thay đổi kể cả engine re-calc). Publish rollback = tạo version mới, giữ history.

## Phần C — Edge Cases tổng hợp

| # | Case | Impact | Handling |
|---|------|--------|----------|
| E-01 | NV nghỉ thai sản trong kỳ | NetIncome có thể âm (ứng lương trước) | Warning, cho Publish nếu Admin confirm; phiếu hiển thị số âm màu đỏ `(1,000,000)` |
| E-02 | NV mới vào giữa tháng | 1 dòng lương, `sliceFromDate = ngayVaoLam` | Prorata công chuẩn theo `SliceDays / TotalDays` |
| E-03 | NV thôi việc giữa tháng | 1 dòng lương, `sliceToDate = ngayNghi` | Auto tính trợ cấp thôi việc (function `HR_fnGetTroCapThoiViec`) — cộng vào TotalIncome |
| E-04 | NV nhiều BPTL (chuyển bàn) | N dòng lương, cross-row BH/Thuế | BR-01 và BR-02 xử lý |
| E-05 | NV lương cao vượt trần BH | BH cap tại `20 × LTT` (chỉ trên dòng MAX, không cộng tổng kỳ) | `PR_fnGetTrichBH_RowV2` auto cap `min(LuongMaxRow, PR_fnGetTranBHVung(@EmpID, sliceToDate_MAX))` |
| E-06 | NV thai sản không có lương | 0 dòng lương | Không sinh phiếu; xuất báo cáo riêng "NV thai sản không nhận lương" |
| E-07 | 2 dòng bằng nhau TotalIncome | BR-01 tiebreaker | Ưu tiên `sliceToDate` xa hơn, sau đó `rowId` lớn hơn |
| E-08 | Function scalar chưa `Đã có` | Runtime error | CK-06 chặn Publish |
| E-09 | Template phiếu placeholder không resolve | Cell trống `«Mã»` | Log warning, không block xuất phiếu |
| E-10 | Kỳ 13 gộp thuế | Bậc thuế tháng cao | Chấp nhận (bản chất tạm trích tháng). KH quyết toán bù trừ ở module Quyết toán năm (out of scope). |
| E-11 | Retro (kỳ điều chỉnh) | Chỉ ghi delta | Cộng vào phiếu kỳ hiện tại, không tạo phiếu mới |
| E-12 | NV có LSP + LTG + LNS đồng thời | 3 kỳ khác nhau | Mỗi kỳ 1 loại; phiếu tổng hợp cross-kỳ = Giai đoạn 2 |

## Phần D — Non-Functional Requirements gợi ý

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Chạy set7 tính lương cho 5000 NV | ≤ 5 phút (MAXDOP 4, aggregate materialized) |
| Performance | Load grid set7 filter | ≤ 3s cho 500 rows |
| Performance | Xuất phiếu PDF 100 NV | ≤ 30s |
| Availability | Uptime giờ hành chính | 99.5% (8h-17h thứ 2-thứ 7) |
| Security | Audit trail | Ghi mọi CRUD trên `BangTinhLuong`, `KyLuong`, `Formula`, khóa/mở |
| Security | Encryption | Phiếu ESS/Mobile mã hóa AES-256 |
| Security | RBAC | 5 role: Admin, BA, HR-Payroll, Auditor, NV, Manager |
| Scalability | Growth | 10,000 NV / kỳ trong 3 năm — engine phải scale |
| Backup | Kỳ đã publish | Backup snapshot hàng ngày, retain 7 năm (luật thuế) |
