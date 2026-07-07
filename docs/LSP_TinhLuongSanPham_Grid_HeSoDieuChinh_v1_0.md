# THIẾT KẾ LƯỚI MÀN HÌNH: TÍNH LƯƠNG SẢN PHẨM – CỘT HỆ SỐ ĐIỀU CHỈNH

**Module:** Lương Sản Phẩm (LSP) – iHRP MPHG  
**Chức năng:** LSP-FN-06 – Tính Lương Sản Phẩm (Màn hình tính chi tiết)  
**Breadcrumb:** Lương sản phẩm › Chức năng › Tính lương sản phẩm  
**Phiên bản:** v1.0 | Ngày: 26/06/2026 | Đối tượng: Dev Team / QA  

---

## 1. HIỆN TRẠNG LƯỚI (Ảnh chụp prototype)

Lưới hiện tại – **Lưới 1: Lương sản phẩm cá nhân theo Bộ phận** – đang có các cột:

| Nhóm cột | Cột hiển thị hiện tại |
|---|---|
| Định danh | STT, Mã NV, Họ tên, Bộ phận (tên + nhóm) |
| Đầu vào tính lương | Công thực tế, Sản lượng, Đơn giá |
| Lương gốc | LSP Gốc |
| Hệ số điều chỉnh | % Đ chính 1, % Đ chính 2, % Đ chính 3 *(chỉ hiển thị giá trị %, chưa hiển thị tiền sau mỗi lần)* |
| Kết quả sau điều chỉnh | LSP sau Đ Chính |
| Hỗ trợ | % HT BP, HT Bộ phận (đ), % HT CĐ, HT Công đoạn (đ) |
| Đặc biệt | Độc hại |
| Tổng | Tổng LSP_total |

**Vấn đề hiện tại của lưới:**
- Cột `% Đ chính 1/2/3` chỉ hiển thị **% hệ số** (ví dụ: 100, 110, 95).
- **Không có cột Tiền sau mỗi lần điều chỉnh** → người dùng không thể kiểm tra kết quả trung gian.
- Không phân biệt được **hướng tăng/giảm** từ nhìn vào lưới (giá trị 95% không rõ là giảm hay tăng lên từ 100%).
- Không có cột tổng hợp **TongHS** (tích 3 hệ số).

---

## 2. YÊU CẦU NÂNG CẤP LƯỚI

### 2.1 Nguyên tắc thiết kế cột

Dựa trên file Excel mẫu (sheet PP_tính), lưới cần phản ánh đúng luồng tính:

```
LSP_Goc (L0)
    × HS1_value  →  Tiền_L1
    × HS2_value  →  Tiền_L2
    × HS3_value  →  Tiền_L3  =  LSP_sau_DC
```

Mỗi lần điều chỉnh cần hiển thị **cả 2 thông tin**: **Hệ số** (%) và **Tiền sau điều chỉnh**.

### 2.2 Phương án cột đề xuất

Thêm 3 cột **"Tiền sau ĐC"** tương ứng với 3 lần điều chỉnh, ngay sau cột Hệ số tương ứng.

---

## 3. THIẾT KẾ CHI TIẾT CÁC CỘT LƯỚI

### Cấu trúc cột đầy đủ – Lưới 1 (Lương cá nhân theo Bộ phận)

