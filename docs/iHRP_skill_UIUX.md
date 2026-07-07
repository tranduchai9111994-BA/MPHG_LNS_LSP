# iHRP_UIUX — UI/UX Design Guide (Minh Phú HRM Prototype)

Tài liệu này mã hóa toàn bộ ngôn ngữ thiết kế của hệ thống **iHRP (Minh Phú HRM)** dựa trên phân tích thực tế prototype LSP/LNS.
Khi tạo màn hình mới, đọc file này trước và áp dụng toàn bộ quy tắc.

---

## 1. BRAND & COLOR PALETTE

### CSS Variables (shared/style.css)

| Token | Giá trị | Sử dụng |
|---|---|---|
| `--color-brand-red` | `#d32f2f` | Logo, nhãn bắt buộc |
| `--color-menu-yellow` | `#ffd600` | Nav bar chính, viền active sidebar |
| `--color-sidebar-dark` | `#1f2a44` | Sidebar LSP/LNS |
| `--color-table-header` | `#f4d03f` | Background thead mặc định |
| `--color-btn-calc` | `#28a745` | Nút Lưu, Tạo kỳ, Tính lương |
| `--color-btn-lock` | `#dc3545` | Nút Xóa, Khóa |
| `--color-btn-export` | `#fd7e14` | Nút Xuất dữ liệu |
| `--color-btn-import` | `#17a2b8` | Nút Nhập dữ liệu |
| `--color-btn-search` | `#ffc107` | Nút Tìm Kiếm (vàng nhạt, text đen) |
| `--color-btn-refresh` | `#007bff` | Nút Làm mới |
| `--color-page-bg` | `#f4f5f7` | Background toàn trang |
| `--color-content-bg` | `#fdfdfd` | Background `.container` |
| `--color-text-red` | `#d32f2f` | Label bắt buộc |
| `--color-text-primary` | `#333` | Label không bắt buộc |
| `--color-text-link` | `#0056b3` | Tiêu đề trang, link |
| `--color-hover-row` | `#f1f8ff` | Row hover |

### Màu nút — Quy tắc cứng

```
[Tìm Kiếm]    → #ffc107,  text #333   (vàng, chữ đen)
[Làm mới]     → #007bff,  text #fff   (xanh dương)
[Lưu]         → #5c9b00,  text #fff   (xanh lá đậm, btn-save2)
[Tạo kỳ]     → #28a745,  text #fff   (xanh lá)
[Tính]        → #28a745,  text #fff   (xanh lá)
[Xóa / Xóa kỳ] → #dc3545, text #fff  (đỏ)
[Khóa]        → #dc3545,  text #fff   (đỏ)
[Mở khóa]     → #dc3545,  text #fff   (đỏ, cùng màu Khóa)
[Xuất dữ liệu] → #fd7e14, text #fff  (cam)
[Nhập dữ liệu] → #17a2b8, text #fff  (xanh nhạt)
[Xuất Excel]   → #fd7e14, text #fff  (cam)
```

---

## 2. TYPOGRAPHY

- **Font**: Arial, sans-serif — system font, không dùng custom
- **Base font-size**: `12px` (body), một số page dùng `13px`
- **Tiêu đề trang**: `font-size: 22px`, `font-weight: bold`, `color: #0056b3`, `text-align: center`, `text-transform: uppercase`
- **Label form bắt buộc**: `color: #d32f2f`, `font-weight: bold`
- **Label form không bắt buộc**: `color: #333`, `font-weight: normal` (hoặc `bold` tuỳ context)
- **Thead bảng**: `font-size: 11px`, `font-weight: bold`, `color: #333`
- **Breadcrumb**: `font-size: 11px`, `color: #555`

---

## 3. LAYOUT TỔNG THỂ

