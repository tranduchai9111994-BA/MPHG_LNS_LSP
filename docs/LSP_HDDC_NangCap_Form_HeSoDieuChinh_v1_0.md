# GIẢI PHÁP NÂNG CẤP CHỨC NĂNG: THIẾT LẬP HỆ SỐ ĐIỀU CHỈNH (HS1 / HS2 / HS3)

**Module:** Lương Sản Phẩm (LSP) – iHRP MPHG  
**Chức năng hiện tại:** LSP-SETUP-04 – Hệ số điều chỉnh  
**Breadcrumb hiện tại:** Lương sản phẩm › Thiết lập › Hệ số điều chỉnh  
**Phiên bản tài liệu:** v1.0  
**Ngày:** 26/06/2026  
**Đối tượng:** Dev Team / Technical Lead / QA  

---

## 1. PHÂN TÍCH HIỆN TRẠNG

### 1.1 Form hiện tại đang làm được gì

Màn hình **"Thiết lập hệ số điều chỉnh theo bộ phận"** hiện tại (hình chụp) đang có:

| Thành phần | Hiện trạng |
|---|---|
| Bộ lọc | Tháng hiệu lực, Công ty, Đơn vị cấp 1–6, Nhóm tính lương |
| Trường nhập | Hệ số 1 (số), Radio: Phần trăm / Số tiền, Ghi chú |
| Nút | Làm mới, Thêm mới, Lưu dữ liệu, Xóa, Xuất dữ liệu, Nhập dữ liệu |
| Grid | STT, Tháng, Công ty / Đơn vị, Nhóm tính lương, Hệ số 1, Ghi chú |

**Hạn chế hiện tại:**
- Chỉ nhập được **1 hệ số duy nhất** (Hệ số 1)
- Chỉ nhập theo **Bộ phận / Nhóm tính lương** (scope cố định)
- Chưa hỗ trợ nhập **tăng/giảm dạng ±% hoặc ±Tiền** (chỉ nhập giá trị tuyệt đối)
- Không phân biệt hướng điều chỉnh: tăng hay giảm

### 1.2 Yêu cầu nghiệp vụ cần bổ sung (từ file Excel mẫu)

Từ ảnh sheet **PP_tính** và file `MPHGCÁCH_CHIA_NS_CHO_PV_MOI_HAITD16_25062026_V1_0.xlsx`, nghiệp vụ thực tế yêu cầu:

1. **3 vòng điều chỉnh tuần tự:** HS1 → HS2 → HS3, mỗi vòng áp lên kết quả của vòng trước
2. **Mỗi hệ số** có thể nhập theo **2 hướng: tăng (+) hoặc giảm (–)**
3. **Mỗi hướng** có thể nhập bằng **2 đơn vị: % hoặc Số tiền**
4. Hệ thống phải **tự quy đổi** ra giá trị Hệ số cuối (dạng số thực) để nhân vào công thức:
   - Tiền HS1 = TiềnL0 × HS1_value
   - Tiền HS2 = Tiền HS1 × HS2_value
   - Tiền HS3 = Tiền HS2 × HS3_value

**Ví dụ từ file Excel (Bộ phận A – Lần 1):**

| Bộ phận | Loại điều chỉnh | % nhập | Tiền nhập | Kết quả HS |
|---|---|---|---|---|
| Bộ phận A | Điều chỉnh = % | +10% | (tính ra tiền) | 110% |
| Bộ phận B | Điều chỉnh = % | -10% | (tính ra tiền) | 90% |
| Bộ phận C | Điều chỉnh = Tiền | (tính ra %) | +500,000 | = 1 + 500000/TiềnL0 |
| Bộ phận D | Điều chỉnh = Tiền | (tính ra %) | -500,000 | = 1 - 500000/TiềnL0 |
| Bộ phận E | Điều chỉnh = % | 0% / 100% | (tính ra tiền) | 100% (giữ nguyên) |

---

## 2. QUYẾT ĐỊNH KIẾN TRÚC: 1 CHỨC NĂNG hay 3 CHỨC NĂNG?

### 2.1 Phân tích 2 phương án

#### Phương án A – Tách 3 chức năng riêng (HS1 / HS2 / HS3)

```
Menu:
  ├── Thiết lập HS điều chỉnh lần 1
  ├── Thiết lập HS điều chỉnh lần 2
  └── Thiết lập HS điều chỉnh lần 3
```

