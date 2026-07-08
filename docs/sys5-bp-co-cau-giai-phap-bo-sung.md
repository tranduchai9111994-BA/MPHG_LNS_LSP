# Tài liệu giải pháp — Bổ sung trường "Nhóm tính lương" và "Bộ phận bảng kê"
## Màn hình: Thiết lập bộ phận tính lương theo cơ cấu (sys5)

> **Phân loại:** Nâng cấp màn hình có sẵn  
> **Ngày soạn:** 08/07/2026  
> **Người soạn:** BA – iHRP Minh Phú  
> **Trạng thái:** Chờ dev thực hiện

---

## 1. Bối cảnh & Mục tiêu

Màn hình **Thiết lập bộ phận tính lương theo cơ cấu** (`FormPage.aspx?FID=sys5` / route tương đương) cho phép cấu hình mapping giữa đơn vị tổ chức theo cơ cấu công ty (cấp 1 → 6) với bộ phận tính lương sản phẩm (LSP).

Hiện tại màn hình **chưa lưu** hai thông tin nghiệp vụ quan trọng cần thiết để hệ thống tự động gắn đúng nhóm tính lương và bộ phận bảng kê khi xử lý dữ liệu từ màn hình **Quá trình làm việc của nhân viên (FID = 24)**:

| Trường cần bổ sung | Mục đích |
|---|---|
| **Nhóm tính lương** | Xác định nhóm công thức tính lương (Hệ số / Năng suất / Bình quân…) áp dụng cho đơn vị |
| **Bộ phận bảng kê** | Xác định bộ phận hiển thị trên bảng kê tổng hợp lương, dùng để gom nhóm khi in báo cáo |

---

## 2. Phạm vi thay đổi

| Hạng mục | Chi tiết |
|---|---|
| **Bảng dữ liệu (DB)** | Thêm 2 cột mới vào bảng thiết lập cơ cấu |
| **Giao diện — Lưới (Grid)** | Hiển thị 2 cột mới |
| **Giao diện — Popup thêm/sửa** | Form nhập 2 trường mới |
| **Template import (Excel)** | Bổ sung 2 cột vào file mẫu `.xlsx` |
| **Xử lý FID = 24** | Đọc mapping để gắn Nhóm tính lương & Bộ phận bảng kê cho nhân viên |

---

## 3. Mô tả chi tiết 2 trường mới

### 3.1 Nhóm tính lương (`NhomTinhLuong`)

| Thuộc tính | Giá trị |
|---|---|
| Tên hiển thị | Nhóm tính lương |
| Bắt buộc | **Không** |
| Kiểu dữ liệu | `nvarchar(20)` — lưu Mã nhóm tính lương |
| Nguồn dữ liệu | Danh mục **Nhóm tính lương** (`dm_NhomTinhLuong`) |
| Hiển thị combo | `[Mã] - [Tên]` — ví dụ: `NTL01 - Hệ số` |
| Vị trí trên lưới | Sau cột **Đơn vị cấp 5**, trước cột **Bộ phận bảng kê** |
| Vị trí trên popup | Dòng 4 — cùng hàng với **Đơn vị cấp 6** (bên phải) |

**Danh mục tham chiếu** (`dm_NhomTinhLuong`):

| Mã | Tên |
|---|---|
| NTL01 | Hệ số |
| NTL02 | Năng suất |
| NTL03 | Bình quân lương sản phẩm |
| NTL04 | Bình quân ca bàn chuyền |
| NTL05 | Hệ số điều chỉnh đặc biệt |

---

### 3.2 Bộ phận bảng kê (`BpBangKe`)

| Thuộc tính | Giá trị |
|---|---|
| Tên hiển thị | Bộ phận bảng kê |
| Bắt buộc | **Không** |
| Kiểu dữ liệu | `nvarchar(20)` — lưu Mã bộ phận bảng kê |
| Nguồn dữ liệu | Danh mục **Bộ phận bảng kê** (`dm_BpBangKe`) — **danh mục mới, cần tạo thêm** |
| Hiển thị combo | `[Mã] - [Tên]` — ví dụ: `BPBK003 - Chế biến K1` |
| Vị trí trên lưới | Sau cột **Nhóm tính lương**, trước cột **Bộ phận tính lương** |
| Vị trí trên popup | Dòng 5 — hàng riêng (nửa trái) |

**Danh mục tham chiếu** (`dm_BpBangKe`) — *danh mục mới cần tạo*:

| Mã | Tên |
|---|---|
| BPBK001 | Băng chuyền K1 |
| BPBK002 | Băng chuyền K2 |
| BPBK003 | Chế biến K1 |
| BPBK004 | Chế biến K2 |
| BPBK005 | PTO K1 |
| BPBK006 | PTO K2 |
| BPBK007 | Tẩm bột |
| BPBK008 | Xuất hàng Tp |
| BPBK009 | Phân cỡ tay |
| BPBK010 | Vệ sinh khuôn viên |

