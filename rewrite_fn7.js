const fs = require('fs');
let htmlFile = 'd:/MPHG_LNS_LSP/lns/fn7-nhom-dv-cap5.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

// 1. Note alert
htmlContent = htmlContent.replace(
  /<b style="color:#28a745">A – Trực tiếp<\/b>, <b style="color:#856404">B – Chia nhóm<\/b>, hoặc <b style="color:#880e4f">C – Làm dùm<\/b>/,
  '<b style="color:#28a745">TH1 – Năng suất riêng</b>, <b style="color:#007bff">TH2 – Năng suất chung (1 đơn vị)</b>, <b style="color:#ffc107">TH3 – Năng suất chung (Nhiều đơn vị)</b>, hoặc <b style="color:#e91e63">TH4 – Năng suất chung (Tách cho phụ)</b>'
);

// 2. Dropdown
htmlContent = htmlContent.replace(
  /<option value="A">A – Trực tiếp<\/option>\s*<option value="B">B – Chia nhóm<\/option>\s*<option value="C">C – Làm dùm<\/option>/,
  `<option value="TH1">TH1 – Năng suất riêng</option>
          <option value="TH2">TH2 – Năng suất chung (1 đơn vị)</option>
          <option value="TH3">TH3 – Năng suất chung (Nhiều đơn vị)</option>
          <option value="TH4">TH4 – Năng suất chung (Tách cho phụ)</option>`
);

// 3. Stat cards
htmlContent = htmlContent.replace(
  /grid-template-columns:repeat\(4,1fr\)/,
  'grid-template-columns:repeat(5,1fr)'
);
htmlContent = htmlContent.replace(
  /<div class="stat-card c-a">Loại A – Trực tiếp<b id="fn7-stat-a">3<\/b><\/div>\s*<div class="stat-card c-b">Loại B – Chia nhóm<b id="fn7-stat-b">1<\/b><\/div>\s*<div class="stat-card c-c">Loại C – Làm dùm<b id="fn7-stat-c">2<\/b><\/div>/,
  `<div class="stat-card c-th1">TH1 – Năng suất riêng<b id="fn7-stat-th1">3</b></div>
      <div class="stat-card c-th2">TH2 – Chung (1 ĐV)<b id="fn7-stat-th2">0</b></div>
      <div class="stat-card c-th3">TH3 – Chung (Nhiều ĐV)<b id="fn7-stat-th3">1</b></div>
      <div class="stat-card c-th4">TH4 – Tách phụ<b id="fn7-stat-th4">2</b></div>`
);

// 4. CSS badges
htmlContent = htmlContent.replace(/\.badge-nhom\.A/g, '.badge-nhom.TH1');
htmlContent = htmlContent.replace(/\.badge-nhom\.B/g, '.badge-nhom.TH3'); // mapping B to TH3
htmlContent = htmlContent.replace(/\.badge-nhom\.C/g, '.badge-nhom.TH4');
htmlContent = htmlContent.replace(/\.stat-card\.c-a/g, '.stat-card.c-th1');
htmlContent = htmlContent.replace(/\.stat-card\.c-b/g, '.stat-card.c-th3');
htmlContent = htmlContent.replace(/\.stat-card\.c-c/g, '.stat-card.c-th4');

