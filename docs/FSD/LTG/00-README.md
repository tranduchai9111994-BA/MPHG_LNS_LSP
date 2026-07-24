# LTG — Lương Thời Gian theo quá trình · Bộ tài liệu FSD

> Tài liệu này là **input chuẩn** cho Claude để sinh ra **Functional Specification Document** cho toàn module LTG (Lương Thời Gian theo Quá trình làm việc) trong hệ thống iHRP MPHG (Minh Phú Hậu Giang).
> Prototype tham chiếu: `lsp/*.html` (KHÔNG chỉnh sửa). Nav gốc: `nav-config.js` — module `ltg`.

---

## ⚠️ ĐỌC KỸ TRƯỚC KHI DÙNG (dành cho Claude)

**Bộ tài liệu này gồm 9 file `.md` — Claude BẮT BUỘC đọc HẾT tất cả file trước khi gen FSD.** File này (`00-README.md`) chỉ là INDEX + INSTRUCTION, KHÔNG chứa nội dung nghiệp vụ đầy đủ.

### Cây thư mục

```
docs/FSD/LTG/
├── 00-README.md                          ← file này (index + skill instruction)
├── 01-context-actors.md                  ← ngữ cảnh MPHG + actors + use cases
├── 02-data-model.md                      ← ERD + 10 entity + sample data
├── 03-luong-setup-engine.md              ← 7 màn setup (set0, set-fn, set1-5)
├── 04-luong-vanhanh.md                   ← 3 màn vận hành (taokyluong, set6, set7)
├── 05-baocao-dong.md                     ← 3 màn báo cáo (set8, set9, bc-che-bien)
├── 06-phieu-luong.md                     ← 7 màn phiếu lương (set-xem-pl, set10-14, gancotluong)
├── 07-business-rules-integration.md      ← 8 business rules + 6 integration + edge cases + NFR
└── 08-catalog-reference.md               ← tra cứu 167+ items (params, functions, TK_/HT_/TT_, công thức)
```

### Reading order BẮT BUỘC (Claude MUST follow)

1. **Đọc trước**: `00-README.md` (file này) — hiểu skill instruction, format yêu cầu.
2. **Đọc tuần tự**: `01` → `02` → `03` → `04` → `05` → `06` → `07` → `08`.
3. **Không skip file nào** — mỗi file cover 1 phần khác nhau của FSD.
4. **Sau khi đọc hết 9 file**, mới bắt đầu gen FSD chuẩn theo cấu trúc ở Section 3.

### 📋 Sample prompt user paste lên Claude

**Cách 1 — Claude Desktop / Web (paste 8 file thủ công)**:
```
Đây là bộ tài liệu spec cho module LTG (Lương Thời Gian theo quá trình)
của hệ thống iHRP MPHG (Minh Phú Thủy sản Hậu Giang).

Có 9 file .md, tôi sẽ paste tuần tự từ 00-README đến 08-catalog-reference.
YÊU CẦU: Chỉ trả lời "OK, đã nhận [tên file]" sau mỗi lần paste.
Sau khi paste xong file cuối cùng, tôi sẽ nói "GEN FSD" — lúc đó bạn
mới bắt đầu gen tài liệu FSD hoàn chỉnh theo skill instruction ở
file 00-README.md section 3.

[Paste 00-README.md]
[Paste 01-context-actors.md]
...
[Paste 07-business-rules-integration.md]
[Paste 08-catalog-reference.md]

GEN FSD
```

**Cách 2 — Claude qua Cursor / có access filesystem**:
```
Đọc TẤT CẢ 9 file .md trong folder `docs/FSD/LTG/` theo thứ tự đánh số
00→08. File 00-README.md chứa skill instruction ở Section 3. Sau khi
đọc xong toàn bộ, gen file `docs/FSD/LTG-FSD-FINAL.md` với FSD hoàn
chỉnh theo cấu trúc quy định. Không skip file nào.
```

