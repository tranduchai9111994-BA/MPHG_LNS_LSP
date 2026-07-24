# 04 — Cụm Vận hành (3 màn)

> Gồm: `set-taokyluong` · `set6` · `set7`
> Actor chính: **HR-Payroll**. Chạy định kỳ mỗi tháng.

---

## SET-TAOKYLUONG — Tạo kỳ lương (LTG)

- **File**: `lsp/set-taokyluong.html`
- **Actor**: HR-Payroll
- **Use case**: Master kỳ lương — định danh 1 kỳ tính lương với BPTL/NTL/khoảng thời gian. 1 tháng có thể có nhiều kỳ (LTG + LSP + LNS + Kỳ 13 + Điều chỉnh).

### UI Layout
```
breadcrumb  Lương › Chức năng LSP › Tạo kỳ lương
page-title  TẠO KỲ LƯƠNG SẢN PHẨM (MỞ RỘNG)                [📋 Quy tắc]
form-panel  Tên kỳ* | Loại kỳ* select (LTG/LSP/LNS/Ky13/DieuChinh)
            Tháng* [1-12] | Năm* [YYYY] | Từ ngày* date | Đến ngày* date
            BP áp dụng* (multi-select combo với search + chips)
            NTL cấp 1 | NTL cấp 2 | NTL cấp 3 (multi-select cascade)
            BPTL* (multi-select combo)
            ☑ Auto-load NV từ HR
actions     [Tìm Kiếm][Lưu][Xóa][Nhân bản kỳ][Xuất Excel]
grid        cột: ☐ STT ✎ | Mã kỳ | Tên kỳ | Loại | Tháng/Năm | From/To | BPTL (badge) | NTL | Trạng thái badge | audit(4)
```

### Fields
| Field | Type | Mandatory | Sample |
|-------|------|-----------|--------|
| kyId | varchar(30) auto-gen | Y | `KY_202605_LTG` |
| tenKy | nvarchar(255) | Y | `Kỳ lương tháng 5/2026 - LTG` |
| loaiKy | enum | Y | `LTG` |
| thang | tinyint 1-12 | Y | 5 |
| nam | smallint | Y | 2026 |
| fromDate/toDate | date | Y | 2026-05-01 / 2026-05-31 |
| bpApDung | multi array | Y | `[CB101, CB102, VP01]` |
| ntl1/2/3 | array | O | `[NTL_A]` |
| bptl | multi array | Y | `[BPTL_001, BPTL_002]` |
| trangThai | enum | Y | `Nháp` → `Đã tạo` → `Đang tính` → `Đã tính` → `Đã khóa` |

### Business Rules
- **BR-K01**: kyId auto-gen theo pattern `KY_<YYYYMM>_<LoaiKy>` — unique.
- **BR-K02**: fromDate ≤ toDate; trong cùng tháng (`MONTH(fromDate)=MONTH(toDate)=thang`).
- **BR-K03**: Không được sửa kỳ `trangThai ≥ Đang tính` (chỉ mở khóa được bởi Admin).
- **BR-K04**: Nhân bản kỳ — copy full setup từ kỳ tháng trước, cho phép edit.
- **BR-K05**: Nếu loại kỳ = LTG → auto-populate BPTL toàn bộ (checkbox `Auto-load`).

### Actions
| Button | Handler |
|--------|---------|
| Lưu | POST /api/kyluong (validate → INSERT/UPDATE) |
| Nhân bản | Clone từ kỳ nguồn + reset ngày sang tháng mới |
| Xóa | Confirm + check dependency (nếu có set6 hoặc set7 data → block) |

### Integration
- **Downstream**: set6 (chọn NV theo bpApDung), set7 (tính lương với kyId).
- **Upstream**: set5 (Công thức đã gán cho cơ cấu).

### Edge Cases
- Tạo trùng kỳ cùng loại+tháng → error `Kỳ đã tồn tại: KY_202605_LTG`.
- Đổi bpApDung sau khi set6 đã load NV → warning `Có N NV không còn thuộc BPTL mới, sẽ bị loại`.

