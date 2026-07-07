# Trường Hợp 3 (TH3) & Trường Hợp 4 (TH4) — Mô tả chi tiết nghiệp vụ

## 1. Tổng quan 4 trường hợp

| Mã | Tên | Nhóm NS | Vai trò |
|----|-----|---------|---------|
| TH1 | Năng suất riêng | Không | Không |
| TH2 | NS chung - 1 ĐV cấp 5 | Không | Không |
| **TH3** | **NS chung - Nhiều ĐV cấp 5** | **Bắt buộc** | Không |
| **TH4** | **NS chung - Tách cho phụ** | **Bắt buộc** | **SX / PV** |

TH3 và TH4 đều yêu cầu Level 5 được gom vào một **Nhóm NS** trước khi hệ thống có thể tính lương.

---

## 2. Trường Hợp 3 (TH3) — NS chung nhiều ĐV

### 2.1 Ý nghĩa nghiệp vụ
Nhiều đơn vị sản xuất cấp 5 phối hợp cùng một dây chuyền, năng suất tổng được **chia đều** (hoặc theo tỷ lệ quy định) cho tất cả thành viên trong nhóm. Không phân biệt vai trò SX/PV.

**Ví dụ:** Nhóm "Lặt đầu + Phân cỡ Ka Sáng" — 2 L5 cùng làm chung 1 lô hàng, NS tính chung cho nhóm.

### 2.2 Trường dữ liệu Level 5 khi gán TH3

| Trường | Giá trị | Ghi chú |
|--------|---------|---------|
| `th` | `'TH3'` | |
| `nhom_id` | `'NS-XXX'` | Bắt buộc, phải chọn hoặc tạo nhóm TH3 |
| `vai_tro` | `''` (rỗng) | TH3 không phân vai trò |
| `ghi_chu` | string | Tùy chọn |

### 2.3 Ràng buộc nghiệp vụ TH3

| Ràng buộc | Lý do |
|-----------|-------|
| Nhóm TH3 cần **ít nhất 2 Level 5** | 1 L5 dùng TH1 là đủ; TH3 có nghĩa khi nhiều L5 cùng chia NS |
| Mỗi L5 chỉ thuộc **1 nhóm TH3** | Tránh tính NS trùng |
| L5 thuộc TH3 **phải có** `nhom_id` | Nếu thiếu → validation báo lỗi |

### 2.4 Hiển thị trong bảng Nhóm NS (card view)

- Section header: `■ TH3 — Chung nhiều ĐV` (màu vàng nâu `#856404`).
- Mỗi hàng nhóm: badge `TH3` vàng + mã nhóm nền vàng nhạt + tên nhóm (có thể sửa inline).
- Link Level 5: `▶ 2 Level 5` — bấm mở rộng xem chi tiết từng L5.
- Hàng chi tiết: tên L5, mã, bộ phận, ghi chú. **Không** hiển thị badge vai trò.
- Cảnh báo `❌` trên hàng nhóm nếu < 2 L5.

---

## 3. Trường Hợp 4 (TH4) — NS chung Tách phụ

### 3.1 Ý nghĩa nghiệp vụ
Một nhóm gồm các L5 **Sản xuất chính (SX)** và các L5 **Phụ vụ (PV)**. Năng suất tổng của nhóm được tính chung, sau đó **tách riêng phần phụ vụ** theo tỷ lệ quy định. Mỗi nhóm phải có ít nhất 1 SX và 1 PV.

**Ví dụ:** Nhóm "SX chính + PV Rửa KS" — 2 L5 SX sản xuất chính, 1 L5 PV rửa vệ sinh hỗ trợ; NS tách phần PV ra khỏi tổng.

### 3.2 Trường dữ liệu Level 5 khi gán TH4