---

## 4. Thay đổi cấu trúc DB

### 4.1 Bảng chính — `LSP_CoCauBoPhan` (hoặc tên bảng tương đương đang dùng)

```sql
ALTER TABLE LSP_CoCauBoPhan
    ADD NhomTinhLuong NVARCHAR(20) NULL,
        BpBangKe      NVARCHAR(20) NULL;
```

> **Ghi chú:** Cả hai cột `NULL` — không bắt buộc. Không có DEFAULT value.

### 4.2 Bảng danh mục mới — `dm_BpBangKe`

```sql
CREATE TABLE dm_BpBangKe (
    Id          INT            IDENTITY(1,1) PRIMARY KEY,
    Ma          NVARCHAR(20)   NOT NULL UNIQUE,
    Ten         NVARCHAR(100)  NOT NULL,
    SuDung      BIT            NOT NULL DEFAULT 1,
    GhiChu      NVARCHAR(200)  NULL,
    NguoiTao    NVARCHAR(50)   NULL,
    NgayTao     DATETIME       NULL,
    NguoiSua    NVARCHAR(50)   NULL,
    NgaySua     DATETIME       NULL
);
```

**Insert dữ liệu khởi tạo:**

```sql
INSERT INTO dm_BpBangKe (Ma, Ten, SuDung) VALUES
('BPBK001', N'Băng chuyền K1',      1),
('BPBK002', N'Băng chuyền K2',      1),
('BPBK003', N'Chế biến K1',         1),
('BPBK004', N'Chế biến K2',         1),
('BPBK005', N'PTO K1',              1),
('BPBK006', N'PTO K2',              1),
('BPBK007', N'Tẩm bột',            1),
('BPBK008', N'Xuất hàng Tp',        1),
('BPBK009', N'Phân cỡ tay',         1),
('BPBK010', N'Vệ sinh khuôn viên',  1);
```

---

## 5. Thay đổi giao diện

### 5.1 Lưới dữ liệu (Grid) — Bổ sung 2 cột

Chèn 2 cột mới vào **sau cột "Đơn vị cấp 5"**, trước cột "Bộ phận tính lương":

| Thứ tự | Tên cột | Binding field | Ghi chú |
|---|---|---|---|
| … | Đơn vị cấp 5 | `DonViCap5` | Cột hiện tại |
| **+1** | **Nhóm tính lương** | `NhomTinhLuong` | **Mới — hiển thị Mã** |
| **+2** | **Bộ phận bảng kê** | `BpBangKe` | **Mới — hiển thị Mã** |
| … | Bộ phận tính lương | `BpTinhLuong` | Cột hiện tại |
| … | Bộ phận nhóm lương | `BoPhan` | Cột hiện tại |

> Nếu muốn hiển thị `Mã - Tên` thay vì chỉ Mã, cần JOIN thêm với bảng danh mục tương ứng.

### 5.2 Popup Thêm mới / Sửa

**Layout popup hiện tại (4 cột: Label | Field | Label | Field):**

```
Dòng 1: [Công ty *]        [combo]    [Đơn vị cấp 1]    [combo]
Dòng 2: [Đơn vị cấp 2]    [combo]    [Đơn vị cấp 3]    [combo]
Dòng 3: [Đơn vị cấp 4]    [combo]    [Đơn vị cấp 5]    [combo]
Dòng 4: [Đơn vị cấp 6]    [combo]    [Nhóm tính lương] [combo]   ← MỚI (bên phải)
Dòng 5: [Bộ phận bảng kê] [combo]    [ ]               [ ]       ← MỚI (nửa trái)
         □ Thiết lập bộ phận tính lương
           └─ (khi check) [Bộ phận tính lương] [combo]
         □ Thiết lập hLevel2
         [Ghi chú]         [textarea]
```

**Quy tắc hiển thị:**
- **Nhóm tính lương**: luôn hiển thị, không bắt buộc
- **Bộ phận bảng kê**: luôn hiển thị, không bắt buộc
- **Bộ phận tính lương**: chỉ hiển thị khi checkbox **"Thiết lập bộ phận tính lương"** được tick

### 5.3 Combo load dữ liệu

| Trường | API / Stored Procedure gợi ý | Tham số |
|---|---|---|
| Nhóm tính lương | `sp_GetDanhMuc` hoặc `GET /api/danhmuc/nhom-tinh-luong` | `SuDung = 1` |
| Bộ phận bảng kê | `sp_GetDanhMuc` hoặc `GET /api/danhmuc/bp-bang-ke` | `SuDung = 1` |

---

## 6. Thay đổi Template Import (Excel)

File mẫu import `.xlsx` cần bổ sung **2 cột mới** vào đúng thứ tự sau cột **Đơn vị cấp 5**.

