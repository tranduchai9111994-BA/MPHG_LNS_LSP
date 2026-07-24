/**
 * NAV_CONFIG — 2-tier: MODULE → GROUP → ITEM.
 * Backward-compat: NAV_CONFIG.groups (flat) và NAV_CONFIG.getAllGroups().
 *
 * Mapping quyết định (24/07/2026 — restructure toàn diện):
 *  - LTG (module) "Lương Thời Gian theo quá trình":
 *      [ltg-tl (TC & CT shared), ltg-cn (Chức năng), ltg-bc (Báo cáo),
 *       ltg-pl (Phiếu lương), ltg-tlpl (Thiết lập Phiếu lương)]
 *  - LSP (module) "Lương Sản Phẩm (Chức năng riêng)":
 *      [lsp-dm (Danh mục), lsp-tl (Thiết lập), lsp-cn (Chức năng thuần LSP)]
 *  - LNS (module) "Lương Năng Suất":
 *      [lns-dm, lns-tl, lns-cn, lns-bc, lns-cb] — giữ nguyên.
 *
 * Note: Engine setup (Tiêu chí & Công thức) chỉ 1 nơi tại LTG (ltg-tl) —
 *       LSP dùng share chung engine nhưng KHÔNG show trên nav LSP để tránh confuse.
 */
