# 05 — Cụm Báo cáo (3 màn)

> Gồm: `set8` · `set9` · `bc-che-bien`
> Actor: BA (thiết kế mẫu), HR-Payroll (chạy báo cáo), Manager (view team).

---

## SET8 — Tạo báo cáo động

- **File**: `lsp/set8-taobaocao-dong.html`
- **Actor**: BA / HR-Setup
- **Use case**: Định nghĩa metadata báo cáo động: tên, kiểu, template file, ghi chú. Không chứa data — chỉ khai báo shape.

### UI Layout
```
breadcrumb  Lương › Báo cáo › Tạo báo cáo động
page-title  TẠO BÁO CÁO ĐỘNG                                [📋 Quy tắc]
filter grid 2 col x 4 row (label 160px, control fill):
  Mã báo cáo* [text]         | Tên báo cáo* [text]
  Nhóm báo cáo* [select]     | Loại báo cáo* [select]
  Template file [file upload] | Định dạng [select docx/xlsx/pdf/html]
  Radio inline: Kiểu: [Cứng/Động] · Xu hướng: [Theo NV/Theo BPTL/Theo kỳ]
  Ghi chú textarea (full row)
actions     [💾 Lưu][🔄 Làm mới][📤 Xuất Excel]
grid        cột: STT | Mã BC | Tên BC | Nhóm | Loại (badge) | Template | Kiểu | Xu hướng | audit | Thao tác (✎ | 📋 Copy | 🔗 Gán CT)
```

### Fields
| Field | Type | Mandatory | Sample |
|-------|------|-----------|--------|
| maBC | varchar(50) unique | Y | `BC_LTG_001` |
| tenBC | nvarchar(255) | Y | `Báo cáo tính lương theo thời gian` |
| nhomBC | enum | Y | `LTG` / `LSP` / `LNS` / `Tổng hợp` / `Kỳ 13` |
| loaiBC | enum | Y | `ltg` (badge vàng) / `ktl` (đỏ) / `trk` (xanh) / `gl` (lá) / `other` (xám) |
| template | file | O | `.docx` / `.xlsx` |
| dinhDang | enum | Y | `docx` / `xlsx` / `pdf` / `html` |
| kieu | radio | Y | `Cứng` (hard-coded) / `Động` (BA cấu hình data) |
| xuHuong | radio | Y | `Theo NV` / `Theo BPTL` / `Theo kỳ` |
| ghiChu | nvarchar(1000) | O | — |

### Business Rules
- **BR-B01**: maBC unique full hệ thống (không phân biệt module).
- **BR-B02**: Nếu `kieu=Động` → **bắt buộc** vào set9 để gán công thức data trước khi báo cáo chạy được (validation ở button `Chạy báo cáo`).
- **BR-B03**: Template file upload phải chứa placeholder theo pattern `{{TenTruong}}` (Excel/Word) hoặc `«Mã»` (Word merge).
- **BR-B04**: Nhóm báo cáo `LTG` — option MỚI được highlight nền vàng `#fff9c4` trong dropdown.

### Actions
| Button | Handler |
|--------|---------|
| 💾 Lưu | POST /api/baocao |
| 📋 Copy | Clone metadata, tạo bản `<Mã>_COPY` |
| 🔗 Gán CT | Navigate → set9 với `bcId=<current>` |

### Integration
- **Downstream**: set9 (gán công thức data), viewer báo cáo runtime.
- **Upstream**: template file upload → lưu blob storage.

### Edge Cases
- Xóa BC đang có gán ở set9 → cascade delete gán (warning `N công thức data sẽ bị xóa`).
- Template file lỗi format → parse warning, không block save.

---

## SET9 — Gán công thức dữ liệu báo cáo

- **File**: `lsp/set9-gan-congthuc-baocao.html`
- **Use case**: Với 1 báo cáo đã tạo, gán từng placeholder (cột / cell / merge field) ↔ Tiêu chí engine (HT_/TT_) hoặc SQL trực tiếp.

### UI Layout
```
breadcrumb  Lương › Báo cáo › Gán công thức dữ liệu báo cáo
page-title  GÁN CÔNG THỨC DỮ LIỆU BÁO CÁO                   [📋 Quy tắc]
top-select  Báo cáo: [dropdown chọn BC] · Info: tên + loại + template
grid        cột: STT | Placeholder | Tên hiển thị | Kiểu DL | Công thức/CT SQL (textarea + [🔍 chọn TC]) | Ghi chú | ☐ Ẩn
actions     [💾 Lưu][🔄 Làm mới][📤 Xuất][📋 Quy tắc]
modal-tc    Popup chọn tiêu chí: search + tabs (TK_/HT_/TT_) + preview SQL
```

