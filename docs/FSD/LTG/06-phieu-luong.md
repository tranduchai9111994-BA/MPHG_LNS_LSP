# 06 — Cụm Phiếu lương (7 màn)

> Gồm: `set-xem-phieu-luong` · `set12` · `set10` · `set11` · `set13` · `set14` · `set-gancotluong`
> Actor: BA (thiết kế template + gán), HR-Payroll (publish), NV/Manager (view).

---

## SET-XEM-PHIEU-LUONG — Xem phiếu lương (viewer)

- **File**: `lsp/set-xem-phieu-luong.html`
- **Actor**: HR-Payroll, NV (ESS/Mobile giai đoạn 2), Manager (team)
- **Use case**: Viewer Telerik-style hiển thị phiếu lương A4, multi-page N/M cho NV có nhiều dòng lương, hỗ trợ zoom/print/PDF.

### UI Layout
```
breadcrumb  Lương › Phiếu lương › Xem phiếu lương (preview)
page-title  XEM PHIẾU LƯƠNG — TELERIK-STYLE PREVIEW         [❓ Quy tắc]
filter grid (3 col x 2 row):
  Kỳ lương* | Mã NV | Tên NV
  BPTL | Template | Định dạng (PDF/Word/HTML)
actions     [👁 Xem (xanh lá)][📤 Xuất PDF][🖨 In]

telerik-viewer (background xám #eaeaea):
┌── toolbar ─────────────────────────────────────────────┐
│ [⏮][◀] [1/2] [▶][⏭] · [🔍-][100%][🔍+] · [🖨][📥] │
│                    · info giữa: "Trang 1 / 2" · font italic phải│
└────────────────────────────────────────────────────────┘
canvas: hiển thị page A4 (794x1123 px):

┌── phieu-lung-page (A4) ─────────────────────────┐
│ [logo] MINH PHU              [Tên công ty]      │
│                                                  │
│         PHIẾU LƯƠNG THÁNG 05/2026                │
│              Trang 1 / 2                         │
│                                                  │
│ Mã NV:  1022907668     Tên:  Nguyễn Thị Loan    │
│ Kỳ:     KY_202605_LTG  BPTL: CB101              │
│                                                  │
│ ┌── Chi tiết tính lương (4 cột) ────────────┐  │
│ │ Chi tiết         │ Giờ    │ Đơn giá │ TL   │  │
│ │ Lương giờ chuẩn  │ 80.00  │ 35,000  │ 2.8tr│  │
│ │ ...                                          │  │
│ └──────────────────────────────────────────────┘  │
│                                                  │
│ Các khoản thu nhập (12 items, 2 cột):           │
│ 1. Lương cơ bản    2.800.000  7. Phụ cấp ...    │
│ ...                                              │
│                                                  │
│ Các khoản khấu trừ (6 items, 2 cột):            │
│ 1. BHXH 8%           223.000  4. Thuế TNCN 0   │
│ ...                                              │
│                                                  │
│ TỔNG NET: 3.900.000 VNĐ                          │
│                                                  │
│ Footer: ATM: 123... Cash: 0  |  Legal ND 145... │
└──────────────────────────────────────────────────┘
```

### Fields (filter)
| Field | Type | Mandatory | Sample |
|-------|------|-----------|--------|
| kyLuong | select | Y | `KY_202605_LTG` |
| maNV | text | O (nếu không, xem toàn kỳ) | `1022907668` |
| tenNV | text (autocomplete) | O | `Nguyễn Thị Loan` |
| bptl | select | O | `CB101` |
| template | select | Y | Từ set12 · gán ở set13 |
| dinhDang | radio | Y | `PDF` / `Word` / `HTML preview` |

