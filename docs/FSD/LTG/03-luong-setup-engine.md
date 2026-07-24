# 03 — Cụm Thiết lập Engine (7 màn)

> Gồm: `set0` · `set-fn` · `set1` · `set2` · `set3` · `set4` · `set5`
> Actor chính: **BA / HR-Setup**. Cấu hình 1 lần (theo chu kỳ nghiệp vụ) — chạy runtime cho LTG/LSP/LNS.

---

## SET0 — Danh mục Param hệ thống

- **File**: `lsp/set0-param-hethong.html`
- **Actor**: BA / HR-Setup
- **Use case**: Duy trì danh mục param global (~35 param) truyền vào function scalar. Param quyết định **hành vi thực tế** của function; là hợp đồng giữa BA (dùng) ↔ Dev (implement engine).

### UI Layout
```
top-header  (logo MPHG, search, notification, user)
main-menu   (Lương ← active)
breadcrumb  Lương › Thiết lập › Danh mục Param hệ thống
page-title  DANH MỤC PARAM HỆ THỐNG
info-bar    (đặc điểm + status-legend: Đang dùng / Dự phòng / Engine internal)
filter-row  [Tên Param text][Khả dụng khi select][Trạng thái select]
actions-bar [Tìm Kiếm][Làm mới][Xuất dữ liệu (cam)]
grid        9 cột: STT | Tên Param | Kiểu DL | Mục đích | Khả dụng | VD sử dụng | VD số liệu | Trạng thái | Ghi chú
ghi-chú-nghiệp-vụ (textarea vàng ffd600)
```

### Fields
| Field | Type | Mandatory | Validation | Ví dụ |
|-------|------|-----------|------------|-------|
| ma | varchar(30) | Y | Regex `^@[A-Za-z_][A-Za-z0-9_]*(\<Mã\>)?$`, unique | `@EmpID` |
| kieu | varchar(50) | Y | Enum types SQL Server | `varchar(20)` |
| mucDich | nvarchar(255) | Y | Non-empty | `Mã nhân viên đang xử lý` |
| khaDung | enum | Y | `Luôn có` / `Khi NV có quá trình` | `Luôn có` |
| viDu | nvarchar(500) | Y | Có gọi function scalar tối thiểu | `dbo.HR_fnGetDonVi(@EmpID, @ToDate, 3)` |
| viDuSoLieu | nvarchar(255) | O | — | `'1022907668'` |
| trangThai | enum | Y | 3 giá trị | `Đang dùng` |
| ghiChu | nvarchar(1000) | O | HTML allowed | — |

### Business Rules
- **BR-P01**: `@Prev_<Mã>` là template động — engine auto-parse regex `/@Prev_[A-Z]+_[A-Za-z0-9_]+/gi` từ SQL của set1/2/3 để build dependency graph.
- **BR-P02**: Chỉ xóa được `trangThai = Dự phòng`; `Đang dùng` phải rollback function trước, `Engine internal` cấm sửa/xóa.
- **BR-P03**: Cảnh báo khi user tham chiếu thủ công param `Engine internal` (`@LuotDong`, `@SliceDays`, `@SliceRatio`, `@IsLastSlice`) — khuyến nghị dùng Phân bổ đầu ra (set2/set4) thay thế.
- **BR-P04**: **KHÔNG có param cứng cho trần BH** (không có `@TranBHXH`, `@LTTVung3`, v.v.). Trần BH lấy runtime từ `dbo.PR_fnGetTranBHVung(@EmpID, @Date)` — configurable ở màn HR data / Salary Config. Nếu BA thấy param cũ dạng cứng trong catalog → mark `Dự phòng` và migrate config sang function.

### Actions
| Button | Color | Handler | Confirmation |
|--------|-------|---------|--------------|
| Tìm Kiếm | vàng `#ffd600` | Filter grid client-side | — |
| Làm mới | xanh dương `#0056b3` | Reset filter | — |
| Xuất dữ liệu | cam `#fd7e14` | Xuất Excel toàn bộ | — |