**Cách 3 — Claude Projects (upload knowledge base)**:
- Tạo Project mới.
- Upload 8 file `.md` làm knowledge base.
- **Custom instruction** (paste vào Project instructions):
  ```
  Bạn là Senior BA cho hệ thống iHRP MPHG (Minh Phú thủy sản).
  Knowledge base chứa 9 file spec cho module LTG. Luôn tham chiếu
  TẤT CẢ 9 file khi trả lời, không chỉ 1 file. File 00-README.md
  chứa skill instruction chính ở Section 3.
  ```
- **Prompt hỏi**:
  ```
  Đọc hết 9 file trong knowledge base theo thứ tự 00→08, sau đó
  gen FSD hoàn chỉnh cho module LTG theo skill instruction ở 00-README.md.
  ```

---

## 1. Overview module LTG

**LTG (Lương Thời Gian)** là module tính lương theo **quá trình làm việc (QTLV)** trong 1 kỳ tháng. Đặc trưng:

- 1 nhân viên có thể trải qua **nhiều giai đoạn (Bàn/Ka/BPTL/Chức vụ)** trong 1 kỳ → engine **sinh N dòng lương** cho NV đó.
- Lương thời gian dựa trên: **Công thực tế × Đơn giá giờ/ngày**, cộng thêm phụ cấp, trừ BH + Thuế TNCN.
- Engine dùng chung với **LSP** (Lương Sản phẩm) và **LNS** (Lương Năng suất) — 3 phân hệ share **Tiêu chí (TK_/HT_/TT_) + Function scalar + Công thức**, khác nhau ở **Công thức được gán cho cơ cấu** (set5) và **Kỳ lương** (set-taokyluong).
- Multi-BPTL → sinh **phiếu lương N/M trang** (mỗi dòng lương = 1 trang A4 độc lập theo ND 145/2020 Điều 22).
- Cross-row: **BH** trích ở dòng lương MAX, **Thuế TNCN** tính 1 lần trên tổng thu nhập rồi phân bổ ngược.

## 2. Danh sách 20 màn LTG (theo `nav-config.js` module `ltg`)

### 2.1 Nhóm Thiết lập (7 màn — engine)

| # | Mã | Tên | File | Mục đích |
|---|----|-----|------|----------|
| 1 | `set0` | Danh mục Param hệ thống | `lsp/set0-param-hethong.html` | ~35 param `@EmpID`, `@KyID`, `@Prev_<Mã>` ... |
| 2 | `set_fn` | Danh mục Function scalar | `lsp/set-function-catalog.html` | Catalog 36 fn scalar (`HR_fn*`, `PR_LSP_fn*`, `PIT_fn*`) |
| 3 | `set1` | Định nghĩa tiêu chí tìm kiếm (TK_) | `lsp/set1-tieuchi-timkiem.html` | 19 items string/datetime, dùng CASE WHEN |
| 4 | `set2` | Định nghĩa tiêu chí hệ thống (HT_) | `lsp/set2-tieuchi-hethong.html` | 33 items numeric raw (HR, Chấm công, BH) |
| 5 | `set3` | Định nghĩa tiêu chí tính toán (TT_) | `lsp/set3-tieuchi-tinhtoan.html` | 49 items numeric computed, có Rank + Deps |
| 6 | `set4` | Tạo công thức lương | `lsp/set4-tao-congthuc-luong.html` | Công thức gồm nhiều Dline, reduce SUM/MAX/MIN/AVG |
| 7 | `set5` | Gán công thức lương cho cơ cấu | `lsp/set5-gan-congthuc-cocau.html` | Map Công thức ↔ (Cơ cấu × Ngày hiệu lực) |

### 2.2 Nhóm Vận hành (3 màn — chức năng chính)