### 6.1 Cấu trúc cột template sau khi nâng cấp

| STT | Tên cột (header) | Tên field | Bắt buộc | Kiểu | Ghi chú |
|---|---|---|---|---|---|
| 1 | Công ty | CongTy | **Có** | Text | |
| 2 | Đơn vị cấp 1 | DonViCap1 | Không | Text | |
| 3 | Đơn vị cấp 2 | DonViCap2 | Không | Text | |
| 4 | Đơn vị cấp 3 | DonViCap3 | Không | Text | |
| 5 | Đơn vị cấp 4 | DonViCap4 | Không | Text | |
| 6 | Đơn vị cấp 5 | DonViCap5 | Không | Text | |
| 7 | Đơn vị cấp 6 | DonViCap6 | Không | Text | |
| **8** | **Nhóm tính lương** | **NhomTinhLuong** | **Không** | **Text** | **Nhập Mã — VD: NTL01** |
| **9** | **Bộ phận bảng kê** | **BpBangKe** | **Không** | **Text** | **Nhập Mã — VD: BPBK003** |
| 10 | Bộ phận tính lương | BpTinhLuong | Không | Text | Nhập Mã |
| 11 | Thiết lập BP tính lương | ThietLapBP | Không | Text | `X` hoặc để trống |
| 12 | Thiết lập hLevel2 | ThietLapHL2 | Không | Text | `X` hoặc để trống |
| 13 | Ghi chú | GhiChu | Không | Text | |

### 6.2 Quy tắc validate khi import

```
1. NhomTinhLuong (nếu có giá trị):
   - Phải tồn tại trong dm_NhomTinhLuong (SuDung = 1)
   - Nếu không khớp → báo lỗi dòng X: "Mã Nhóm tính lương không hợp lệ"

2. BpBangKe (nếu có giá trị):
   - Phải tồn tại trong dm_BpBangKe (SuDung = 1)
   - Nếu không khớp → báo lỗi dòng X: "Mã Bộ phận bảng kê không hợp lệ"

3. Các trường cũ: giữ nguyên quy tắc validate hiện hành
```

### 6.3 Sheet "Danh mục" trong file template

Bổ sung 2 sheet tham chiếu để người dùng tra cứu Mã khi nhập file:

**Sheet `DM_NhomTinhLuong`:**

| Mã | Tên |
|---|---|
| NTL01 | Hệ số |
| NTL02 | Năng suất |
| NTL03 | Bình quân lương sản phẩm |
| NTL04 | Bình quân ca bàn chuyền |
| NTL05 | Hệ số điều chỉnh đặc biệt |

**Sheet `DM_BpBangKe`:** *(load từ dm_BpBangKe)*

---

## 7. Liên kết với màn hình Quá trình làm việc nhân viên (FID = 24)

### 7.1 Luồng nghiệp vụ

```
[FID = 24 — Quá trình làm việc nhân viên]
        │
        │  Khi lưu / cập nhật bản ghi QTLV của nhân viên
        ▼
[Đọc cơ cấu đơn vị của nhân viên]
  → DonViCap1, DonViCap2, ... DonViCap5 (từ hồ sơ nhân sự)
        │
        │  Tra cứu bảng LSP_CoCauBoPhan
        ▼
[Lấy mapping: NhomTinhLuong + BpBangKe + BpTinhLuong]
        │
        ▼
[Ghi vào bảng QTLV của nhân viên]
  → Trường QtlvNhomTinhLuong  ← NhomTinhLuong
  → Trường QtlvBpBangKe       ← BpBangKe
  → Trường QtlvBpTinhLuong    ← BpTinhLuong (nếu có)
```

### 7.2 Logic tra cứu mapping (SQL gợi ý)

```sql
-- Lấy cấu hình LSP theo đơn vị của nhân viên
SELECT
    c.NhomTinhLuong,
    c.BpBangKe,
    c.BpTinhLuong,
    c.BoPhan,
    c.ThietLapBP,
    c.ThietLapHL2
FROM LSP_CoCauBoPhan c
WHERE c.CongTy    = @CongTy
  AND (c.DonViCap1 = @DonViCap1 OR c.DonViCap1 IS NULL OR c.DonViCap1 = '')
  AND (c.DonViCap2 = @DonViCap2 OR c.DonViCap2 IS NULL OR c.DonViCap2 = '')
  AND (c.DonViCap3 = @DonViCap3 OR c.DonViCap3 IS NULL OR c.DonViCap3 = '')
  AND (c.DonViCap4 = @DonViCap4 OR c.DonViCap4 IS NULL OR c.DonViCap4 = '')
  AND (c.DonViCap5 = @DonViCap5 OR c.DonViCap5 IS NULL OR c.DonViCap5 = '')
ORDER BY
    -- Ưu tiên cấu hình khớp nhiều cấp nhất (cấp thấp hơn đặc thù hơn)
    IIF(c.DonViCap5 IS NOT NULL AND c.DonViCap5 != '', 1, 0)
  + IIF(c.DonViCap4 IS NOT NULL AND c.DonViCap4 != '', 1, 0)
  + IIF(c.DonViCap3 IS NOT NULL AND c.DonViCap3 != '', 1, 0) DESC;
-- Lấy TOP 1
```

