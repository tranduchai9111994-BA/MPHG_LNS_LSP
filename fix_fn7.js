const fs = require('fs');
let file = 'd:/MPHG_LNS_LSP/lns/fn7-nhom-dv-cap5.html';
let content = fs.readFileSync(file, 'utf-8');

// 1. Column header
content = content.replace(/<th>Làm dùm cho \/ Tỷ lệ<\/th>/, '<th>Mapping đơn vị (Chung NS / Làm dùm)</th>');

// 2. Radio group block
const oldRadioGroupRegex = /<div class="nhom-radio-group" id="fn7-nhom-group">[\s\S]*?<\/div>\s*<!-- Panel B -->/;
const newRadioGroup = `<div class="nhom-radio-group" id="fn7-nhom-group" style="display:flex;gap:10px;margin-bottom:15px;">
          <label class="nhom-radio-item" style="cursor:pointer;"><input type="radio" name="fn7_nhom" value="TH1" checked onchange="fn7SwitchNhom('TH1')"> <b>TH1</b> - Năng suất riêng</label>
          <label class="nhom-radio-item" style="cursor:pointer;"><input type="radio" name="fn7_nhom" value="TH2" onchange="fn7SwitchNhom('TH2')"> <b>TH2</b> - NS chung (1 ĐV)</label>
          <label class="nhom-radio-item" style="cursor:pointer;"><input type="radio" name="fn7_nhom" value="TH3" onchange="fn7SwitchNhom('TH3')"> <b>TH3</b> - NS chung (Nhiều ĐV)</label>
          <label class="nhom-radio-item" style="cursor:pointer;"><input type="radio" name="fn7_nhom" value="TH4" onchange="fn7SwitchNhom('TH4')"> <b>TH4</b> - Tách cho phụ</label>
        </div>
        <!-- Panels -->`;
content = content.replace(oldRadioGroupRegex, newRadioGroup);

// 3. Remove Panel B
const panelBRegex = /<div id="fn7-panel-B"[\s\S]*?<\/div>\s*<\/div>\s*<!-- Panel C/;
content = content.replace(panelBRegex, '<!-- Panel Map');

// 4. Update Panel C to Panel Map
const panelCRegex = /<div id="fn7-panel-C" class="nhom-panel">[\s\S]*?<div class="panel-title">.*?<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<!-- Ghi chú/;
const newPanelMap = `<div id="fn7-panel-map" class="nhom-panel" style="display:none;background:#f8f9fa;padding:10px;border:1px solid #ddd;border-radius:4px;">
          <div class="panel-title" style="font-weight:bold;margin-bottom:8px;color:#0056b3;">🔗 Chọn các ĐV cấp 5 để Mapping (TH3 / TH4)</div>
          <div style="font-size:10px;color:#666;margin-bottom:6px;">Hiển thị danh sách bàn để map năng suất.</div>
          <div class="ban-sx-search-wrap">
            <input type="text" id="fn7-bansx-search" placeholder="Tìm kiếm..." oninput="fn7RenderBanSXGrouped()">
          </div>
          <div class="ban-sx-list-wrap" id="fn7-ban-sx-list" style="max-height:150px;overflow-y:auto;border:1px solid #ccc;background:#fff;padding:5px;"></div>
        </div>
        <!-- Ghi chú`;
content = content.replace(panelCRegex, newPanelMap);

// 5. Update fn7SwitchNhom logic
const fn7SwitchRegex = /function fn7SwitchNhom\([\s\S]*?\}/;
const newFn7Switch = `function fn7SwitchNhom(loai) {
      document.getElementById('fn7-panel-map').style.display = (loai === 'TH3' || loai === 'TH4') ? 'block' : 'none';
      if(loai === 'TH3' || loai === 'TH4') fn7RenderBanSXGrouped();
    }`;
content = content.replace(fn7SwitchRegex, newFn7Switch);

// 6. Update RenderGrid to make TH3 render identically to TH4
const renderLamDumRegex = /\} else if \(row\.loai === 'TH3'\) \{[\s\S]*?\} else if \(row\.loai === 'TH4'\) \{/;
const newRenderLamDum = `} else if (row.loai === 'TH3' || row.loai === 'TH4') {`;
content = content.replace(renderLamDumRegex, newRenderLamDum);

// 7. Update Mock Data for TH3
const mockDataRegex = /loai:'B',\s*pct_giu:70,\s*lam_dum:\[\],\s*ngay_hl:'01\/07\/2026',\s*ngay_kt:null,\s*ghi_chu:'Thử nghiệm 70\/30'/;
const newMockData = `loai:'TH3', pct_giu:null, lam_dum:['DV5_LAT_KC', 'DV5_PHANC_KC'], ngay_hl:'01/07/2026', ngay_kt:null, ghi_chu:'Mapping chung năng suất 2 bàn'`;
content = content.replace(mockDataRegex, newMockData);

// 8. One more fix for loai:'B' to loai:'TH3' in Mock Data if any
content = content.replace(/loai:'B'/g, "loai:'TH3'");

// 9. Fix fn7ShowHT button inside grid for TH3
content = content.replace(/\$\{row\.loai==='TH4'\?'<br><button class="btn-detail-row"/g, "${(row.loai==='TH3'||row.loai==='TH4')?'<br><button class=\"btn-detail-row\"");

fs.writeFileSync(file, content);
console.log("Fixed TH3 logic in fn7-nhom-dv-cap5.html");
