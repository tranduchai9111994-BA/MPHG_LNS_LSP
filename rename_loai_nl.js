const fs = require('fs');

// 1. Update dm4-loai-nl.html
let htmlFile = 'd:/MPHG_LNS_LSP/lns/dm4-loai-nl.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

htmlContent = htmlContent.replace(/Danh mục Loại Năng Lượng/g, 'Danh mục Loại nguyên liệu');
htmlContent = htmlContent.replace(/Danh mục Loại NL/g, 'Danh mục Loại nguyên liệu');
htmlContent = htmlContent.replace(/› Loại NL/g, '› Loại nguyên liệu');
htmlContent = htmlContent.replace(/DANH MỤC LOẠI NL/g, 'DANH MỤC LOẠI NGUYÊN LIỆU');
htmlContent = htmlContent.replace(/<label class="lbl-red">Loại NL<\/label>/g, '<label class="lbl-red">Loại nguyên liệu</label>');
htmlContent = htmlContent.replace(/Tên loại NL\.\.\./g, 'Tên loại nguyên liệu...');
htmlContent = htmlContent.replace(/<th>Loại NL<\/th>/g, '<th>Loại nguyên liệu</th>');
htmlContent = htmlContent.replace(/UPDATE Loại NL/g, 'UPDATE Loại nguyên liệu');
htmlContent = htmlContent.replace(/Danh mục Loại NL/g, 'Danh mục Loại nguyên liệu');
htmlContent = htmlContent.replace(/<li>Loại NL/g, '<li>Loại nguyên liệu');
htmlContent = htmlContent.replace(/và Loại NL\./g, 'và Loại nguyên liệu.');
htmlContent = htmlContent.replace(/Loại NL thành công/g, 'Loại nguyên liệu thành công');

fs.writeFileSync(htmlFile, htmlContent);

// 2. Update nav-config.js
let navFile = 'd:/MPHG_LNS_LSP/nav-config.js';
let navContent = fs.readFileSync(navFile, 'utf-8');

navContent = navContent.replace(/"Loại NL"/g, '"Loại nguyên liệu"');

fs.writeFileSync(navFile, navContent);

console.log("Done updating labels.");
