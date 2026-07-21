# 06 — Bổ sung danh mục "Bộ phận tính lương chi tiết" (BPTL_CT)

> **Mục đích tài liệu**: Cung cấp đầy đủ thông tin để AI sinh FSD (Functional Specification Document) cho việc bổ sung danh mục mới BPTL chi tiết vào toàn bộ khối Lương Sản Phẩm (LSP).

---

## 1. Tổng quan

### 1.1 Đây là danh mục MỚI HOÀN TOÀN

- **Tên danh mục**: Bộ phận tính lương chi tiết (BPTL_CT)
- **Bảng DB**: `LSP_BoPhanTinhLuong_ChiTiet` (bảng MỚI, chưa tồn tại)
- **Quan hệ**: **Con (child)** của bảng `LSP_BoPhanTinhLuong` (BPTL)
- **Mối quan hệ**: 1 BPTL → N BPTL_CT (1-to-many)
- **Ví dụ**: BPTL001 "PTO" → PTO Tôm Sú, PTO Tôm Thẻ, PTO Nobashi

### 1.2 Lý do bổ sung

Hiện tại, BPTL chỉ quản lý ở mức bộ phận lớn (VD: PTO, Tẩm bột, Chiên, Chế biến...). Thực tế Minh Phú cần tách nhỏ hơn để:
- Tính lương sản phẩm **riêng biệt theo từng nhóm sản phẩm/công đoạn con** trong cùng 1 bộ phận
- Xuất báo cáo chi tiết theo từng phân nhóm con
- Thiết lập hệ số, đơn giá, quy cách tính lương khác nhau cho từng nhóm con

---

## 2. Cấu trúc bảng BPTL_CT

| STT | Tên trường | Kiểu | Bắt buộc | Mô tả |
|-----|-----------|------|----------|-------|
| 1 | `Ma` | varchar(30) | Y | Mã chi tiết (PK). VD: BPTL001_CT01 |
| 2 | `Ten` | nvarchar(255) | Y | Tên chi tiết. VD: "PTO Tôm Sú" |
| 3 | `BoPhanTinhLuong_Ma` | varchar(20) | Y | **FK → LSP_BoPhanTinhLuong.Ma**. VD: BPTL001 |
| 4 | `ThuTu` | int | Y | Thứ tự sắp xếp trong nhóm cha |
| 5 | `SuDung` | bit | Y | Đang sử dụng (Y/N) |
| 6 | `GhiChu` | nvarchar(500) | N | Ghi chú |
| 7 | `NguoiTao` | varchar(50) | — | Audit |
| 8 | `NgayTao` | datetime | — | Audit |
| 9 | `NguoiSua` | varchar(50) | — | Audit |
| 10 | `NgaySua` | datetime | — | Audit |

**Constraint**:
- PK: `Ma`
- FK: `BoPhanTinhLuong_Ma` → `LSP_BoPhanTinhLuong.Ma`
- Unique: `Ma` (mã chi tiết phải duy nhất toàn hệ thống)

---

## 3. Màn hình quản lý danh mục BPTL_CT

- **Vị trí menu**: LSP → Danh mục → Bộ phận tính lương chi tiết (ngay dưới "Bộ phận tính lương")
- **Prototype**: `lsp/dm5-bp-tinh-luong-ct.html`
- **Pattern**: Danh mục có FK (giống Nhóm tính lương → FK Nhóm lương)

### Chức năng:
1. **Thêm/Sửa/Xóa** BPTL chi tiết
2. **Dropdown FK**: Bộ phận tính lương (cha) — format `MÃ - Tên`
3. **Tìm kiếm** theo Mã, Tên, BP tính lương (cha)
4. **Nhập dữ liệu** (Import CSV/Excel)
5. **Xuất dữ liệu** (Export CSV)

### Grid columns:
☐ | STT | ✎ | Mã chi tiết | Tên chi tiết | BP tính lương (FK) | Thứ tự | Sử dụng | Ghi chú | Người tạo | Ngày tạo | Người sửa | Ngày sửa

---

## 4. Danh sách MÀN HÌNH cần bổ sung BPTL chi tiết

### 4.1 Danh mục (đã có)
| # | Màn hình | File | Hành động |
|---|---------|------|-----------|
| 1 | Bộ phận tính lương chi tiết | `dm5-bp-tinh-luong-ct.html` | **MỚI** — đã tạo prototype |