| STT cột | Tên cột | Ký hiệu | Kiểu | Ghi chú / Nguồn |
|---|---|---|---|---|
| 1 | STT | — | Label | Số thứ tự dòng |
| 2 | Mã NV | ma_nv | Label | Mã nhân viên |
| 3 | Họ và Tên | ho_ten | Label | Tên nhân viên |
| 4 | Bộ phận | bo_phan | Label | Tên ĐV + Nhóm tính lương |
| 5 | Công thực tế | cong_tt | Decimal | Số công làm việc |
| 6 | Sản lượng | san_luong | Decimal | NS_FINAL từ module LNS |
| 7 | Đơn giá | don_gia | Integer | Đơn giá/đơn vị tính |
| **8** | **LSP Gốc (L0)** | **lsp_goc** | **Integer** | **= Sản lượng × Đơn giá. Lương gốc trước mọi điều chỉnh** |
| **9** | **HS1 (%)** | **hs1_pct** | **Decimal** | **Hệ số điều chỉnh lần 1. Mặc định 100% nếu không thiết lập** |
| **10** | **Tiền L1** | **tien_l1** | **Integer** | **= LSP_Goc × HS1_value. Lương sau điều chỉnh lần 1** |
| **11** | **HS2 (%)** | **hs2_pct** | **Decimal** | **Hệ số điều chỉnh lần 2. Mặc định 100% nếu không thiết lập** |
| **12** | **Tiền L2** | **tien_l2** | **Integer** | **= Tiền_L1 × HS2_value. Lương sau điều chỉnh lần 2** |
| **13** | **HS3 (%)** | **hs3_pct** | **Decimal** | **Hệ số điều chỉnh lần 3. Mặc định 100% nếu không thiết lập** |
| **14** | **Tiền L3** | **tien_l3** | **Integer** | **= Tiền_L2 × HS3_value. Lương sau điều chỉnh lần 3 = LSP sau ĐC** |
| 15 | % HT BP | pct_ht_bp | Decimal | % hỗ trợ theo bộ phận |
| 16 | HT Bộ phận (đ) | ht_bp | Integer | = Tiền_L3 × %HT_BP |
| 17 | % HT CĐ | pct_ht_cd | Decimal | % hỗ trợ theo công đoạn |
| 18 | HT Công đoạn (đ) | ht_cd | Integer | = Tiền_L3 × %HT_CĐ × TongHS |
| 19 | Độc hại | doc_hai | Integer | Khoản phụ cấp độc hại nếu có |
| **20** | **Tổng LSP_total** | **tong_lsp** | **Integer** | **= Tiền_L3 + HT_BP + HT_CĐ + Độc_hại** |

> **Lưu ý cột bị đổi tên:** Cột "LSP sau Đ Chính" hiện tại → đổi thành **"Tiền L3"** (cột 14) cho nhất quán với chuỗi L0 → L1 → L2 → L3.

---

## 4. QUY TẮC HIỂN THỊ HỆ SỐ

### 4.1 Mặc định 100% khi không có thiết lập

```
Nếu KHÔNG có bản ghi hệ số điều chỉnh lần N cho Bộ phận này trong tháng:
    HS_value = 1.00 (tức 100%)
    Hiển thị cột HSN(%) = "100%"
    Tiền_LN = Tiền_L(N-1) × 1.00 = giữ nguyên
```

**Quy tắc màu sắc đề xuất cho cột HS:**

| Giá trị HS | Màu hiển thị | Ý nghĩa |
|---|---|---|
| HS = 100% | Màu mặc định (đen) | Không điều chỉnh |
| HS > 100% | Màu xanh lá | Tăng lương |
| HS < 100% | Màu đỏ cam | Giảm lương |

### 4.2 Tooltip / Hover info

Khi hover vào ô HSN(%), hiển thị tooltip:
```
Lần [N] | Bộ phận: [Tên BP]
Loại: [% / Tiền] | Hướng: [Tăng / Giảm]
Giá trị nhập: [X] | HS quy đổi: [Y%]
Người lập: [User] | Ngày lập: [DateTime]
```

---

## 5. CÔNG THỨC TÍNH CHI TIẾT

```
HS1_value = hs1_pct / 100
HS2_value = hs2_pct / 100
HS3_value = hs3_pct / 100

Tiền_L0 = san_luong × don_gia
Tiền_L1 = Tiền_L0 × HS1_value
Tiền_L2 = Tiền_L1 × HS2_value
Tiền_L3 = Tiền_L2 × HS3_value

TongHS   = HS1_value × HS2_value × HS3_value
           (Ví dụ: 110% × 95% × 110% = 114.95%)

HT_BP    = Tiền_L3 × (pct_ht_bp / 100)
HT_CĐ   = Tiền_L3 × TongHS × (pct_ht_cd / 100)   ← Need Confirm OP-03

Tong_LSP = Tiền_L3 + HT_BP + HT_CĐ + doc_hai
```

