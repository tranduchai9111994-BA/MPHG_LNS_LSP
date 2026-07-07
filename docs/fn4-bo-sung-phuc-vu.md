# Chức năng: % Bổ sung Phục vụ (fn4)

**Mã chức năng:** fn4
**File:** `lns/fn4-chot-san-luong.html`
**Menu:** LNS · Chức năng → % Bổ sung Phục vụ
**Breadcrumb:** Lương › Tính Lương năng suất › % Bổ sung Phục vụ

---

## 1. Mô tả tổng quan

Chức năng khai báo **% Bổ sung Phục vụ (PV)** áp dụng cho một phạm vi Đơn vị (cấp 1 → cấp 5) trong một khoảng kỳ (Từ tháng → Đến tháng), gắn với Nhóm tính lương và Bộ phận tính lương cụ thể.

- % Bổ sung PV được cộng thêm vào lương năng suất của nhân viên thuộc phạm vi đơn vị được khai báo.
- Cho phép khai báo theo khoảng thời gian mở (Đến tháng để trống = áp dụng vô thời hạn từ Từ tháng).
- Dữ liệu quản lý dạng Master-detail: Form nhập liệu bên trên + Lưới danh sách bên dưới, hỗ trợ Thêm mới/Sửa/Xóa trực tiếp trên lưới.

**Loại form:** CRUD đầy đủ (Thêm/Sửa/Xóa), dữ liệu mock lưu trong biến JS `fn4Data` (chưa nối API thật).

---

## 2. Form nhập liệu (Form Panel)

Layout 2 cột, mỗi hàng là 1 field (class `.field`: label cố định 160px + input chiếm phần còn lại).

### 2.1. Cột trái

| # | Trường | ID | Loại | Bắt buộc | Mô tả |
|---|--------|----|------|----------|-------|
| 1 | Từ tháng (kỳ NS) | `fn4_thang` | Text input | **Có** | Tháng bắt đầu áp dụng, định dạng `MM/YYYY`. Cùng hàng với "Đến tháng" |
| 2 | Đến tháng | `fn4_denthang` | Text input | Không | Tháng kết thúc áp dụng, định dạng `MM/YYYY`. Để trống = chưa xác định ngày kết thúc (áp dụng vô thời hạn) |
| 3 | Đơn vị cấp 1 | `fn4_dv1` | Dropdown | **Có** | VD: Khối Kinh doanh, Khối Sản xuất |
| 4 | Đơn vị cấp 2 | `fn4_dv2` | Dropdown | Không | VD: Miền Nam, Nhà máy 1 |
| 5 | Đơn vị cấp 3 | `fn4_dv3` | Dropdown | Không | VD: TP.HCM, Xưởng A |
| 6 | Đơn vị cấp 4 | `fn4_dv4` | Dropdown | Không | VD: CN Quận 1, Tổ 01 |
| 7 | Đơn vị cấp 5 | `fn4_dv5` | Dropdown | Không | VD: Tổ bán hàng 1, hoặc `-` (không áp dụng cấp 5) |

### 2.2. Cột phải

| # | Trường | ID | Loại | Bắt buộc | Mô tả |
|---|--------|----|------|----------|-------|
| 8 | Nhóm tính lương | `fn4_nhomtl` | Dropdown | Không | VD: N1, N2 |
| 9 | Bộ phận tính lương | `fn4_bptl` | Dropdown | Không | VD: Kinh doanh, Sản xuất |
| 10 | % Bổ sung PV | `fn4_pv` | Number input | **Có** | Giá trị % cộng thêm (VD: 10 = 10%) |
| 11 | Ghi chú | `fn4_ghichu` | Textarea | Không | Diễn giải phạm vi/lý do áp dụng |

### 2.3. Ghi chú UX

- Nhãn màu đỏ (`lbl-red`): Từ tháng, Đơn vị cấp 1, % Bổ sung PV — **bắt buộc nhập**.
- Khi bấm ✎ (Sửa) trên lưới, form được nạp sẵn dữ liệu dòng đó; ID dòng đang sửa lưu tạm ở `dataset.editId` của ô `fn4_thang` (ẩn, không hiển thị cho người dùng).
- Bấm "Làm mới" sẽ xóa trắng form và thoát chế độ Sửa (xóa `editId`).