### 4.2 Thiết lập — cần bổ sung BPTL_CT
| # | Màn hình | File | Hành động |
|---|---------|------|-----------|
| 1 | Thiết lập BP tính lương theo cơ cấu | `sys5-bp-co-cau.html` | Thêm cột + dropdown BPTL_CT (lọc theo BPTL cha đã chọn) |
| 2 | Hỗ trợ quy cách tính lương | `pg8-ho-tro-cd.html` | Thêm filter + cột BPTL_CT |
| 3 | Hỗ trợ Độc hại chiên | `pg8-ho-tro-cd-chien.html` | Thêm filter + cột BPTL_CT |
| 4 | Hệ số điều chỉnh lần 1/2/3/4 | `pg9-he-so-hs123.html`, `pg5-nhap-nv.html` | Thêm filter + cột BPTL_CT |
| 5 | Thiết lập hệ số, BQ TLSP cho vệ sinh | `sys7-heso-bq-vs.html` | Thêm filter + cột BPTL_CT |

### 4.3 Chức năng — cần bổ sung BPTL_CT
| # | Màn hình | File | Hành động |
|---|---------|------|-----------|
| 1 | Tạo kỳ Lương Sản Phẩm | `pg1-tao-ky.html` | Thêm filter BPTL_CT |
| 2 | Tính Lương Sản Phẩm | `pg2-tinh-lsp.html` | Thêm filter + cột BPTL_CT trên lưới kết quả |
| 3 | Tổng hợp điều chỉnh | `pg12-tong-hop-dc.html` | Thêm filter BPTL_CT (hiện đã có filter BPTL) |
| 4 | Tính bình quân LSP (BQTL) | `pg10-bq-tlsp.html` | Thêm filter + cột BPTL_CT |
| 5 | Tính lương nhóm vệ sinh | `pg11-bang-tinh-vs.html` | Thêm filter + cột BPTL_CT |
| 6 | Bảng tính các khoản tiền công | `pg14-bang-tinh-luong.html` | Thêm filter + cột BPTL_CT |

### 4.4 Báo cáo — cần bổ sung BPTL_CT
| # | Màn hình | File | Hành động |
|---|---------|------|-----------|
| 1 | Bảng tính lương chế biến | `bc-che-bien.html` | Thêm filter + cột BPTL_CT |
| 2 | Báo cáo điều chỉnh lương | `bc-dieu-chinh-luong.html` | Thêm filter + cột BPTL_CT |
| 3 | Báo cáo mẫu 3 lương BP | `bc-mau3-luong-bp.html` | Thêm filter + cột BPTL_CT |
| 4 | Báo cáo khoản tiền công | `bc-khoan-tien-cong.html` | Thêm filter + cột BPTL_CT |

### 4.5 Bình quân vệ sinh — cần bổ sung BPTL_CT
| # | Màn hình | File | Hành động |
|---|---------|------|-----------|
| 1 | Bình quân lương vệ sinh | `pg13-binhquan-vs.html` | Thêm filter + cột BPTL_CT |

---

## 5. Quy tắc bổ sung BPTL_CT vào từng màn hình

### 5.1 Filter bar
- Thêm **dropdown "BP tính lương chi tiết"** ngay SAU dropdown "BP tính lương"
- Format: `MÃ - Tên` (VD: `BPTL001_CT01 - PTO Tôm Sú`)
- **Cascade filter**: Khi chọn BPTL (cha), dropdown BPTL_CT chỉ hiển thị các con thuộc BPTL đã chọn
- Nếu BPTL (cha) chưa chọn → BPTL_CT hiển thị toàn bộ

### 5.2 Grid/Lưới dữ liệu
- Thêm cột **"BP tính lương CT"** ngay SAU cột "BP tính lương"
- Hiển thị: `MÃ - Tên` hoặc chỉ `Tên chi tiết` (tuỳ độ rộng lưới)

### 5.3 Form nhập liệu
- Nếu màn hình có form nhập/sửa (VD: sys5-bp-co-cau.html): thêm dropdown BPTL_CT với cascade filter theo BPTL cha

### 5.4 Báo cáo
- Thêm filter BPTL_CT trong phần bộ lọc báo cáo
- Thêm cột BPTL_CT trong bảng kết quả báo cáo
- Hỗ trợ group-by theo BPTL_CT nếu báo cáo có tính năng nhóm

---

## 6. Mock data chuẩn (21 records)

Dữ liệu mẫu cho 10 BPTL (cha), mỗi BPTL có 2-3 BPTL_CT (con):

