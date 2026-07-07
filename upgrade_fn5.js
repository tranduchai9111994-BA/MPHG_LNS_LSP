const fs = require('fs');
let htmlFile = 'd:/MPHG_LNS_LSP/lns/fn5-khoa-cong.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

// Replace table header
htmlContent = htmlContent.replace(/<thead>.*?<\/thead>/, `<thead><tr><th>STT</th><th>Ngày LV</th><th>Mã BP</th><th>Ka LV</th><th>Công đoạn</th><th>Mã nội bộ</th><th>NS Làm</th><th>KL</th><th>ĐVT</th><th>Lô</th><th>Quy cách SX</th></tr></thead>`);

// Replace table body
htmlContent = htmlContent.replace(/<tbody>[\s\S]*?<\/tbody>/, `<tbody>
      <tr><td>1</td><td>15/07/2025</td><td>CB101</td><td>1</td><td>May thân trước</td><td style="font-family:monospace;font-weight:bold;">50524494</td><td><span class="badge" style="background:#e3f2fd;color:#1565c0;">1: Trong ca</span></td><td><b>520</b></td><td style="color:#d32f2f;font-weight:bold;">kg</td><td>P0</td><td>LX PTO</td></tr>
      <tr><td>2</td><td>15/07/2025</td><td>CB102</td><td>1</td><td>May tay áo</td><td style="font-family:monospace;font-weight:bold;">50524445</td><td><span class="badge" style="background:#e8f5e9;color:#2e7d32;">2: Ca đêm</span></td><td><b>450</b></td><td style="color:#d32f2f;font-weight:bold;">con</td><td>P1</td><td>Nobashi</td></tr>
      <tr><td>3</td><td>16/07/2025</td><td>CB103</td><td>2</td><td>Hoàn thiện</td><td style="font-family:monospace;font-weight:bold;">50524492</td><td><span class="badge" style="background:#fff3e0;color:#ef6c00;">3: Tăng ca</span></td><td><b>390</b></td><td style="color:#d32f2f;font-weight:bold;">kg</td><td>P2</td><td>Sushi</td></tr>
    </tbody>`);

// Replace modal form
const newModalBody = `<div class="modal-body" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;padding:15px;background:#f9f9f9;max-height:70vh;overflow-y:auto;">
    <div class="form-row"><label>Mã BP <span class="req">*</span></label><input type="text" id="fn5_mabp" placeholder="CB101..."></div>
    <div class="form-row"><label>Ka LV <span class="req">*</span></label><input type="text" id="fn5_kalv" placeholder="1"></div>
    <div class="form-row"><label>Ngày NL</label><input type="date" id="fn5_ngaynl"></div>
    <div class="form-row"><label>Lô</label><input type="text" id="fn5_lo" placeholder="P0"></div>
    <div class="form-row"><label>Nhóm KS</label><input type="text" id="fn5_nhomks" placeholder="N1"></div>
    <div class="form-row"><label>KL Bơ</label><input type="number" step="0.01" id="fn5_klbo" placeholder="222"></div>
    <div class="form-row"><label>Quy cách SX</label><input type="text" id="fn5_qcsx" placeholder="LX PTO hấp vỏ"></div>
    <div class="form-row"><label>Mã nội bộ <span class="req">*</span></label><input type="text" id="fn5_manb" placeholder="50524494"></div>
    <div class="form-row"><label>Size nội bộ</label><input type="text" id="fn5_sizenb" placeholder="VM 13/15"></div>
    <div class="form-row"><label>Quy cách tính lương</label><input type="text" id="fn5_qctl" placeholder="WTHLXPTOHV0015"></div>
    <div class="form-row"><label>Ngày LV <span class="req">*</span></label><input type="date" id="fn5_ngaylv"></div>
    <div class="form-row"><label>TG bắt đầu</label><input type="time" id="fn5_tgbd"></div>
    <div class="form-row"><label>Ngày cân</label><input type="date" id="fn5_ngaycan"></div>
    <div class="form-row"><label>Giờ cân</label><input type="time" id="fn5_giocan"></div>
    <div class="form-row"><label>gr/con</label><input type="number" step="0.01" id="fn5_grcon"></div>
    <div class="form-row"><label>con/khay</label><input type="number" step="0.01" id="fn5_conkhay"></div>
    <div class="form-row"><label>Công đoạn <span class="req">*</span></label><select id="fn5_congdoan" onchange="document.getElementById('fn5_dvt').value = this.value === 'May tay áo' ? 'con' : 'kg';"><option>-- Chọn --</option><option value="May thân trước">May thân trước</option><option value="May tay áo">May tay áo</option><option value="Hoàn thiện">Hoàn thiện</option></select></div>
    <div class="form-row"><label>Khối lượng (KL) <span class="req">*</span></label><input type="number" step="0.01" id="fn5_kl" placeholder="14.41"></div>
    <div class="form-row"><label>Đơn vị tính <span class="req">*</span></label><select id="fn5_dvt"><option value="kg">kg</option><option value="con">con</option><option value="Thùng">Thùng</option><option value="Lít">Lít</option><option value="Miếng">Miếng</option><option value="Khay">Khay</option></select></div>
    <div class="form-row"><label>NS Làm <span class="req">*</span></label><select id="fn5_nslam"><option value="1">1: Trong ca</option><option value="2">2: Ca đêm</option><option value="3">3: Tăng ca</option><option value="4">4: Tăng ca đêm</option></select></div>
    <div class="form-row"><label>Line.Bơ</label><input type="text" id="fn5_linebo" placeholder="2226029.15015"></div>
  </div>
  <div class="modal-ftr">
    <button class="btn-cancel" onclick="hideModal('fn5-add')">Hủy</button>
    <button class="btn-ok" onclick="saveFn5Form()">Lưu</button>
  </div>`;

htmlContent = htmlContent.replace(/<div class="modal-body">[\s\S]*?<div class="modal-ftr">[\s\S]*?<\/div>/, newModalBody);

// Add validation script
const validationScript = `
    function saveFn5Form() {
      const cd = document.getElementById('fn5_congdoan').value;
      const dvt = document.getElementById('fn5_dvt').value.toLowerCase();
      let expectedDvt = cd === 'May tay áo' ? 'con' : 'kg';
      
      if (cd && cd !== '-- Chọn --' && dvt !== expectedDvt) {
        alert("LỖI NGHIỆP VỤ: Đơn vị tính [" + dvt + "] không khớp với cấu hình của công đoạn [" + cd + "] (" + expectedDvt + "). Vui lòng kiểm tra lại!");
        return false;
      }
      
      hideModal('fn5-add');
      alert("Lưu năng suất thành công!");
    }
  </script>`;

htmlContent = htmlContent.replace(/<\/script>/, validationScript);

fs.writeFileSync(htmlFile, htmlContent);
console.log("Updated fn5-khoa-cong.html");