---

## 3. Thanh hành động (Actions Bar)

| # | Nút | Class | Hàm xử lý | Mô tả |
|---|-----|-------|-----------|-------|
| 1 | **Tìm kiếm** | `btn-search` | `fn4Search()` | Placeholder — hiện alert "Tìm kiếm hoàn tất" (chưa lọc theo tiêu chí form) |
| 2 | **Làm mới** | `btn-refresh` | `fn4Clear()` | Xóa trắng form, thoát chế độ Sửa |
| 3 | **Lưu** | `btn-save2` | `fn4Save()` | Validate rồi Thêm mới hoặc Cập nhật dòng đang sửa |
| 4 | **Xóa** | `btn-delete` | `fn4Delete()` | Xóa các dòng đã tick chọn trên lưới (có confirm) |
| 5 | **Xuất dữ liệu** | `btn-export` | *(chưa gán hàm)* | Placeholder xuất Excel |
| 6 | **Nhập dữ liệu** | `btn-import` | *(chưa gán hàm)* | Placeholder — hiện chưa mở modal Import (khác với các trang danh mục khác như dm2/dm6/dm7 đã có modal Import) |

> **Lưu ý kỹ thuật:** Nút "Nhập dữ liệu" hiện tại chưa được nối vào modal/hàm xử lý. Mục 5 bên dưới đề xuất cấu trúc file mẫu (template) nên dùng khi triển khai chức năng Import cho màn hình này, theo đúng rule import đã áp dụng ở các danh mục khác trong dự án (dm2, dm6, dm7).

---

## 4. Lưới dữ liệu (Grid)

### 4.1. Cột

| # | Cột | Ghi chú |
|---|-----|---------|
| 1 | ☐ (checkbox) | Chọn dòng để xóa. Header có checkbox "chọn tất cả" (`fn4-chkAll` → `toggleAll`) |
| 2 | Sửa | Icon ✎ (`edit-icon`) → `fn4EditById(id)`, nạp dữ liệu dòng vào form |
| 3 | STT | Số thứ tự theo vị trí hiện tại trong mảng |
| 4 | Từ tháng | |
| 5 | Đến tháng | Trống nếu không khai báo |
| 6 | ĐV1 | Đơn vị cấp 1 |
| 7 | ĐV2 | Đơn vị cấp 2 |
| 8 | ĐV3 | Đơn vị cấp 3 |
| 9 | ĐV4 | Đơn vị cấp 4 |
| 10 | ĐV5 | Đơn vị cấp 5 |
| 11 | Nhóm tính lương | |
| 12 | Bộ phận TL | Bộ phận tính lương |
| 13 | % PV | Hiển thị dạng `10%` |
| 14 | Ghi chú | Căn trái |

### 4.2. Dữ liệu mẫu (mock, 2 dòng)

| STT | Từ tháng | Đến tháng | ĐV1 | ĐV2 | ĐV3 | ĐV4 | ĐV5 | Nhóm TL | Bộ phận TL | % PV | Ghi chú |
|-----|----------|-----------|-----|-----|-----|-----|-----|---------|------------|------|---------|
| 1 | 07/2025 | *(trống)* | Khối Kinh doanh | Miền Nam | TP.HCM | CN Quận 1 | Tổ bán hàng 1 | N1 | Kinh doanh | 10% | Áp dụng khu vực miền Nam |
| 2 | 07/2025 | 09/2025 | Khối Sản xuất | Nhà máy 1 | Xưởng A | Tổ 01 | - | N2 | Sản xuất | 5% | Áp dụng toàn bộ xưởng A |

---

## 5. Template Import (đề xuất)

> Chưa có modal Import trong bản hiện tại. Cấu trúc dưới đây đề xuất theo đúng convention rule import đã dùng ở dm2/dm6/dm7 (mã khóa xác định để UPDATE/INSERT, dừng toàn bộ nếu trùng trong file).

### 5.1. Cột trong file Excel mẫu