// Add TH2 CSS if needed
htmlContent = htmlContent.replace(/\.badge-nhom\.TH1 \{ background:#d4edda; color:#155724; \}/,
  `.badge-nhom.TH1 { background:#d4edda; color:#155724; }
    .badge-nhom.TH2 { background:#cce5ff; color:#004085; }`);
htmlContent = htmlContent.replace(/\.stat-card\.c-th1 b \{ color:#28a745; \}/,
  `.stat-card.c-th1 b { color:#28a745; }
    .stat-card.c-th2 b { color:#007bff; }`);

// 5. JS logical replacements in Mock Data
htmlContent = htmlContent.replace(/loai:'A'/g, "loai:'TH1'");
htmlContent = htmlContent.replace(/loai:'B'/g, "loai:'TH3'");
htmlContent = htmlContent.replace(/loai:'C'/g, "loai:'TH4'");

htmlContent = htmlContent.replace(/row\.loai === 'A'/g, "row.loai === 'TH1' || row.loai === 'TH2'");
htmlContent = htmlContent.replace(/row\.loai === 'B'/g, "row.loai === 'TH3'");
htmlContent = htmlContent.replace(/row\.loai === 'C'/g, "row.loai === 'TH4'");

htmlContent = htmlContent.replace(/cntA = 0, cntB = 0, cntC = 0/g, "cntTH1 = 0, cntTH2 = 0, cntTH3 = 0, cntTH4 = 0");
htmlContent = htmlContent.replace(/cntA\+\+/g, "cntTH1++");
htmlContent = htmlContent.replace(/cntB\+\+/g, "cntTH3++");
htmlContent = htmlContent.replace(/cntC\+\+/g, "cntTH4++");
// We need to count TH2 also, so let's update fn7RenderGrid completely.
htmlContent = htmlContent.replace(/if \(row\.loai === 'TH4'\) cntTH4\+\+;/, "if (row.loai === 'TH4') cntTH4++; else if (row.loai === 'TH2') cntTH2++; else if (row.loai === 'TH3') cntTH3++; else cntTH1++;");
// Wait, the original code had:
// if(row.loai==='A') cntA++; else if(row.loai==='B') cntB++; else if(row.loai==='C') cntC++;
htmlContent = htmlContent.replace(/if\s*\(row\.loai\s*===\s*'A'\)\s*cntTH1\+\+;\s*else\s*if\s*\(row\.loai\s*===\s*'B'\)\s*cntTH3\+\+;\s*else\s*if\s*\(row\.loai\s*===\s*'C'\)\s*cntTH4\+\+;/,
  "if(row.loai==='TH1') cntTH1++; else if(row.loai==='TH2') cntTH2++; else if(row.loai==='TH3') cntTH3++; else if(row.loai==='TH4') cntTH4++;");
htmlContent = htmlContent.replace(/if\(row\.loai==='A'\) cntA\+\+;\s*else if\(row\.loai==='B'\) cntB\+\+;\s*else if\(row\.loai==='C'\) cntC\+\+;/g,
  "if(row.loai==='TH1') cntTH1++; else if(row.loai==='TH2') cntTH2++; else if(row.loai==='TH3') cntTH3++; else if(row.loai==='TH4') cntTH4++;");

htmlContent = htmlContent.replace(/document\.getElementById\('fn7-stat-a'\)\.innerText = cntA;/g, 
  "document.getElementById('fn7-stat-th1').innerText = cntTH1; document.getElementById('fn7-stat-th2').innerText = cntTH2;");
htmlContent = htmlContent.replace(/document\.getElementById\('fn7-stat-b'\)\.innerText = cntB;/g, 
  "document.getElementById('fn7-stat-th3').innerText = cntTH3;");
htmlContent = htmlContent.replace(/document\.getElementById\('fn7-stat-c'\)\.innerText = cntC;/g, 
  "document.getElementById('fn7-stat-th4').innerText = cntTH4;");

// Labels for group logic
htmlContent = htmlContent.replace(/let loaiLbl = '';/g, `let loaiLbl = '';
      if(row.loai === 'TH1') loaiLbl = 'TH1: Năng suất riêng';
      else if(row.loai === 'TH2') loaiLbl = 'TH2: Năng suất chung (1 ĐV)';
      else if(row.loai === 'TH3') loaiLbl = 'TH3: Năng suất chung (Nhiều ĐV)';
      else if(row.loai === 'TH4') loaiLbl = 'TH4: Năng suất chung (Tách phụ)';`);
htmlContent = htmlContent.replace(/if\s*\(row\.loai\s*===\s*'TH1'\s*\|\|\s*row\.loai\s*===\s*'TH2'\)\s*loaiLbl\s*=\s*'A – Trực tiếp';/g, "");
htmlContent = htmlContent.replace(/else\s*if\s*\(row\.loai\s*===\s*'TH3'\)\s*loaiLbl\s*=\s*'B – Chia nhóm';/g, "");
htmlContent = htmlContent.replace(/else\s*if\s*\(row\.loai\s*===\s*'TH4'\)\s*loaiLbl\s*=\s*'C – Làm dùm';/g, "");

// Dropdown in Modal Form!
htmlContent = htmlContent.replace(/<input type="radio" name="fn7-loai" id="fn7-loai-a" value="A" checked onchange="fn7ToggleConfig\(\)">\s*<label for="fn7-loai-a">A – Trực tiếp<\/label>\s*<input type="radio" name="fn7-loai" id="fn7-loai-b" value="B" onchange="fn7ToggleConfig\(\)">\s*<label for="fn7-loai-b">B – Chia nhóm<\/label>\s*<input type="radio" name="fn7-loai" id="fn7-loai-c" value="C" onchange="fn7ToggleConfig\(\)">\s*<label for="fn7-loai-c">C – Làm dùm<\/label>/,
  `<input type="radio" name="fn7-loai" id="fn7-loai-th1" value="TH1" checked onchange="fn7ToggleConfig()">
          <label for="fn7-loai-th1">TH1</label>
          <input type="radio" name="fn7-loai" id="fn7-loai-th2" value="TH2" onchange="fn7ToggleConfig()">
          <label for="fn7-loai-th2">TH2</label>
          <input type="radio" name="fn7-loai" id="fn7-loai-th3" value="TH3" onchange="fn7ToggleConfig()">
          <label for="fn7-loai-th3">TH3</label>
          <input type="radio" name="fn7-loai" id="fn7-loai-th4" value="TH4" onchange="fn7ToggleConfig()">
          <label for="fn7-loai-th4">TH4</label>`
);

htmlContent = htmlContent.replace(/document\.getElementById\('fn7-loai-a'\)\.checked = true;/g, "document.getElementById('fn7-loai-th1').checked = true;");
htmlContent = htmlContent.replace(/document\.getElementById\('fn7-loai-b'\)\.checked = true;/g, "document.getElementById('fn7-loai-th3').checked = true;");
htmlContent = htmlContent.replace(/document\.getElementById\('fn7-loai-c'\)\.checked = true;/g, "document.getElementById('fn7-loai-th4').checked = true;");
htmlContent = htmlContent.replace(/const loai = document\.querySelector\('input\[name="fn7-loai"\]:checked'\)\.value;/g, "const loai = document.querySelector('input[name=\"fn7-loai\"]:checked').value;");

// Update fn7ToggleConfig function to handle TH1, TH2, TH3, TH4 correctly
htmlContent = htmlContent.replace(/function fn7ToggleConfig\(\) \{[\s\S]*?const loai = document\.querySelector\('input\[name="fn7-loai"\]:checked'\)\.value;[\s\S]*?document\.getElementById\('fn7-cfg-b'\)\.style\.display = loai === 'B' \? 'block' : 'none';[\s\S]*?document\.getElementById\('fn7-cfg-c'\)\.style\.display = loai === 'C' \? 'block' : 'none';[\s\S]*?\}/,
  `function fn7ToggleConfig() {
      const loai = document.querySelector('input[name="fn7-loai"]:checked').value;
      document.getElementById('fn7-cfg-b').style.display = loai === 'TH3' ? 'block' : 'none';
      document.getElementById('fn7-cfg-c').style.display = loai === 'TH4' ? 'block' : 'none';
    }`);

// Also fix row styles
htmlContent = htmlContent.replace(/row\.loai === 'TH4'/g, "row.loai === 'TH4'");

// Add a mock data item for TH2
htmlContent = htmlContent.replace(/ghi_chu:'' \},/i, `ghi_chu:'' },
    { ma:'DV5_DONG_KS', ten:'Đóng gói Ka Sáng', ka:'Ka Sáng', ka_id:'KA_SANG', loai:'TH2', pct_giu:null, lam_dum:[], ngay_hl:'01/07/2026', ngay_kt:null, ghi_chu:'Test TH2' },`);

fs.writeFileSync(htmlFile, htmlContent);
console.log("Refactored 3 groups into 4 groups");