### Integration
- **Dùng bởi**: `set-fn` (function signature), `set1/2/3` (SQL editor autocomplete), `set4` (validate CT dùng đúng param).
- **Source**: bảng cứng do Dev seed, migration V001.

### Error Handling
- `E-P001`: Trùng `ma` → red toast `Param "@X" đã tồn tại`.
- `E-P002`: Sửa Engine internal → block button + tooltip `Param engine không được sửa`.

### Edge Cases
1. `@Prev_<Mã>` với Mã tiêu chí bị xóa → dependency graph rỗng, warning ở set3 khi save CT.
2. Import Excel param → validate regex trước, reject dòng lỗi.
3. 2 param cùng nghĩa (`@EmpID` vs `@NVID`) — engine treat alias, ưu tiên `@EmpID`.

---

## SET-FN — Danh mục Function scalar

- **File**: `lsp/set-function-catalog.html`
- **Actor**: BA (đề xuất) + Dev (implement)
- **Use case**: Catalog **37 scalar function T-SQL** — hợp đồng BA↔Dev. BA đề xuất function cần có; Dev update trạng thái.
- **Cross-row & Trần BH** (LTG core, `trangThai = Đang dùng`, return `decimal(18,2)`): `PR_LSP_fnGetMaxLuongGopKy`, `PR_LSP_fnGetSumTNChiuThueKy`, `PR_fnGetTrichBH_RowV2` (V1 `PR_fnGetTrichBH_Row` legacy LSP/LNS backward-compat), `PR_fnGetTranBHVung` (mới, thay thế mọi hardcode trần BH). Xem chi tiết signature ở [02-data-model.md §2.2.a](./02-data-model.md).

### UI Layout
```
breadcrumb  Lương › Thiết lập › Danh mục Function scalar
page-title  DANH MỤC FUNCTION SCALAR                       [📋 Quy tắc]
toolbar     [Tìm text][Nhóm select][Module select][Trạng thái select][Loại select][🔍 Tìm][🔄 Làm mới][➕ Thêm][📤 Xuất Excel] · counter
grid        12 cột: STT | Tên function | Nhóm | Module | Mục đích | Params | Return | Ví dụ SQL | Ví dụ KQ | Loại | Trạng thái | Thao tác(✎/📋)
modal-edit  form 12 field
modal-rules 5 quy tắc nghiệp vụ
```

### Fields
| Field | Type | Mandatory | Sample |
|-------|------|-----------|--------|
| ten | varchar(200) unique | Y | `dbo.HR_fnGetVungMien` |
| nhom | enum | Y | `HR core` |
| moduleDung | enum | Y | `set1` / `set2` / `set1,set2` |
| mucDich | nvarchar(500) | Y | `Lấy vùng miền theo địa chỉ NV tại thời điểm` |
| params | nvarchar(500) | Y | `@EmpID varchar(20), @Date date` |
| returnType | varchar(50) | Y | `int` |
| viDuSql | nvarchar(500) | Y | `dbo.HR_fnGetVungMien('1022906420','2026-07-31')` |
| viDuKq | nvarchar(255) | O | `2` (vùng II) |
| cot | varchar(30) | O | `C20` (map bảng Excel gốc) |
| loai | enum | Y | `Scalar` / `iTVF` / `mTVF` |
| trangThai | enum | Y | `Đề xuất` |

### Business Rules
- **BR-F01**: `ten` unique full path (`dbo.XxxFn`).
- **BR-F02**: `params` phải khớp với `Param` catalog set0 (validation soft — cảnh báo, không block).
- **BR-F03**: Function `Scalar` return 1 giá trị đơn; cần trả nhiều cột → `iTVF`/`mTVF`.
- **BR-F04**: 5 quy tắc trong modal:
  1. Naming: `dbo.<Module>_fn<Action><Object>` (VD `dbo.PR_LSP_fnGetDonGia`).
  2. Đầu vào phải là param từ set0.
  3. NULL-safe: return `NULL` khi không tìm thấy record (không throw).
  4. Deterministic ưu tiên (WITH SCHEMABINDING nếu có thể).
  5. Không side-effect (không INSERT/UPDATE trong function).