window.NAV_CONFIG = {
  modules: [
    {
      id: "ltg",
      title: "Lương Thời Gian theo quá trình",
      icon: "⏰",
      defaultExpanded: true,
      groups: [
        {
          id: "ltg-tl",
          title: "LTG · Thiết lập",
          defaultExpanded: true,
          items: [
            { id: "set0", label: "Danh mục Param hệ thống", src: "lsp/set0-param-hethong.html" },
            { id: "set_fn", label: "Danh mục Function scalar", src: "lsp/set-function-catalog.html" },
            { id: "set1", label: "Định nghĩa tiêu chí tìm kiếm", src: "lsp/set1-tieuchi-timkiem.html" },
            { id: "set2", label: "Định nghĩa tiêu chí hệ thống", src: "lsp/set2-tieuchi-hethong.html" },
            { id: "set3", label: "Định nghĩa tiêu chí tính toán", src: "lsp/set3-tieuchi-tinhtoan.html" },
            { id: "set4", label: "Tạo công thức lương", src: "lsp/set4-tao-congthuc-luong.html" },
            { id: "set5", label: "Gán công thức lương cho cơ cấu", src: "lsp/set5-gan-congthuc-cocau.html" }
          ]
        },
        {
          id: "ltg-cn",
          title: "LTG · Chức năng",
          defaultExpanded: true,
          items: [
            { id: "pg1_ext", label: "Tạo kỳ lương (LTG)", src: "lsp/set-taokyluong.html" },
            { id: "set6_dsnv", label: "Cập nhật DS NV tính lương", src: "lsp/set6-danhsach-nv-tinh-luong.html" },
            { id: "set7_tinhluong", label: "Tính lương tháng", src: "lsp/set7-tinhluong-thang.html" }
          ]
        },
        {
          id: "ltg-bc",
          title: "LTG · Báo cáo",
          defaultExpanded: false,
          items: [
            { id: "set8", label: "Tạo báo cáo động", src: "lsp/set8-taobaocao-dong.html" },
            { id: "set9", label: "Gán công thức dữ liệu báo cáo", src: "lsp/set9-gan-congthuc-baocao.html" },
            { id: "ltg_bc_chebien", label: "Bảng tính lương chế biến", src: "lsp/bc-che-bien.html" }
          ]
        },
        {
          id: "ltg-pl",
          title: "LTG · Phiếu lương",
          defaultExpanded: true,
          items: [
            { id: "set_xem_pl", label: "Xem phiếu lương", src: "lsp/set-xem-phieu-luong.html" }
          ]
        },
        {
          id: "ltg-tlpl",
          title: "LTG · Thiết lập Phiếu lương",
          defaultExpanded: false,
          items: [
            { id: "set12", label: "Định nghĩa template PL", src: "lsp/set12-dinhnghia-template-pl.html" },
            { id: "set10", label: "Tham số được sử dụng (PL)", src: "lsp/set10-thamso-phieuluong.html" },
            { id: "set11", label: "Gán công thức dữ liệu (PL)", src: "lsp/set11-gancongthuc-phieuluong.html" },
            { id: "set13", label: "Gán PL cho cơ cấu", src: "lsp/set13-ganpl-cocau.html" },
            { id: "set14", label: "Điều kiện lọc PL mặc định", src: "lsp/set14-dieu-kien-loc-pl.html" },
            { id: "set_gancotluong", label: "Gán CT cột Tính lương", src: "lsp/set-gancongthuc-cot-tinhluong.html" }
          ]
        }
      ]
    },
    {
      id: "lsp",
      title: "Lương Sản Phẩm (Chức năng riêng)",
      icon: "📦",
      defaultExpanded: false,
      groups: [
        {
          id: "lsp-dm",
          title: "LSP · Danh mục",
          defaultExpanded: false,
          items: [
            { id: "lsp_dm1", label: "Nhóm lương", src: "lsp/dm1-nhom-luong.html" },
            { id: "lsp_dm2", label: "Nhóm tính lương", src: "lsp/dm2-nhom-tinh-luong.html" },
            { id: "lsp_dm3", label: "Bộ phận bảng kê", src: "lsp/dm3-bp-bang-ke.html" },
            { id: "lsp_dm4", label: "Bộ phận tính lương", src: "lsp/dm4-bp-tinh-luong.html" },
            { id: "lsp_dm5", label: "Bộ phận tính lương chi tiết", src: "lsp/dm5-bp-tinh-luong-ct.html" }
          ]
        },
        {
          id: "lsp-tl",
          title: "LSP · Thiết lập",
          defaultExpanded: false,
          items: [
            { id: "sys5", label: "Thiết lập BP tính lương theo cơ cấu", src: "lsp/sys5-bp-co-cau.html" },
            { id: "dm7", label: "Quy cách tính lương", src: "lns/dm7-quy-cach.html" },
            { id: "pg8", label: "Hỗ trợ quy cách tính lương", src: "lsp/pg8-ho-tro-cd.html" },
            { id: "pg8_1", label: "Hỗ trợ Độc hại chiên", src: "lsp/pg8-ho-tro-cd-chien.html" },
            { id: "pg9_1", label: "Hệ số điều chỉnh lần 1", src: "lsp/pg9-he-so-hs123.html?lan=1" },
            { id: "pg9_2", label: "Hệ số điều chỉnh lần 2", src: "lsp/pg9-he-so-hs123.html?lan=2" },
            { id: "pg5", label: "Hệ số điều chỉnh lần 3", src: "lsp/pg5-nhap-nv.html" },
            { id: "pg9_4", label: "Hệ số điều chỉnh lần 4", src: "lsp/pg9-he-so-hs123.html?lan=4" }
          ]
        },
        {
          id: "lsp-cn",
          title: "LSP · Chức năng",
          defaultExpanded: false,
          items: [
            { id: "pg1", label: "Tạo kỳ Lương Sản Phẩm", src: "lsp/pg1-tao-ky.html" },
            { id: "pg2", label: "Tính Lương Sản Phẩm", src: "lsp/pg2-tinh-lsp.html" },
            { id: "pg12", label: "Tổng hợp điều chỉnh", src: "lsp/pg12-tong-hop-dc.html" },
            { id: "pg10", label: "Tính bình quân LSP (BQTL)", src: "lsp/pg10-bq-tlsp.html" },
            { id: "sys7", label: "Thiết lập hệ số, BQ TLSP cho vệ sinh", src: "lsp/sys7-heso-bq-vs.html" },
            { id: "pg11", label: "Tính lương nhóm vệ sinh", src: "lsp/pg11-bang-tinh-vs.html" },
            { id: "pg14", label: "Bảng tính các khoản tiền công", src: "lsp/pg14-bang-tinh-luong.html" }
          ]
        }
      ]
    },
    {
      id: "lns",
      title: "Lương Năng Suất",
      icon: "⚡",
      defaultExpanded: false,
      groups: [
        {
          id: "lns-dm",
          title: "LNS · Danh mục",
          defaultExpanded: false,
          items: [
            { id: "dm1", label: "Tiến trình", src: "lns/dm1-tien-trinh.html" },
            { id: "dm1b", label: "Đơn vị tính", src: "lns/dm1b-don-vi-tinh.html" },
            { id: "dm6", label: "Mã size nội bộ", src: "lns/dm6-ma-sap.html" },
            { id: "dm3", label: "Loại Tôm", src: "lns/dm3-loai-tom.html" },
            { id: "dm4", label: "Loại nguyên liệu", src: "lns/dm4-loai-nl.html" },
            { id: "dm2", label: "Công đoạn", src: "lns/dm2-cong-doan.html" },
            { id: "dm5", label: "Mã Size", src: "lns/dm5-ma-size.html" }
          ]
        },
        {
          id: "lns-tl",
          title: "LNS · Thiết lập",
          defaultExpanded: false,
          items: [
            { id: "fn7", label: "Thiết lập nhóm tính lương năng suất", src: "lns/fn7-nhom-dv-cap5.html" }
          ]
        },
        {
          id: "lns-cn",
          title: "LNS · Chức năng",
          defaultExpanded: false,
          items: [
            { id: "fn9", label: "Công năng suất", src: "lns/fn9-cong-nang-suat.html" },
            { id: "fn5", label: "Nhập năng suất chung theo bộ phận", src: "lns/fn5-khoa-cong.html" },
            { id: "fn5b", label: "Nhập năng suất riêng theo nhân viên", src: "lns/fn5b-ns-nhan-vien.html" },
            { id: "fn4", label: "% Bổ sung Phục vụ", src: "lns/fn4-chot-san-luong.html" },
            { id: "fn1", label: "Tạo kỳ tính năng suất", src: "lns/fn1-tao-ky.html" },
            { id: "fn6", label: "Tính Lương Năng Suất", src: "lns/fn6-tinh-lns.html" }
          ]
        },
        {
          id: "lns-bc",
          title: "LNS · Báo cáo",
          defaultExpanded: false,
          items: [
            { id: "bc0", label: "Báo cáo công năng suất", src: "lns/bc0-cong-ns.html" },
            { id: "bc1", label: "Báo cáo chi tiết 1 công năng suất", src: "lns/bc1-chi-tiet-cong-ns.html" },
            { id: "bc2", label: "Báo cáo chi tiết nhân viên theo ngày", src: "lns/bc2-chi-tiet-nv-ngay-03.html" },
            { id: "bc3", label: "Báo cáo chi tiết nhân viên theo tháng", src: "lns/bc3-chi-tiet-nv-theo-thang.html" },
            { id: "bc4", label: "Báo cáo tổng hợp thành phẩm sản xuất", src: "lns/bc4-tong-hop-thanh-pham.html" },
            { id: "bc5", label: "Báo cáo check NS tính lương", src: "lns/bc5-check-ns.html" },
            { id: "bc6", label: "Báo cáo năng suất tổng mã nội bộ", src: "lns/bc6-nang-suat-tong-ma-noi-bo.html" }
          ]
        },
        {
          id: "lns-cb",
          title: "LNS · Cảnh báo",
          defaultExpanded: false,
          items: [
            { id: "cb1", label: "Cảnh báo Năng suất riêng", src: "lns/cb1-ns-rieng.html" },
            { id: "cb2", label: "Cảnh báo Năng suất chung", src: "lns/cb2-ns-chung.html" }
          ]
        }
      ]
    }
  ],

  getAllGroups: function () {
    return this.modules.reduce(function (acc, m) { return acc.concat(m.groups); }, []);
  }
};

Object.defineProperty(window.NAV_CONFIG, 'groups', {
  get: function () { return this.getAllGroups(); }
});
