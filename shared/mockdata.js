window.MOCK = {
    // Danh mục dùng chung
    congDoan: [
        { id: 1, ma: "CD001", ten: "PTO Tôm Thường Size 2/4", gia: 250, dv: "Kg", tienTrinh: "TT_TOM_SU", suDung: true, note: "" },
        { id: 2, ma: "CD002", ten: "PTO Tôm Thường Size 4/6", gia: 200, dv: "Kg", tienTrinh: "TT_TOM_SU", suDung: true, note: "" },
        { id: 3, ma: "CD003", ten: "Tẩm bột", gia: 350, dv: "Kg", tienTrinh: "TT_TOM_THE", suDung: true, note: "" },
        { id: 4, ma: "CD004", ten: "Chiên", gia: 300, dv: "Kg", tienTrinh: "TT_TOM_THE", suDung: true, note: "" },
        { id: 5, ma: "CD005", ten: "Hàng virut", gia: 180, dv: "Kg", tienTrinh: "TT_TOM_SU", suDung: true, note: "" },
        { id: 6, ma: "CD_PTO", ten: "Công đoạn PTO", gia: 250, dv: "Kg", tienTrinh: "TT_TOM_SU", suDung: true, note: "" },
        { id: 7, ma: "CD_NOBASHI", ten: "Công đoạn Nobashi", gia: 300, dv: "Kg", tienTrinh: "TT_TOM_THE", suDung: true, note: "" },
        { id: 8, ma: "CD_VIRUS", ten: "Công đoạn Virus", gia: 180, dv: "Kg", tienTrinh: "TT_TOM_SU", suDung: true, note: "" }
    ],
    tienTrinh: [
        { id: 1, ma: "TT_TOM_SU", tenVN: "Tiến trình Tôm Sú", tenEN: "Black Tiger Process", suDung: true, note: "" },
        { id: 2, ma: "TT_TOM_THE", tenVN: "Tiến trình Tôm Thẻ", tenEN: "Vannamei Process", suDung: true, note: "" },
        { id: 3, ma: "TT_DONG_GOI", tenVN: "Tiến trình Đóng gói", tenEN: "Packing Process", suDung: true, note: "" }
    ],
    congTy: [
        "Công Ty CP Thủy Sản MPHG"
    ],
    donVi: {
        "Công Ty CP Thủy Sản MPHG": ["Khối Sản Xuất > Nhà máy 1", "Khối Sản Xuất > Nhà máy 2", "Khối Văn Phòng"]
    },
    boPhan: [
        "BP_PTO", "BP_TB", "BP_CHIEN", "BP_SOCHE", "BP_DONGGOI", "BP_LUOC", "BP_GTGT", "BP_KHOLANH",
        "Bộ phận PTO", "Bộ phận Tẩm bột", "Bộ phận Chiên", "Tổ Sơ chế chung"
    ],

    // LSP data
    lsp: {
        kyLuong: [
            { id: 1, maKy: "LSP_202605", thang: "05/2026", tuNgay: "01/05/2026", denNgay: "31/05/2026", trangThai: "Locked" },
            { id: 2, maKy: "LSP_202606_DRAFT", thang: "06/2026", tuNgay: "01/06/2026", denNgay: "30/06/2026", trangThai: "Draft" },
            { id: 3, maKy: "LSP_202606_TEST", thang: "06/2026", tuNgay: "01/06/2026", denNgay: "30/06/2026", trangThai: "Calculated (Preview)" }
        ],
        donGia: [
            { id: 1, thang: "01/2026", ma: "CD001", ten: "PTO Tôm Thường Size 2/4", gia: 250, dv: "Kg", note: "" },
            { id: 2, thang: "01/2026", ma: "CD002", ten: "PTO Tôm Thường Size 4/6", gia: 200, dv: "Kg", note: "" },
            { id: 3, thang: "01/2026", ma: "CD003", ten: "Tẩm bột", gia: 350, dv: "Kg", note: "" },
            { id: 4, thang: "01/2026", ma: "CD004", ten: "Chiên", gia: 300, dv: "Kg", note: "" },
            { id: 5, thang: "01/2026", ma: "CD005", ten: "Hàng virut", gia: 180, dv: "Kg", note: "" }
        ],
        hoTroBP: [
            { id: 1,  thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_PTO",     tenBp: "Bộ phận PTO",          hoTro: 5,  note: "Hỗ trợ vượt sản lượng" },
            { id: 2,  thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_TB",      tenBp: "Bộ phận Tẩm bột",      hoTro: 8,  note: "Hỗ trợ ca đêm" },
            { id: 3,  thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_CHIEN",   tenBp: "Bộ phận Chiên",        hoTro: 10, note: "Hỗ trợ môi trường độc hại – nhiệt độ cao" },
            { id: 4,  thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_SOCHE",   tenBp: "Tổ Sơ chế chung",      hoTro: 3,  note: "Hỗ trợ tiêu chuẩn" },
            { id: 5,  thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_DONGGOI", tenBp: "Bộ phận Đóng gói",     hoTro: 5,  note: "Hỗ trợ độc hại – hóa chất" },
            { id: 6,  thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_LUOC",    tenBp: "Bộ phận Luộc/Hấp",    hoTro: 7,  note: "Hỗ trợ hơi nước, nhiệt độ" },
            { id: 7,  thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 2", bp: "BP_KHOLANH", tenBp: "Bộ phận Kho lạnh",    hoTro: 6,  note: "Hỗ trợ môi trường lạnh âm" },
            { id: 8,  thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 2", bp: "BP_GTGT",    tenBp: "Bộ phận Hàng GTGT",   hoTro: 4,  note: "" },
            { id: 9,  thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 2", bp: "BP_PTO",     tenBp: "Bộ phận PTO",          hoTro: 5,  note: "NM2 – cùng mức NM1" },
            { id: 10, thang: "05/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_PTO",     tenBp: "Bộ phận PTO",          hoTro: 5,  note: "Tháng 5 – ổn định" },
            { id: 11, thang: "05/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_TB",      tenBp: "Bộ phận Tẩm bột",      hoTro: 8,  note: "Tháng 5 – ổn định" },
            { id: 12, thang: "05/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_CHIEN",   tenBp: "Bộ phận Chiên",        hoTro: 10, note: "Tháng 5 – ổn định" },
            { id: 13, thang: "05/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_DONGGOI", tenBp: "Bộ phận Đóng gói",     hoTro: 5,  note: "Tháng 5 – ổn định" },
            { id: 14, thang: "04/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_CHIEN",   tenBp: "Bộ phận Chiên",        hoTro: 12, note: "Tháng 4 – tăng đặc biệt do cao điểm" }
        ],
        hoTroCD: [
            { id: 1, thang: "06/2026", loai: "CongDoan", loaiText: "Công đoạn", doiTuong: "Tẩm bột", mucHT: "15%", note: "" },
            { id: 2, thang: "06/2026", loai: "CongDoan", loaiText: "Công đoạn", doiTuong: "Hàng virut (VR)", mucHT: "5%", note: "" },
            { id: 3, thang: "06/2026", loai: "CongDoan", loaiText: "Công đoạn", doiTuong: "Lặt đầu tôm (LĐ)", mucHT: "5%", note: "" },
            { id: 4, thang: "06/2026", loai: "CongDoan", loaiText: "Công đoạn", doiTuong: "Sushi (Su)", mucHT: "5%", note: "" }
        ],
        heSoHS: [
            { id: 1, thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_PTO", tenBp: "Bộ phận PTO", hs1: 100, hs2: 100, hs3: 100, note: "Mặc định" },
            { id: 2, thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_TB", tenBp: "Bộ phận Tẩm bột", hs1: 110, hs2: 100, hs3: 100, note: "Tăng HS1 do yêu cầu kỹ thuật cao" },
            { id: 3, thang: "06/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_SOCHE", tenBp: "Tổ Sơ chế chung", hs1: 100, hs2: 100, hs3: 95, note: "BGĐ hạ HS3" }
        ],
        ketQua: [
            // === Bộ phận PTO ===
            {
                id: "ROW-001", ma_nv: "NV001", ho_ten: "Nguyễn Văn An", ma_bp: "PTO", ten_bp: "Bộ phận PTO", ten_cd: "Tẩm bột tôm", lam_gium: false,
                ns_trong_gio: 50000, ns_ca_dem: 15000, ns_tang_ca: 5000, ns_tang_ca_dem: 0, unit_price: 2, hs1: 100, hs2: 100, hs3: 100, dept_support_pct: 5, stage_support_pct: 15, hazard_amt: 0,
                ngay_cong: 20, is_locked: 1
            },
            {
                id: "ROW-002", ma_nv: "NV002", ho_ten: "Trần Thị Bình", ma_bp: "PTO", ten_bp: "Bộ phận PTO", ten_cd: "Tẩm bột tôm", lam_gium: false,
                ns_trong_gio: 80000, ns_ca_dem: 0, ns_tang_ca: 0, ns_tang_ca_dem: 0, unit_price: 2, hs1: 100, hs2: 100, hs3: 100, dept_support_pct: 5, stage_support_pct: 15, hazard_amt: 0,
                ngay_cong: 26, is_locked: 1
            },
            {
                id: "ROW-003", ma_nv: "NV003", ho_ten: "Lê Hoàng Thao", ma_bp: "PTO", ten_bp: "Bộ phận PTO", ten_cd: "Phân cỡ tay", lam_gium: false,
                ns_trong_gio: 60000, ns_ca_dem: 0, ns_tang_ca: 0, ns_tang_ca_dem: 0, unit_price: 2.5, hs1: 100, hs2: 100, hs3: 100, dept_support_pct: 5, stage_support_pct: 0, hazard_amt: 0,
                ngay_cong: 24, is_locked: 1
            },
            // === Bộ phận Chiên ===
            {
                id: "ROW-004", ma_nv: "NV001", ho_ten: "Nguyễn Văn An", ma_bp: "CHIEN", ten_bp: "Bộ phận Chiên", ten_cd: "Chiên tôm", lam_gium: true,
                ns_trong_gio: 10000, ns_ca_dem: 8000, ns_tang_ca: 2000, ns_tang_ca_dem: 0, unit_price: 3, hs1: 100, hs2: 100, hs3: 100, dept_support_pct: 0, stage_support_pct: 0, hazard_amt: 50000,
                ngay_cong: 6, is_locked: 1
            },
            {
                id: "ROW-005", ma_nv: "NV004", ho_ten: "Phạm Văn Chảo", ma_bp: "CHIEN", ten_bp: "Bộ phận Chiên", ten_cd: "Chiên tôm chính", lam_gium: false,
                ns_trong_gio: 90000, ns_ca_dem: 0, ns_tang_ca: 0, ns_tang_ca_dem: 0, unit_price: 3, hs1: 100, hs2: 100, hs3: 100, dept_support_pct: 0, stage_support_pct: 0, hazard_amt: 300000,
                ngay_cong: 26, is_locked: 1
            },
            {
                id: "ROW-010", ma_nv: "NV010", ho_ten: "Võ Thị Hoa", ma_bp: "CHIEN", ten_bp: "Bộ phận Chiên", ten_cd: "Chiên tôm phụ", lam_gium: false,
                ns_trong_gio: 45000, ns_ca_dem: 5000, ns_tang_ca: 0, ns_tang_ca_dem: 0, unit_price: 3, hs1: 100, hs2: 100, hs3: 100, dept_support_pct: 0, stage_support_pct: 0, hazard_amt: 150000,
                ngay_cong: 22, is_locked: 1
            },
            // === Bộ phận Tẩm bột ===
            {
                id: "ROW-006", ma_nv: "NV005", ho_ten: "Đặng Hoàng Nam", ma_bp: "TAMBOT", ten_bp: "Bộ phận Tẩm bột", ten_cd: "Tẩm bột lăn", lam_gium: false,
                ns_trong_gio: 55000, ns_ca_dem: 10000, ns_tang_ca: 3000, ns_tang_ca_dem: 0, unit_price: 2.8, hs1: 110, hs2: 100, hs3: 100, dept_support_pct: 8, stage_support_pct: 15, hazard_amt: 0,
                ngay_cong: 24, is_locked: 1
            },
            {
                id: "ROW-007", ma_nv: "NV006", ho_ten: "Võ Minh Trang", ma_bp: "TAMBOT", ten_bp: "Bộ phận Tẩm bột", ten_cd: "Tẩm bột nhúng", lam_gium: false,
                ns_trong_gio: 48000, ns_ca_dem: 0, ns_tang_ca: 5000, ns_tang_ca_dem: 0, unit_price: 2.8, hs1: 110, hs2: 100, hs3: 100, dept_support_pct: 8, stage_support_pct: 15, hazard_amt: 0,
                ngay_cong: 25, is_locked: 1
            },
            // === Bộ phận Sơ chế ===
            {
                id: "ROW-008", ma_nv: "NV011", ho_ten: "Trần Văn Minh", ma_bp: "SOCHE", ten_bp: "Tổ Sơ chế", ten_cd: "Lặt đầu tôm", lam_gium: false,
                ns_trong_gio: 70000, ns_ca_dem: 0, ns_tang_ca: 0, ns_tang_ca_dem: 0, unit_price: 1.8, hs1: 100, hs2: 100, hs3: 95, dept_support_pct: 3, stage_support_pct: 5, hazard_amt: 0,
                ngay_cong: 26, is_locked: 1
            },
            {
                id: "ROW-009", ma_nv: "NV012", ho_ten: "Nguyễn Thị Mai", ma_bp: "SOCHE", ten_bp: "Tổ Sơ chế", ten_cd: "Lặt đầu tôm", lam_gium: false,
                ns_trong_gio: 65000, ns_ca_dem: 0, ns_tang_ca: 0, ns_tang_ca_dem: 0, unit_price: 1.8, hs1: 100, hs2: 100, hs3: 95, dept_support_pct: 3, stage_support_pct: 5, hazard_amt: 0,
                ngay_cong: 24, is_locked: 1
            }
        ],
        nhanVienPhuTro: [
            { ma_nv: "NV007", ho_ten: "Nguyễn Thủ Kho", vi_tri: "Thủ kho", ma_bp: "PTO", ten_bp: "Bộ phận PTO", he_so_bac_luong: 1.05 },
            { ma_nv: "NV008", ho_ten: "Trần Kiểm Hàng", vi_tri: "KCS", ma_bp: "PTO", ten_bp: "Bộ phận PTO", he_so_bac_luong: 1.00 },
            { ma_nv: "NV009", ho_ten: "Lê Văn Kho", vi_tri: "Thủ kho ca", ma_bp: "CHIEN", ten_bp: "Bộ phận Chiên", he_so_bac_luong: 1.10 },
            { ma_nv: "NV013", ho_ten: "Phạm Thị Lan", vi_tri: "KCS", ma_bp: "CHIEN", ten_bp: "Bộ phận Chiên", he_so_bac_luong: 0.95 },
            { ma_nv: "NV014", ho_ten: "Hoàng Văn Đức", vi_tri: "Thủ kho", ma_bp: "TAMBOT", ten_bp: "Bộ phận Tẩm bột", he_so_bac_luong: 1.00 },
            { ma_nv: "NV015", ho_ten: "Lý Thị Hương", vi_tri: "KCS", ma_bp: "TAMBOT", ten_bp: "Bộ phận Tẩm bột", he_so_bac_luong: 1.05 },
            { ma_nv: "NV016", ho_ten: "Bùi Quốc Toàn", vi_tri: "Thủ kho", ma_bp: "SOCHE", ten_bp: "Tổ Sơ chế", he_so_bac_luong: 1.00 }
        ],
        ketQuaBP: [
            { id: 1, bp: "PTO", tongTien: 450000000, tongNgay: 2000 },
            { id: 2, bp: "Tẩm bột", tongTien: 312000000, tongNgay: 1560 },
            { id: 3, bp: "Chiên", tongTien: 420000000, tongNgay: 1750 }
        ],

        // ==========================================================
        // DỮ LIỆU BÌNH QUÂN TLSP (Report2_BQTL) – dùng cho pg10-bq-tlsp
        // Mỗi dòng = 1 Bộ phận × Ka, số liệu quỹ lương lấy từ kết quả
        // Bảng tính TLSP (Report1) của kỳ đã khóa.
        //   congDu   : công chuẩn đủ công của Ka (K1=27, K2=26)
        //   tongCong : tổng công thực tế của BP trong tháng
        //   ldMoi    : số LĐ mới vào < 3 tháng (bị loại khi tính BQ >3T)
        //   congMoi / qtlMoi : công & quỹ lương của nhóm LĐ mới <3T
        //   qtl      : quỹ tiền lương theo bảng tính TLSP
        //   slBan    : số bàn/dây chuyền – trọng số khi tính BQ công đủ gia quyền
        // ==========================================================
        bqBoPhan: [
            { ma: "PVNL_K1", boPhan: "PV Bến NL",          ka: "K1",    congDu: 27,   tongCong: 817.0,  tongLD: 32,  ldMoi: 0,  congMoi: 0,    qtlMoi: 0,         qtl: 348500000,  slBan: 1 },
            { ma: "PVQ_K1",  boPhan: "PV Quay",            ka: "K1",    congDu: 27,   tongCong: 482.0,  tongLD: 19,  ldMoi: 6,  congMoi: 95,   qtlMoi: 32000000,  qtl: 190100000,  slBan: 1 },
            { ma: "PVQ_K2",  boPhan: "PV Quay",            ka: "K2",    congDu: 26,   tongCong: 443.9,  tongLD: 20,  ldMoi: 0,  congMoi: 0,    qtlMoi: 0,         qtl: 181800000,  slBan: 1 },
            { ma: "BC_K1",   boPhan: "Băng chuyền",        ka: "K1",    congDu: 27,   tongCong: 4134.8, tongLD: 167, ldMoi: 24, congMoi: 550,  qtlMoi: 190000000, qtl: 1692300000, slBan: 5 },
            { ma: "CD_K1",   boPhan: "Cấp Đông",           ka: "K1",    congDu: 27,   tongCong: 422.0,  tongLD: 18,  ldMoi: 8,  congMoi: 130,  qtlMoi: 42000000,  qtl: 160800000,  slBan: 1 },
            { ma: "XH_K1",   boPhan: "Xếp Hộp",            ka: "K1",    congDu: 27,   tongCong: 945.3,  tongLD: 37,  ldMoi: 15, congMoi: 300,  qtlMoi: 98000000,  qtl: 355400000,  slBan: 1 },
            { ma: "BC_K2",   boPhan: "Băng chuyền",        ka: "K2",    congDu: 26,   tongCong: 3990.2, tongLD: 172, ldMoi: 0,  congMoi: 0,    qtlMoi: 0,         qtl: 1545000000, slBan: 5 },
            { ma: "CD_K2",   boPhan: "Cấp Đông",           ka: "K2",    congDu: 26,   tongCong: 435.4,  tongLD: 18,  ldMoi: 0,  congMoi: 0,    qtlMoi: 0,         qtl: 168400000,  slBan: 1 },
            { ma: "XH_K2",   boPhan: "Xếp Hộp",            ka: "K2",    congDu: 26,   tongCong: 873.8,  tongLD: 37,  ldMoi: 0,  congMoi: 0,    qtlMoi: 0,         qtl: 332500000,  slBan: 1 },
            { ma: "CB_K1",   boPhan: "Chế biến",           ka: "K1",    congDu: 27,   tongCong: 7449.7, tongLD: 331, ldMoi: 52, congMoi: 1100, qtlMoi: 390000000, qtl: 2960000000, slBan: 6 },
            { ma: "CB_K2",   boPhan: "Chế biến",           ka: "K2",    congDu: 26,   tongCong: 6597.0, tongLD: 313, ldMoi: 0,  congMoi: 0,    qtlMoi: 0,         qtl: 2677000000, slBan: 6 },
            { ma: "XQ_K1",   boPhan: "Xiên que",           ka: "K1",    congDu: 27,   tongCong: 698.0,  tongLD: 28,  ldMoi: 3,  congMoi: 60,   qtlMoi: 21000000,  qtl: 291800000,  slBan: 1 },
            { ma: "XQ_K2",   boPhan: "Xiên que",           ka: "K2",    congDu: 26,   tongCong: 669.4,  tongLD: 28,  ldMoi: 3,  congMoi: 60,   qtlMoi: 20500000,  qtl: 278600000,  slBan: 1 },
            { ma: "PTO_K1",  boPhan: "PTO",                ka: "K1",    congDu: 27,   tongCong: 4699.9, tongLD: 206, ldMoi: 29, congMoi: 620,  qtlMoi: 215000000, qtl: 1800000000, slBan: 7 },
            { ma: "PTO_K2",  boPhan: "PTO",                ka: "K2",    congDu: 26,   tongCong: 3848.9, tongLD: 186, ldMoi: 0,  congMoi: 0,    qtlMoi: 0,         qtl: 1506000000, slBan: 7 },
            { ma: "CBTB",    boPhan: "PX Tẩm bột (CBTB)",  ka: "K1+K2", congDu: 26.5, tongCong: 2119.4, tongLD: 95,  ldMoi: 10, congMoi: 210,  qtlMoi: 72000000,  qtl: 830000000,  slBan: 3 },
            { ma: "TB_K1",   boPhan: "Tẩm bột",            ka: "K1",    congDu: 27,   tongCong: 1150.0, tongLD: 48,  ldMoi: 5,  congMoi: 100,  qtlMoi: 34000000,  qtl: 445000000,  slBan: 2 },
            { ma: "XHTP_K1", boPhan: "Xuất hàng Tp",       ka: "K1",    congDu: 27,   tongCong: 698.0,  tongLD: 28,  ldMoi: 3,  congMoi: 60,   qtlMoi: 21500000,  qtl: 292192000,  slBan: 1 },
            { ma: "XHTP_K2", boPhan: "Xuất hàng Tp",       ka: "K2",    congDu: 26,   tongCong: 669.4,  tongLD: 28,  ldMoi: 0,  congMoi: 0,    qtlMoi: 0,         qtl: 279860000,  slBan: 1 }
        ],

        // Cấu hình NHÓM BÌNH QUÂN (thay các dòng 40/52/54 của Report2_BQTL)
        // BQ nhóm = SUM(QTL thành viên) / SUM(Công thành viên) × BQ công đủ gia quyền theo SL bàn
        // nhomHuong = các nhóm NV phụ trợ hưởng lương theo đơn giá BQ của nhóm này
        nhomBQ: [
            {
                ma: "BQ_LSP_KO_XHTP", ten: "BQ T.Cả (LSP _ Ko XHTP)", excelRef: "Report2 dòng 40/50",
                members: ["PVNL_K1","PVQ_K1","PVQ_K2","BC_K1","CD_K1","XH_K1","BC_K2","CD_K2","XH_K2","CB_K1","CB_K2","XQ_K1","XQ_K2","PTO_K1","PTO_K2","CBTB","TB_K1"],
                nhomHuong: "Bốc xếp bao bì"
            },
            {
                ma: "BQ_MPHG", ten: "BQ MPHG (LSP_Ko XHTP)", excelRef: "Report2 dòng 52",
                members: ["PVNL_K1","PVQ_K1","PVQ_K2","BC_K1","CD_K1","XH_K1","BC_K2","CD_K2","XH_K2"],
                nhomHuong: "VS khuôn viên + cây xanh"
            },
            {
                ma: "BQ_CB_XQ_PTO", ten: "BQ (CB, XQ, PTO, BCtb, CBTB, TB)", excelRef: "Report2 dòng 54",
                members: ["CB_K1","CB_K2","XQ_K1","XQ_K2","PTO_K1","PTO_K2","CBTB","TB_K1"],
                nhomHuong: "VS MPHG, VS PXTB, Giặt đồ"
            }
        ],

        // Trạng thái phiên tính BQ của kỳ (kết quả Bước 2 pipeline) – input bắt buộc của Bảng tính VS
        bqRun: { ky: "LSP_01_2026", trangThai: "Locked", phamVi: "ALL", thoiGian: "02/07/2026 10:15", nguoiTinh: "FPT Admin" },

        // ==========================================================
        // DỮ LIỆU BẢNG TÍNH VỆ SINH (Report3_BangTinhVS) – pg11-bang-tinh-vs
        // ==========================================================
        vsDinhMuc: [
            { loai: "VS_THUONG", ten: "Vệ sinh thường",     pct: 90 },
            { loai: "VS_KDV",    ten: "VS Kiểm đầu vỏ",     pct: 95 }
        ],
        vsNhanVien: [
            { maNV: "1022901896", hoTen: "Trần Thị Út",           khuVuc: "Vệ sinh Bến NL Ka1",  ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "NL1VS", cap3: "NL",  cap4: "NL1",  cap5: "NL1VS",  loaiVS: "VS_THUONG", congTT: 26.0, htL4Pct: 2, ghiChu: "" },
            { maNV: "1022900957", hoTen: "Tạ Thị Kim Tuyền",      khuVuc: "Vệ sinh Bến NL Ka1",  ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "NL1VS", cap3: "NL",  cap4: "NL1",  cap5: "NL1VS",  loaiVS: "VS_THUONG", congTT: 27.0, htL4Pct: 2, ghiChu: "" },
            { maNV: "1022902032", hoTen: "Huỳnh Thị Me",          khuVuc: "Vệ sinh Bến NL Ka2",  ka: "K2", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "NL2VS", cap3: "NL",  cap4: "NL2",  cap5: "NL2VS",  loaiVS: "VS_THUONG", congTT: 26.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022902160", hoTen: "Nguyễn Thị Nga",        khuVuc: "Vệ sinh Bến NL Ka2",  ka: "K2", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "NL2VS", cap3: "NL",  cap4: "NL2",  cap5: "NL2VS",  loaiVS: "VS_THUONG", congTT: 21.5, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022900988", hoTen: "Nguyễn Thị Hồng Thắm",  khuVuc: "Vệ sinh Phân Cỡ Ka1", ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC1VS", cap3: "PC",  cap4: "PC1",  cap5: "PC1VS",  loaiVS: "VS_THUONG", congTT: 27.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022904592", hoTen: "Nguyễn Thị Phước",      khuVuc: "Vệ sinh Phân Cỡ Ka1", ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC1VS", cap3: "PC",  cap4: "PC1",  cap5: "PC1VS",  loaiVS: "VS_THUONG", congTT: 22.9, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022901790", hoTen: "Lê Thị Bé Hậu",         khuVuc: "Vệ sinh Phân Cỡ Ka1", ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC1VS", cap3: "PC",  cap4: "PC1",  cap5: "PC1VS",  loaiVS: "VS_THUONG", congTT: 27.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022902153", hoTen: "Trần Thị Trúc Linh",    khuVuc: "Vệ sinh Phân Cỡ Ka1", ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC1VS", cap3: "PC",  cap4: "PC1",  cap5: "PC1VS",  loaiVS: "VS_THUONG", congTT: 21.2, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022900669", hoTen: "Bùi Thị Huệ",           khuVuc: "Vệ sinh Phân Cỡ Ka1", ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC1VS", cap3: "PC",  cap4: "PC1",  cap5: "PC1VS",  loaiVS: "VS_THUONG", congTT: 27.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022903601", hoTen: "Phạm Thanh Thúy",       khuVuc: "Vệ sinh Phân Cỡ Ka2", ka: "K2", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC2VS", cap3: "PC",  cap4: "PC2",  cap5: "PC2VS",  loaiVS: "VS_THUONG", congTT: 26.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022907151", hoTen: "Ngô Thị Kiều Thanh",    khuVuc: "Vệ sinh Phân Cỡ Ka2", ka: "K2", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC2VS", cap3: "PC",  cap4: "PC2",  cap5: "PC2VS",  loaiVS: "VS_THUONG", congTT: 25.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022908092", hoTen: "Hà Thị Bảy",            khuVuc: "Vệ sinh Phân Cỡ Ka2", ka: "K2", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC2VS", cap3: "PC",  cap4: "PC2",  cap5: "PC2VS",  loaiVS: "VS_THUONG", congTT: 23.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022904794", hoTen: "Đặng Thị Chung",        khuVuc: "Vệ sinh Phân Cỡ Ka2", ka: "K2", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC2VS", cap3: "PC",  cap4: "PC2",  cap5: "PC2VS",  loaiVS: "VS_THUONG", congTT: 1.0,  htL4Pct: 0, ghiChu: "NV" },
            { maNV: "1022902738", hoTen: "Nguyễn Thị Mỹ Tú",      khuVuc: "Vệ sinh Phân Cỡ Ka2", ka: "K2", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC2VS", cap3: "PC",  cap4: "PC2",  cap5: "PC2VS",  loaiVS: "VS_THUONG", congTT: 25.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022902339", hoTen: "Trần Thị Cẩm Hằng",     khuVuc: "Vệ sinh Phân Cỡ Ka2", ka: "K2", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PC2VS", cap3: "PC",  cap4: "PC2",  cap5: "PC2VS",  loaiVS: "VS_THUONG", congTT: 18.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022901543", hoTen: "Nguyễn Văn Dũ",         khuVuc: "Vệ sinh PTO Ka1",     ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PTO1VS", cap3: "PTO", cap4: "PTO1", cap5: "PTO1VS", loaiVS: "VS_THUONG", congTT: 27.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022900491", hoTen: "Nguyễn Thị Tô Châu",    khuVuc: "Vệ sinh PTO Ka1",     ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PTO1VS", cap3: "PTO", cap4: "PTO1", cap5: "PTO1VS", loaiVS: "VS_THUONG", congTT: 27.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022911236", hoTen: "Trần Vũ Linh",          khuVuc: "Vệ sinh PTO Ka1",     ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PTO1VS", cap3: "PTO", cap4: "PTO1", cap5: "PTO1VS", loaiVS: "VS_THUONG", congTT: 27.0, htL4Pct: 0, ghiChu: "" },
            { maNV: "1022906002", hoTen: "Nguyễn Thị Thanh Nga",  khuVuc: "Vệ sinh PTO Ka1",     ka: "K1", nhomBQ: "BQ_CB_XQ_PTO", nhomTL: "Năng suất", maBP: "PTO1VS", cap3: "PTO", cap4: "PTO1", cap5: "PTO1VS", loaiVS: "VS_THUONG", congTT: 27.0, htL4Pct: 0, ghiChu: "" }
        ]
    },

    // LNS data
    lns: {
        kyLuong: [
            { id: 1, thang: "01/2026", tuNgay: "01/01/2026", denNgay: "31/01/2026", ghiChu: "Kỳ LNS tháng 01", nguoiTao: "FPT Admin", thoiGian: "2026-01-05 08:00:00" },
            { id: 2, thang: "02/2026", tuNgay: "01/02/2026", denNgay: "28/02/2026", ghiChu: "Kỳ LNS tháng 02", nguoiTao: "FPT Admin", thoiGian: "2026-02-05 08:00:00" }
        ],
        congThucTe: [
            { id: 1, maNV: "NV001", tenNV: "Nguyễn Văn An", bp: "Bàn 1", ngayCong: 22, nguon: "Tổng hợp chấm công" },
            { id: 2, maNV: "NV002", tenNV: "Trần Minh Hải", bp: "Bàn 1", ngayCong: 20, nguon: "Tổng hợp chấm công" }
        ],
        heSoThang: [
            { id: 1, thang: "01/2026", ma: "NV001", ten: "Nguyễn Văn An", bp: "Bộ phận PTO", heso: 100, note: "Mặc định" },
            { id: 2, thang: "01/2026", ma: "NV002", ten: "Trần Minh Hải", bp: "Bộ phận PTO", heso: 120, note: "Thưởng NS tháng trước" },
            { id: 3, thang: "01/2026", ma: "NV005", ten: "Đặng Hoàng Nam", bp: "Bộ phận Tẩm bột", heso: 80, note: "Bị kỷ luật trừ 20%" }
        ],
        boSungPV: [
            { id: 1, thang: "01/2026", dv: "Khối Sản Xuất > Nhà máy 1", bp: "BP_PTO", pct: 10, loai: "Chỉ Phục vụ", note: "Bổ sung theo quy định" }
        ],
        nsThucTe: [
            { id: 1, ngay: "15/01/2026", cd: "CD001", nsCa: 500, nsDem: 0, tcNgay: 0, tcDem: 0, tong: 500 },
            { id: 2, ngay: "15/01/2026", cd: "CD002", nsCa: 420, nsDem: 0, tcNgay: 0, tcDem: 0, tong: 420 }
        ],
        nhanVien: [
            { ma: "NV001", ten: "Nguyễn Văn An",  loai: "SX", ka: "Ka Sáng", ban: "Bàn 1", ctt: 22, hst: 100, bspv: 0 },
            { ma: "NV002", ten: "Trần Minh Hải",  loai: "SX", ka: "Ka Sáng", ban: "Bàn 1", ctt: 20, hst: 90,  bspv: 0 },
            { ma: "NV003", ten: "Lê Quốc Dũng",   loai: "PV", ka: "Ka Sáng", ban: "Bàn 1", ctt: 22, hst: 100, bspv: 10 },
            { ma: "NV004", ten: "Phạm Thị Lan",   loai: "SX", ka: "Ka Sáng", ban: "Bàn 2", ctt: 22, hst: 100, bspv: 0 },
            { ma: "NV005", ten: "Đặng Hoàng Nam", loai: "SX", ka: "Ka Sáng", ban: "Bàn 2", ctt: 18, hst: 90,  bspv: 0 },
            { ma: "NV006", ten: "Võ Minh Trang",  loai: "PV", ka: "Ka Sáng", ban: "Bàn 2", ctt: 22, hst: 100, bspv: 10 },
            { ma: "NV007", ten: "Trần Văn Cường", loai: "SX", ka: "Ka Sáng", ban: "Bàn HT", ctt: 26, hst: 110, bspv: 0 },
            { ma: "NV008", ten: "Lê Thị Hồng",    loai: "SX", ka: "Ka Sáng", ban: "Bàn HT", ctt: 26, hst: 100, bspv: 0 }
        ],
        nsttTheoNgay: {
            "Bàn 1": 500,
            "Bàn 2": 420
        },
        moKhoa: [
            { id: 1, trangThai: "Locked", thang: "01/2026", maNV: "NV001", tenNV: "Nguyễn Văn An", viTri: "Công nhân", dv: "Nhà máy 1" },
            { id: 2, trangThai: "Locked", thang: "01/2026", maNV: "NV002", tenNV: "Trần Minh Hải", viTri: "Công nhân", dv: "Nhà máy 1" }
        ],
        // Dữ liệu thiết lập nhóm tính lương ĐV cấp 5 (Dùng chung cho fn7 và fn6)
        nhomDvCap5: [
            {
                id: 1, maDv5: "B001", tenDv5: "Bàn 1",
                ka: "Ka Sáng", congTy: "MPHG", ngayHl: "01/07/2026",
                loai: "A", pctGiu: 0, lamDum: []
            },
            {
                id: 2, maDv5: "B002", tenDv5: "Bàn 2",
                ka: "Ka Sáng", congTy: "MPHG", ngayHl: "01/07/2026",
                loai: "B", pctGiu: 70, lamDum: []
            },
            {
                id: 3, maDv5: "BHT", tenDv5: "Bàn HT",
                ka: "Ka Sáng", congTy: "MPHG", ngayHl: "01/07/2026",
                loai: "C", pctGiu: 0, lamDum: ["Bàn 1", "Bàn 2"]
            }
        ]
    },

    // Danh mục dùng chung LSP
    nhomTinhLuong: [
        { ma: "NTL01", ten: "Hệ số",                          suDung: true },
        { ma: "NTL02", ten: "Năng suất",                      suDung: true },
        { ma: "NTL03", ten: "Bình quân lương sản phẩm",       suDung: true },
        { ma: "NTL04", ten: "Bình quân ca bàn chuyền",        suDung: true },
        { ma: "NTL05", ten: "Hệ số điều chỉnh đặc biệt",     suDung: true }
    ],
    bpBangKe: [
        { id: 1, ma: "BPBK001", ten: "Băng chuyền K1",        suDung: true, note: "" },
        { id: 2, ma: "BPBK002", ten: "Băng chuyền K2",        suDung: true, note: "" },
        { id: 3, ma: "BPBK003", ten: "Chế biến K1",           suDung: true, note: "" },
        { id: 4, ma: "BPBK004", ten: "Chế biến K2",           suDung: true, note: "" },
        { id: 5, ma: "BPBK005", ten: "PTO K1",                suDung: true, note: "" },
        { id: 6, ma: "BPBK006", ten: "PTO K2",                suDung: true, note: "" },
        { id: 7, ma: "BPBK007", ten: "Tẩm bột",              suDung: true, note: "" },
        { id: 8, ma: "BPBK008", ten: "Xuất hàng Tp",          suDung: true, note: "" },
        { id: 9, ma: "BPBK009", ten: "Phân cỡ tay",           suDung: true, note: "" },
        { id:10, ma: "BPBK010", ten: "Vệ sinh khuôn viên",    suDung: true, note: "" }
    ],
    bpTinhLuong: [
        { id: 1, ma: "BPTL001", ten: "Bộ phận PTO",           suDung: true, note: "" },
        { id: 2, ma: "BPTL002", ten: "Bộ phận Tẩm bột",       suDung: true, note: "" },
        { id: 3, ma: "BPTL003", ten: "Bộ phận Chiên",         suDung: true, note: "" },
        { id: 4, ma: "BPTL004", ten: "Bộ phận Chế biến",      suDung: true, note: "" },
        { id: 5, ma: "BPTL005", ten: "Bộ phận Sơ chế",        suDung: true, note: "" },
        { id: 6, ma: "BPTL006", ten: "Bộ phận Đóng gói",      suDung: true, note: "" },
        { id: 7, ma: "BPTL007", ten: "Bộ phận Kho lạnh",      suDung: true, note: "" },
        { id: 8, ma: "BPTL008", ten: "Bộ phận Luộc / Hấp",    suDung: true, note: "" },
        { id: 9, ma: "BPTL009", ten: "Bộ phận Hàng GTGT",     suDung: true, note: "" },
        { id:10, ma: "BPTL010", ten: "Bộ phận Xuất hàng",     suDung: true, note: "" }
    ],

    // System data
    sys: {
        tieuChiTimKiem: [
            { id: 1, ma: "TC01", tenEN: "Employee Code", tenVN: "Mã Nhân Viên", thuTu: 1, bang: "NS_Result", sql: "SELECT EmpCode FROM ...", type: "String", note: "" },
            { id: 2, ma: "TC02", tenEN: "Department", tenVN: "Bộ phận", thuTu: 2, bang: "NS_Result", sql: "SELECT Dept FROM ...", type: "String", note: "" }
        ],
        tieuChiHeThong: [
            { id: 1, ma: "HT01", tenEN: "Lock Status", tenVN: "Trạng thái khóa", thuTu: 1, bang: "Sys_Status", sql: "...", type: "Boolean", note: "" }
        ],
        tieuChiTinhToan: [
            { id: 1,  ma: "TT_LSP_Base_L0",          tenEN: "Base L0",               tenVN: "Lương gốc L0",                      thuTu: 1,  prio: 10, rowClass: "Detail",  alloc: "None",          sumPrev: "N", prorataBasis: "", type: "Number", note: "" },
            { id: 2,  ma: "TT_LSP_TienL1",            tenEN: "After L1",              tenVN: "Tiền sau ĐC lần 1",                 thuTu: 2,  prio: 20, rowClass: "Detail",  alloc: "None",          sumPrev: "N", prorataBasis: "", type: "Number", note: "" },
            { id: 3,  ma: "TT_LSP_TienL2",            tenEN: "After L2",              tenVN: "Tiền sau ĐC lần 2",                 thuTu: 3,  prio: 30, rowClass: "Detail",  alloc: "None",          sumPrev: "N", prorataBasis: "", type: "Number", note: "" },
            { id: 4,  ma: "TT_LSP_TienL3",            tenEN: "After L3",              tenVN: "Tiền sau ĐC lần 3",                 thuTu: 4,  prio: 40, rowClass: "Detail",  alloc: "None",          sumPrev: "N", prorataBasis: "", type: "Number", note: "" },
            { id: 5,  ma: "TT_LSP_HoTroChuyenBan",    tenEN: "Station handover support", tenVN: "Hỗ trợ bàn giao (giai đoạn cũ)", thuTu: 5,  prio: 45, rowClass: "Detail",  alloc: "OldStage",      sumPrev: "N", prorataBasis: "", type: "Number", note: "Dồn vào giai đoạn CŨ trước khi chuyển bàn" },
            { id: 6,  ma: "TT_LSP_LuongThoiGian",     tenEN: "Time salary",           tenVN: "Lương thời gian (ngày công)",        thuTu: 6,  prio: 50, rowClass: "Detail",  alloc: "Prorata",       sumPrev: "N", prorataBasis: "HT_TS_CongThucTe", type: "Number", note: "" },
            { id: 8,  ma: "TT_LSP_KhoanTruThang",     tenEN: "Monthly deduction",     tenVN: "Khoản trừ tháng (tạm ứng, kỷ luật...)", thuTu: 8, prio: 62, rowClass: "Summary", alloc: "MaxSalaryRow", sumPrev: "Y", prorataBasis: "", type: "Number", note: "Gán theo tháng cho NV" },
            { id: 10, ma: "TT_TNChiuThueTNCN",        tenEN: "Taxable income (PIT)",  tenVN: "Thu nhập chịu thuế TNCN",            thuTu: 10, prio: 70, rowClass: "Summary", alloc: "LastStageRow",  sumPrev: "Y", prorataBasis: "", type: "Number", note: "" },
            { id: 11, ma: "TT_LSP_KetQua_Final",      tenEN: "Final result",          tenVN: "Tổng LSP cuối cùng",                thuTu: 11, prio: 99, rowClass: "Summary", alloc: "None",          sumPrev: "Y", prorataBasis: "", type: "Number", note: "" }
        ],
        congThucLuong: [
            { id: 1, ten: "Công thức LNS 2026", loai: "LNS", hieuLuc: "01/01/2026", congThuc: "CALC_01 + CALC_02" }
        ]
    }
};