### Actions
| Button | Handler | Note |
|--------|---------|------|
| ➕ Thêm | Mở modal Thêm | required 6 field đỏ |
| ✎ (icon) | Mở modal Sửa | Không đổi `ten` (unique) |
| 📤 Xuất Excel | Export theo filter | file `functions-YYYYMMDD.xlsx` |

### Integration
- **Dùng bởi**: set1/set2 dropdown `fnTable`, set3 (validate `@Prev_`).
- **Ràng buộc**: Function `trangThai = Đang phát triển / Đề xuất` — hiển thị warning ở set1/2 khi user chọn.

### Edge Cases
- Function chưa `Đã có` mà tiêu chí đã dùng → engine runtime error `Object not exist`. Prevention: chặn Publish kỳ nếu có tiêu chí gọi function `!= Đã có`.

---

## SET1 — Định nghĩa tiêu chí tìm kiếm (TK_)

- **File**: `lsp/set1-tieuchi-timkiem.html`
- **Use case**: Định nghĩa 19 tiêu chí `TK_*` output string/datetime cho filter grid + CASE WHEN. Ví dụ: `TK_ThangLuong`, `TK_BPTL`, `TK_NgayVaoLam`.

### UI Layout
```
breadcrumb  Lương › Thiết lập › Định nghĩa tiêu chí hệ thống tìm kiếm
page-title  ĐỊNH NGHĨA TIÊU CHÍ HỆ THỐNG TÌM KIẾM        [📋 Quy tắc]
form-panel  form grid 2 col:
  Mã* [text] | Tên VI* [text] | Tên EN [text] | Rank* [num]
  Fn table [select] | Kiểu DL [select nvarchar/datetime]
  Công thức SQL* [textarea] (grid-column 2/5)
  Phân bổ đầu ra* [combobox]  · (Căn cứ phân bổ conditional khi maxby/minby)
  ☑ Sử dụng
actions-bar [Tìm Kiếm][Làm mới][Lưu][Xóa][Xuất dữ liệu]
grid        cột: ☐ STT ✎ Mã | Tên EN | Tên VI | Kiểu | Rank | Công thức | Phân bổ | Căn cứ | Sử dụng | audit(4)
```

### Fields
| Field | Type | Mandatory | Validation | Ví dụ |
|-------|------|-----------|------------|-------|
| ma | varchar(100) | Y | Unique, prefix `TK_`, no space/dấu | `TK_BPTL` |
| tenVI | nvarchar(255) | Y | Non-empty | `Bộ phận tính lương` |
| tenEN | nvarchar(255) | O | ASCII only | `Payroll Department` |
| rank | int ≥1 | Y | ≥1 | 1 |
| fnTable | varchar(100) | O | Enum từ set-fn | `HR_fnGetDonVi` |
| kieu | enum | Y | `nvarchar` / `datetime` | `nvarchar` |
| sql | nvarchar(2000) | Y | Chỉ dùng param `@X` từ set0 | `dbo.HR_fnGetDonVi(@EmpID, @SliceToDate, 3)` |
| phanBo | enum | Y | 5 giá trị | `slice` |
| phanBoBasis | varchar(100) | R (maxby/minby) | Ref → HT_/TT_ | — |
| use | bit | Y | default 1 | 1 |

