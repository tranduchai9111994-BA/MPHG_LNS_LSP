const fs = require('fs');
let htmlFile = 'd:/MPHG_LNS_LSP/lns/fn5-khoa-cong.html';
let htmlContent = fs.readFileSync(htmlFile, 'utf-8');

// Replace table header
htmlContent = htmlContent.replace(/<thead>.*?<\/thead>/, `<thead><tr>
  <th>STT</th>
  <th>Mã BP</th>
  <th>Ka LV</th>
  <th>Ngày NL</th>
  <th>Lô</th>
  <th>Nhóm KS</th>
  <th>KL Bơ</th>
  <th>Quy cách SX</th>
  <th>Mã nội bộ</th>
  <th>Size nội bộ</th>
  <th>Quy cách tính lương</th>
  <th>Ngày LV</th>
  <th>TG bắt đầu</th>
  <th>Ngày cân</th>
  <th>Giờ cân</th>
  <th>gr/con</th>
  <th>con/khay</th>
  <th>KL</th>
  <th>Đơn vị tính</th>
  <th>NS Làm</th>
  <th>Line.Bơ</th>
</tr></thead>`);

// Replace table body
htmlContent = htmlContent.replace(/<tbody>[\s\S]*?<\/tbody>/, `<tbody>
      <tr>
        <td>1</td>
        <td>CB101</td>
        <td>1</td>
        <td>30/05/2026</td>
        <td>P0</td>
        <td>N1</td>
        <td>222</td>
        <td>LX PTO</td>
        <td style="font-family:monospace;font-weight:bold;">50524494</td>
        <td>VM 13/15</td>
        <td>WTHLXPTOHV0015</td>
        <td>15/07/2025</td>
        <td>13:00</td>
        <td>15/07/2025</td>
        <td>13:24</td>
        <td>0.00</td>
        <td>0.00</td>
        <td><b>520</b></td>
        <td style="color:#d32f2f;font-weight:bold;">kg</td>
        <td><span class="badge" style="background:#e3f2fd;color:#1565c0;">1: Trong ca</span></td>
        <td>2226029.15</td>
      </tr>
      <tr>
        <td>2</td>
        <td>CB102</td>
        <td>1</td>
        <td>30/05/2026</td>
        <td>P1</td>
        <td>N2</td>
        <td>100</td>
        <td>Nobashi</td>
        <td style="font-family:monospace;font-weight:bold;">50524445</td>
        <td>VM 16/20</td>
        <td>WTHLXPTOHV0016</td>
        <td>15/07/2025</td>
        <td>14:00</td>
        <td>15/07/2025</td>
        <td>14:30</td>
        <td>0.00</td>
        <td>0.00</td>
        <td><b>450</b></td>
        <td style="color:#d32f2f;font-weight:bold;">con</td>
        <td><span class="badge" style="background:#e8f5e9;color:#2e7d32;">2: Ca đêm</span></td>
        <td>2226029.16</td>
      </tr>
      <tr>
        <td>3</td>
        <td>CB103</td>
        <td>2</td>
        <td>31/05/2026</td>
        <td>P2</td>
        <td>N3</td>
        <td>150</td>
        <td>Sushi</td>
        <td style="font-family:monospace;font-weight:bold;">50524492</td>
        <td>VM 21/25</td>
        <td>WTHLXPTOHV0017</td>
        <td>16/07/2025</td>
        <td>08:00</td>
        <td>16/07/2025</td>
        <td>08:45</td>
        <td>0.00</td>
        <td>0.00</td>
        <td><b>390</b></td>
        <td style="color:#d32f2f;font-weight:bold;">kg</td>
        <td><span class="badge" style="background:#fff3e0;color:#ef6c00;">3: Tăng ca</span></td>
        <td>2226029.17</td>
      </tr>
    </tbody>`);

htmlContent = htmlContent.replace(/<div class="grid-wrap">/, `<div class="grid-wrap" style="overflow-x:auto;">`);

fs.writeFileSync(htmlFile, htmlContent);
console.log("Updated fn5-khoa-cong.html grid to 21 columns");
