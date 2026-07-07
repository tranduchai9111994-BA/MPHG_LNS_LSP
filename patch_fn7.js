const fs = require('fs');
let htmlFile = 'd:/MPHG_LNS_LSP/lns/fn7-nhom-dv-cap5.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

htmlContent = htmlContent.replace(/if\s*\(row\.loai\s*===\s*'TH1'\s*\|\|\s*row\.loai\s*===\s*'TH2'\)\s*cntTH1\+\+;\s*else\s*if\s*\(row\.loai\s*===\s*'TH3'\)\s*cntTH3\+\+;\s*else\s*cntTH4\+\+;/, 
  "if(row.loai==='TH1') cntTH1++; else if(row.loai==='TH2') cntTH2++; else if(row.loai==='TH3') cntTH3++; else if(row.loai==='TH4') cntTH4++;");

htmlContent = htmlContent.replace(/\$\{row\.loai==='A'\?'A – Trực tiếp':row\.loai==='B'\?'B – Chia nhóm':'C –[^<]*/, 
  "${row.loai==='TH1'?'TH1 – Năng suất riêng':row.loai==='TH2'?'TH2 – Năng suất chung (1 ĐV)':row.loai==='TH3'?'TH3 – Năng suất chung (Nhiều ĐV)':'TH4 – Năng suất chung (Tách phụ)'}");

htmlContent = htmlContent.replace(/\$\{row\.loai==='C'\?/g, "${row.loai==='TH4'?");

fs.writeFileSync(htmlFile, htmlContent);
console.log("Patched render function");