| # | Mã | Tên | File | Mục đích |
|---|----|-----|------|----------|
| 8 | `pg1_ext` | Tạo kỳ lương LTG | `lsp/set-taokyluong.html` | Master Kỳ: tên, tháng/năm, from/to, BPTL, NTL cascade |
| 9 | `set6_dsnv` | Cập nhật DS NV tính lương | `lsp/set6-danhsach-nv-tinh-luong.html` | Dual-list: NV chưa tính vs. NV được chọn tính lương |
| 10 | `set7_tinhluong` | Tính lương tháng | `lsp/set7-tinhluong-thang.html` | Filter 5 hàng, grid kết quả 26 cột, 4 nút khóa lương |

### 2.3 Nhóm Báo cáo (3 màn)

| # | Mã | Tên | File | Mục đích |
|---|----|-----|------|----------|
| 11 | `set8` | Tạo báo cáo động | `lsp/set8-taobaocao-dong.html` | Định nghĩa metadata báo cáo (tên, template, kiểu) |
| 12 | `set9` | Gán công thức dữ liệu báo cáo | `lsp/set9-gan-congthuc-baocao.html` | Map placeholder trên báo cáo ↔ Tiêu chí engine |
| 13 | `ltg_bc_chebien` | Bảng tính lương chế biến | `lsp/bc-che-bien.html` | Báo cáo mẫu cứng — bảng lương BPTL chế biến |

### 2.4 Nhóm Phiếu lương (1 màn)

| # | Mã | Tên | File | Mục đích |
|---|----|-----|------|----------|
| 14 | `set_xem_pl` | Xem phiếu lương | `lsp/set-xem-phieu-luong.html` | Viewer Telerik-style, multi-page N/M, in A4, PDF |

### 2.5 Nhóm Thiết lập Phiếu lương (6 màn)

| # | Mã | Tên | File | Mục đích |
|----|----|-----|------|----------|
| 15 | `set12` | Định nghĩa template PL | `lsp/set12-dinhnghia-template-pl.html` | Upload/thiết kế template Word/Excel với placeholder `«Mã»` |
| 16 | `set10` | Tham số được sử dụng (PL) | `lsp/set10-thamso-phieuluong.html` | Danh mục tham số/placeholder trong phiếu (MPHG + Millennium) |
| 17 | `set11` | Gán công thức dữ liệu (PL) | `lsp/set11-gancongthuc-phieuluong.html` | Map placeholder phiếu ↔ Tiêu chí engine |
| 18 | `set13` | Gán PL cho cơ cấu | `lsp/set13-ganpl-cocau.html` | Chọn phiếu áp dụng cho cơ cấu × ngày hiệu lực |
| 19 | `set14` | Điều kiện lọc PL mặc định | `lsp/set14-dieu-kien-loc-pl.html` | Preset filter mặc định cho viewer |
| 20 | `set_gancotluong` | Gán CT cột Tính lương | `lsp/set-gancongthuc-cot-tinhluong.html` | Map cột grid set7 ↔ Tiêu chí engine |

---

## 3. Skill / Instruction cho Claude — Gen FSD

```markdown
# 🎯 Instruction for Claude — Gen FSD

You are a Senior Business Analyst. Given this folder (`docs/FSD/LTG/`) as input,
generate a comprehensive Functional Specification Document following this structure:

1. **Executive Summary** — 1 trang: mục tiêu, scope, out-of-scope, milestones.
2. **Business Context** — background MPHG, quy mô ~5000 NV, ngành chế biến tôm,
   legal Nghị định 145/2020, core Millennium cần extend.
3. **Actors & Use Cases** — table Actor × Screen với Permission (R/W/A/D).
4. **Data Model (ERD)** — mermaid ERD 8 entity chính + attribute table
   (type, mandatory, sample). Naming convention TK_/HT_/TT_/@Prev_.
5. **Functional Requirements (per screen)** — 20 màn, mỗi màn theo template:
   - **UI Layout** — text-based mockup (position, size, color code `#hex`).
   - **Fields** — table (name, label, type, mandatory, validation, mock example).
   - **Business Rules** — bullet list rules đặc thù của màn.
   - **Actions** — table (button name, color, handler, confirmation dialog).
   - **Integration points** — API/DB/function scalar được gọi.
   - **Error handling** — codes + messages + recovery.
