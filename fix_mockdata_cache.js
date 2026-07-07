const fs = require('fs');

const files = [
  'lsp/pg5-don-gia.html',
  'lsp/pg7-ho-tro-bp.html',
  'lsp/pg8-ho-tro-cd.html',
  'lsp/pg9-he-so-hs123.html'
];
const map = {
  'pg5-don-gia.html': 'donGia',
  'pg7-ho-tro-bp.html': 'hoTroBP',
  'pg8-ho-tro-cd.html': 'hoTroCD',
  'pg9-he-so-hs123.html': 'heSoHS'
};

for (const file of files) {
  const filepath = 'd:\\MPHG_LNS_LSP\\' + file;
  let content = fs.readFileSync(filepath, 'utf8');
  let basename = file.split('/').pop();
  let prop = map[basename];
  let varName = (basename === 'pg5-don-gia.html' || basename === 'pg7-ho-tro-bp.html') ? 'sampleData' : 'mockData';
  
  content = content.replace(new RegExp(`let ${varName} = window\\.MOCK \\? \\[\\.\\.\\.window\\.MOCK\\.lsp\\.${prop}\\] : \\[\\];`), `let ${varName} = [];`);
  
  content = content.replace(/\n\s*renderTable\(\);\n\s*function toggleAll/, `\n    document.addEventListener("DOMContentLoaded", () => {
        if(window.MOCK && window.MOCK.lsp && window.MOCK.lsp.${prop}) {
            ${varName} = [...window.MOCK.lsp.${prop}];
        }
        renderTable();
    });\n    function toggleAll`);
    
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Fixed', file);
}

// Fix index.html cache busting
let idxContent = fs.readFileSync('d:\\MPHG_LNS_LSP\\index.html', 'utf8');
idxContent = idxContent.replace(
    /const src = itemEl\.getAttribute\('data-src'\);\n\s*const title = itemEl\.getAttribute\('data-title'\);/,
    `const src = itemEl.getAttribute('data-src') + '?v=' + new Date().getTime();\n         const title = itemEl.getAttribute('data-title');`
);
fs.writeFileSync('d:\\MPHG_LNS_LSP\\index.html', idxContent, 'utf8');
console.log('Fixed index.html');