**Ưu điểm:**
- Mỗi màn hình đơn giản, người dùng không bị nhầm lẫn giữa các lần
- Phù hợp khi 3 lần điều chỉnh do **3 người / 3 bộ phận khác nhau** thực hiện (phân quyền rõ)
- Dễ phân quyền xem/sửa/khóa từng lần độc lập
- Dễ audit log từng lần riêng biệt

**Nhược điểm:**
- Tạo thêm 2 menu item và 2 màn hình mới → Dev tốn effort hơn
- User phải di chuyển qua lại 3 màn hình để nhập đủ 3 lần
- Logic form giống nhau → dễ sinh code trùng lặp nếu Dev không abstract đúng

#### Phương án B – 1 chức năng, grid có 3 cột (HS1 / HS2 / HS3) trên cùng 1 dòng Bộ phận

```
Grid:
  Tháng | Bộ phận | Nhóm TL | HS1 (loại, giá trị) | HS2 (loại, giá trị) | HS3 (loại, giá trị) | Ghi chú
```

**Ưu điểm:**
- Người dùng thấy toàn bộ 3 hệ số của 1 bộ phận trên 1 dòng → dễ so sánh
- 1 màn hình, 1 lần truy cập → UX đơn giản hơn cho user nhập liệu đồng thời

**Nhược điểm:**
- Grid sẽ có nhiều cột, khó đọc trên màn hình nhỏ
- Phân quyền theo từng lần khó hơn (phải phân quyền field-level)
- Nghiệp vụ thực tế: 3 lần điều chỉnh thường được nhập **tại 3 thời điểm khác nhau** trong quy trình tính lương, không phải đồng thời → dễ gây nhầm

### 2.2 Kết luận kiến trúc – Khuyến nghị

> **Khuyến nghị: Phương án A – Tách 3 chức năng riêng, nhưng dùng chung 1 component/form template.**

**Lý do:**
1. Quy trình LSP (PRM.BP.03) mô tả rõ: Bước 4 → Bước 6 → Bước 8 là 3 bước **tuần tự, có điều kiện tiên quyết** (phải có kết quả lần trước mới nhập lần sau). Tách riêng phản ánh đúng luồng nghiệp vụ.
2. Phân quyền theo từng lần điều chỉnh sẽ dễ kiểm soát hơn (ví dụ: chỉ HR cấp cao mới được nhập HS3).
3. Dev có thể reuse 1 form component duy nhất, truyền vào tham số `lan` (1/2/3) → không code trùng lặp, effort không tăng nhiều.
4. Khả năng mở rộng: Nếu sau này cần 4 lần điều chỉnh, chỉ thêm 1 menu item và 1 config record.

**Cấu trúc menu đề xuất:**

```
LSP – THIẾT LẬP
  1. Quy cách tính lương
  2. Hỗ trợ theo Bộ phận
  3. Hỗ trợ quy cách tính lương
  4. Hệ số điều chỉnh lần 1   ← Nâng cấp từ "Hệ số điều chỉnh" hiện tại
  5. Hệ số điều chỉnh lần 2   ← Thêm mới
  6. Hệ số điều chỉnh lần 3   ← Thêm mới
```

---

## 3. THIẾT KẾ GIẢI PHÁP CHI TIẾT

### 3.1 Nguyên tắc dùng chung (áp dụng cho cả 3 màn hình)

3 màn hình HS1 / HS2 / HS3 **dùng chung 1 form component**, phân biệt nhau qua tham số cấu hình:

| Tham số | HS1 | HS2 | HS3 |
|---|---|---|---|
| `lan` | 1 | 2 | 3 |
| Màn hình tiêu đề | "Hệ số điều chỉnh lần 1" | "Hệ số điều chỉnh lần 2" | "Hệ số điều chỉnh lần 3" |
| Điều kiện tiên quyết để nhập | Đã tính LSP gốc | Đã nhập / xác nhận HS1 | Đã nhập / xác nhận HS2 |
| DB field mapping | `hs1_loai`, `hs1_gia_tri` | `hs2_loai`, `hs2_gia_tri` | `hs3_loai`, `hs3_gia_tri` |
| DM tham chiếu | DM021 | DM022 | DM023 |

---