> **Need Confirm OP-03:** Công thức `HT_CĐ = Tiền_L3 × TongHS × %HT_CĐ` hay `HT_CĐ = Tiền_L3 × %HT_CĐ`? Chưa code trước khi xác nhận.

---

## 6. BẢNG VÍ DỤ DỮ LIỆU – ĐẦY ĐỦ CÁC TÌNH HUỐNG

Dữ liệu giả định: Đơn giá = 2,000 đ/kg. Mọi NV có Sản lượng khác nhau.  
Công chuẩn = 26 công.

---

### 6.1 Bộ phận A – Điều chỉnh = % (tăng L1, giảm L2, tăng L3)

**Thiết lập hệ số:**

| Lần | Loại | Hướng | Giá trị nhập | HS_value |
|---|---|---|---|---|
| HS1 | % | Tăng | 10% | 110% = 1.10 |
| HS2 | % | Giảm | 5% | 95% = 0.95 |
| HS3 | % | Tăng | 10% | 110% = 1.10 |

**Kết quả lưới:**

| Mã NV | Công TT | Sản lượng | Đơn giá | **L0 (Gốc)** | **HS1 (%)** | **Tiền L1** | **HS2 (%)** | **Tiền L2** | **HS3 (%)** | **Tiền L3** |
|---|---|---|---|---|---|---|---|---|---|---|
| NV1 | 26 | 1,000 | 2,000 | **2,000,000** | **110%** | **2,200,000** | **95%** | **2,090,000** | **110%** | **2,299,000** |
| NV2 | 26 | 1,200 | 2,000 | **2,400,000** | **110%** | **2,640,000** | **95%** | **2,508,000** | **110%** | **2,758,800** |
| NV3 | 26 | 1,400 | 2,000 | **2,800,000** | **110%** | **3,080,000** | **95%** | **2,926,000** | **110%** | **3,218,600** |
| **Cộng BP A** | | | | **7,200,000** | | **7,920,000** | | **7,524,000** | | **8,276,400** |

*TongHS = 1.10 × 0.95 × 1.10 = 1.1495 (114.95%)*

---

### 6.2 Bộ phận B – Điều chỉnh = % (giảm L1, tăng L2, giảm L3)

**Thiết lập hệ số:**

| Lần | Loại | Hướng | Giá trị nhập | HS_value |
|---|---|---|---|---|
| HS1 | % | Giảm | 10% | 90% = 0.90 |
| HS2 | % | Tăng | 5% | 105% = 1.05 |
| HS3 | % | Giảm | 10% | 90% = 0.90 |

**Kết quả lưới:**

| Mã NV | Công TT | Sản lượng | Đơn giá | **L0 (Gốc)** | **HS1 (%)** | **Tiền L1** | **HS2 (%)** | **Tiền L2** | **HS3 (%)** | **Tiền L3** |
|---|---|---|---|---|---|---|---|---|---|---|
| NV1 | 26 | 1,000 | 2,000 | **2,000,000** | **90%** | **1,800,000** | **105%** | **1,890,000** | **90%** | **1,701,000** |
| NV2 | 26 | 1,200 | 2,000 | **2,400,000** | **90%** | **2,160,000** | **105%** | **2,268,000** | **90%** | **2,041,200** |
| NV3 | 26 | 1,400 | 2,000 | **2,800,000** | **90%** | **2,520,000** | **105%** | **2,646,000** | **90%** | **2,381,400** |
| **Cộng BP B** | | | | **7,200,000** | | **6,480,000** | | **6,804,000** | | **6,123,600** |