---

## SET6 — Cập nhật DS NV tính lương

- **File**: `lsp/set6-danhsach-nv-tinh-luong.html`
- **Use case**: Dual-list — LEFT = NV chưa được tính, RIGHT = NV được chọn tính lương cho kỳ. Filter theo BPTL/Cơ cấu.

### UI Layout
```
period-bar  🗓 Kỳ lương: [dropdown chọn kỳ] · Info: Tháng/Năm · From/To · Số NV đã chọn
filter grid 4 cột x 3 hàng:
  Mã NV | Tên NV | ĐV cấp 1 | ĐV cấp 2 | ĐV cấp 3 | ĐV cấp 4 | ĐV cấp 5 | BPTL
  Chức vụ | NTL1 | NTL2 | Ngày vào từ/đến | Nghỉ việc từ/đến | Trạng thái radio (Đang làm/Nghỉ/Tất cả)
toolbar     [🔄 Load NV theo kỳ][🔍 Tìm][📤 Xuất Excel][📥 Import Excel]
dual-list   ┌─ LEFT: NV chưa tính (N) ──┐ [→ >] [← <] [→→ >>] [←← <<] ┌─ RIGHT: NV được chọn (M) ──┐
            │ search + grid checkbox    │                              │ search + grid checkbox     │
            │ cột: ☐ STT | Mã | Tên |   │                              │ cùng cột                   │
            │       ĐV | BPTL | CV |    │                              │                            │
            │       Ngày vào             │                              │                            │
            └───────────────────────────┘                              └───────────────────────────┘
bulk-bar    [💾 Lưu danh sách (xanh lá)][🗑 Xóa tất cả bên phải (đỏ)]
```

### Fields
- Kỳ lương select: bắt buộc chọn trước khi thao tác.
- Filter: giống set-taokyluong + Chức vụ, Ngày vào/nghỉ, Trạng thái.
- Dual-list: row có class `row-nghi` (vàng) cho NV nghỉ việc, `row-locked` (xám) cho NV đã tính rồi.

### Business Rules
- **BR-D01**: Chọn kỳ bắt buộc trước; nếu không → toolbar disabled + toast `Vui lòng chọn kỳ`.
- **BR-D02**: NV nghỉ việc trong kỳ vẫn được thêm nếu có công (đề phòng lương thai sản, nghỉ ốm).
- **BR-D03**: NV đã có dòng lương ở set7 (locked) — không cho xóa khỏi RIGHT (row-locked, không tick).
- **BR-D04**: Import Excel — validate empId tồn tại + không trùng.
- **BR-D05**: Save = replace RIGHT list (delete-insert) → cẩn thận: xóa NV mất history khi chưa tính.

### Actions
| Button | Handler |
|--------|---------|
| Load NV theo kỳ | Auto-populate LEFT theo BPTL của kỳ |
| → / ← | Move selected (bulk) |
| →→ / ←← | Move all (visible after filter) |
| Lưu danh sách | POST /api/kyluong/{kyId}/nv (upsert) |
| Xóa tất cả | Confirm `Xóa toàn bộ N NV khỏi kỳ?` |

### Integration
- Nguồn NV: `HR_NhanSu` (via `dbo.HR_fnGetDanhSachNV`).
- Output: bảng `KyLuong_NV` — trigger cho set7 chạy engine.

### Edge Cases
- NV multi-BPTL (làm 2 dây chuyền tháng đó) → chỉ hiển thị 1 lần bên LEFT, khi tính lương ở set7 mới sinh 2 dòng.
- NV chuyển ĐV giữa tháng → filter theo `toDate` mặc định.

---

## SET7 — Tính lương tháng

- **File**: `lsp/set7-tinhluong-thang.html` — **KHÔNG edit** (subagent khác đang xử lý).
- **Use case**: Chạy engine tính lương, hiển thị grid kết quả 26 cột, cho phép khóa/mở khóa dòng.

### UI Layout — Filter panel MỚI 5 hàng