### Business Rules
- **BR-PL01**: 1 dòng lương ở `BangTinhLuong` = **1 trang phiếu A4 độc lập** (compliance ND 145/2020 Điều 22).
- **BR-PL02**: NV có N dòng → phiếu N trang, page indicator `Trang X / N`, mỗi trang tự chứa đủ thông tin pháp lý.
- **BR-PL03**: NV chỉ xem được phiếu của chính mình (`empId = current_user.empId`); Manager xem được team (theo cây tổ chức); HR-Payroll xem tất cả.
- **BR-PL04**: Preview HTML chỉ show 1 page active; khi Print/PDF sẽ show tất cả (CSS `@media print`).
- **BR-PL05**: Template resolve placeholder theo per-row data (cross-row BH/Thuế đã handle ở engine set7 trước).
- **BR-PL06**: Nếu không có template gán cho cơ cấu → dùng template mặc định `default-mphg-a4`.

### Layout mẫu chuẩn (phieu-lung-page)
- **Header**: logo MPHG 55px + brand text (đỏ `#d32f2f`) + tên công ty giữa.
- **Title**: `PHIẾU LƯƠNG THÁNG MM/YYYY` giữa, in đậm 15px, có `Trang X / N` màu `#0056b3`.
- **Meta row 2 cột**: (Mã NV / Tên NV / Chức vụ / BPTL) | (Kỳ / From/To / Ngày lập / Tài khoản ATM).
- **Grid chi tiết 4 cột**: `Chi tiết | Time (giờ/ngày) | Đơn giá | Thành tiền`, border đen, thead vàng `#fff3cd`.
- **Section thu nhập**: 12 items 2 cột, mỗi item `<idx> <tên> <số tiền> <đơn vị>`.
- **Section khấu trừ**: 6 items 2 cột (BHXH 8%, BHYT 1.5%, BHTN 1%, CĐ 1%, Thuế TNCN, Khác).
- **Footer**: dòng tổng NET in đậm, ATM/Cash breakdown, legal note `Phiếu được lập theo Điều 22 Nghị định 145/2020/NĐ-CP`.

### Actions
| Button | Handler |
|--------|---------|
| Xem | Load data + render pages, active trang 1 |
| Xuất PDF | Puppeteer render → download |
| In | window.print() với CSS @media print |
| Toolbar zoom | 50%–200%, step 25% |
| Toolbar page nav | Update `.active` class |

### Integration
- Data: `PhieuLuongData` (snapshot đóng băng lúc publish).
- Template: `PhieuLuongTemplate` — chọn qua set13 (gán cơ cấu) hoặc filter thủ công.
- ESS/Mobile publish: **Giai đoạn 2** — API `/api/ess/phieuluong/{empId}/{kyId}` với biometric auth.

### Edge Cases
1. Kỳ chưa Publish → viewer báo `Kỳ chưa được duyệt phát hành`.
2. NV NetIncome âm (thai sản) → phiếu vẫn xuất, số âm hiển thị `(1,000,000)` màu đỏ.
3. Template lỗi placeholder không resolve → cell hiển thị `«Mã»` giữ nguyên + log warning.
4. Print A4 landscape khi phiếu quá rộng (>794px) → auto-scale.

---

## SET12 — Định nghĩa template phiếu lương

- **File**: `lsp/set12-dinhnghia-template-pl.html`
- **Actor**: BA
- **Use case**: Upload/thiết kế template Word/Excel/HTML với placeholder `«Mã»` (Word merge) hoặc `{{Mã}}` (HTML/Excel).

### Fields
| Field | Type | Mandatory | Sample |
|-------|------|-----------|--------|
| tenTemplate | nvarchar(255) unique | Y | `Phiếu lương chuẩn A4 MPHG` |
| loai | enum | Y | `Word` / `Excel` / `HTML` |
| filePath | varchar(500) | Y (Word/Excel) | `/templates/phieu-lung-a4.docx` |
| htmlContent | nvarchar(MAX) | Y (HTML) | `<div class="phieu-lung">...</div>` |
| placeholderList | JSON | auto-parse | `["«EmpName»", "«HT_HeSoBHXH»", ...]` |
| trangThai | enum | Y | `Đang dùng` / `Ngừng` |

