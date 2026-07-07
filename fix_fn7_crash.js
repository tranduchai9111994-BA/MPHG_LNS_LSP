const fs = require('fs');
let htmlFile = 'd:/MPHG_LNS_LSP/lns/fn7-nhom-dv-cap5.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

// Fix stat card counter assignments
htmlContent = htmlContent.replace(/document\.getElementById\('fn7-stat-a'\)\.textContent = cntA;/g, 
  "document.getElementById('fn7-stat-th1').textContent = cntTH1; document.getElementById('fn7-stat-th2').textContent = cntTH2;");
htmlContent = htmlContent.replace(/document\.getElementById\('fn7-stat-b'\)\.textContent = cntB;/g, 
  "document.getElementById('fn7-stat-th3').textContent = cntTH3;");
htmlContent = htmlContent.replace(/document\.getElementById\('fn7-stat-c'\)\.textContent = cntC;/g, 
  "document.getElementById('fn7-stat-th4').textContent = cntTH4;");

// Fix the detail button for TH3
htmlContent = htmlContent.replace(/\$\{row\.loai==='TH4'\?`<br><button class="btn-detail-row"/g, 
  "${(row.loai==='TH3' || row.loai==='TH4')?`<br><button class=\"btn-detail-row\"");

fs.writeFileSync(htmlFile, htmlContent);
console.log("Fixed JS ReferenceError and TH3 button");