### 3.2 Trường thông tin trên form (áp dụng cho cả 3 màn hình)

#### Vùng filter / header (giữ nguyên như hiện tại, bổ sung Nhóm tính lương bắt buộc)

| Trường | Bắt buộc | Kiểu | Ghi chú |
|---|---|---|---|
| Tháng hiệu lực | Có | MM/YYYY | Kỳ LSP phải đã tồn tại |
| Công ty | Có | Combobox | |
| Đơn vị cấp 1 | Không | Combobox | Cascade |
| Đơn vị cấp 2–6 | Không | Combobox | Cascade |
| Nhóm tính lương | Không | Combobox | Filter thêm |

#### Vùng nhập hệ số – **THAY ĐỔI CHÍNH**

Thay vì chỉ có "Hệ số 1" + Radio Phần trăm/Số tiền, nâng cấp thành:

| Trường | Bắt buộc | Kiểu | Mô tả |
|---|---|---|---|
| Loại điều chỉnh | Có | Radio 2 option | `%` hoặc `Tiền` |
| Hướng điều chỉnh | Có | Radio 2 option | `Tăng (+)` hoặc `Giảm (–)` |
| Giá trị nhập | Có | Numeric | Nhập số dương. Âm dương do "Hướng" quyết định |
| Hệ số quy đổi (tự tính) | Không | Label | Hiển thị read-only giá trị HS thực sau quy đổi (ví dụ: 110% hoặc 90%) |
| Ghi chú | Không | Text | Max 1000 ký tự |

**Logic quy đổi ra HS thực (hệ số nhân vào tiền lương):**

```
Nếu Loại = % và Hướng = Tăng:
    HS_value = (100 + GiaTriNhap) / 100
    Ví dụ: nhập 10 → HS = 110% = 1.10

Nếu Loại = % và Hướng = Giảm:
    HS_value = (100 - GiaTriNhap) / 100
    Ví dụ: nhập 10 → HS = 90% = 0.90

Nếu Loại = Tiền và Hướng = Tăng:
    HS_value = 1 + (GiaTriNhap / TienLuongTruoc)
    Ví dụ: Tiền gốc = 5,000,000; nhập 500,000 → HS = 1 + 0.10 = 1.10

Nếu Loại = Tiền và Hướng = Giảm:
    HS_value = 1 - (GiaTriNhap / TienLuongTruoc)
    Ví dụ: Tiền gốc = 5,000,000; nhập 500,000 → HS = 1 - 0.10 = 0.90
```

> **Need Confirm OP-01:** Khi Loại = Tiền, `TienLuongTruoc` để quy đổi ra % là tiền lương **bình quân của Bộ phận** trong kỳ, hay tiền lương **từng nhân viên** trong Bộ phận? Nếu tính theo từng NV thì HS_value sẽ khác nhau từng người → không thể lưu thành 1 bản ghi theo Bộ phận. Cần xác nhận trước khi code.

> **Need Confirm OP-02:** Khi Loại = Tiền, giá trị tiền nhập là **cố định tuyệt đối** (mọi NV trong BP đều ± cùng 1 khoản tiền) hay **tỷ lệ theo lương**? Nếu cố định tuyệt đối thì công thức không cần TienLuongTruoc → đơn giản hơn.

#### Ví dụ mẫu thao tác trên Form

| Trường dữ liệu trên Form | Kịch bản 1: Tăng % | Kịch bản 2: Giảm số tiền | Kịch bản 3: Không đổi |
|---|---|---|---|
| **Bộ phận chọn** | Tổ Phile 1 | Tổ Đóng Gói 2 | Kho Lạnh |
| **Loại điều chỉnh** | `(o) %` | `(o) Tiền` | `(o) %` |
| **Hướng** | `(o) Tăng (+)` | `(o) Giảm (-)` | `(o) Tăng (+)` |
| **Giá trị nhập** | `15` | `1,000,000` | `0` |
| **Hệ số quy đổi** *(Tự động tính)* | `115%` | *(Phụ thuộc kết quả OP-01/02)* | `100%` |
| **Ghi chú** | Đạt năng suất vượt mức | Trừ tiền do hàng lỗi | Không điều chỉnh |

---

### 3.3 Grid hiển thị (sau khi lưu)

