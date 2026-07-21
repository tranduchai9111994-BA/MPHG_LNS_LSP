# LSP – Nâng cấp cụm màn hình Thiết lập công thức lương (4 MH core)

> Mục tiêu: nâng cấp 4 màn hình core sẵn có của phân hệ Lương để engine LSP tính được **lương nhiều dòng theo Quá trình làm việc (QTLV)** và hỗ trợ các thuộc tính phân bổ/tổng hợp/lũy kế.
> Đối tượng: Claude Code sinh prototype HTML tĩnh vào prototype hiện tại (mock data, không backend).
> Đọc trước: `shared/iHRP_skill_UIUX.md` (design system) — áp dụng TOÀN BỘ quy tắc.

## Phạm vi giai đoạn 1 — chỉ 4 MH core

| # | Mã | Màn hình | File core tham chiếu (đã có) | File prototype tạo mới |
|---|-----|----------|------------------------------|------------------------|
| 1 | LSP-TK-001 | Tiêu chí tìm kiếm (TK_) | "Định nghĩa tiêu chí hệ thống tìm kiếm" (Image 1) | `lsp/set1-tieuchi-timkiem.html` |
| 2 | LSP-HT-001 | Tiêu chí hệ thống (HT_) | "Định nghĩa tiêu chí hệ thống" (Image 2) | `lsp/set2-tieuchi-hethong.html` |
| 3 | LSP-TT-001 | Tiêu chí tính toán (TT_) | "Định nghĩa tiêu chí tính toán" (Image 3) | `lsp/set3-tieuchi-tinhtoan.html` |
| 4 | LSP-FRM-001 | Tạo công thức lương | "Tạo công thức lương" (Image 4) | `lsp/set4-tao-congthuc-luong.html` |

## Nguyên tắc nâng cấp (KHÔNG thiết kế lại từ đầu)

1. **Reuse toàn bộ** layout core: top-header, main-menu (Lương active), breadcrumb, form-panel phía trên, bộ nút, data-grid, audit trail. Chỉ **thêm** thuộc tính mới, không xóa cột cũ.
2. Mọi thuộc tính mới gom vào 1 **section "Thuộc tính nâng cao (LSP)"** trong form nhập, có thể thu gọn (collapsible) để không làm rối màn hình core.
3. Grid thêm cột mới ở **bên phải** các cột nghiệp vụ cũ, trước cột audit.
4. Giữ đúng bộ màu nút theo skill: `[Tìm Kiếm]` vàng, `[Làm mới]` xanh dương, `[Lưu]` xanh lá, `[Xóa]` đỏ, `[Xuất dữ liệu]` cam.
5. Label bắt buộc `#d32f2f`, KHÔNG dùng dấu `*`. Combo format `MÃ - Tên`. Icon sửa `✎` cam. Khu Ghi chú nghiệp vụ cuối trang.

## Mô hình dữ liệu nhiều dòng (chốt với BA)

- **Chiều sinh dòng**: theo **Quá trình làm việc** — mỗi giai đoạn (thay đổi Bàn cấp 5 / Ka cấp 4) trong kỳ = **1 dòng**. Slice có (FromDate, ToDate, Ban, Ka, Dept).
- Tham khảo có chọn lọc SAP SuccessFactors: mỗi tiêu chí (element) có thuộc tính "subject to proration" và cơ chế time-slice; PeopleX: Phân loại (Thông tin/Chi tiết/Tổng hợp) + toán tử Sum + Param + Priority.

## 3 nhóm thuộc tính mới thêm vào tiêu chí

| Nhóm | Áp cho MH | Thuộc tính | Giá trị |
|------|-----------|-----------|---------|
| Sinh dòng | TK_, Công thức | `ApplyByStage` (Y/N), `DateParamMode` (ToDate/FromDate/Both), `RowGenMode` (ByWorkHistory) | quyết định cắt dòng & tham số ngày |
| Tính/tổng hợp | HT_ | `CalcLevel` (PerSlice/PerEmployee/Aggregate), `AggregateScope` (Ban/Ka/Dept/CrossDept), `AggregateOp` (Sum/Avg/Max/Min), `Module`, `Param` | tính per-dòng vs gộp |
| Phân bổ dòng | TT_ | `RowClass` (Info/Detail/Summary), `Allocation` (None/Prorata/OldStage/NewStage/MaxSalaryRow/LastStageRow/Accumulate), `AllowSumPrev` (Y/N), `Priority` (int) | chia prorata vs dồn 1 dòng vs lũy kế |

## Bài toán nghiệp vụ mà thuộc tính giải quyết

- **Lương ngày công** → `Allocation=Prorata` (chia theo công từng dòng).
- **Bảo hiểm** → `Allocation=MaxSalaryRow` (trích cho dòng lương cao nhất).
- **Thuế TNCN** → `Allocation=LastStageRow` (dòng QTLV cuối cùng).
- **Lũy kế** → `AllowSumPrev=Y` + `Allocation=Accumulate`.
- **BQ bộ phận** → `CalcLevel=Aggregate, Scope=Dept, Op=Avg`.

## Engine tính 2 pha (mô tả cho preview & QA — xem file 05)

Pha 1: sinh dòng → nạp TK_/HT_ per-dòng → tính TT_ Detail (Priority ASC).
Pha 2: tính HT_ Aggregate theo scope → tính TT_ Summary & phân bổ dòng → ghi kết quả + map bảng cứng 20 col.

## Danh sách file .md

- `01_MH_TieuChi_TimKiem.md` (LSP-TK-001)
- `02_MH_TieuChi_HeThong.md` (LSP-HT-001)
- `03_MH_TieuChi_TinhToan.md` (LSP-TT-001)
- `04_MH_TaoCongThuc_Luong.md` (LSP-FRM-001)
- `05_Engine_NhieuDong_MockData.md` (mock data + logic preview dùng chung)

## Open points (đưa vào Ghi chú nghiệp vụ mỗi màn hình)

1. `MaxSalaryRow` so theo tiêu chí lương nào (L0/L4/Final)? khi 2 dòng bằng nhau chọn dòng nào?
2. Lũy kế (`Accumulate`) trong 1 kỳ hay xuyên kỳ (retro như SAP SF)?
3. Loại trừ NV < 50% công chuẩn ở cả tử+mẫu hay chỉ mẫu (LSP-OP-09)?
4. NV làm nhiều BP trong tháng — sau khi tính từng dòng có gộp tổng theo BP (M25=SUM) không (confirm #7)?
5. Aggregate tính realtime hay materialized (performance ~3000 NV — LSP-OP-07)?