```
┌──────────────────────────────────────────────────────┐
│ TOP HEADER: logo ❦ MINH PHU | search | user info    │  height ~40px, bg #fff
├──────────────────────────────────────────────────────┤
│ MAIN MENU: Nhân sự | Thôi việc | ... | Lương* | ... │  bg #ffd600, text #fff
├──────────────────────────────────────────────────────┤
│ .container (padding 15px 25px, bg #fdfdfd)           │
│  ├─ DEMO BADGE (góc trên phải, tuỳ chọn)            │
│  ├─ BREADCRUMB                                       │
│  ├─ PAGE TITLE (h1, uppercase, center, #0056b3)      │
│  ├─ INFO BAR (cảnh báo/ràng buộc nghiệp vụ)         │
│  ├─ ALERT BOX (thông báo lỗi/thành công)            │
│  ├─ FORM PANEL (.form-panel)                         │
│  │   └─ FORM GRID (.form-grid hoặc .form-grid-2col) │
│  ├─ ACTIONS BAR (.actions-bar, center)              │
│  ├─ DATA GRID (.grid-container hoặc .grid-wrap)     │
│  └─ GHI CHÚ NGHIỆP VỤ (dashed border #ffd600)      │
└──────────────────────────────────────────────────────┘
```

---

## 4. FORM / FILTER SECTION

### Cấu trúc grid

**`.form-grid`** — 4 cột, dùng cho form master:
```css
grid-template-columns: 150px 1fr 150px 1fr;
gap: 15px 30px;
```

**`.form-grid-2col`** — 4 cột hẹp hơn:
```css
grid-template-columns: 130px 1fr 130px 1fr;
gap: 10px 15px;
```

**`.filter-grid`** — 6 cột cho filter bar:
```css
grid-template-columns: 110px 1fr 110px 1fr 110px 1fr;
gap: 8px 15px;
```

### Quy tắc label
- Label **bắt buộc**: `class="text-red"` hoặc `class="lbl-red"` → màu `#d32f2f`, bold
- Label **không bắt buộc**: `color: #333`, font-weight normal (hoặc bold không màu đỏ)
- **KHÔNG** dùng dấu `*` — màu đỏ thay thế dấu sao

### Input / Dropdown
```css
input[type="text"], input[type="date"], select {
  border: 1px solid #ccc;
  padding: 4px 6px;
  height: 26px;
  font-size: 12px;
}
input[type="date"] { height: 28px; }
textarea { resize: vertical; }
```

### Combo dropdown — định dạng Mã - Tên
```html
<option value="NL_CHE_BIEN">NL_CHE_BIEN - Nhóm lương Chế biến</option>
```
Luôn hiển thị `[MÃ] - [Tên đầy đủ]` trong dropdown option.

### Auto-fill từ input
Khi nhập **Tháng tính** (`MM/yyyy`):
- Từ ngày → tự động ngày 1 tháng đó
- Đến ngày → tự động ngày cuối tháng
- Mã kỳ → tự động `LSP_YYmm` nếu chưa nhập

### Field đặc biệt — span nhiều cột
```html
<input style="grid-column: span 3;">
```
Dùng cho Ghi chú khi cần trải dài 3 cột.

---

## 5. BUTTON PATTERNS THEO LOẠI MÀN HÌNH

### A. Danh mục (Master data — dm*):
```
[Tìm Kiếm] [Làm mới] [Lưu] [Xóa] [Nhập dữ liệu] [Xuất dữ liệu]
```

### B. Chức năng — Tạo kỳ (pg1):
```
[Tìm Kiếm] [Tạo kỳ Lương] [Làm mới] [Xóa kỳ]
```
*Không có nút Lưu riêng — lưu khi tạo kỳ hoặc qua icon ✎ trên lưới*

### C. Chức năng — Tính lương (pg2):
```
[Tìm Kiếm] [Tính] [Làm mới] [Xóa] [Khóa] [Mở khóa] [Xuất Excel]
```

### D. Danh mục đơn giản (không có Nhập dữ liệu):
```
[Tìm Kiếm] [Làm mới] [Lưu] [Xóa] [Xuất dữ liệu]
```

### Thứ tự nút
Luôn: **Tìm Kiếm** → **hành động chính** → **Làm mới** → **Xóa** → **các nút phụ**

---

## 6. DATA GRID / TABLE

### Cấu trúc cột chuẩn (trái → phải)

