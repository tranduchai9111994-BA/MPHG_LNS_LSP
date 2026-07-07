const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MINH PHU – Nhập NS Thực Tế Nhân Viên</title>
    <link rel="stylesheet" href="../shared/style.css">
    <style>
      .form-grid-4col { display: grid; grid-template-columns: 100px 1fr 100px 1fr 100px 1fr; gap: 8px; align-items: center; }
      .table-responsive { width: 100%; overflow-x: auto; background: #fff; border: 1px solid #ccc; max-height: 500px; overflow-y: auto; }
      .table-responsive table { width: max-content; min-width: 100%; border-collapse: collapse; }
      .table-responsive th, .table-responsive td { padding: 4px 6px; border: 1px solid #ddd; font-size: 11px; white-space: nowrap; text-align: center; }
      .table-responsive th { background: #ffd600; position: sticky; top: 0; z-index: 10; color: #333; font-weight: bold; }
      .table-responsive input, .table-responsive select { width: 100%; font-size: 11px; padding: 2px; box-sizing: border-box; }
      .input-error { border: 1px solid red !important; background: #ffebee !important; }
      .col-freeze-1 { position: sticky; left: 0; background: #fff; z-index: 5; }
      .col-freeze-2 { position: sticky; left: 35px; background: #fff; z-index: 5; }
      .col-freeze-3 { position: sticky; left: 110px; background: #fff; z-index: 5; }
      th.col-freeze-1, th.col-freeze-2, th.col-freeze-3 { background: #ffd600; z-index: 15; }
    </style>
</head>
<body>
  <div class="top-header">
    <div class="logo"><span style="font-size:24px;color:#e74c3c">❦</span> MINH PHU</div>
    <div class="search-bar"><input type="text" placeholder="Tìm kiếm hồ sơ và chức năng"></div>
    <div class="user-actions">
      <span>🇻🇳 VN ⌄</span>
      <span>🔔 <span style="background:red;color:white;border-radius:50%;padding:1px 4px;font-size:9px">6</span></span>
      <span>✉ <span style="background:red;color:white;border-radius:50%;padding:1px 4px;font-size:9px">45</span></span>
      <span style="font-size:11px;text-align:right;line-height:1.2">Xin chào,<br><b>FPT Admin</b></span>
    </div>
  </div>
  <div class="main-menu">
    <a href="#">Nhân sự</a><a href="#">Thôi việc</a><a href="#">Chấm công</a>
    <a href="#">Bảo hiểm</a><a href="#" class="active">Lương</a>
    <a href="#">Thưởng</a><a href="#">Thuế</a><a href="#">Hệ thống</a><a href="#">DV cá nhân</a>
  </div>
  <div class="container">
    <div class="demo-badge">DEMO</div>

<div>
  <div class="breadcrumb">Lương › Tính Lương năng suất › Nhập NS thực tế theo nhân viên</div>
  <div class="page-title">NHẬP NĂNG SUẤT THỰC TẾ THEO TỪNG NHÂN VIÊN</div>
  <div id="fn5b-alert" class="alert-box"></div>

  <div class="form-panel">
    <div class="form-grid-4col">
      <label>Từ ngày</label>
      <input type="date" value="2026-06-01">
      <label>Đến ngày</label>
      <input type="date" value="2026-06-30">
      <label>Ngày làm việc</label>
      <input type="date">
      
      <label>Bộ phận</label>
      <select><option>Tất cả</option><option>PTO Tải 01</option></select>
      <label>Ca làm việc</label>
      <select><option>Tất cả</option><option>1</option><option>2</option></select>
      <label>Nhân viên</label>
      <input type="text" placeholder="Mã NV / Tên NV...">
    </div>
  </div>
  <div class="actions-bar" style="justify-content: center;">
    <button class="btn-search">Tìm kiếm</button>
    <button class="btn-refresh" onclick="fn5bClear()">Làm mới</button>
    <button class="btn-save2" onclick="fn5bSave()">Lưu dữ liệu</button>
    <button class="btn-import" onclick="showModal('fn5b-imp')">Nhập dữ liệu (Excel)</button>
    <button class="btn-export">Xuất Excel</button>
  </div>

  <div class="table-responsive">
    <table>
      <thead>
        <tr>
          <th class="col-freeze-1" style="width:35px;">STT</th>
          <th class="col-freeze-2" style="width:75px;">Mã NV</th>
          <th class="col-freeze-3" style="width:120px;">Họ và Tên</th>
          <th style="width:70px;">Mã BP</th>
          <th style="width:120px;">Bộ phận</th>
          <th style="width:50px;">Ka LV</th>
          <th style="width:90px;">Ngày NL</th>
          <th style="width:70px;">Lô</th>
          <th style="width:70px;">Nhóm KS</th>
          <th style="width:60px;">KL Bơ</th>
          <th style="width:100px;">Quy cách SX</th>
          <th style="width:80px;">Mã nội bộ</th>
          <th style="width:80px;">Size nội bộ</th>
          <th style="width:120px;">QC tính lương</th>
          <th style="width:90px;">Ngày LV</th>
          <th style="width:70px;">TG bắt đầu</th>
          <th style="width:90px;">Ngày cân</th>
          <th style="width:70px;">Giờ cân</th>
          <th style="width:60px;">gr/con</th>
          <th style="width:60px;">con/khay</th>
          <th style="width:70px;background:#fff9c4;color:#f57f17;">KL (kg)</th>
          <th style="width:70px;">Đơn vị tính</th>
          <th style="width:80px;">NS Làm</th>
          <th style="width:70px;">Line.Bơ</th>
          <th style="width:40px;">Xóa</th>
        </tr>
      </thead>
      <tbody id="fn5b-tbody"></tbody>
    </table>
  </div>
  
  <div style="margin-top:10px; padding: 10px; background: #e3f2fd; border: 1px solid #90caf9; font-size: 12px; border-radius: 4px;">
    <strong>Thao tác:</strong> 
    <button onclick="fn5bAddRow()" style="padding:4px 8px; font-size:11px; cursor:pointer; margin-left: 10px;">+ Thêm dòng mới</button>
  </div>

</div>

<!-- Modal Import -->
<div class="modal-overlay" id="fn5b-imp"><div class="modal-box">
  <div class="modal-hdr cyan"><span>IMPORT NĂNG SUẤT THỰC TẾ NHÂN VIÊN</span><button class="x" onclick="hideModal('fn5b-imp')">✕</button></div>
  <div class="modal-body">
    <div style="background:#f9f9f9;padding:8px;margin-bottom:12px;font-size:11px;border:1px dashed #999;"><strong>Hướng dẫn:</strong><br>
      1. Tải template mẫu về và điền 24 cột tương ứng.<br>
      <span style="color:red">2. Hệ thống sẽ validate realtime Đơn vị tính và Đơn giá sau khi import.</span>
    </div>
    <input type="file" accept=".xlsx,.xls" style="width:100%;border:1px solid #ccc;padding:4px;margin-bottom:8px;"><a href="#" style="font-size:11px;color:#0056b3">Tải template mẫu</a>
  </div>
  <div class="modal-ftr"><button class="btn-cancel" onclick="hideModal('fn5b-imp')">Đóng</button><button class="btn-ok" onclick="hideModal('fn5b-imp');showAlert2('fn5b-alert','Import dữ liệu thành công! Vui lòng bấm Lưu.','success')">Thực hiện Import</button></div>
</div></div>

    <div style="margin-top:20px;border-top:2px dashed #ffd600;padding-top:15px;">
      <div style="font-weight:bold;color:#856404;margin-bottom:8px;font-size:12px;">
        📋 GHI CHÚ NGHIỆP VỤ (dành cho thẩm định)
      </div>
      <textarea rows="3" style="width:100%;border:1px dashed #ffd600;padding:8px;font-size:12px;font-family:Arial;background:#fffef0;resize:vertical;" placeholder="BA ghi chú: Rule kiểm tra Đơn giá trống = Warning, Sai ĐVT = Error chặn lưu. Auto-fill Họ Tên theo Mã NV."></textarea>
    </div>
  </div>
  <script src="../shared/mockdata.js"></script>
  <script src="../shared/utils.js"></script>
  <script>
    function showModal(id) { const e = document.getElementById(id); if(e) e.style.display = 'flex'; }
    function hideModal(id) { const e = document.getElementById(id); if(e) e.style.display = 'none'; }
    function showAlert2(id, msg, type) {
      const b = document.getElementById(id);
      if(!b) return;
      b.className = 'alert-box alert-' + type;
      b.innerHTML = msg;
      b.style.display = 'block';
      if (type !== 'error') setTimeout(() => b.style.display = 'none', 5000);
    }

    // Mock employees DB for autocomplete
    const nhanVienDB = {
        '1022909958': 'Phạm Thị Trúc Ly',
        '1022909959': 'Nguyễn Văn An',
        '1022909960': 'Trần Thị Bích Nga'
    };

    // Valid units for check (mock)
    const validDVT = ['kg', 'con', 'khay', 'thung'];

    let fn5bData = [
      { id:1, ma_nv:'1022909958', ho_ten:'Phạm Thị Trúc Ly', ma_bp:'PTO101', ten_bp:'PTO tải 01', ka_lv:1, ngay_nl:'2026-05-31', lo:'P0', nhom_ks:'N1', kl_bo:276, quy_cach_sx:'Lặt xẻ PTO', ma_noibo:'50524494', size_noibo:'VM 13/15', qc_tinhluong:'WTHLXPTOHV0015', ngay_lv:'2026-06-01', tg_batdau:'13:00', ngay_can:'2026-06-01', gio_can:'13:42', gr_con:'', con_khay:'', kl_kg:2.42, dvt:'kg', ns_lam:'1', line_bo:'8', dongia: 1200 },
      { id:2, ma_nv:'1022909959', ho_ten:'Nguyễn Văn An', ma_bp:'PTO102', ten_bp:'PTO tải 02', ka_lv:1, ngay_nl:'2026-05-31', lo:'P1', nhom_ks:'N2', kl_bo:150, quy_cach_sx:'Nobashi', ma_noibo:'50524445', size_noibo:'VM 16/20', qc_tinhluong:'WTHLXPTOHV0016', ngay_lv:'2026-06-01', tg_batdau:'14:00', ngay_can:'2026-06-01', gio_can:'14:30', gr_con:'', con_khay:'', kl_kg:5.00, dvt:'kg', ns_lam:'1', line_bo:'9', dongia: null } // Demo null dongia
    ];
    let fn5bNextId = 3;

    function fn5bRender() {
      const tbody = document.getElementById('fn5b-tbody');
      tbody.innerHTML = '';
      fn5bData.forEach((r, i) => {
        tbody.appendChild(createRowHTML(r, i));
      });
    }

    function createRowHTML(r, i) {
        const tr = document.createElement('tr');
        tr.id = 'row-' + r.id;
        
        let selectNS = '<select class="inp-ns-lam"><option value="1" '+(r.ns_lam=='1'?'selected':'')+'>1: Trong ca</option><option value="2" '+(r.ns_lam=='2'?'selected':'')+'>2: Ca đêm</option><option value="3" '+(r.ns_lam=='3'?'selected':'')+'>3: Tăng ca</option><option value="4" '+(r.ns_lam=='4'?'selected':'')+'>4: Tăng ca đêm</option></select>';
        
        // Highlight logic for initial load
        let klStyle = "text-align:right;";
        let dvtStyle = "";
        let klVal = parseFloat(r.kl_kg) || 0;
        
        tr.innerHTML = \`
          <td class="col-freeze-1">\${i+1}</td>
          <td class="col-freeze-2"><input type="text" class="inp-manv" value="\${r.ma_nv}" data-id="\${r.id}" onchange="checkMaNV(this)"></td>
          <td class="col-freeze-3"><input type="text" class="inp-hoten" value="\${r.ho_ten}" readonly style="background:#f0f0f0"></td>
          <td><input type="text" value="\${r.ma_bp}"></td>
          <td><input type="text" value="\${r.ten_bp}"></td>
          <td><input type="text" value="\${r.ka_lv}" style="text-align:center"></td>
          <td><input type="date" value="\${r.ngay_nl}"></td>
          <td><input type="text" value="\${r.lo}" style="text-align:center"></td>
          <td><input type="text" value="\${r.nhom_ks}" style="text-align:center"></td>
          <td><input type="number" value="\${r.kl_bo}" style="text-align:right"></td>
          <td><input type="text" value="\${r.quy_cach_sx}"></td>
          <td><input type="text" value="\${r.ma_noibo}" style="text-align:center"></td>
          <td><input type="text" value="\${r.size_noibo}" style="text-align:center"></td>
          <td><input type="text" value="\${r.qc_tinhluong}"></td>
          <td><input type="date" value="\${r.ngay_lv}"></td>
          <td><input type="time" value="\${r.tg_batdau}"></td>
          <td><input type="date" value="\${r.ngay_can}"></td>
          <td><input type="time" value="\${r.gio_can}"></td>
          <td><input type="number" value="\${r.gr_con}" style="text-align:right"></td>
          <td><input type="number" value="\${r.con_khay}" style="text-align:right"></td>
          <td><input type="number" class="inp-kl" data-id="\${r.id}" data-dongia="\${r.dongia===null?'':r.dongia}" value="\${r.kl_kg}" style="\${klStyle}" onchange="validateRow(this)"></td>
          <td><input type="text" class="inp-dvt" value="\${r.dvt}" style="\${dvtStyle}" onchange="validateRow(this)"></td>
          <td>\${selectNS}</td>
          <td><input type="text" value="\${r.line_bo}" style="text-align:center"></td>
          <td><button onclick="fn5bDelete(\${r.id})" style="color:red; cursor:pointer; background:none; border:none; font-weight:bold">X</button></td>
        \`;
        return tr;
    }

    function checkMaNV(input) {
        const ma = input.value.trim();
        const row = input.closest('tr');
        const hotenInput = row.querySelector('.inp-hoten');
        if(nhanVienDB[ma]) {
            hotenInput.value = nhanVienDB[ma];
        } else {
            hotenInput.value = 'Không tìm thấy';
        }
    }

    function validateRow(input) {
        const row = input.closest('tr');
        const inpKL = row.querySelector('.inp-kl');
        const inpDVT = row.querySelector('.inp-dvt');
        
        let kl = parseFloat(inpKL.value) || 0;
        let dvt = inpDVT.value.trim().toLowerCase();
        let dongia = inpKL.getAttribute('data-dongia');
        
        inpDVT.classList.remove('input-error');
        
        // Rule 1: KL > 0 and dongia is empty -> Warning (We check this mainly on Save, but can highlight)
        // Rule 2: DVT invalid -> Error
        if (dvt && !validDVT.includes(dvt)) {
            inpDVT.classList.add('input-error');
        }
    }

    function fn5bAddRow() {
      const newRow = { id: fn5bNextId++, ma_nv:'', ho_ten:'', ma_bp:'', ten_bp:'', ka_lv:1, ngay_nl:'', lo:'', nhom_ks:'', kl_bo:'', quy_cach_sx:'', ma_noibo:'', size_noibo:'', qc_tinhluong:'', ngay_lv:'', tg_batdau:'', ngay_can:'', gio_can:'', gr_con:'', con_khay:'', kl_kg:'', dvt:'kg', ns_lam:'1', line_bo:'', dongia: 1000 };
      fn5bData.push(newRow);
      fn5bRender();
    }

    function fn5bDelete(id) {
        fn5bData = fn5bData.filter(x => x.id !== id);
        fn5bRender();
    }

    function fn5bSave() {
        // Collect UI state and validate
        const rows = document.querySelectorAll('#fn5b-tbody tr');
        let hasError = false;
        let hasWarning = false;
        
        rows.forEach((row, idx) => {
            const inpKL = row.querySelector('.inp-kl');
            const inpDVT = row.querySelector('.inp-dvt');
            
            let kl = parseFloat(inpKL.value) || 0;
            let dvt = inpDVT.value.trim().toLowerCase();
            let dongia = inpKL.getAttribute('data-dongia');
            
            if (dvt && !validDVT.includes(dvt)) {
                hasError = true;
                inpDVT.classList.add('input-error');
            }
            if (kl > 0 && !dongia) {
                hasWarning = true;
            }
        });
        
        if (hasError) {
            showAlert2('fn5b-alert', '<b>LỖI CHẶN LƯU:</b> Có dòng sai "Đơn vị tính" (phải là kg, con, khay, thung). Vui lòng kiểm tra các ô màu đỏ.', 'error');
            return; // Block save
        }
        
        if (hasWarning) {
            showAlert2('fn5b-alert', '<b>CẢNH BÁO:</b> Có dòng Khối lượng > 0 nhưng Đơn giá đang trống. Vui lòng kiểm tra lại cấu hình đơn giá! Dữ liệu đã được lưu thành công.', 'warning');
            return;
        }

        showAlert2('fn5b-alert', 'Lưu dữ liệu thành công!', 'success');
    }

    fn5bRender();
  </script>
</body>
</html>
`
fs.writeFileSync(path.join('d:/MPHG_LNS_LSP/lns', 'fn5b-ns-nhan-vien.html'), htmlContent);
console.log('Created fn5b-ns-nhan-vien.html');