| Cột | Mô tả |
|---|---|
| STT | Số thứ tự |
| Tháng | Tháng hiệu lực |
| Công ty / Đơn vị | Chuỗi đơn vị cascade |
| Nhóm tính lương | |
| Loại điều chỉnh | `%` hoặc `Tiền` |
| Hướng | `Tăng` hoặc `Giảm` |
| Giá trị nhập | Số người dùng nhập |
| Hệ số quy đổi | HS_value dạng %, ví dụ `110%`, `90%` |
| Ghi chú | |
| Người lưu | Auto-fill từ session |
| Ngày lưu | Auto-fill timestamp |

---

### 3.4 Nút chức năng

| Nút | Hành vi | Rule bổ sung |
|---|---|---|
| Làm mới | Reset filter, clear form nhập | Giữ nguyên |
| Thêm mới | Mở form nhập mới | Kiểm tra kỳ hợp lệ trước khi cho thêm |
| Lưu dữ liệu | Lưu bản ghi mới / cập nhật | Validate loại, hướng, giá trị > 0. Upsert theo Công ty + ĐV + Nhóm TL + Tháng + Lần |
| Xóa | Xóa bản ghi | Popup xác nhận. Không xóa nếu kỳ đã khóa LSP |
| Xuất dữ liệu | Export grid ra Excel | Thêm cột Loại, Hướng, Giá trị nhập, HS quy đổi vào template export |
| Nhập dữ liệu | Import từ Excel template | Xem mục 3.5 |

---

### 3.5 Import Excel – Template mới

Template import cần bổ sung thêm 2 cột so với template hiện tại:

| Cột Excel | Tên header | Bắt buộc | Kiểu | Ghi chú |
|---|---|---|---|---|
| A | Tháng | Có | MM/YYYY | |
| B | Mã Công ty | Có | Text | |
| C | Mã ĐV cấp 1 | Không | Text | |
| D | Mã ĐV cấp 2 | Không | Text | |
| E | Mã ĐV cấp 3 (Bộ phận) | Không | Text | |
| F | Mã Nhóm tính lương | Không | Text | |
| G | Loại điều chỉnh | Có | Text | Chỉ nhận: `%` hoặc `Tiền` |
| H | Hướng điều chỉnh | Có | Text | Chỉ nhận: `Tăng` hoặc `Giảm` |
| I | Giá trị | Có | Numeric | > 0 |
| J | Ghi chú | Không | Text | |

**Validate khi import:**

| Điều kiện | Hành động |
|---|---|
| Thiếu cột Loại hoặc Hướng | Lỗi chặn dòng |
| Loại không phải `%` hoặc `Tiền` | Lỗi chặn dòng, ghi thông báo lỗi |
| Hướng không phải `Tăng` hoặc `Giảm` | Lỗi chặn dòng |
| Giá trị ≤ 0 hoặc không phải số | Lỗi chặn dòng |
| Tháng không tồn tại trong kỳ LSP | Lỗi chặn dòng |
| Trùng Công ty + ĐV + Nhóm TL + Tháng + Lần | Hỏi xác nhận ghi đè (Warning+Confirm) |
| Kỳ đã khóa LSP | Lỗi chặn toàn bộ import |

**Xử lý import:** Partial success – dòng lỗi bỏ qua, dòng hợp lệ import. Hiển thị log chi tiết dòng lỗi.

---

### 3.6 Validation Rules chi tiết

| Rule ID | Điều kiện | Message | Loại |
|---|---|---|---|
| HDDC-R01 | Tháng không tồn tại hoặc chưa tạo kỳ LSP | "Kỳ tháng [MM/YYYY] chưa tồn tại. Vui lòng tạo kỳ LSP trước." | Blocking |
| HDDC-R02 | Loại = `Tiền` và Giá trị > TiềnLuongBinhQuanBP | "Giá trị điều chỉnh vượt quá lương bình quân bộ phận. Kiểm tra lại." | Warning |
| HDDC-R03 | Loại = `%` và GiaTriNhap > 100 (Hướng = Giảm) | "Điều chỉnh giảm vượt 100% sẽ tạo ra lương âm. Vui lòng kiểm tra." | Blocking |
| HDDC-R04 | Kỳ LSP đã khóa | "Kỳ [MM/YYYY] đã khóa. Vui lòng mở khóa trước khi chỉnh sửa hệ số." | Blocking |
| HDDC-R05 | Trùng Bộ phận + Tháng + Lần khi Thêm mới | "Đã có hệ số điều chỉnh lần [N] cho [Bộ phận] tháng [MM/YYYY]. Cập nhật?" | Warning+Confirm |
| HDDC-R06 | Giá trị nhập = 0 | "Giá trị = 0 không tạo ra điều chỉnh. Hệ số sẽ = 100%. Tiếp tục lưu?" | Warning+Confirm |