| # | Cột | Bắt buộc | Ghi chú |
|---|-----|----------|---------|
| 1 | Từ tháng | **Có** | `MM/YYYY` |
| 2 | Đến tháng | Không | `MM/YYYY`, để trống nếu không giới hạn |
| 3 | Đơn vị cấp 1 | **Có** | Phải khớp danh mục đơn vị hiện có |
| 4 | Đơn vị cấp 2 | Không | |
| 5 | Đơn vị cấp 3 | Không | |
| 6 | Đơn vị cấp 4 | Không | |
| 7 | Đơn vị cấp 5 | Không | |
| 8 | Nhóm tính lương | Không | |
| 9 | Bộ phận tính lương | Không | |
| 10 | % Bổ sung PV | **Có** | Số, VD `10` = 10% |
| 11 | Ghi chú | Không | |

### 5.2. Rule Import (đề xuất, theo pattern chung của dự án)

1. Khóa xác định trùng = tổ hợp (**Từ tháng** + **ĐV1** + **ĐV2** + **ĐV3** + **ĐV4** + **ĐV5** + **Nhóm tính lương** + **Bộ phận tính lương**).
2. Tổ hợp khóa đã tồn tại → **UPDATE** % Bổ sung PV, Đến tháng, Ghi chú.
3. Tổ hợp khóa chưa tồn tại → **INSERT** mới.
4. Khóa trùng nhau trong cùng 1 file import → **DỪNG TOÀN BỘ**, báo lỗi dòng đầu tiên bị trùng.
5. Thiếu cột bắt buộc (Từ tháng, Đơn vị cấp 1, % Bổ sung PV) → **DỪNG**, báo lỗi dòng tương ứng.

---

## 6. Validate khi Lưu (`fn4Save`)

| # | Rule | Thông báo lỗi |
|---|------|----------------|
| 1 | Từ tháng bắt buộc | "Vui lòng nhập Từ tháng (kỳ NS)." |
| 2 | % Bổ sung PV bắt buộc | "Vui lòng nhập % Bổ sung PV." |

- Không có validate định dạng `MM/YYYY` hay validate Đến tháng ≥ Từ tháng trong bản hiện tại (điểm cần bổ sung khi hoàn thiện nghiệp vụ).
- Khi Lưu thành công (thêm mới hoặc cập nhật): render lại lưới, xóa trắng form.

---

## 7. Luồng nghiệp vụ

```
1. User nhập Từ tháng (bắt buộc) + Đến tháng (tùy chọn, để trống = không giới hạn)
2. Chọn phạm vi Đơn vị cấp 1 (bắt buộc) → cấp 2 → ... → cấp 5 (tùy chọn, thu hẹp phạm vi áp dụng)
3. (Tùy chọn) Chọn Nhóm tính lương / Bộ phận tính lương để giới hạn thêm đối tượng áp dụng
4. Nhập % Bổ sung PV (bắt buộc) + Ghi chú
5. Bấm "Lưu" → validate → Thêm mới hoặc Cập nhật (nếu đang ở dòng đang sửa từ bấm ✎)
6. % Bổ sung PV được dùng làm đầu vào khi Tính Lương Năng Suất (fn6) cho nhân viên
   thuộc phạm vi đơn vị/nhóm/bộ phận đã khai báo, trong khoảng Từ tháng → Đến tháng
7. Có thể Sửa lại (✎) hoặc Xóa (chọn checkbox + Xóa) các dòng đã khai báo
```

---

## 8. Ghi chú nghiệp vụ

- Textarea cuối trang cho BA/quản lý nhập ghi chú, open points (nút "Lưu ghi chú" riêng, không liên quan tới `fn4Save`).
- **Điểm mở (open points) cần xác nhận với khách hàng:**
  - Nếu 1 nhân viên rơi vào nhiều dòng % Bổ sung PV chồng lấn (trùng kỳ + trùng đơn vị ở các cấp khác nhau) thì áp dụng dòng nào — ưu tiên theo cấp đơn vị cụ thể nhất, hay cộng dồn?
  - "Nút Tìm kiếm" hiện chưa lọc lưới theo điều kiện trên form — cần làm rõ có cần lọc theo Từ tháng/Đơn vị hay không.
  - Nút Xuất dữ liệu/Nhập dữ liệu chưa có logic — cần xác nhận rule import theo mục 5 ở trên có đúng mong muốn nghiệp vụ không.