### Business Rules
- **BR-TK01**: Prefix `TK_` bắt buộc.
- **BR-TK02**: SQL chỉ dùng param declared ở set0 — engine parse regex `/@[A-Za-z][A-Za-z0-9_]*/` để check.
- **BR-TK03**: Phân bổ `maxby`/`minby` yêu cầu **Căn cứ** (basis) — engine chạy 2 pha: (1) chạy Căn cứ per slice để chốt slice MAX/MIN, (2) lấy giá trị SQL tại slice đó → replicate mọi dòng.
- **BR-TK04**: Cùng Rank = xử lý đồng thời (parallel); Rank thấp chạy trước Rank cao.
- **BR-TK05**: TK_ output string/datetime — **không dùng làm số**. Nếu công thức lương cần số → convert sang HT_/TT_.

### Actions
| Button | Color | Handler |
|--------|-------|---------|
| Tìm Kiếm | vàng | Filter grid |
| Lưu | xanh lá `#28a745` | POST /api/tieuchi-tk |
| Xóa | đỏ `#dc3545` | Confirm dialog: `Xóa tiêu chí "X"? Nếu có công thức tham chiếu sẽ bị lỗi.` |
| Xuất dữ liệu | cam | Excel export |

### Integration
- Consumed by: set3 (@Prev_TK_ trong SQL TT_), set7 (filter grid), set11 (map placeholder phiếu).

### Edge Cases
- Xóa TK_ đang dùng ở TT_ khác → lỗi FK; UI báo `Tiêu chí "TK_X" đang được N tiêu chí TT_ tham chiếu`.
- Đổi `kieu` từ nvarchar → datetime khi grid đã có data → warning cast fail.

---

## SET2 — Định nghĩa tiêu chí hệ thống (HT_)

- **File**: `lsp/set2-tieuchi-hethong.html`
- **Use case**: Định nghĩa 33 tiêu chí `HT_*` numeric raw lấy trực tiếp từ HR / Chấm công / Bảo hiểm / Sản lượng.

### UI Layout
Giống set1 + section **CalcLevel/AggregateScope/AggregateOp** (Aggregate auto-detect badge khi SQL có SUM/MAX/MIN).

### Fields (khác set1)
| Field | Type | Sample |
|-------|------|--------|
| ma | prefix `HT_` | `HT_TG_TrongGio` |
| kieu | mặc định `float` | — |
| calcLevel | enum | `PerSlice` / `PerEmployee` / `Aggregate` |
| aggregateScope | enum | `Ban` / `Ka` / `Dept` / `CrossDept` |
| aggregateOp | enum | `Sum` / `Avg` / `Max` / `Min` |
| sql | Phải return numeric | `dbo.PTS_fnGetCongTrongGio(@EmpID, @SliceFromDate, @SliceToDate)` |

### Business Rules
- **BR-HT01**: Prefix `HT_` bắt buộc.
- **BR-HT02**: `calcLevel=Aggregate` → BẮT BUỘC chọn scope + op. Engine materialize aggregate 1 lần cho cả kỳ (performance).
- **BR-HT03**: `PerSlice` (mặc định) = tính theo từng dòng QTLV; `PerEmployee` = 1 giá trị cho NV cả kỳ; `Aggregate` = qua group scope.

### Sample data
- `HT_TG_TrongGio = 162.56` giờ (NV `1022907668`, 05/2026)
- `HT_DonGiaGio = 35000` VNĐ/giờ
- `HT_HeSoBHXH = 4.5` (mức đóng BH quy đổi)

### Integration
- Nguồn dữ liệu: bảng `PTS_ChamCong`, `BH_BaoHiem`, `HR_NhanSu`, `PR_LSP_SanLuong` — thông qua function scalar.

---

## SET3 — Định nghĩa tiêu chí tính toán (TT_)

- **File**: `lsp/set3-tieuchi-tinhtoan.html`
- **Use case**: Định nghĩa 49 tiêu chí `TT_*` numeric computed. **KHÔNG chứa công thức trực tiếp** — chỉ khai báo Mã/Tên/Rank + hành vi phân bổ dòng.