*TongHS = 0.90 × 1.05 × 0.90 = 0.8505 (85.05%)*

---

### 6.3 Bộ phận C – Điều chỉnh = Tiền cố định (tăng L1, giảm L2, tăng L3)

> **Lưu ý:** Áp dụng tình huống này khi OP-02 xác nhận: khoản tiền là **cố định tuyệt đối**, mọi NV trong BP được ± cùng một số tiền.  
> HS_value tính theo công thức: `HS = 1 ± (SoTienDieuChinh / Tiền_Truoc)`  
> → HS_value của mỗi NV sẽ **khác nhau** vì L0 mỗi người khác nhau.

**Thiết lập hệ số:**

| Lần | Loại | Hướng | Số tiền nhập | Ghi chú |
|---|---|---|---|---|
| HS1 | Tiền | Tăng | +500,000 | Cộng đều 500k vào L0 của từng NV |
| HS2 | Tiền | Giảm | -500,000 | Trừ đều 500k từ L1 của từng NV |
| HS3 | Tiền | Tăng | +500,000 | Cộng đều 500k vào L2 của từng NV |

**Kết quả lưới:**

| Mã NV | **L0 (Gốc)** | **HS1 (%)** | **Tiền L1** | **HS2 (%)** | **Tiền L2** | **HS3 (%)** | **Tiền L3** |
|---|---|---|---|---|---|---|---|
| NV4 | **2,000,000** | **125.0%** | **2,500,000** | **80.0%** | **2,000,000** | **125.0%** | **2,500,000** |
| NV5 | **2,400,000** | **120.8%** | **2,900,000** | **82.8%** | **2,400,000** | **120.8%** | **2,900,000** |
| NV6 | **2,800,000** | **117.9%** | **3,300,000** | **84.8%** | **2,800,000** | **117.9%** | **3,300,000** |
| **Cộng BP C** | **7,200,000** | | **8,700,000** | | **7,200,000** | | **8,700,000** |

*Ghi chú cột HS(%): Vì đây là điều chỉnh theo Tiền tuyệt đối, HS% mỗi NV khác nhau. Hệ thống tính ngược từ số tiền để ra %. Cần ghi chú tooltip rõ ràng.*

---

### 6.4 Bộ phận D – Điều chỉnh = % tất cả 3 lần đều giảm

**Thiết lập hệ số:**

| Lần | Loại | Hướng | Giá trị nhập | HS_value |
|---|---|---|---|---|
| HS1 | % | Giảm | 7% | 93% = 0.93 |
| HS2 | % | Giảm | 7% | 93% = 0.93 |
| HS3 | % | Giảm | 8% | 92% = 0.92 |

**Kết quả lưới:**

| Mã NV | **L0 (Gốc)** | **HS1 (%)** | **Tiền L1** | **HS2 (%)** | **Tiền L2** | **HS3 (%)** | **Tiền L3** |
|---|---|---|---|---|---|---|---|
| NV7 | **2,000,000** | **93%** | **1,860,000** | **93%** | **1,729,800** | **92%** | **1,591,416** |
| NV8 | **2,400,000** | **93%** | **2,232,000** | **93%** | **2,075,760** | **92%** | **1,909,699** |
| NV9 | **2,800,000** | **93%** | **2,604,000** | **93%** | **2,421,720** | **92%** | **2,227,982** |
| **Cộng BP D** | **7,200,000** | | **6,696,000** | | **6,227,280** | | **5,729,098** |

*TongHS = 0.93 × 0.93 × 0.92 = 0.7961 (79.61%)*

---

### 6.5 Bộ phận E – Không điều chỉnh (cả 3 lần mặc định 100%)

**Thiết lập hệ số:** Không có bản ghi nào trong bảng hệ số điều chỉnh cho BP E tháng này.

**Xử lý của hệ thống:** Engine tự dùng HS1 = HS2 = HS3 = 100%.

**Kết quả lưới:**

