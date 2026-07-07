# Chức năng: Công năng suất (fn9)

**Mã chức năng:** fn9  
**File:** `lns/fn9-cong-nang-suat.html`  
**Menu:** LNS · Chức năng → Công năng suất  
**Breadcrumb:** Lương › Tính Lương năng suất › Công năng suất

---

## 1. Mô tả tổng quan

Chức năng hiển thị và quản lý **Công năng suất** của nhân viên theo tháng. Công năng suất = Công thực tế (từ chấm công) × % năng suất.

- Công thực tế được **đồng bộ tự động** từ phân hệ Chấm công khi chấm công khóa.
- Cột **% năng suất** mặc định 100%, cho phép nhập thủ công hoặc import từ file.
- Dữ liệu sau khi tính xong tại đây sẽ được sử dụng bởi chức năng **Tính Lương Năng Suất (fn6)**.

**Loại form:** Bán tự động (dữ liệu CTT đọc từ CC, % nhập tay hoặc import)

---

## 2. Bộ lọc (Filter Panel)

### 2.1. Hàng 1 (Grid 4 cột)

| # | Trường | ID | Loại | Bắt buộc | Mô tả | Giá trị mặc định |
|---|--------|----|------|----------|-------|-------------------|
| 1 | Tháng | `fn9-thang` | Text input | **Có** | Tháng tính, định dạng MM/YYYY | `07/2026` |
| 2 | Công ty | `fn9-cty` | Dropdown | Có | Mã công ty | `MPHG` (MPHG, MPCA) |
| 3 | Level 1 | `fn9-l1` | Dropdown | Có | Bộ phận cấp 1 | `Bộ phận PTO` |
| 4 | Level 2 | `fn9-l2` | Dropdown | Có | Bộ phận cấp 2, phụ thuộc Level 1 | `Ka` |

### 2.2. Hàng 2 (Flex row)

| # | Trường | ID | Loại | Bắt buộc | Mô tả | Giá trị mặc định |
|---|--------|----|------|----------|-------|-------------------|
| 5 | Level 3 | `fn9-l3` | Dropdown | Không | Ca làm việc, phụ thuộc L2 | `-- Tất cả --` |
| 6 | Level 4 | `fn9-l4` | Dropdown | Không | Phân nhóm cấp 4, phụ thuộc L3 | `-- Tất cả --` |
| 7 | Level 5 | `fn9-l5` | Dropdown | Không | Đơn vị cấp 5 (ĐV tính NS) | `-- Tất cả --` |
| 8 | Level 6 | `fn9-l6` | Dropdown | Không | Phân nhóm phụ (nếu có) | `-- Tất cả --` |
| 9 | Nhân viên | `fn9-nv-search` | Text input + autocomplete | Không | Tìm theo mã NV hoặc tên. Hiện dropdown gợi ý khi gõ | Trống |

### 2.3. Ràng buộc bộ lọc

- Tháng là **bắt buộc**, format `MM/YYYY`.
- Level 1 → Level 2 → Level 3 → Level 4 → Level 5 → Level 6: **phụ thuộc theo chuỗi** (cascade). Thay đổi level trên sẽ reload level dưới.
- Nhân viên: tìm kiếm autocomplete, hiện dropdown `nv-dropdown` khi gõ ≥ 1 ký tự, match theo `ma` hoặc `ten` (case-insensitive). Click chọn NV sẽ fill mã NV vào ô.
- Click ra ngoài vùng tìm kiếm sẽ đóng dropdown.

---

## 3. Thanh đồng bộ (Sync Bar)

| Thành phần | Mô tả |
|------------|-------|
| Trạng thái | Hiển thị `✅ Đã đồng bộ` (xanh) hoặc `⚠️ Chưa đồng bộ` (cam) |
| Thời gian | Lần đồng bộ cuối: ngày giờ + trạng thái khóa CC |
| Nút **🔄 Đồng bộ thủ công** | Gọi lại dữ liệu công thực tế từ phân hệ Chấm công |
| Nút **🔍 Kiểm tra thay đổi** | Kiểm tra xem CC có thay đổi gì mới sau lần đồng bộ cuối |

### Ràng buộc

- Đồng bộ chỉ pull dữ liệu CTT, **không ghi đè** % đã nhập.
- Sau đồng bộ: tự động render lại grid và cập nhật stat cards.

---

## 4. Thẻ thống kê (Stat Cards)

5 thẻ hiển thị trên cùng, cập nhật tự động khi dữ liệu thay đổi:

| # | Thẻ | ID | Mô tả | Màu |
|---|-----|----|-------|-----|
| 1 | Tổng nhân viên | `fn9-stat-nv` | Số NV trong bộ lọc hiện tại | Xanh dương |
| 2 | Tổng công TT | `fn9-stat-ctt` | Tổng công thực tế tất cả NV, tất cả ngày | Xanh lá |
| 3 | TB % năng suất | `fn9-stat-pct` | Trung bình % NS = Σ(%_NV) / SốNV | Cam |
| 4 | Tổng công NS | `fn9-stat-cns` | Tổng công năng suất = Σ(CTT × %) | Tím |
| 5 | NV chưa có % | `fn9-stat-nopct` | Số NV có % = null (chưa nhập) | Đỏ |

---

## 5. Thanh hành động (Actions Bar)