### UI Layout
```
info-bar    "Tiêu chí tính toán chỉ khai báo Mã/Tên/Rank — không chứa CT"
form-panel  Mã* | Tên VI* | Tên EN | Thứ tự sắp xếp* | Ghi chú | ☑ Mã hóa DL | ☑ Sử dụng
collapsible "🔧 Hành vi dòng (LSP)"
            RowClass* select | Allocation* select | AllowSumPrev select | Priority* num
button-tab  [📖 Tham số hệ thống][📋 Quy tắc]
grid        cột: ☐ STT ✎ Mã | Tên EN | Tên VI | Ghi chú | Thứ tự | RowClass | Allocation | SUM trước | Priority | Sử dụng | Mã hóa | audit(4)
```

### Fields (Section Hành vi dòng)
| Field | Type | Options | Default |
|-------|------|---------|---------|
| rowClass | enum R | `Info` / `Detail` / `Summary` | `Detail` |
| allocation | enum R | `None` / `Prorata` / `OldStage` / `NewStage` / `MaxSalaryRow` / `LastStageRow` / `Accumulate` | `None` |
| allowSumPrev | enum | `Y` / `N` | `N` |
| priority | int R | ≥0 | 0 |

### Business Rules
- **BR-TT01**: `Allocation=Prorata` chỉ hợp lệ khi `RowClass=Detail` (message: `Prorata chỉ áp dụng cho tiêu chí Chi tiết`).
- **BR-TT02**: `RowClass=Summary` gợi ý `AllowSumPrev=Y` (không bắt buộc).
- **BR-TT03**: Chống circular reference — engine detect vòng lặp `@Prev_` graph → chặn save.
- **BR-TT04**: **Bảng gợi ý Allocation → bài toán**:

| Allocation | Bài toán | Ý nghĩa |
|-----------|----------|---------|
| Prorata | Lương ngày công | Chia theo công từng dòng: `value × (công_dòng / Σcông)` |
| MaxSalaryRow | **Bảo hiểm** | Dồn 100% vào dòng lương cao nhất, dòng khác = 0 |
| LastStageRow | **Thuế TNCN** | Dồn vào dòng có ToDate lớn nhất (giai đoạn cuối) |
| Accumulate | Lũy kế | Cộng dồn giá trị các dòng trước (VD tính thuế lũy kế năm) |
| OldStage/NewStage | Đặc thù | Gán theo giai đoạn cũ/mới |
| None | Detail thường | Giữ nguyên |

### Sample
```javascript
{ ma:'TT_TruBHXH', tenVI:'Trừ BHXH', rank:5, rowClass:'Summary',
  allocation:'MaxSalaryRow', allowSumPrev:'N', priority:100 }
{ ma:'TT_TruThueTNCN', tenVI:'Trừ thuế TNCN', rank:7, rowClass:'Summary',
  allocation:'LastStageRow', allowSumPrev:'Y', priority:200 }
```

### Integration
- Công thức thực tế nhập ở **set4** (Dline). set3 chỉ nắm behavior.

---

## SET4 — Tạo công thức lương

- **File**: `lsp/set4-tao-congthuc-luong.html`
- **Use case**: Tạo Công thức lương gồm N Dline; mỗi Dline output vào 1 TT_. Có preview multi-row.

### UI Layout
```
form-header Tên CT* | Customer* (dropdown, mặc định MPHG) | Ghi chú | [dropdown load CT có sẵn][Lấy C.thức] | Chiều sinh dòng* (RowGenMode)
actions     [Lưu & tiếp][Lưu & đóng][Hủy][Xem trước nhiều dòng]
grid Dline  STT | Mã tiêu chí (sticky) | Tên | STT thứ tự | Công thức (textarea) | Ghi chú | Loại tính (RO: RowClass/Allocation)
detail-toolbar [Search text][☐ Ẩn dòng tắt][counter][Bulk ON/OFF]
popup       "🔍 XEM TRƯỚC KẾT QUẢ NHIỀU DÒNG" — chọn NV mẫu, preview N dòng theo QTLV
```