### Business Rules
- **BR-T01**: Upload file → parse tự động extract placeholder, populate `placeholderList` để set11 gán.
- **BR-T02**: Placeholder pattern hỗ trợ: `«Mã»` (Word merge Millennium legacy), `{{Mã}}` (Handlebars), `${Mã}` (JSTL). BA chọn 1 pattern trong template config.
- **BR-T03**: Ngừng template đang được set13 gán → warning `N cơ cấu đang dùng, hãy gán template khác trước`.

### Placeholder mẫu (Millennium legacy)
- `«EmpName»`, `«EmpID»`, `«BPTL»`, `«ThangLuong»`, `«NgayLap»`
- `«HT_TG_TrongGio»`, `«HT_HeSoBHXH»`, `«HT_DonGiaGio»`, ...
- `«TT_TLTGTrongGio»`, `«TT_TruBHXH»`, `«TT_TruThueTNCN»`, ...
- `«TotalIncome»`, `«NetIncome»`, `«ATMAmount»`, `«CashAmount»`

---

## SET10 — Tham số được sử dụng (PL)

- **File**: `lsp/set10-thamso-phieuluong.html`
- **Use case**: Danh mục toàn bộ tham số/placeholder có thể dùng trong phiếu lương, chia 2 nhóm:
  - **Millennium**: legacy từ Core cũ (24 items — badge xám).
  - **MPHG**: mới do LTG/LSP tạo (26 cột set7 + 12 HT_ + 11 TT_ — badge xanh cyan `#17a2b8`).

### UI Layout
```
info-bar-mphg 🆕 Tenant MPHG: 26 cột set7 + 12 HT_ + 11 TT_ dùng cho phiếu lương
grid          cột: STT | Mã tham số | Tên hiển thị | Nguồn (badge MPHG/Millennium) | Kiểu DL | Ví dụ | ☑ Dùng | Ghi chú
row-mphg      background xanh nhạt #f0fbfc
```

### Business Rules
- **BR-TS01**: Tham số **per-row** resolve — mỗi dòng lương có bộ placeholder riêng.
- **BR-TS02**: Cross-row BH/Thuế đã handle ở engine set7 trước (viewer chỉ đọc `BangTinhLuong`).
- **BR-TS03**: Tham số MPHG có badge `NEW` đỏ nếu vừa thêm trong 30 ngày.

---

## SET11 — Gán công thức dữ liệu (PL)

- **File**: `lsp/set11-gancongthuc-phieuluong.html`
- **Use case**: Với 1 template + 1 cơ cấu → gán mỗi placeholder ↔ Tiêu chí engine (HT_/TT_) hoặc SQL raw. Tương tự set9 nhưng scope là phiếu lương.

### Fields (per row gán)
| Field | Type | Sample |
|-------|------|--------|
| templateId | FK | 501 |
| placeholder | varchar(100) | `«HT_HeSoBHXH»` |
| congThuc | nvarchar(2000) | `HT_HeSoBHXH` (ref TC) hoặc `dbo.PR_LSP_fnCustom(@EmpID, @KyID)` |
| formatString | varchar(50) | `#,##0` / `dd/MM/yyyy` |
| defaultValue | nvarchar(255) | `0` (khi resolve NULL) |

### Business Rules
- **BR-PC01**: Placeholder phải tồn tại trong `placeholderList` của template.
- **BR-PC02**: Format string áp dụng cho kiểu số/date (money `#,##0` VNĐ, date `dd/MM/yyyy`).
- **BR-PC03**: Reuse gán từ template khác — nút `📋 Copy from template X`.

---

## SET13 — Gán phiếu lương cho cơ cấu

- **File**: `lsp/set13-ganpl-cocau.html`
- **Use case**: Chọn template áp dụng cho cơ cấu (ĐV1-5 × BPTL × NTL) × Ngày hiệu lực. Tương tự set5 nhưng scope là template phiếu.

