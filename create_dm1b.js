const fs = require('fs');
let content = fs.readFileSync('d:/MPHG_LNS_LSP/lns/dm3-loai-tom.html', 'utf-8');

content = content.replace(/Danh mục Loại Tôm/g, 'Danh mục Đơn vị tính');
content = content.replace(/DANH MỤC LOẠI TÔM/g, 'DANH MỤC ĐƠN VỊ TÍNH');
content = content.replace(/Mã Tôm/g, 'Mã ĐVT');
content = content.replace(/Loại Tôm/g, 'Tên ĐVT');
content = content.replace(/Tên loại tôm\.\.\. VD: Sú, Wct, Sắt/g, 'Tên đơn vị tính... VD: Kg, Con, Thùng');
content = content.replace(/Unique\. Không dấu, không khoảng trắng\. VD: T, W, C/g, 'Unique. Không dấu, không khoảng trắng. VD: KG, CON');
content = content.replace(/dm3/g, 'dm1b');
content = content.replace(/DM3/g, 'DM1B');
content = content.replace(/› Loại Tôm/g, '› Đơn vị tính');

// Update mock data
content = content.replace(/let dm1bData = \[[\s\S]*?\];/, `let dm1bData = [
      { id:1, ma:'KG', loai:'Kg',  note:'Kilogram',      use:true },
      { id:2, ma:'CON', loai:'Con', note:'Con',   use:true },
      { id:3, ma:'THUNG', loai:'Thùng', note:'Thùng', use:true },
      { id:4, ma:'LIT', loai:'Lít', note:'Lít', use:true },
      { id:5, ma:'MIENG', loai:'Miếng', note:'Miếng', use:true },
      { id:6, ma:'KHAY', loai:'Khay', note:'Khay', use:true }
    ];`);
content = content.replace(/let dm1bNextId = 4;/, `let dm1bNextId = 7;`);

// Update example table
content = content.replace(/<tbody\s*>\s*<tr style="background:#fff;">[\s\S]*?<\/tbody>/, `<tbody>
      <tr style="background:#fff;">
        <td style="padding:4px 8px;border:1px solid #ffd600;text-align:center;">1</td>
        <td style="padding:4px 8px;border:1px solid #ffd600;text-align:center;font-weight:bold;">KG</td>
        <td style="padding:4px 8px;border:1px solid #ffd600;">Kg</td>
        <td style="padding:4px 8px;border:1px solid #ffd600;color:#555;">Kilogram</td>
      </tr>
      <tr style="background:#fffde7;">
        <td style="padding:4px 8px;border:1px solid #ffd600;text-align:center;">2</td>
        <td style="padding:4px 8px;border:1px solid #ffd600;text-align:center;font-weight:bold;">CON</td>
        <td style="padding:4px 8px;border:1px solid #ffd600;">Con</td>
        <td style="padding:4px 8px;border:1px solid #ffd600;color:#555;">Tính theo số con</td>
      </tr>
      <tr style="background:#fff;">
        <td style="padding:4px 8px;border:1px solid #ffd600;text-align:center;">3</td>
        <td style="padding:4px 8px;border:1px solid #ffd600;text-align:center;font-weight:bold;">THUNG</td>
        <td style="padding:4px 8px;border:1px solid #ffd600;">Thùng</td>
        <td style="padding:4px 8px;border:1px solid #ffd600;color:#555;">Thùng tiêu chuẩn</td>
      </tr>
    </tbody>`);

fs.writeFileSync('d:/MPHG_LNS_LSP/lns/dm1b-don-vi-tinh.html', content);
console.log("Created dm1b-don-vi-tinh.html");
