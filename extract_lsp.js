const fs = require('fs');
const content = fs.readFileSync('d:/MPHG_LNS_LSP/MPHG_LuongSanPham_Full.html', 'utf-8');

const pages = [
  { id: 'pg5', file: 'lsp/pg5-don-gia.html' },
  { id: 'pg6', file: 'lsp/pg6-ho-tro-he-so.html' },
  { id: 'pg7', file: 'lsp/pg7-ho-tro-bp.html' },
  { id: 'pg8', file: 'lsp/pg8-ho-tro-cd.html' },
  { id: 'pg9', file: 'lsp/pg9-he-so-hs123.html' }
];

pages.forEach(p => {
  const match = content.match(new RegExp(`<script type="text\\/html" id="${p.id}">([\\s\\S]*?)<\\/script>`, 'i'));
  if (match) {
    let html = match[1];
    
    // Replace styles
    html = html.replace(/<style>[\s\S]*?<\/style>/i, '<link rel="stylesheet" href="../shared/style.css">\n    <style>\n        /* Custom styles for ' + p.id + ' */\n    </style>');
    
    // Add Demo badge inside <div class="container">
    if (html.includes('<div class="container">')) {
        html = html.replace('<div class="container">', '<div class="container">\n    <div class="demo-badge">DEMO</div>');
    }
    
    // Add Ghi chú nghiệp vụ and Scripts before </body>
    const ghiChu = `
    <div style="margin-top:20px;border-top:2px dashed #ffd600;padding-top:15px;">
      <div style="font-weight:bold;color:#856404;margin-bottom:8px;font-size:12px;">
        📋 GHI CHÚ NGHIỆP VỤ (dành cho thẩm định)
      </div>
      <textarea rows="3" style="width:100%;border:1px dashed #ffd600;padding:8px;font-size:12px;font-family:Arial;background:#fffef0;resize:vertical;" placeholder="BA nhập ghi chú, open points, điểm cần xác nhận với khách hàng..."></textarea>
    </div>
    <script src="../shared/mockdata.js"><\/script>
    <script src="../shared/utils.js"><\/script>
`;
    html = html.replace('</body>', ghiChu + '</body>');
    
    // Ensure scripts refer to window.MOCK where possible (manual fixes might still be needed)
    
    fs.writeFileSync(`d:/MPHG_LNS_LSP/${p.file}`, html);
    console.log(`Extracted ${p.file}`);
  }
});
