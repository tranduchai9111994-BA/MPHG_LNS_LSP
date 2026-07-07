const fs = require('fs');
let css = fs.readFileSync('shared/style.css', 'utf-8');

const badEdit = `   ============================================================= * GENERAL FORMATTING */
body { font-family: Arial, sans-serif; background-color: #f4f5f7; padding: 0; margin: 0; font-size: 12px; }
.container { padding: 15px 25px; background-color: #fdfdfd; min-height: calc(100vh - 100px); position: relative; }
.breadcrumb { font-size: 11px; color: #555; margin-bottom: 15px; }
.breadcrumb a { color: #555; text-decoration: none; }
.page-title { text-align: center; color: #0056b3; font-weight: bold; font-size: 22px; margin: 10px 0 25px 0; text-transform: uppercase; }

/* FIX DATE FORMAT dd/mm/yyyy GLOBALLY */
input[type="date"] {
    position: relative;
    color: transparent !important;
}
input[type="date"]::-webkit-datetime-edit {
    color: transparent !important;
}
input[type="date"]::before {
    content: attr(data-date);
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #333;
    pointer-events: none;
    font-family: inherit;
    font-size: 12px;
}
input[type="date"]:invalid::before,
input[type="date"][data-date=""]::before {
    content: 'dd/mm/yyyy';
    color: #999;
}`;

const goodEdit = `   ============================================================= */
.container {
  padding: 15px 25px;
  background-color: var(--color-content-bg);
  min-height: calc(100vh - 80px);
}

.page-wrap {
  padding: 15px 20px;
  background: #eef2f5;
  min-height: 100%;
}

.breadcrumb {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: 15px;
}

.breadcrumb a {
  color: var(--color-text-muted);
  text-decoration: none;
}

.page-title {
  text-align: center;
  color: var(--color-text-link);
  font-weight: bold;
  font-size: var(--font-size-page-title);
  margin: 10px 0 25px 0;
  text-transform: uppercase;
}`;

css = css.replace(badEdit, goodEdit);

const extraCSS = `

/* FIX DATE FORMAT dd/mm/yyyy GLOBALLY */
input[type="date"] {
    position: relative;
    color: transparent !important;
}
input[type="date"]::-webkit-datetime-edit {
    color: transparent !important;
}
input[type="date"]::before {
    content: attr(data-date);
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #333;
    pointer-events: none;
    font-family: inherit;
    font-size: var(--font-size-base);
}
input[type="date"]:invalid::before,
input[type="date"][data-date=""]::before {
    content: 'dd/mm/yyyy';
    color: #999;
}
`;

if (!css.includes('/* FIX DATE FORMAT dd/mm/yyyy GLOBALLY */')) {
   css += extraCSS;
}

fs.writeFileSync('shared/style.css', css);
console.log('Restored and appended CSS successfully.');