### Fields (per row)
| Field | Type | Mandatory | Sample |
|-------|------|-----------|--------|
| placeholder | varchar(100) | Y | `«HT_TG_TrongGio»` |
| tenHienThi | nvarchar(255) | Y | `Công trong giờ` |
| kieuDL | enum | Y | `text` / `number` / `date` / `money` |
| congThuc | nvarchar(2000) | Y | `HT_TG_TrongGio` hoặc `SELECT SUM(...)` |
| ghiChu | nvarchar(500) | O | — |
| an | bit | Y | 0 (mặc định hiện) |

### Business Rules
- **BR-G01**: Placeholder phải match với placeholder trong template file (validate scan file).
- **BR-G02**: Công thức tham chiếu tiêu chí phải `use=1` — chặn save nếu ref TC đã tắt.
- **BR-G03**: Modal chọn TC — group theo TK_/HT_/TT_, có filter search + preview SQL cuộn.
- **BR-G04**: Xu hướng báo cáo (từ set8) quyết định scope agrregate:
  - `Theo NV` → mỗi row báo cáo = 1 NV, aggregate SUM/AVG toàn dòng lương NV.
  - `Theo BPTL` → mỗi row = 1 BPTL.
  - `Theo kỳ` → 1 row = 1 kỳ.

### Integration
- Runtime: engine build query dựa trên công thức đã gán + template → merge → export.

### Edge Cases
- Placeholder trên template mà không được gán CT → cell trống + log warning.
- Công thức SQL raw có `DELETE`/`DROP` → engine reject (whitelist chỉ SELECT).

---

## BC-CHE-BIEN — Bảng tính lương chế biến

- **File**: `lsp/bc-che-bien.html`
- **Actor**: HR-Payroll, Manager BP chế biến
- **Use case**: Báo cáo mẫu **cứng** — bảng tính lương tháng cho BPTL chế biến. Đây là instance đầu tiên của cụm báo cáo, showcase.

### UI Layout
```
breadcrumb  Lương Sản Phẩm › Báo cáo › Bảng tính lương chế biến
page-title  BẢNG TÍNH LƯƠNG CHẾ BIẾN THÁNG
filter      Kỳ lương [select] | BPTL [multi-select] | Từ ngày | Đến ngày
actions     [🔍 Tìm][📤 Xuất Excel][🖨 In]
grid        pivot table: hàng = NV, cột = (Ngày làm | Sản lượng | Đơn giá | Thành tiền | Phụ cấp | Trừ BH | Trừ Thuế | Net)
            footer: Tổng cộng theo BPTL + Tổng toàn báo cáo
```

### Fields
| Field | Type | Sample |
|-------|------|--------|
| kyLuong | select | `KY_202605_LTG` |
| bptl | multi | `[CB101, CB102]` |
| tuNgay/denNgay | date | 2026-05-01 / 2026-05-31 |

### Business Rules
- **BR-BC01**: Chỉ hiển thị NV có dòng lương `daKhoa=1` (đã khóa) — báo cáo chính thức.
- **BR-BC02**: Grouping theo BPTL → subtotal row + grand total.
- **BR-BC03**: Cột `Trừ Thuế` chỉ hiển thị cho user role có permission `VIEW_TAX_DETAIL` — Manager thường không thấy.
- **BR-BC04**: Xuất Excel — layout preserve merge, format `#,##0` cho tiền.

### Sample data
```
Kỳ: 05/2026 · BPTL: CB101
| STT | Mã NV      | Tên NV           | Ngày công | Sản lượng | Đơn giá | Thành tiền  | Phụ cấp | Trừ BH  | Trừ Thuế | Net       |
| 1   | 1022907668 | Nguyễn Thị Loan  | 15        | 45.2 kg   | 55,000  | 2,486,000   | 350,000 | 297,860 | 0        | 2,538,140 |
| 2   | 1022907669 | Trần Văn A       | 22        | 68.1 kg   | 55,000  | 3,745,500   | 460,000 | 421,050 | 32,000   | 3,752,450 |
| --- | --- Subtotal CB101 --- | | 37 | 113.3 kg |     | 6,231,500  | 810,000 | 718,910 | 32,000  | 6,290,590 |
```

### Integration
- Query source: `BangTinhLuong` + join `HR_NhanSu`, `HR_BoPhan`.
- Không dùng set8/set9 (báo cáo cứng, hard-coded template).

### Edge Cases
- BPTL không có NV nào tính lương → grid rỗng + info `Không có dữ liệu`.
- NV có nhiều dòng lương trong cùng BPTL (do split slice) → gộp thành 1 row (SUM cộng dồn).
- In A4 landscape: nếu >20 cột → tự động scale.