```
breadcrumb  Lương › Chức năng › Tính lương tháng
page-title  TÍNH LƯƠNG THÁNG - LTG                          [📋 Quy tắc]

┌── Filter panel (5 hàng, mỗi hàng 4 cell label+control) ──────────────┐
│ Hàng 1: Kỳ lương* [select]        | Mã NV [text]      | Tên NV [text]│
│ Hàng 2: ĐV cấp 1 [select cascade] | ĐV cấp 2         | ĐV cấp 3     │
│         ĐV cấp 4                  | ĐV cấp 5                        │
│ Hàng 3: Chức vụ [select]          | NTL cấp 1 cascade| NTL cấp 2    │
│         NTL cấp 3                 | BPTL [multi-select]             │
│ Hàng 4: Nghỉ việc từ [date]       | NLV cuối từ [date]              │
│         Tháng năm [month]                                            │
│ Hàng 5: Khóa lương [radio: Tất cả/Đã khóa/Chưa khóa]                │
│         Tình trạng [radio: Tất cả/Có lương/Không lương/Nghỉ thai sản]│
└──────────────────────────────────────────────────────────────────────┘

actions-bar [🔍 Tìm][🔄 Làm mới][⚡ Tính lại (theo filter)][📤 Xuất Excel]

grid (26 cột mặc định, do set-gancotluong cấu hình):
  ☑ Chọn tất cả | STT | Mã NV | Tên NV | ĐV | BPTL | LượtDòng | From/To
  | HT_TG_TrongGio | HT_DonGiaGio | ... | TT_TLTGTrongGio | ...
  | TotalIncome | TruBH | TruThue | NetIncome | Khóa? | KhóaBy | KhóaAt
  
  Header có checkbox "Chọn tất cả" (indeterminate state hỗ trợ)
  Row-locked style xám khi daKhoa=1

4 action button khóa lương (cuối grid):
  [🔒 Khóa dòng chọn][🔓 Mở khóa dòng chọn][🔒 Khóa tất cả (theo filter)][🔓 Mở khóa tất cả]
```

### Fields — Filter
| Field | Type | Mandatory | Note |
|-------|------|-----------|------|
| kyLuong | select | Y | Load từ set-taokyluong |
| maNV | text | O | LIKE `%X%` |
| tenNV | text | O | LIKE Unicode-insensitive |
| donViCap 1-5 | select cascade | O | Cha filter con |
| chucVu | select | O | Từ HR |
| ntlCap 1-3 | select cascade | O | Từ set5 |
| bptl | multi-select | O | Từ Kỳ lương |
| nghiViecTu | date | O | NV có `ngayNghi >= X` |
| nlvCuoiTu | date | O | Ngày làm việc cuối cùng >= X |
| thangNam | month picker | O | Bổ sung filter theo tháng năm khi kỳ crosses months |
| khoaLuong | radio | Y | `Tất cả` / `Đã khóa` / `Chưa khóa` — default `Tất cả` |
| tinhTrang | radio | Y | `Tất cả` / `Có lương` / `Không lương` / `Nghỉ thai sản` — default `Tất cả` |

### Business Rules
- **BR-T01**: Kỳ lương bắt buộc — không chọn → grid empty + toast.
- **BR-T02**: Header checkbox "Chọn tất cả" tick → select tất cả row **đang hiển thị theo filter hiện tại** (không phải toàn kỳ).
- **BR-T03**: 4 nút khóa:
  1. **Khóa dòng chọn** — set `daKhoa=1` cho các row user tick.
  2. **Mở khóa dòng chọn** — set `daKhoa=0` cho các row user tick.
  3. **Khóa tất cả (theo filter)** — set `daKhoa=1` cho **toàn bộ row match filter** (không giới hạn selection). Confirm: `Khóa N dòng lương? Sau khi khóa không sửa được.`
  4. **Mở khóa tất cả** — reverse. Chỉ Admin. Confirm 2 lần.
