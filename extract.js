const fs = require('fs');
const content = fs.readFileSync('d:/MPHG_LNS_LSP/MPHG_LuongSanPham_Full.html', 'utf-8');

const regex = /(?:const|var|let)\s+(\w+)\s*=\s*(\[[^\]]*\]|\{[^\}]*\})\s*;/gs;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log('--- ' + match[1] + ' ---');
  let data = match[2];
  if (data.length > 500) data = data.substring(0, 500) + '... (truncated)';
  console.log(data);
}