---

### 3.7 Công thức tính lương sử dụng HS1/HS2/HS3

Áp dụng trong engine tính LSP, theo thứ tự:

```
Tiền_L0   = Lương Sản Phẩm Gốc (trước điều chỉnh)

Tiền_L1   = Tiền_L0 × HS1_value        (lần 1)
Tiền_L2   = Tiền_L1 × HS2_value        (lần 2)
Tiền_L3   = Tiền_L2 × HS3_value        (lần 3)

Hỗ trợ   = Tiền_L3 - Tiền_L1          (khoản hỗ trợ tách ra – Bước 10 PRM.BP.03)

Tổng HS   = HS1 × HS2 × HS3            (hiển thị tổng hợp)
```

> **Need Confirm OP-03 (OP-16 cũ):** Công thức `TongHS = HS1 × HS2 × HS3 × (1 + %HoTroBP)` đã được ghi nhận là **BLOCKING** trong prototype (banner vàng trên màn hình chụp). Cần xác nhận: `%HoTroBP` có nhân vào `TongHS` không, hay `%HoTroBP` là một khoản cộng thêm độc lập sau khi đã nhân HS3? Nếu nhân vào TongHS sẽ **double-count** với cột "Hỗ trợ tiền lương" đang tính riêng. **Không code công thức engine trước khi có xác nhận.**

---

### 3.8 Phân quyền

| Role | HS1 | HS2 | HS3 |
|---|---|---|---|
| HR Admin – Tính lương | Xem + Nhập + Sửa + Xóa + Import + Export | Xem + Nhập + Sửa + Xóa + Import + Export | Xem + Nhập + Sửa + Xóa + Import + Export |
| HR Xem báo cáo | Chỉ Xem + Export | Chỉ Xem + Export | Chỉ Xem + Export |
| Quản lý Bộ phận | Chỉ Xem ĐV thuộc phạm vi phân quyền | Chỉ Xem | Chỉ Xem |
| System Admin | Full | Full | Full |

> **Need Confirm OP-04:** Có cần phân quyền riêng cho từng Lần (ví dụ: chỉ HR cấp cao được nhập HS3) không?

Data scope: HR chỉ được nhập/xem hệ số điều chỉnh của các Bộ phận/Đơn vị thuộc phạm vi phân quyền dữ liệu của user đó.

---

### 3.9 Audit Log

Mỗi thao tác Thêm / Sửa / Xóa / Import cần lưu:

| Trường log | Mô tả |
|---|---|
| user_id | Người thao tác |
| role | Vai trò |
| action | INSERT / UPDATE / DELETE / IMPORT |
| lan | 1 / 2 / 3 |
| thang | Tháng hiệu lực |
| don_vi | Mã ĐV |
| nhom_tinh_luong | Mã nhóm |
| gia_tri_cu | Giá trị trước khi sửa |
| gia_tri_moi | Giá trị sau khi sửa |
| loai_cu / loai_moi | Loại (% / Tiền) trước/sau |
| huong_cu / huong_moi | Hướng (Tăng/Giảm) trước/sau |
| timestamp | Thời điểm thao tác |
| ghi_chu | Comment nếu có |

---

### 3.10 Notification / Email

Không có yêu cầu gửi email/notification cho chức năng nhập hệ số điều chỉnh.  
Nếu sau này cần thêm: cần xác nhận thêm. _(Need Confirm OP-05)_

---

## 4. EXCEPTION / EDGE CASE