| Vị trí | Cột | Ghi chú |
|---|---|---|
| 1 | ☐ Checkbox | `<input type="checkbox" class="chk-row">`, header có select-all |
| 2 | STT | Số thứ tự, width ~50px |
| 3 | Sửa | Icon ✎ (`edit-icon`), color `#e67e22` |
| 4+ | Cột nghiệp vụ | Dữ liệu thực tế |
| Cuối | Người tạo / Ngày tạo / Người sửa / Ngày sửa | Audit trail |

### Audit trail columns (cho màn hình có tạo/sửa)
```html
<th>Người tạo</th>
<th>Ngày tạo</th>
<th>Người sửa</th>
<th>Ngày sửa</th>
```
Auto-populate khi tạo/sửa bằng `CURRENT_USER` và `nowStr()`.

### Icon sửa ✎
```html
<span class="edit-icon" onclick="startEdit(this)">✎</span>
```
```css
.edit-icon { color: #e67e22; cursor: pointer; font-size: 14-15px; }
```
Click → populate form phía trên → user sửa → save → cập nhật cells tương ứng.

### Edit inline pattern
```javascript
function startEdit(btn) {
  const row = btn.closest('tr');
  const cells = row.cells;
  // Đọc cells[index] → set form fields
  editingRow = row;
  window.scrollTo(0, 0);  // scroll lên đầu để thấy form
}
function saveEdit() {
  if (!editingRow) return;
  // Cập nhật editingRow.cells[index].innerText
  editingRow.cells[auditIdx].innerText = CURRENT_USER;
  editingRow.cells[auditIdx+1].innerText = nowStr();
}
```

### Cột Chi tiết (per-row popup)
```html
<td><span style="cursor:pointer;color:#0056b3;" onclick="showChiTiet(rowId)">🔍 Xem</span></td>
```
Đặt sau cột Bộ phận / cột đầu tiên của nghiệp vụ.

### Style thead
```css
th {
  background-color: #f4d03f;  /* vàng */
  padding: 8px 10px;
  border: 1px solid #ddd;
  text-align: center;
  font-weight: bold;
  color: #333;
}
```

### Row states
```css
.row-locked { background-color: #d1d1d1; color: #777; font-style: italic; }
tbody tr:hover { background-color: #f1f8ff; }
tbody tr:nth-child(even) { background: #fbfbfb; }
```

---

## 7. MODAL / POPUP DIALOG

### Cấu trúc HTML
```html
<div class="modal-overlay" id="modal-xxx" style="display:none; justify-content:center; align-items:center;">
  <div class="modal-box wide">   <!-- width: 700px -->
    <div class="modal-hdr">
      📋 TIÊU ĐỀ POPUP
      <button class="x" onclick="document.getElementById('modal-xxx').style.display='none'">✕</button>
    </div>
    <div class="modal-body" id="modal-xxx-body">
      <!-- nội dung động -->
    </div>
    <div class="modal-ftr">
      <button class="btn btn-cancel" onclick="...">Đóng</button>
    </div>
  </div>
</div>
```

### Mở modal
```javascript
document.getElementById('modal-xxx').style.display = 'flex';
```

### Chi tiết popup — diễn giải tính toán
Modal hiển thị table các bước tính theo từng nhân viên:
```javascript
function showChiTiet(rowId) {
  const emp = window.MOCK.lsp.ketQua.find(e => e.id === rowId);
  // Tính các bước CALC-03 → CALC-10
  // Render bảng HTML động vào modal-body
  document.getElementById('modal-xxx').style.display = 'flex';
}
```
Table trong popup: 3 cột (Bước, Diễn giải, Giá trị), thead xanh `#0056b3`.

### Màu header modal
- Thông tin / Chi tiết: `--color-text-link` (`#0056b3`)
- Cảnh báo / Xóa: `#dc3545`
- Nhập liệu: `--color-btn-import` (`#17a2b8`)

---

## 8. PERIOD BAR (Thanh kỳ lương — pg2 style)