| Mã NV | **L0 (Gốc)** | **HS1 (%)** | **Tiền L1** | **HS2 (%)** | **Tiền L2** | **HS3 (%)** | **Tiền L3** |
|---|---|---|---|---|---|---|---|
| NV10 | **2,000,000** | **100%** | **2,000,000** | **100%** | **2,000,000** | **100%** | **2,000,000** |
| NV11 | **2,400,000** | **100%** | **2,400,000** | **100%** | **2,400,000** | **100%** | **2,400,000** |
| NV12 | **2,800,000** | **100%** | **2,800,000** | **100%** | **2,800,000** | **100%** | **2,800,000** |
| **Cộng BP E** | **7,200,000** | | **7,200,000** | | **7,200,000** | | **7,200,000** |

*TongHS = 1.00 × 1.00 × 1.00 = 1.00 (100%) – Lương không thay đổi*

> **Rule hiển thị quan trọng:** Cột HS1/HS2/HS3 của BP E hiển thị **"100%"** với màu mặc định (không phải blank). Không được để trống, tránh gây hiểu nhầm là chưa cấu hình hay lỗi dữ liệu.

---

### 6.6 Tình huống hỗn hợp: Một số lần có điều chỉnh, một số lần không

**Ví dụ BP F – chỉ có HS2, HS1 và HS3 mặc định 100%:**

| Lần | Thiết lập | HS_value |
|---|---|---|
| HS1 | Không có bản ghi | **100%** (mặc định) |
| HS2 | % Giảm 10% | **90%** |
| HS3 | Không có bản ghi | **100%** (mặc định) |

| Mã NV | **L0 (Gốc)** | **HS1 (%)** | **Tiền L1** | **HS2 (%)** | **Tiền L2** | **HS3 (%)** | **Tiền L3** |
|---|---|---|---|---|---|---|---|
| NV13 | **2,000,000** | **100%** | **2,000,000** | **90%** | **1,800,000** | **100%** | **1,800,000** |
| NV14 | **2,400,000** | **100%** | **2,400,000** | **90%** | **2,160,000** | **100%** | **2,160,000** |

*Tiền L3 = Tiền L2 (vì HS3 = 100%)*

---

### 6.7 Tổng hợp tất cả tình huống – Bảng so sánh

| Bộ phận | Tình huống | HS1 | HS2 | HS3 | TongHS | Chiều lương |
|---|---|---|---|---|---|---|
| **BP A** | Tăng – Giảm – Tăng | 110% | 95% | 110% | 114.95% | ↑ Tăng cuối |
| **BP B** | Giảm – Tăng – Giảm | 90% | 105% | 90% | 85.05% | ↓ Giảm cuối |
| **BP C** | Tiền cố định +/–/+ | ~125% | ~82% | ~125% | Phụ thuộc NV | Tăng nhẹ cuối |
| **BP D** | Tất cả giảm | 93% | 93% | 92% | 79.61% | ↓ Giảm mạnh |
| **BP E** | Không điều chỉnh | 100% | 100% | 100% | 100.00% | → Giữ nguyên |
| **BP F** | Chỉ HS2 giảm | 100% | 90% | 100% | 90.00% | ↓ Giảm nhẹ |

---

## 7. DÒNG TỔNG HỢP THEO BỘ PHẬN (Row subtotal)

Sau mỗi nhóm nhân viên cùng Bộ phận, hệ thống hiển thị 1 dòng tổng với style highlight (màu vàng nhạt như hiện tại):

| Dòng tổng | Nội dung |
|---|---|
| Label | "Cộng Bộ phận [Tên BP] ([N] dòng)" |
| Công TT | SUM |
| Sản lượng | SUM |
| L0 | SUM |
| Tiền L1 | SUM (không phải SUM(L0) × HS_trung_bình) |
| Tiền L2 | SUM |
| Tiền L3 | SUM |
| HT BP | SUM |
| HT CĐ | SUM |
| Tổng LSP | SUM |