6. **Non-Functional Requirements** — Performance (~5000 NV, tính lương < 5 phút),
   Security (audit trail, role-based), Availability (99% giờ hành chính).
7. **Business Rules Consolidated** — 8 rules chính (07-business-rules-*).
8. **Integration Points** — Millennium core, HR, Chấm công, Thuế, BH, ESS/Mobile.
9. **Edge Cases & Known Issues** — NV thai sản NetIncome âm, NV mới giữa tháng,
   thôi việc, nhiều BPTL, lương cao vượt trần BH.
10. **Glossary** — VN ↔ EN tech terms (LTG, LSP, LNS, BPTL, QTLV, NTL,
    Slice, Rank, Allocation, Aggregate ...).

## Format
- Markdown H1/H2/H3 hierarchy.
- Tables for fields/rules; code blocks (```sql / ```javascript) for SQL / formula.
- Mermaid ``` mermaid ``` cho flow & ERD.
- Vietnamese primary; English glossary block cuối tài liệu.

## Depth
Đủ để dev code KHÔNG cần hỏi BA. Bắt buộc:
- Exact field validation (regex, min/max, message).
- Sample data theo NV thật MPHG (`@EmpID='1022907668'`, kỳ 05/2026).
- Concrete SQL contract + response JSON schema.
- Screen mockup mô tả layout bằng ASCII/text.
- Ít nhất 3 edge case per screen.
```

---

## 4. Cách đọc các file trong folder này

| File | Nội dung | Đọc trước khi gen ... |
|------|----------|------------------------|
| `01-context-actors.md` | Ngữ cảnh MPHG + Actors + Use Case matrix | Executive Summary, Business Context, Actors |
| `02-data-model.md` | Entities + ERD + attributes | Data Model, Glossary |
| `03-luong-setup-engine.md` | 7 màn Setup (set0, set-fn, set1-5) | Functional Requirements — Cụm Thiết lập |
| `04-luong-vanhanh.md` | 3 màn Vận hành (set-taokyluong, set6, set7) | Functional Requirements — Cụm Vận hành |
| `05-baocao-dong.md` | 3 màn Báo cáo (set8, set9, bc-che-bien) | Functional Requirements — Cụm Báo cáo |
| `06-phieu-luong.md` | 7 màn Phiếu lương (set-xem-pl, set10-14, set-gancotluong) | Functional Requirements — Cụm Phiếu lương |
| `07-business-rules-integration.md` | 8 rules cross-cutting + 5 nhóm integration | Business Rules, Integration, Edge Cases |
| `08-catalog-reference.md` | Danh sách chi tiết 167+ item (32 params, 37 functions, 18 TK_, 42 HT_, 57 TT_, 1 công thức mẫu) + cross-reference matrix | Data Model deep-dive, Function contracts, Field validation, mọi mục cần tra cứu chi tiết item engine |

## 5. Ràng buộc chung áp dụng cho toàn FSD

- **Ngôn ngữ chính**: Tiếng Việt. Tech term có English trong ngoặc.
- **Naming**: `TK_` (string/datetime), `HT_` (numeric raw), `TT_` (numeric computed), `@X` (param), `AGG_` (cross-row aggregate).
- **Kỳ mẫu**: 05/2026 — NV `1022907668 · Nguyễn Thị Loan` (2 giai đoạn QTLV chuyển bàn).
- **Design system**: `iHRP_skill_UIUX.md` — nút vàng `#ffd600` search, xanh dương `#0056b3` search, xanh lá `#28a745` save, đỏ `#dc3545` delete, cam `#fd7e14` export. Label bắt buộc `#d32f2f` (không dấu `*`). Combo format `MÃ - Tên`.