Dùng cho màn hình Tính lương:
```html
<div class="period-bar">
  <div class="period-left">
    <label style="color:#d32f2f;font-weight:bold;">Kỳ/Tháng lương</label>
    <select>...</select>
  </div>
  <div style="display:flex;align-items:center;gap:20px;">
    <!-- Radio: Khóa lương / Chưa khóa / Tất cả -->
    <label>Nhóm lương</label><select>...</select>
    <label>Nhóm tính lương</label><select>...</select>
  </div>
</div>
```

---

## 9. SIDEBAR NAVIGATION

### Cấu trúc nav-config.js
```javascript
window.NAV_CONFIG = {
  groups: [
    {
      title: "LSP · Danh mục",
      items: [
        { id: "lsp_dm1", label: "Nhóm lương", src: "lsp/dm1-nhom-luong.html" }
      ]
    },
    ...
  ]
};
```

### Nhóm sidebar theo module
- `LSP · Danh mục` — Master data LSP
- `LSP · Thiết lập` — Setup/Config LSP
- `LSP · Chức năng` — Business function LSP
- `LSP · Báo cáo` — Reports LSP
- `LNS · Danh mục` / `LNS · Thiết lập` / `LNS · Chức năng` / `LNS · Báo cáo`

### CSS sidebar
```css
.app > .sidebar { width: 280px; background: #1f2a44; }
.nav-item { border-left: 4px solid transparent; }
.nav-item.active { border-left-color: #ffd600; background: #2a3960; font-weight: bold; }
.grp-title { color: #9fb0d0; font-size: 11px; text-transform: uppercase; }
```

---

## 10. INFO BAR & ALERTS

### Info bar — ràng buộc nghiệp vụ
```html
<div class="info-bar">
  RÀNG BUỘC: <strong>Nội dung quan trọng</strong> — mô tả rule.
</div>
```
Background vàng nhạt `#fff3cd`, border `#ffeeba`.

### Alert box — thông báo kết quả
```html
<div id="alertBox" class="alert-box"></div>
```
```javascript
function showAlert(id, msg, type) {
  const b = document.getElementById(id);
  b.className = 'alert-box alert-' + type;
  b.innerHTML = msg;
  b.style.display = 'block';
  if (type !== 'error') setTimeout(() => b.style.display = 'none', 4000);
}
```
- `alert-success`: nền xanh lá nhạt
- `alert-error`: nền đỏ nhạt
- `alert-warning`: nền vàng nhạt

---

## 11. GHI CHÚ NGHIỆP VỤ (DEMO section)

Mỗi màn hình prototype có khu vực ghi chú cho BA:
```html
<div style="margin-top:20px;border-top:2px dashed #ffd600;padding-top:15px;">
  <div style="font-weight:bold;color:#856404;margin-bottom:8px;font-size:12px;">
    📋 GHI CHÚ NGHIỆP VỤ (dành cho thẩm định)
  </div>
  <textarea rows="3" style="width:100%;border:1px dashed #ffd600;padding:8px;
    font-size:12px;background:#fffef0;resize:vertical;"
    placeholder="BA nhập ghi chú, open points, điểm cần xác nhận với khách hàng...">
  </textarea>
  <div style="text-align:right;margin-top:6px;">
    <button class="btn-save2" style="font-size:11px;padding:4px 14px;">💾 Lưu ghi chú</button>
  </div>
</div>
```
Đặt ở **cuối trang**, sau data grid.

---

## 12. PATTERN THEO LOẠI MÀN HÌNH

### A. Danh mục — Master Data (dm*)
**Cấu trúc**: Form nhập + Buttons + Grid
- Form: `form-panel` + grid 2 cột
- Grid: checkbox | STT | ✎ | Mã | Tên VI | Tên EN | [fields] | Sử dụng
- Cột **Sử dụng**: hiển thị `X` (có) hoặc blank
- Cột **Mã**: `<b>MÃ</b>` — in đậm
- Validation: mã không trùng, required fields kiểm tra trước save

### B. Danh mục có FK (dm với combo cha)
Ví dụ: Nhóm tính lương có FK → Nhóm lương
- Combo cha dùng format `[MÃ] - [Tên]`
- Row lưu `data-nhomluong="NL_CHE_BIEN"` trên `<tr>`
- `ntlEdit()` đọc attribute này để set combo khi edit