| # | Nút | Mô tả | Validate |
|---|-----|-------|----------|
| 1 | **📤 Import %** | Import file Excel chứa % năng suất cho từng NV. Cập nhật cột % trên grid | File phải đúng format (Mã NV, %) |
| 2 | **📥 Xuất Excel** | Xuất toàn bộ grid hiện tại ra file Excel | Phải có dữ liệu |
| 3 | **💾 Lưu %** | Lưu giá trị % đã nhập/chỉnh sửa vào DB | Không |

---

## 6. Tabs

2 tab chuyển đổi:

| Tab | Tên | Mô tả |
|-----|-----|-------|
| `ctt` | **📅 Công thực tế** | Hiển thị công TT từ chấm công, cột % cho phép nhập. **Tab mặc định** |
| `cns` | **📈 Công năng suất** | Hiển thị CNS = CTT × %, chỉ đọc. Cột % hiện giá trị nhưng không cho sửa |

---

## 7. Lưới dữ liệu (Grid)

### 7.1. Header (2 dòng)

**Dòng 1 — Cột cố định (sticky left):**

| # | Cột | Sticky left | Width | Mô tả |
|---|-----|-------------|-------|-------|
| 1 | STT | `left:0` | 30px | Số thứ tự |
| 2 | Mã NV | `left:30px` | 75px | Mã nhân viên, font monospace |
| 3 | Họ tên | `left:105px` | 135px | Họ tên NV, căn trái |
| 4 | % | `left:240px` | 55px | % năng suất |

**Dòng 1 — Cột ngày (scroll ngang):**

| # | Cột | Mô tả |
|---|-----|-------|
| 5–35 | N01 → N31 | Công ngày 1 đến 31. Header nền vàng (#ffd600). Ngày vượt quá số ngày trong tháng: nền xám, disabled |
| 36 | Tổng | Tổng công trong tháng. Header nền xanh lá |

### 7.2. Body — Tab Công thực tế (`ctt`)

| Cột | Nội dung | Editable | Style |
|-----|----------|----------|-------|
| STT | Số thứ tự | Không | |
| Mã NV | Mã NV | Không | Monospace, xám |
| Họ tên | Tên đầy đủ | Không | Bold, căn trái |
| % | `<input type="number">` | **Có** | Input viền xanh, min=0, max=200, step=1. Mặc định 100 nếu chưa nhập |
| N01–N31 | Giá trị công TT | Không | `0` = ẩn; `1` = bold đen; `0.5/0.8` = cam; `null` = disabled xám |
| Tổng | Σ công TT | Không | Bold, xanh dương |

### 7.3. Body — Tab Công năng suất (`cns`)

| Cột | Nội dung | Editable | Style |
|-----|----------|----------|-------|
| STT | Số thứ tự | Không | |
| Mã NV | Mã NV | Không | |
| Họ tên | Tên đầy đủ | Không | |
| % | Giá trị % (text) | **Không** | Bold, tím, readonly |
| N01–N31 | CTT × % | Không | Cùng style day cells |
| Tổng | Σ CNS | Không | Bold, tím |

### 7.4. Dòng tổng (row-total)

- Cuối grid: 1 dòng tổng Level 5.
- Nền xanh lá nhạt, bold.
- Tổng theo từng cột ngày và cột Tổng.

### 7.5. Ràng buộc và logic

- **% mặc định = 100** khi NV chưa có % (pct = null).
- **Công thức CNS:** `CNS_ngày = CTT_ngày × (% / 100)`
- **Khi thay đổi %:** tự động recalc tất cả cột CNS + tổng + stat cards. Không cần bấm nút.
- **Ngày disabled:** ngày > số ngày trong tháng → ô xám, không hiển thị giá trị.
- **Frozen columns:** 4 cột đầu (STT, Mã NV, Họ tên, %) sticky khi scroll ngang.

---

## 8. Phân trang (Pager)

| Thành phần | Mô tả |
|------------|-------|
| Range | "Hiển thị 1–12 / 12 nhân viên" |
| Số dòng/trang | 50 (mặc định bold) · 100 · 200. Click chuyển |
| Nút trang | «, 1, 2..., » |

---

## 9. Ghi chú nghiệp vụ

- Textarea cho BA/quản lý nhập ghi chú, open points.
- Nút **💾 Lưu ghi chú** để lưu.

---

## 10. Validate tổng hợp

| Rule | Mô tả | Xử lý |
|------|-------|-------|
| Tháng bắt buộc | Phải nhập tháng trước khi thao tác | Alert lỗi |
| % trong khoảng 0–200 | Input có `min=0 max=200` | Browser validation |
| % phải là số nguyên | `step=1` | Browser validation |
| NV không có công | CTT tất cả ngày = 0 | Hiển thị bình thường, CNS = 0 |
| Đồng bộ không ghi đè % | Khi bấm đồng bộ chỉ cập nhật CTT | Logic code |

---

## 11. Luồng nghiệp vụ

```
1. Chấm công khóa tháng → Dữ liệu CTT tự động đồng bộ về fn9
2. User chọn bộ lọc (Tháng, Công ty, Level 1→5)
3. Grid hiển thị Công TT theo 31 ngày
4. User nhập % cho từng NV (hoặc Import %)
5. Tab "Công năng suất" tự tính CNS = CTT × %
6. Bấm "Lưu %" để lưu
7. Dữ liệu CNS sẵn sàng cho fn6 (Tính Lương NS)
```