| Trường | Giá trị | Ghi chú |
|--------|---------|---------|
| `th` | `'TH4'` | |
| `nhom_id` | `'NS-XXX'` | Bắt buộc, phải chọn hoặc tạo nhóm TH4 |
| `vai_tro` | `'SX'` hoặc `'PV'` | Bắt buộc, không được để rỗng |
| `ghi_chu` | string | Tùy chọn |

### 3.3 Ràng buộc nghiệp vụ TH4

| Ràng buộc | Lý do |
|-----------|-------|
| Nhóm TH4 cần **ít nhất 1 SX** | Không có SX thì không có NS để tách |
| Nhóm TH4 cần **ít nhất 1 PV** | Không có PV thì dùng TH3 là đủ |
| Nhóm TH4 cần **ít nhất 2 L5** | Cần đủ 2 vai trò nên tối thiểu 2 L5 |
| Mỗi L5 TH4 **phải có** `vai_tro` | Validation báo lỗi nếu để rỗng |
| Mỗi L5 TH4 **phải có** `nhom_id` | Validation báo lỗi nếu thiếu |
| Không được đổi L5 PV cuối cùng thành SX | Hệ thống chặn khi còn đúng 1 PV |

### 3.4 Hiển thị trong bảng Nhóm NS (card view)

- Section header: `■ TH4 — Tách phụ` (màu hồng `#880e4f`).
- Mỗi hàng nhóm: badge `TH4` hồng + mã nhóm nền hồng nhạt + tên nhóm (sửa inline).
- Link Level 5: `▶ 3 Level 5 (2 SX, 1 PV)` — bấm mở rộng.
- Hàng chi tiết: badge vai trò (`SX` xanh lá / `PV` hồng) + tên L5, mã, bộ phận, ghi chú.
- Cảnh báo `❌` nếu thiếu SX hoặc PV.

---

## 4. Modal Gán nhóm — Luồng cho TH3/TH4

### 4.1 Bố cục modal (fullscreen, 2 cột)

**Cột trái (320px):**
- 4 radio chọn TH1/TH2/TH3/TH4.
- **Section Nhóm NS** (hiện ra khi chọn TH3 hoặc TH4):
  - Dropdown chọn nhóm đã có (lọc đúng loại TH).
  - Hoặc: input tên nhóm mới + nút **+ Tạo** (mã tự sinh `NS-XXX`).
- Input **Ghi chú chung** (áp dụng cho tất cả L5 đang được gán).
- Lưu ý nghiệp vụ (màu vàng).

**Cột phải:**
- **Danh sách checkbox Level 5 chưa gán** (filter: chỉ hiện L5 chưa có TH, không có trong pending):
  - Header: "Chọn Level 5 chưa gán" + checkbox "Chọn tất cả".
  - Mỗi dòng: tên L5 + mã L5 (monospace).
- **Bảng L5 đã chọn / sẽ gán**:
  - Thành viên **hiện tại** của nhóm (đã trong DETAILS với `nhom_id` = nhóm đang chọn) — hàng nền xám.
  - Thành viên **mới thêm** (pending) — hàng nền xanh nhạt, có badge "Mới".
  - Cột vai trò (chỉ hiện khi TH4): 2 nút toggle **SX** / **PV** trên mỗi dòng.
  - Nút ✕ xóa khỏi pending (chỉ có ở hàng mới).

### 4.2 Quy tắc chọn vai trò mặc định (TH4)

| Trường hợp | Vai trò mặc định |
|------------|-----------------|
| L5 đầu tiên được check | PV |
| L5 thứ 2 trở đi | SX |
| Mở modal với L5 đã chọn sẵn từ lưới | L5 đầu tiên = PV, còn lại = SX |

### 4.3 Bảo vệ PV cuối cùng

Khi người dùng bấm nút **SX** để đổi vai trò của 1 L5 đang là PV:
- Nếu chỉ còn **đúng 1 PV** trong pending → hiện cảnh báo `⚠ Phải có ít nhất 1 Level 5 là PV.` và không cho đổi.

### 4.4 Luồng lưu

