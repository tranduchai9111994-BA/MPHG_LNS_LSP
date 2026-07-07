const fs = require('fs');

const content = fs.readFileSync('d:/MPHG_LNS_LSP/MPHG_LuongSanPham_Full.html', 'utf-8');

const tabs = ['sys1','sys2','sys3','sys4','dm1','dm2','tl1','fn1','fn2','fn3','fn4','fn5','fn8'];
const tabMap = {
  'sys1': 'lns/sys1-cau-hinh-hsld.html',
  'sys2': 'lns/sys2-bspv.html',
  'sys3': 'lns/sys3-hsld-thang.html',
  'sys4': 'lns/sys4-bspv-thang.html',
  'dm1':  'lns/dm1-tien-trinh.html',
  'dm2':  'lns/dm2-cong-doan.html',
  'tl1':  'lns/tl1-ngay-lam-viec.html',
  'fn1':  'lns/fn1-tao-ky.html',
  'fn2':  'lns/fn2-import-san-luong.html',
  'fn3':  'lns/fn3-hs-nhan-vien.html',
  'fn4':  'lns/fn4-chot-san-luong.html',
  'fn5':  'lns/fn5-khoa-cong.html',
  'fn8':  'lns/fn8-mo-khoa.html'
};

const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>\n<\/body>\n<\/html>/);
const fullScript = scriptMatch ? scriptMatch[1] : '';

const template = (id, innerHtml, customScript) => `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MINH PHU – Lương Năng Suất</title>
    <link rel="stylesheet" href="../shared/style.css">
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
${innerHtml}
    <div style="margin-top:20px;border-top:2px dashed #ffd600;padding-top:15px;">
      <div style="font-weight:bold;color:#856404;margin-bottom:8px;font-size:12px;">
        📋 GHI CHÚ NGHIỆP VỤ (dành cho thẩm định)
      </div>
      <textarea rows="3" style="width:100%;border:1px dashed #ffd600;padding:8px;font-size:12px;font-family:Arial;background:#fffef0;resize:vertical;" placeholder="BA nhập ghi chú, open points, điểm cần xác nhận với khách hàng..."></textarea>
    </div>
  </div>
  <script src="../shared/mockdata.js"></script>
  <script src="../shared/utils.js"></script>
  <script>
    // General Utils
    function showModal(id) { const e = document.getElementById(id); if(e) e.style.display = 'flex'; }
    function hideModal(id) { const e = document.getElementById(id); if(e) e.style.display = 'none'; }
    function showAlert2(id, msg, type) {
      const b = document.getElementById(id);
      if(!b) return;
      b.className = 'alert-box alert-' + type;
      b.innerHTML = msg;
      b.style.display = 'block';
      if (type !== 'error') setTimeout(() => b.style.display = 'none', 4000);
    }
    function toggleAll(masterChk, selector) {
      const checked = document.getElementById(masterChk).checked;
      document.querySelectorAll(selector).forEach(c => c.checked = checked);
    }
    function toggleCollapse(id) {
      const el = document.getElementById(id);
      if(el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
    }

${customScript}
  </script>
</body>
</html>`;

tabs.forEach((id, index) => {
  const htmlMatch = content.match(new RegExp(`<div id="tab-${id}" class="tab-panel">([\\s\\S]*?)(?=<div id="tab-|</div>\\s*</div>\\s*</div>\\s*<script>)`, 'i'));
  
  if (htmlMatch) {
    let innerHtml = htmlMatch[1];
    innerHtml = innerHtml.replace('<div class="page-wrap">', '<div>');
    
    // Remove the trailing </div> which belonged to the tab-panel
    innerHtml = innerHtml.replace(/<\/div>\s*$/, '');
    
    let customScript = '';
    if (fullScript) {
      const lines = fullScript.split('\n');
      let insideFunc = false;
      lines.forEach(line => {
        if (!insideFunc && (line.includes(`function ${id}`) || line.includes(`const ${id}`) || line.includes(`let ${id}`))) {
          customScript += line + '\n';
          if (!line.includes('}') && line.includes('{')) {
             insideFunc = true;
          }
        } else if (insideFunc) {
          customScript += line + '\n';
          if (line.startsWith('}')) insideFunc = false;
        }
      });
      
      if (id === 'fn8') {
        const iifeMatch = fullScript.match(/\(function\(\) \{\s*const names[\s\S]*?\}\)\(\);/);
        if(iifeMatch) customScript += '\n' + iifeMatch[0];
      }
      if (id === 'fn3') {
        const rMatch = fullScript.match(/fn3Render\(\);/);
        if(rMatch) customScript += '\nfn3Render();';
      }
    }
    
    const finalHtml = template(id, innerHtml, customScript);
    fs.writeFileSync(`d:/MPHG_LNS_LSP/${tabMap[id]}`, finalHtml);
    console.log(`Extracted ${tabMap[id]}`);
  }
});
