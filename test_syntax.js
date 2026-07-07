const fs = require('fs');
const content = fs.readFileSync('d:\\MPHG_LNS_LSP\\lsp\\pg9-he-so-hs123.html', 'utf8');
const scriptMatch = content.match(/<script>\s*([\s\S]*?)<\/script>/);
if (scriptMatch) {
    const js = scriptMatch[1];
    try {
        new Function(js);
        console.log("Syntax is OK!");
    } catch (e) {
        console.error("Syntax Error: " + e.message);
    }
} else {
    console.log("Script not found");
}