1. Kiểm tra đã chọn TH.
2. Kiểm tra đã chọn Nhóm NS (TH3/TH4).
3. TH4: kiểm tra tổng PV (pending + existing) ≥ 1.
4. Ghi vào DETAILS: `th`, `nhom_id`, `vai_tro`, `ghi_chu` cho mỗi L5 pending.
5. Đóng modal, hiển thị alert thành công, re-render lưới và master.

---

## 5. Nút và hành động liên quan TH3/TH4

### Trong toolbar Chi tiết Level 5

| Nút | Hành động |
|-----|-----------|
| **+ Gán nhóm** (xanh lá) | Mở modal Gán nhóm với L5 đã tích chọn trong lưới |
| **Bỏ gán** (đỏ border) | Xóa `th`, `nhom_id`, `vai_tro` của L5 đang tích chọn |
| **Quản lý Nhóm NS** (cam) | Mở modal Quản lý Nhóm NS |
| **Nhóm NS** (view toggle) | Chuyển sang view card Nhóm NS |

### Trong từng hàng lưới (cột cuối)

| Nút | Hành động |
|-----|-----------|
| **✎** (nếu đã gán) | Mở modal Gán nhóm cho đúng L5 đó, pre-fill TH và nhóm hiện tại |
| **+** (nếu chưa gán) | Mở modal Gán nhóm cho L5 đó |
| Dropdown **Gán nhanh** (cột "Gán nhanh") | Chọn TH1/TH2/TH3/TH4 inline — chỉ gán TH, không chọn Nhóm NS; dùng cho TH1/TH2 |

### Trong lưới Bulk (thanh vàng)

| Nút | Điều kiện hiện |
|-----|---------------|
| **Gán N dòng** (xanh lá) | Hiện khi ≥ 1 dòng được tích chọn trong lưới |
| Dropdown TH | Chọn TH1/TH2/TH3/TH4 để gán hàng loạt |
| **Chọn tất cả chưa gán** | Tích chọn toàn bộ L5 chưa có TH |

> **Lưu ý:** Gán nhanh (bulk + inline dropdown) không yêu cầu chọn Nhóm NS. Nếu gán TH3/TH4 qua bulk, hệ thống chỉ set `th`, `nhom_id` sẽ rỗng → phải vào modal Gán nhóm để chọn nhóm sau.

---

## 6. Cảnh báo Cross-Ka

Khi nhóm TH3 hoặc TH4 chứa L5 từ nhiều bộ phận (Ka Sáng + Ka Chiều...):
- Trong card view: dòng `⚠ Cross: Ka Sáng+Ka Chiều` xuất hiện dưới tên nhóm.
- Trong Quản lý Nhóm NS: dòng `⚠ Cross-Ka: Ka Sáng + Ka Chiều`.
- Trong Validation: cảnh báo (không chặn), cần xác nhận với nghiệp vụ.

---

## 7. Validation liên quan TH3/TH4

Kết quả hiển thị trong panel **Checklist** trong modal Chi tiết khi chạy validation (hoặc khi bấm Khóa):

**Section TH3:**
- ✅ Mỗi nhóm TH3 có ≥ 2 L5.
- ❌ Nhóm `NS-XXX` chỉ có 1 L5 — cần ít nhất 2.
- ❌ N L5 thuộc TH3 nhưng chưa gán Nhóm NS.

**Section TH4:**
- ✅ Nhóm `NS-XXX`: X SX + Y PV.
- ❌ Thiếu vai trò SX / PV.
- ❌ N L5 thuộc TH4 nhưng chưa gán Nhóm NS.
- ⚠ N L5 chưa gán vai trò SX/PV.

**Section Cross-Ka:**
- ⚠ Nhóm `NS-XXX` chứa L5 từ nhiều bộ phận — kiểm tra cross-Ka?

**Section trùng lặp:**
- ❌ Mã `DVS_XXX` xuất hiện trong nhiều nhóm — mỗi L5 chỉ thuộc 1 nhóm.