> **Dev Note:** Dòng tổng tính bằng SUM các dòng NV, không tính lại từ HS. Tránh sai số do làm tròn khi nhân HS trung bình.

---

## 8. DÒNG TỔNG HỢP TOÀN BỘ PHẬN (Grand total)

Cuối Lưới 1, hiển thị 1 dòng tổng tất cả với style highlight đậm hơn:

| Dòng | Nội dung |
|---|---|
| Label | "Tổng toàn bộ phận" |
| Các cột số | SUM toàn bộ lưới |

---

## 9. BUTTON / ACTION BỔ SUNG LIÊN QUAN

| Nút hiện tại | Giữ / Thay đổi | Ghi chú |
|---|---|---|
| 1 – Tính lương cá nhân | Giữ | Chạy engine tính toàn bộ L0 → L1 → L2 → L3 |
| 2 – Tính bình quân Bộ phận | Giữ | Tính từ Tiền L3 (không phải L0) |
| 3 – Tính lương NV Phụ trợ | Giữ | — |
| Xem lương | Giữ | Load kết quả đã tính, không chạy lại |
| Làm mới | Giữ | Reset filter |
| Khóa / Chốt Lương | Giữ | Khóa toàn bộ dữ liệu kỳ |
| Xuất Excel | **Nâng cấp** | Template xuất phải bao gồm đầy đủ cột L0 → L1 → L2 → L3 mới |

---

## 10. YÊU CẦU EXPORT EXCEL

Khi user bấm **Xuất Excel**, file xuất ra phải có đầy đủ các cột mới:

| Cột Excel | Tên cột |
|---|---|
| A–D | Định danh NV (Mã NV, Họ tên, Bộ phận, Nhóm TL) |
| E | Công thực tế |
| F | Sản lượng |
| G | Đơn giá |
| **H** | **LSP Gốc (L0)** |
| **I** | **HS1 (%)** |
| **J** | **Tiền L1** |
| **K** | **HS2 (%)** |
| **L** | **Tiền L2** |
| **M** | **HS3 (%)** |
| **N** | **Tiền L3** |
| O | % HT BP |
| P | HT Bộ phận (đ) |
| Q | % HT CĐ |
| R | HT Công đoạn (đ) |
| S | Độc hại |
| **T** | **Tổng LSP_total** |

---

## 11. VALIDATE & RULE HIỂN THỊ

| Rule | Điều kiện | Xử lý |
|---|---|---|
| GRID-R01 | Chưa có bản ghi HS1/2/3 cho BP trong tháng | Hiển thị "100%" màu mặc định, không hiển thị blank |
| GRID-R02 | Tiền L1/L2/L3 âm (do HS < 0 hoặc giảm quá 100%) | Highlight đỏ ô tiền, cảnh báo "Lương âm – kiểm tra lại hệ số" |
| GRID-R03 | Bấm "Tính lương cá nhân" khi HS có OP-03 chưa confirm | Tính bình thường nhưng cột HT_CĐ tạm bỏ qua ×TongHS. Ghi chú cạnh cột |
| GRID-R04 | Có sự thay đổi HS sau khi đã tính lần trước | Hiển thị badge "Cần tính lại" trên nút "Tính lương cá nhân" |
| GRID-R05 | NV chưa có dữ liệu LNS (sản lượng = 0 hoặc null) | LSP_Goc = 0, tất cả cột tiền = 0, hiển thị warning icon |

---

## 12. DEV NOTE