### C. Tạo kỳ (pg1)
- Auto-fill ngày từ tháng tính
- Combo Nhóm lương (required đỏ) + Nhóm tính lương (optional đen)
- Audit columns đầy đủ
- Không có nút Lưu riêng

### D. Tính lương (pg2)
- Period bar trên cùng với filter Nhóm lương/Nhóm tính lương
- Grid có: checkbox | STT | ✎ | Mã NV | Họ tên | Bộ phận | 🔍 Chi tiết | [cột tính toán] | Người tính | Ngày tính
- Cột Chi tiết → popup diễn giải bước tính
- Bộ phận: plain text, không badge màu

---

## 13. TIMESTAMP & AUDIT

```javascript
const CURRENT_USER = 'FPT Admin';

function nowStr() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
```
Format: `DD/MM/YYYY HH:mm`

---

## 14. DATE FORMAT

Input date dùng `type="date"` nhưng hiển thị dạng `DD/MM/YYYY` qua CSS override:
```css
input[type="date"] { color: transparent; }
input[type="date"]::before {
  content: attr(data-date);
  position: absolute;
  color: #333;
}
```
Hàm chuyển đổi:
```javascript
function formatDate(isoStr) {
  // YYYY-MM-DD → DD/MM/YYYY
  if (!isoStr) return '';
  const [y, m, d] = isoStr.split('-');
  return `${d}/${m}/${y}`;
}
function dmyToInput(dmy) {
  // DD/MM/YYYY → YYYY-MM-DD
  const p = dmy.split('/');
  return `${p[2]}-${p[1]}-${p[0]}`;
}
```

---

## 15. MOCK DATA STRUCTURE

```javascript
// shared/mockdata.js
window.MOCK = {
  lsp: {
    kyLuong: [...],   // Kỳ LSP
    ketQua: [...],    // Kết quả tính lương cá nhân
  },
  lns: { ... }
};
```

---

## 16. QUY TẮC BẮT BUỘC

1. **Label required**: `color: #d32f2f` — không dùng dấu `*`
2. **Label optional**: `color: #333` (đen thường)
3. **Thead bảng**: `background: #f4d03f` (vàng), `color: #333`
4. **Cột đầu bảng**: checkbox → STT → ✎ (Sửa)
5. **Combo format**: `MÃ - Tên đầy đủ`
6. **Icon sửa**: `✎` màu `#e67e22` (cam)
7. **Chi tiết per-row**: `🔍 Xem` → popup, đặt sau cột Bộ phận
8. **Audit trail**: Người tạo / Ngày tạo / Người sửa / Ngày sửa ở cuối grid
9. **Thứ tự nút**: Tìm Kiếm → hành động chính → Làm mới → Xóa → phụ
10. **KHÔNG** có nút Lưu trên màn hình Tạo kỳ/Tính lương
11. **Bộ phận**: plain text — không badge màu nền
12. **Ghi chú nghiệp vụ**: cuối mỗi page, dashed border `#ffd600`
13. **Page title**: ALL CAPS, `color: #0056b3`, center
14. **Font size tối thiểu**: 12px
15. **Không dùng**: Bootstrap, Material UI, Tailwind mặc định

---

## 17. CHECKLIST TRƯỚC KHI TẠO MÀN HÌNH MỚI

- [ ] Link `../shared/style.css` và `../shared/mockdata.js`, `../shared/utils.js`
- [ ] Có `.top-header` (logo, search, user)
- [ ] Có `.main-menu` (Lương active)
- [ ] Breadcrumb đúng path
- [ ] Page title ALL CAPS, xanh `#0056b3`
- [ ] Label required màu đỏ `#d32f2f`
- [ ] Combo dropdown format `MÃ - Tên`
- [ ] Buttons đúng màu theo nhóm màn hình
- [ ] Grid: checkbox + STT + ✎ + cột nghiệp vụ + audit
- [ ] Alert box `#alertBox` cho thông báo
- [ ] Khu vực Ghi chú nghiệp vụ cuối trang
- [ ] `CURRENT_USER` và `nowStr()` cho audit trail