### 7.3 Điều kiện áp dụng tại FID = 24

| Tình huống | Hành động |
|---|---|
| Tìm được 1 bản ghi khớp | Ghi `NhomTinhLuong`, `BpBangKe`, `BpTinhLuong` vào QTLV |
| Tìm được > 1 bản ghi | Lấy bản ghi có cấu hình chi tiết nhất (khớp nhiều cấp nhất) |
| Không tìm được | Để trống — **không báo lỗi**, nhưng **ghi log cảnh báo** |
| `NhomTinhLuong` = NULL | Không ghi đè giá trị cũ trong QTLV (nếu đã có) |
| `BpBangKe` = NULL | Không ghi đè giá trị cũ trong QTLV (nếu đã có) |

---

## 8. Checklist thực hiện cho Dev

### Backend / DB
- [ ] Thêm 2 cột `NhomTinhLuong`, `BpBangKe` vào bảng `LSP_CoCauBoPhan`
- [ ] Tạo bảng `dm_BpBangKe` và insert dữ liệu khởi tạo
- [ ] Cập nhật Stored Procedure `sp_GetLSPCoCau` (hoặc tương đương) — SELECT thêm 2 cột mới
- [ ] Cập nhật SP `sp_SaveLSPCoCau` — INSERT/UPDATE thêm 2 cột mới
- [ ] Tạo SP/API endpoint lấy danh mục `dm_BpBangKe`
- [ ] Cập nhật SP/logic tại FID = 24 theo mục 7.2

### Frontend
- [ ] Lưới: thêm 2 cột `NhomTinhLuong`, `BpBangKe` đúng vị trí
- [ ] Popup: thêm combo `Nhóm tính lương` (dòng 4, bên phải)
- [ ] Popup: thêm combo `Bộ phận bảng kê` (dòng 5, bên trái)
- [ ] Popup: combo `Nhóm tính lương` load từ API/SP danh mục, format `Mã - Tên`
- [ ] Popup: combo `Bộ phận bảng kê` load từ API/SP `dm_BpBangKe`, format `Mã - Tên`
- [ ] Thêm màn hình danh mục `Bộ phận bảng kê` (CRUD cơ bản, tương tự dm_BpTinhLuong)

### Import Excel
- [ ] Cập nhật file template `.xlsx`: thêm cột 8 (`NhomTinhLuong`) và cột 9 (`BpBangKe`)
- [ ] Cập nhật code đọc file: map đúng cột mới vào entity
- [ ] Bổ sung validate mã tham chiếu (mục 6.2)
- [ ] Bổ sung 2 sheet danh mục trong file template

### Test
- [ ] Thêm mới bản ghi qua popup — kiểm tra lưu đúng 2 trường
- [ ] Sửa bản ghi — kiểm tra load đúng giá trị cũ vào combo
- [ ] Import file có đủ 2 cột mới — kiểm tra import thành công
- [ ] Import file không có 2 cột mới (file cũ) — kiểm tra không lỗi (backward compatible)
- [ ] FID = 24: tạo QTLV cho nhân viên thuộc đơn vị đã có mapping → kiểm tra 2 trường được ghi đúng
- [ ] FID = 24: tạo QTLV cho nhân viên thuộc đơn vị chưa có mapping → kiểm tra không lỗi, ghi log

---

## 9. Open Points / Câu hỏi cần xác nhận với khách hàng

| # | Câu hỏi | Người trả lời | Trạng thái |
|---|---|---|---|
| 1 | Khi import file cũ (thiếu cột `NhomTinhLuong` / `BpBangKe`), hệ thống có cần báo warning hay bỏ qua hoàn toàn? | KH | Chờ xác nhận |
| 2 | Tại FID = 24, nếu nhân viên chuyển đơn vị → có cập nhật lại 2 trường hay giữ nguyên giá trị cũ? | KH | Chờ xác nhận |
| 3 | Combo `Nhóm tính lương` trên màn hình sys5 có cần lọc theo `Nhóm lương` cha không? | KH | Chờ xác nhận |
| 4 | Bảng `dm_BpBangKe` có cần phân quyền theo công ty không (multi-company)? | KH | Chờ xác nhận |
| 5 | Tên bảng DB thực tế của màn hình sys5 là gì? (BA cần Dev xác nhận) | Dev | Chờ xác nhận |
