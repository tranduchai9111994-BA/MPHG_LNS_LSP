const fs = require('fs');
let content = fs.readFileSync('d:/MPHG_LNS_LSP/lns/dm4-loai-nl.html', 'utf-8');

// Global replaces
content = content.replace(/dm4/g, 'dm7');
content = content.replace(/DM4/g, 'DM7');
content = content.replace(/Danh mục Loại nguyên liệu/g, 'Danh mục Mã quy cách');
content = content.replace(/DANH MỤC LOẠI NGUYÊN LIỆU/g, 'DANH MỤC MÃ QUY CÁCH');
content = content.replace(/Loại nguyên liệu/g, 'Quy cách');

// Form grid layout for dm7
content = content.replace(
  /<div class="form-grid-2col">[\s\S]*?<\/div>/,
  `<div class="form-grid-2col">
      <label class="lbl-red">Mã quy cách</label>
      <div class="input-wrap"><input type="text" id="dm7_ma" maxlength="20" placeholder="Nhập mã..." oninput="this.value = this.value.replace(/\\s/g, '')"><div class="input-note">Bắt buộc. Viết liền không có khoảng trắng. VD: LXPTO, NBN</div></div>
      <label>Đơn giá</label>
      <div class="input-wrap"><input type="number" id="dm7_dongia" placeholder="0"><div class="input-note">Không bắt buộc nhập (VNĐ)</div></div>
      <label>Ghi chú</label>
      <textarea id="dm7_note" maxlength="500" style="height:50px;" placeholder="Nhập ghi chú..."></textarea>
      <label></label>
      <label style="display:flex;align-items:center;gap:6px;font-weight:normal;cursor:pointer;"><input type="checkbox" id="dm7_use" checked> Sử dụng?</label>
    </div>`
);

// Table Header
content = content.replace(/<th>Mã NL<\/th><th>Quy cách<\/th>/, `<th>Mã quy cách</th><th>Đơn giá</th>`);

// Table example
content = content.replace(/<table style="width:100%;border-collapse:collapse;font-size:11px;">[\s\S]*?<\/table>/,
`<table style="width:100%;border-collapse:collapse;font-size:11px;">
    <thead>
      <tr style="background:#c8e6c9;">
        <th style="padding:5px 8px;text-align:center;border:1px solid #a5d6a7;width:36px;">STT</th>
        <th style="padding:5px 8px;text-align:center;border:1px solid #a5d6a7;width:120px;">Mã quy cách</th>
        <th style="padding:5px 8px;text-align:right;border:1px solid #a5d6a7;">Đơn giá</th>
        <th style="padding:5px 8px;text-align:left;border:1px solid #a5d6a7;">Ghi chú</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background:#fff;">
        <td style="padding:4px 8px;border:1px solid #a5d6a7;text-align:center;">1</td>
        <td style="padding:4px 8px;border:1px solid #a5d6a7;text-align:center;font-weight:bold;color:#1565c0;">LXPTO</td>
        <td style="padding:4px 8px;border:1px solid #a5d6a7;text-align:right;">1,200</td>
        <td style="padding:4px 8px;border:1px solid #a5d6a7;color:#555;">Lặt xẻ PTO</td>
      </tr>
    </tbody>
  </table>`
);

content = content.replace(/<li>Mã NL dùng để phân loại.*?<\/li>/, '<li>Mã quy cách bắt buộc viết liền không dấu khoảng trắng.</li>');
content = content.replace(/<li>Quy cách ảnh hưởng đến.*?<\/li>/, '<li>Đơn giá là tuỳ chọn, có thể bỏ trống nếu không áp dụng.</li>');

// Javascript Mock data
content = content.replace(
  /let dm7Data = \[[\s\S]*?\];/,
  `let dm7Data = [
      { id:1, ma:'LXPTO', dongia:1200, note:'Lặt xẻ PTO', use:true },
      { id:2, ma:'NBN',   dongia:'',   note:'Nobashi N',  use:true },
      { id:3, ma:'SUSH',  dongia:1500, note:'Sushi',      use:true }
    ];`
);

// Render function
content = content.replace(
  /function dm7Render\(\) \{[\s\S]*?const tbody = document\.getElementById\('dm7-tbody'\);[\s\S]*?tbody\.innerHTML \+= `<tr>[\s\S]*?<td>\$\{r\.loai\}<\/td>[\s\S]*?<\/tr>`;\s*\}\);\s*\}/,
  `function dm7Render() {
      const tbody = document.getElementById('dm7-tbody');
      tbody.innerHTML = '';
      dm7Data.forEach((r, i) => {
        const trClass = !r.use ? 'class="inactive"' : '';
        tbody.innerHTML += \`<tr \${trClass}>
          <td><input type="checkbox" class="dm7-chk"></td>
          <td><button class="btn-edit-row" onclick="fn7Alert('info','Chức năng Sửa đang hoàn thiện.')">✎</button></td>
          <td>\${i+1}</td>
          <td style="font-weight:bold;color:#0056b3">\${r.ma}</td>
          <td style="text-align:right;">\${r.dongia ? Number(r.dongia).toLocaleString() : ''}</td>
          <td class="tl">\${r.note}</td>
          <td><span class="\${r.use ? 'status-active' : 'status-inactive'}">\${r.use ? 'Sử dụng' : 'Ngưng'}</span></td>
        </tr>\`;
      });
    }`
);

// Map save logic
content = content.replace(/const loai = document\.getElementById\('dm7_loai'\)\.value\.trim\(\);/, "const dongia = document.getElementById('dm7_dongia').value.trim();");
content = content.replace(/if\(!ma \|\| !loai\)/, "if(!ma)");
content = content.replace(/loai: loai,/, "dongia: dongia,");
content = content.replace(/document\.getElementById\('dm7_loai'\)\.value = '';/, "document.getElementById('dm7_dongia').value = '';");

fs.writeFileSync('d:/MPHG_LNS_LSP/lns/dm7-quy-cach.html', content);
console.log('Created dm7-quy-cach.html successfully!');