- **BR-T04**: **Cross-row BH/Thuế** đã handle ở engine trước khi hiển thị grid:
  - BH trích 1 lần ở dòng lương MAX (`Allocation=MaxSalaryRow` cho `TT_TruBHXH`).
  - Thuế TNCN gộp toàn kỳ tính 1 lần → dồn dòng cuối (`Allocation=LastStageRow`).
- **BR-T05**: Publish ESS/Mobile — giai đoạn 2. Prototype có button `Publish` disabled + tooltip `Giai đoạn 2 sẽ triển khai`.
- **BR-T06**: Audit trail — mỗi lần khóa/mở khóa ghi log: `(rowId, action, by, at, oldValue, newValue)`.

### Actions
| Button | Color | Handler | Confirmation |
|--------|-------|---------|--------------|
| Tìm | vàng | Load grid theo filter | — |
| Làm mới | xanh dương | Reset filter | — |
| Tính lại (theo filter) | tím | Chạy lại engine cho subset | `Tính lại N dòng? Ghi đè kết quả cũ.` |
| Xuất Excel | cam | Export grid | — |
| Khóa dòng chọn | đỏ nhạt | Bulk update daKhoa=1 | — |
| Mở khóa dòng chọn | xám | Bulk update daKhoa=0 | — |
| Khóa tất cả | đỏ đậm | Update all filter matches | `Khóa N dòng?` |
| Mở khóa tất cả | cam đỏ | Update all filter matches | 2-step confirm |

### Integration
- **Engine call**: `dbo.PR_LSP_spTinhLuong @KyID, @DanhSachEmpID` — chạy 2 pha:
  - Pha 1: sinh dòng QTLV → nạp TK_/HT_ per-slice → tính TT_ Detail (topological order theo Rank + Priority).
  - Pha 2: tính HT_ Aggregate theo scope → tính TT_ Summary → phân bổ (MaxSalaryRow/LastStageRow/Prorata/Accumulate) → ghi `BangTinhLuong`.
- **Cross-row functions** (return `decimal(18,2)`): `PR_LSP_fnGetMaxLuongGopKy(@EmpID, @KyID)`, `PR_LSP_fnGetSumTNChiuThueKy(@EmpID, @KyID)`, `PR_fnGetTrichBH_RowV2(@EmpID, @KyID, @LuotDong)` (V1 legacy `PR_fnGetTrichBH_Row` giữ nguyên cho LSP/LNS backward-compat).
- **Downstream**: set-xem-phieu-luong (viewer), set9 (báo cáo), publish ESS (Giai đoạn 2).

### Sample data (grid)

```
| ☑ | STT | Mã NV      | Tên NV           | BPTL  | Lượt/Total | From       | To         | HT_TG_TrongGio | HT_DonGia | TT_TL     | TotalInc  | TruBH   | TruThue | Net       | Khóa |
| ☐ | 1   | 1022907668 | Nguyễn Thị Loan  | CB101 | 1/2        | 2026-05-01 | 2026-05-15 | 80.00          | 35,000    | 2,800,000 | 3,900,000 | 0       | 0       | 3,900,000 |  ❌  |
| ☐ | 2   | 1022907668 | Nguyễn Thị Loan  | CB102 | 2/2        | 2026-05-16 | 2026-05-31 | 82.56          | 35,000    | 2,889,600 | 4,600,000 | 892,500 | 145,000 | 3,562,500 |  ❌  |
```

### Edge Cases
1. NV `NetIncome < 0` (thai sản, ứng lương quá cao) → row highlight đỏ, warning toast + block Publish.
2. NV chỉ có 1 dòng lương (không multi-BPTL) → BH và Thuế đều ở dòng 1.
3. NV lương > 20×LTT vùng → BH cap tại trần (fn `PR_fnGetTrichBH_RowV2` đã handle, cap `min(LuongMaxRow, PR_fnGetTranBHVung)` tại `sliceToDate.MAX`).
4. Lock rồi mở lock lại → giữ giá trị cũ, không tính lại tự động (phải bấm `Tính lại`).
5. Kỳ đã Publish → cấm mở khóa cho user thường; Admin mở → status kỳ về `Đang tính`.
