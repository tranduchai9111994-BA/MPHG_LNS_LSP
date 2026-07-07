const fs = require('fs');
const fullPath = 'd:/MPHG_LNS_LSP/MPHG_LuongSanPham_Full.html';
const pg2Path = 'd:/MPHG_LNS_LSP/lsp/pg2-tinh-lsp.html';

const fullContent = fs.readFileSync(fullPath, 'utf8');
const pg2Content = fs.readFileSync(pg2Path, 'utf8');

const startMarker = '<script type="text/html" id="pg2">';
const endMarker = '</script>\n<script type="text/html" id="pg3">';

const startIndex = fullContent.indexOf(startMarker);
const endIndex = fullContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newFullContent = fullContent.substring(0, startIndex + startMarker.length) + '\n' + pg2Content + '\n' + fullContent.substring(endIndex);
    fs.writeFileSync(fullPath, newFullContent);
    console.log('Successfully synced pg2-tinh-lsp.html into MPHG_LuongSanPham_Full.html');
} else {
    console.error('Markers not found');
}
