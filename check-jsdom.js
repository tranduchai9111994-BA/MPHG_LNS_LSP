const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('d:\\MPHG_LNS_LSP\\lsp\\pg5-don-gia.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (e) => {
  console.log("JSDOM ERROR:", e);
});
virtualConsole.on("log", (msg) => {
  console.log("JSDOM LOG:", msg);
});
virtualConsole.on("warn", (msg) => {
  console.log("JSDOM WARN:", msg);
});

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "file:///d:/MPHG_LNS_LSP/lsp/pg5-don-gia.html",
  virtualConsole
});

dom.window.document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const rows = dom.window.document.querySelectorAll('#tableBody tr');
        console.log("Number of rows in tableBody:", rows.length);
        console.log("sampleData length:", dom.window.sampleData ? dom.window.sampleData.length : "undefined");
        if (dom.window.sampleData) console.log("sampleData:", dom.window.sampleData);
        process.exit(0);
    }, 1000);
});