| # | Ghi chú |
|---|---|
| DN-01 | Engine tính LSP cần join bảng hs_dieu_chinh theo: Tháng + Công ty + ĐV cascade (ưu tiên ĐV nhỏ nhất có dữ liệu). Nếu không có bản ghi → HS_value = 1.00. |
| DN-02 | Lưu cả 3 cột trung gian `tien_l1`, `tien_l2`, `tien_l3` vào DB để tránh tính lại khi xem. Không tính on-the-fly khi load lưới. |
| DN-03 | `tien_l1/l2/l3` nên lưu dạng BIGINT (đơn vị đồng, không lưu số thập phân) hoặc DECIMAL(15,0). Làm tròn ROUND_HALF_UP sau mỗi lần nhân. |
| DN-04 | Dòng tổng Bộ phận: tính bằng SUM từ DB, không nhân lại HS để tránh sai số làm tròn tích lũy. |
| DN-05 | Cột HS(%) trong lưới: đọc từ bảng `hs_dieu_chinh.hs_pct` (đã được quy đổi sẵn khi lưu). Không tính lại từ loại/hướng/giá_trị_nhập khi hiển thị lưới. |
| DN-06 | Nếu loại điều chỉnh = Tiền (OP-02 confirm tuyệt đối): `Tiền_L1 = Tiền_L0 ± SoTienNhap`, `HS1_pct = (Tiền_L1 / Tiền_L0) × 100`. Giá trị HS% mỗi NV sẽ khác nhau → không lưu 1 giá trị HS% chung cho cả BP, phải lưu per-NV. Đây là điểm phức tạp cần confirm OP-01/OP-02 trước. |
| DN-07 | Màu ô HS trong lưới: so sánh `hs_pct` với 100, không so sánh với lần trước. |

---

## 13. QA / TEST NOTE

| Loại | Test case |
|---|---|
| Positive | BP E không có HS thiết lập → cột HS1/HS2/HS3 hiển thị "100%", Tiền L3 = Tiền L0 |
| Positive | BP A có HS1=110%, HS2=95%, HS3=110% → kiểm tra Tiền L1/L2/L3 đúng theo bảng mục 6.1 |
| Positive | BP F chỉ có HS2=90% → HS1=100%, HS3=100%, Tiền L3 = Tiền L0 × 0.90 |
| Positive | Dòng Cộng BP = SUM đúng các dòng NV |
| Negative | HS Giảm 100% → Tiền L = 0, không âm, highlight đỏ |
| Negative | HS Giảm 101% → blocking ở màn hình nhập HS, không được tạo ra tình huống này |
| Boundary | HS1 = HS2 = HS3 = 100% → Tổng LSP = LSP Gốc (không thay đổi) |
| Boundary | 1 lần = 200%, 2 lần còn lại = 100% → TongHS = 200% |
| Loại Tiền | BP C nhập Tiền +500,000 → từng NV có HS% khác nhau, kiểm tra từng dòng |
| Export | File Excel xuất ra có đủ cột L0 → L1 → L2 → L3 mới |
| Permission | HR Xem báo cáo thấy lưới nhưng nút Tính / Khóa bị disable |
| Recalculate | Thay đổi HS2 sau khi đã tính → badge "Cần tính lại" xuất hiện trên nút Tính |

---

## 14. OPEN POINTS – CẦN XÁC NHẬN

| Mã | Nội dung | Mức độ |
|---|---|---|
| OP-01 | Khi Loại=Tiền, HS% mỗi NV khác nhau → lưu per-NV hay per-BP? | **BLOCKING** |
| OP-02 | Khoản tiền điều chỉnh: cố định tuyệt đối (mọi NV ± cùng số tiền) hay tỷ lệ theo lương? | **BLOCKING** |
| OP-03 | Công thức HT_CĐ: nhân thêm TongHS hay không? | **BLOCKING – Chưa code** |
| OP-07 | Cột "Tiền L1 / L2 / L3" có hiển thị mặc định trên lưới hay ẩn đi (user tự bật)? Vì lưới sẽ có thêm 3 cột mới, có thể gây quá tải cột. | Medium |
| OP-08 | Khi Tính lại (sau khi thay đổi HS), dữ liệu cũ L1/L2/L3 có lưu lịch sử không? | Medium |

---

*Tài liệu này bổ sung cho `LSP_HDDC_NangCap_Form_HeSoDieuChinh_v1_0.md`. Đọc song song để hiểu đầy đủ thiết kế.*