| Case | Mô tả | Xử lý |
|---|---|---|
| Bộ phận không thuộc kỳ LSP | User chọn Bộ phận nhưng kỳ đó không có dữ liệu tính lương | Warning: "Bộ phận [X] chưa có dữ liệu LSP trong kỳ [MM/YYYY]. Hệ số vẫn có thể lưu nhưng sẽ không ảnh hưởng kết quả tính." |
| HS2/HS3 nhập khi HS trước chưa có | User nhập HS2 khi chưa có HS1 | Warning (không blocking): "Chưa có Hệ số điều chỉnh lần 1 cho Bộ phận này. Đảm bảo nhập đủ trước khi tính lương." |
| Kỳ LSP đã khóa | Toàn bộ 3 màn hình HS đều không cho sửa | Blocking với message rõ ràng + link mở khóa |
| Import file thiếu cột Hướng | File cũ format (không có cột Hướng / Loại) | Reject import, hiển thị hướng dẫn tải template mới |
| Giá trị nhập dạng % > 100 Giảm | Tạo lương âm | Blocking – HDDC-R03 |
| Nhóm tính lương bị xóa sau khi đã lưu HS | HS còn lưu trong DB nhưng không tìm thấy nhóm | Log warning, không xóa HS. Báo lỗi khi tính LSP nếu mapping không tìm thấy. |

---

## 5. ACCEPTANCE CRITERIA

| # | Tiêu chí | Test Case |
|---|---|---|
| AC-01 | Màn hình HS1 / HS2 / HS3 có tiêu đề phân biệt rõ ràng, breadcrumb đúng | Mở từng màn hình, kiểm tra tiêu đề và breadcrumb |
| AC-02 | Người dùng chọn được Loại (% / Tiền) và Hướng (Tăng / Giảm), Giá trị > 0 | Nhập đủ 4 combo, bấm Lưu → lưu thành công |
| AC-03 | Hệ số quy đổi được tính và hiển thị tự động khi user nhập xong Giá trị | Nhập Loại=%, Hướng=Tăng, GiaTri=10 → Hệ số quy đổi hiển thị 110% |
| AC-04 | Nhập Loại=%, Hướng=Giảm, GiaTri=100 → Hệ thống chặn lưu (lương âm) | Kiểm tra HDDC-R03 blocking |
| AC-05 | Trùng Bộ phận + Tháng + Lần → hệ thống hỏi xác nhận ghi đè, không tự ghi đè | Nhập lại record đã tồn tại, kiểm tra popup confirm |
| AC-06 | Kỳ LSP đã khóa → không cho thêm/sửa/xóa HS | Lock kỳ, thử thao tác, kiểm tra message chặn |
| AC-07 | Import template mới (có cột Loại, Hướng) → import thành công dòng hợp lệ | Import file 10 dòng (8 hợp lệ, 2 lỗi), kiểm tra kết quả |
| AC-08 | Import dòng thiếu cột Hướng → reject dòng đó, ghi log lỗi | Kiểm tra partial success và log lỗi |
| AC-09 | Audit log ghi đủ: user, action, lan, thang, don_vi, gia_tri_cu, gia_tri_moi, timestamp | Sửa 1 record, kiểm tra bảng audit log |
| AC-10 | Data scope: HR chỉ thấy ĐV thuộc phạm vi phân quyền | Login bằng HR ĐV A, kiểm tra không thấy dữ liệu ĐV B |
| AC-11 | Grid xuất Excel đúng format mới (có cột Loại, Hướng, Giá trị nhập, HS quy đổi) | Export grid, mở file kiểm tra cột |
| AC-12 | Bộ phận E nhập GiaTri=0 → Warning confirm, lưu được với HS=100% | Nhập GiaTri=0, xác nhận Warning, kiểm tra HS_value=1.00 trong DB |

---

## 6. DEV NOTE