### Business Rules
- **BR-GP01**: 1 cơ cấu chỉ có 1 template active tại 1 thời điểm (theo effective date).
- **BR-GP02**: Không gán → dùng template mặc định `default-mphg-a4`.
- **BR-GP03**: Xóa gán khi kỳ đã xuất phiếu → warning `Có N phiếu đã xuất bằng template này`.

---

## SET14 — Điều kiện lọc PL mặc định

- **File**: `lsp/set14-dieu-kien-loc-pl.html`
- **Use case**: Preset filter mặc định cho viewer set-xem-phieu-luong. Mỗi user role có thể có preset riêng.

### Fields
| Field | Type | Sample |
|-------|------|--------|
| tenPreset | nvarchar(100) | `Phiếu tháng hiện tại - BPTL của tôi` |
| userRole | enum | `HR-Payroll` / `NV` / `Manager` |
| kyLuong | select (relative) | `Tháng hiện tại` / `Tháng trước` / `Chọn thủ công` |
| bptl | multi | `[Auto theo user]` |
| template | select | `default-mphg-a4` |
| isDefault | bit | 1 |

### Business Rules
- **BR-DL01**: 1 role có nhiều preset, nhưng chỉ 1 `isDefault=1` — auto-apply khi mở viewer.
- **BR-DL02**: NV role: preset auto set `maNV = current_user.empId` (không cho edit).

---

## SET-GANCOTLUONG — Gán CT cột Tính lương

- **File**: `lsp/set-gancongthuc-cot-tinhluong.html`
- **Use case**: Cấu hình grid 26 cột của set7 — mỗi cột ↔ 1 tiêu chí (HT_/TT_/TK_) hoặc SQL. Cho phép ẩn cột không dùng.

### UI Layout
```
info-bar     "Grid set7 hiển thị mặc định 26 cột — BA cấu hình mapping cột↔TC"
actions      [💾 Lưu][📤 Xuất][📋 Quy tắc][🔄 Reset về mặc định]
grid         sticky col STT + Mã, cột:
             STT | Mã cột (RO) | Tên VN | Công thức (textarea + btn 🎯 chọn TC) | Ghi chú | ☐ Ẩn
             row-readonly cho cột hệ thống (không edit được)
modal-tc     chọn tiêu chí (tabs TK_/HT_/TT_ + search + preview SQL)
```

### Fields (per row cột)
| Field | Type | Sample |
|-------|------|--------|
| maCot | varchar(50) unique | `col_ht_tg_tronggio` |
| tenVN | nvarchar(255) | `Công trong giờ` |
| congThuc | nvarchar(2000) | `HT_TG_TrongGio` |
| ghiChu | nvarchar(500) | — |
| isSystem | bit | 1 (system cols không sửa được) |
| an | bit | 0 |

### Business Rules
- **BR-GC01**: 26 cột default (system) — read-only, chỉ toggle Ẩn.
- **BR-GC02**: BA có thể thêm cột custom (không sticky, hiện cuối grid set7).
- **BR-GC03**: Reset về mặc định — clear custom cols + restore 26 system cols.
- **BR-GC04**: Công thức tham chiếu TC `use=0` → validate reject.

### Sample 26 cột default
```
[Chọn][STT][Mã NV][Tên NV][ĐV][BPTL][LượtDòng][From][To]
[HT_TG_TrongGio][HT_DonGiaGio][HT_PhuCap][HT_HeSoBHXH]
[TT_TLTGTrongGio][TT_LuongCoBan][TT_TongTNCT][TT_TruBHXH][TT_TruBHYT][TT_TruBHTN][TT_TruThueTNCN]
[TotalIncome][NetIncome][ATMAmount][CashAmount]
[Khóa?][KhóaBy][KhóaAt]
```

### Integration
- Runtime: set7 render grid theo config này (dynamic column definition).
- Save: `POST /api/config/set7-columns` → invalidate cache.