| BPTL (cha) | BPTL_CT (con) | Tên chi tiết |
|-----------|--------------|-------------|
| BPTL001 - PTO | BPTL001_CT01 | PTO Tôm Sú |
| BPTL001 - PTO | BPTL001_CT02 | PTO Tôm Thẻ |
| BPTL001 - PTO | BPTL001_CT03 | PTO Nobashi |
| BPTL002 - Tẩm bột | BPTL002_CT01 | Tẩm bột thường |
| BPTL002 - Tẩm bột | BPTL002_CT02 | Tẩm bột Tempura |
| BPTL003 - Chiên | BPTL003_CT01 | Chiên thường |
| BPTL003 - Chiên | BPTL003_CT02 | Chiên Tempura |
| BPTL004 - Chế biến | BPTL004_CT01 | Chế biến tôm nguyên con |
| BPTL004 - Chế biến | BPTL004_CT02 | Chế biến hàng GTGT |
| BPTL005 - Sơ chế | BPTL005_CT01 | Sơ chế tôm sú |
| BPTL005 - Sơ chế | BPTL005_CT02 | Sơ chế tôm thẻ |
| BPTL006 - Đóng gói | BPTL006_CT01 | Đóng gói thành phẩm |
| BPTL006 - Đóng gói | BPTL006_CT02 | Đóng gói bao bì |
| BPTL007 - Kho lạnh | BPTL007_CT01 | Kho lạnh cấp đông |
| BPTL007 - Kho lạnh | BPTL007_CT02 | Kho lạnh bảo quản |
| BPTL008 - Luộc/Hấp | BPTL008_CT01 | Luộc tôm |
| BPTL008 - Luộc/Hấp | BPTL008_CT02 | Hấp tôm |
| BPTL009 - GTGT | BPTL009_CT01 | GTGT Sushi |
| BPTL009 - GTGT | BPTL009_CT02 | GTGT Ebifry |
| BPTL010 - Xuất hàng | BPTL010_CT01 | Xuất hàng container |
| BPTL010 - Xuất hàng | BPTL010_CT02 | Xuất hàng lẻ |

---

## 7. Shared mock data (mockdata.js)

Cần bổ sung vào `shared/mockdata.js`:

```javascript
window.MOCK.bpTinhLuongChiTiet = [
  { ma:'BPTL001_CT01', ten:'PTO Tôm Sú',          bptlMa:'BPTL001', thuTu:1, suDung:true },
  { ma:'BPTL001_CT02', ten:'PTO Tôm Thẻ',         bptlMa:'BPTL001', thuTu:2, suDung:true },
  { ma:'BPTL001_CT03', ten:'PTO Nobashi',          bptlMa:'BPTL001', thuTu:3, suDung:true },
  // ... (21 records tổng cộng, xem mock data ở section 6)
];
```

---

## 8. Cascade dropdown — Logic kỹ thuật

```javascript
// Khi thay đổi dropdown BPTL (cha):
document.getElementById('selBPTL').addEventListener('change', function() {
    const bptlMa = this.value;
    const selCT = document.getElementById('selBPTL_CT');
    selCT.innerHTML = '<option value="">-- Tất cả --</option>';
    const filtered = (window.MOCK.bpTinhLuongChiTiet || [])
        .filter(r => !bptlMa || r.bptlMa === bptlMa);
    filtered.forEach(r => {
        selCT.innerHTML += `<option value="${r.ma}">${r.ma} - ${r.ten}</option>`;
    });
});
```

---

## 9. Ảnh hưởng đến Engine tính lương

- Engine hiện tại tính theo BPTL. Sau khi có BPTL_CT:
  - **Tạo kỳ**: Cho phép tạo kỳ theo BPTL_CT (chi tiết hơn)
  - **Tính lương**: Kết quả tính có thể phân tách theo BPTL_CT
  - **Báo cáo**: Group-by theo BPTL_CT để xuất báo cáo chi tiết

---

## 10. Tóm tắt cho AI sinh FSD

> **ĐIỂM NHẤN QUAN TRỌNG**:
> 1. BPTL_CT là **BẢNG MỚI** — cần tạo DB, stored procedure, API, UI
> 2. BPTL_CT là **CON** của BPTL — có FK, cascade filter, cascade delete
> 3. Phải bổ sung BPTL_CT vào **TOÀN BỘ** màn hình LSP: 5 thiết lập + 6 chức năng + 4 báo cáo + 1 bình quân VS = **16 màn hình** cần sửa + 1 màn hình mới
> 4. Dropdown BPTL_CT luôn **cascade** theo BPTL cha
> 5. Mock data: 21 records (2-3 con / mỗi BPTL cha)