| # | Ghi chú kỹ thuật |
|---|---|
| DN-01 | 3 màn hình HS1/HS2/HS3 nên dùng **1 component/controller dùng chung**, nhận tham số `lan` (1/2/3) qua route/config. Tránh copy-paste code. |
| DN-02 | DB: Nên lưu cả `loai` (% / T), `huong` (+ / -), `gia_tri_nhap` (số người dùng nhập), và `hs_value` (giá trị quy đổi thực). Không nên chỉ lưu `hs_value` vì mất thông tin gốc. |
| DN-03 | Khi Loại = Tiền: nếu quyết định quy đổi theo lương bình quân BP thì cần join với bảng kết quả LSP gốc tại thời điểm tính. Cần index trên `thang + don_vi + nhom_tinh_luong`. |
| DN-04 | Field `hs_value` nên lưu dạng DECIMAL(10,6) để đảm bảo độ chính xác khi nhân chuỗi 3 lần. |
| DN-05 | Engine tính LSP cần đọc HS1, HS2, HS3 theo đúng thứ tự và theo **scope hẹp nhất** (ưu tiên ĐV cấp 6 → cấp 5 → ... → cấp 1 → Công ty) nếu có nhiều cấp cùng nhập. **Need Confirm OP-06:** Xác nhận rule ưu tiên scope. |
| DN-06 | **OP-16 BLOCKING:** Chưa code công thức `TongHS × (1 + %HoTroBP)` cho đến khi có xác nhận từ PO/BA. |
| DN-07 | Khi import, nên validate cột Loại và Hướng case-insensitive (`%`, `TIEN`, `Tiền`, `tien`, `TANG`, `GIAM`...) và normalize trước khi lưu. |
| DN-08 | Log import nên lưu tên file, số dòng thành công, số dòng lỗi, chi tiết lỗi từng dòng. |

---

## 7. QA / TEST NOTE

| Case loại | Test cần thực hiện |
|---|---|
| Positive | Nhập đủ Loại=%, Hướng=Tăng, GiaTri=10 → Lưu OK, HS_value=1.10 |
| Positive | Nhập Loại=Tiền, Hướng=Giảm, GiaTri=500000 → Lưu OK (chờ confirm OP-01/OP-02) |
| Positive | Import 10 dòng hợp lệ → 10 dòng thành công |
| Negative | GiaTri=-5 → Chặn lưu (giá trị phải > 0) |
| Negative | Loại=%, Hướng=Giảm, GiaTri=100 → Chặn, message lương âm |
| Negative | Loại=%, Hướng=Giảm, GiaTri=150 → Chặn |
| Negative | Kỳ đã khóa LSP → Chặn mọi thao tác |
| Boundary | GiaTri=0 → Warning, cho lưu sau confirm |
| Boundary | GiaTri=100 (Loại=%, Hướng=Tăng) → HS=200%, Warning nhưng cho lưu |
| Workflow | Nhập HS1 → tính lương → nhập HS2 → tính lại → kết quả HS2 áp lên kết quả HS1 |
| Permission | HR ĐV A không thấy ĐV B trong dropdown và grid |
| Permission | HR Xem không thấy nút Thêm mới / Lưu / Xóa / Import |
| Import | File có cột Hướng bị sai giá trị ("Tang" thay vì "Tăng") → reject dòng đó |
| Import | File thiếu cột Loại → reject toàn bộ file với hướng dẫn tải template mới |
| Audit | Sửa HS từ 10% Tăng sang 15% Tăng → log ghi đúng gia_tri_cu=10, gia_tri_moi=15 |

---

## 8. OPEN POINTS – CẦN XÁC NHẬN

| Mã | Nội dung | Đối tượng cần xác nhận | Mức độ |
|---|---|---|---|
| OP-01 | Khi Loại=Tiền, `TienLuongTruoc` để quy đổi là lương **bình quân BP** hay lương **từng NV**? | BA / PO / MPHG | **BLOCKING** |
| OP-02 | Khi Loại=Tiền, khoản tiền nhập là **cố định tuyệt đối** (tất cả NV ± cùng số tiền) hay **tỷ lệ theo lương**? | BA / PO / MPHG | **BLOCKING** |
| OP-03 | Công thức `TongHS = HS1 × HS2 × HS3 × (1 + %HoTroBP)`: `%HoTroBP` nhân vào TongHS hay là khoản cộng thêm độc lập? (OP-16 cũ) | BA / PO / MPHG | **BLOCKING – Chưa code engine** |
| OP-04 | Có phân quyền riêng từng Lần (HS1/HS2/HS3) theo Role không? | BA / PO | Medium |
| OP-05 | Có cần gửi Notification khi lưu / hoàn thành nhập HS không? | BA / PO | Low |
| OP-06 | Rule ưu tiên scope: nếu có HS1 cho cả ĐV cấp 3 và ĐV cấp 5 trong cùng 1 tháng, ưu tiên cấp nào? | BA / Tech Lead | Medium |

---

*Tài liệu này là đầu vào cho Dev estimate, design DB, code và QA test. Mọi thay đổi sau khi confirm Open Points cần cập nhật lại phiên bản tài liệu.*