### Fields
| Field | Type | Mandatory | Sample |
|-------|------|-----------|--------|
| name | nvarchar(255) unique per customer | Y | `Lương Thời Gian - Chế biến` |
| customer | varchar(50) | Y | `MPHG` |
| rowGenMode | enum | Y (mặc định `ByWorkHistory`) | `ByWorkHistory` |
| dline.congThuc | nvarchar(2000) | Y | `HT_TG_TrongGio * HT_DonGiaGio + HT_PhuCap` |
| dline.reduceOp | enum | O | `SUM` / `MAX` / `MIN` / `AVG` |
| dline.order | int | Y | 10, 20, 30, ... (bước 10 để chèn dòng sau) |
| dline.stt >= 999 | int | O | Dòng tắt (dùng để soft-disable) |

### Business Rules
- **BR-F01**: Order phải unique trong 1 formula.
- **BR-F02**: Công thức parse để lấy dependency graph — engine chạy topological sort theo `TT_.Rank` + `dline.order`.
- **BR-F03**: `reduceOp` áp dụng khi công thức trả nhiều dòng (dependency là HT_ Aggregate scope=CrossDept trả nhiều value).
- **BR-F04**: Dline dòng "tắt" (order ≥ 999) — badge `TẮT`, style xám, không tham gia engine.
- **BR-F05**: Preview NV mẫu chạy engine mock — hiển thị bảng slice × tiêu chí với giá trị cụ thể.

### Actions
| Button | Handler |
|--------|---------|
| Lưu & tiếp | Save, clear form Dline, giữ header |
| Lưu & đóng | Save + navigate về danh sách CT |
| Xem trước nhiều dòng | Mở popup preview với NV mock |

### Integration
- Consumed by: set5 (gán CT cho cơ cấu), set7 (engine chạy khi Tính lương).

---

## SET5 — Gán công thức lương cho cơ cấu

- **File**: `lsp/set5-gan-congthuc-cocau.html`
- **Use case**: Map Công thức ↔ (Đơn vị cấp 1-5 × BPTL × NTL cấp 1-2) × Ngày hiệu lực. 1 cơ cấu có thể có nhiều CT theo thời gian.

### UI Layout
```
info-bar    "Cascade: ĐV1 → 2 → 3 → 4 → 5 → BPTL → NTL1 → NTL2"
filter      cascade-grid 3 col x 3 row:
            ĐV1 select | ĐV2 select | ĐV3 select
            ĐV4 select | ĐV5 select | BPTL select
            NTL1 select | NTL2 select | Ngày hiệu lực date
actions     [Tìm Kiếm][Lưu][Làm mới][Xóa]
pnl-edit    (hidden default) — Thêm/Sửa với cascade tương tự + [+ Thêm CT] tag list
grid        cột: ☐ STT | ĐV1..5 | BPTL | NTL1..2 | Ngày HL | Công thức (tag chips) | audit(4)
```

### Business Rules
- **BR-A01**: Cascade — chọn cấp cha → filter cấp con. Không chọn = "Tất cả".
- **BR-A02**: Cùng cơ cấu × nhiều CT — engine chọn CT có `ngayHL ≤ kyLuong.toDate` GẦN NHẤT (theo effective date).
- **BR-A03**: 1 cơ cấu = 1 loại lương × 1 CT tại 1 thời điểm (LTG/LSP/LNS tách riêng).
- **BR-A04**: Xóa gán chỉ được phép khi chưa có kỳ nào tham chiếu.

### Sample
```
ĐV1=Cty MPHG, ĐV3=PX Chế biến 2, BPTL=CB101, NgàyHL=2026-01-01
→ CT: [Lương Thời Gian - Chế biến, LSP - Chế biến 2026]
```

### Integration
- **Downstream**: set7 (Tính lương). set6 (DS NV) filter theo cơ cấu.
- **Upstream**: set4 (Công thức đã tạo).
