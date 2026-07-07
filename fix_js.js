const fs = require('fs');
let js = fs.readFileSync('shared/utils.js', 'utf-8');

// Modify autoFillPeriod to dispatch 'change' event
js = js.replace(
`    if (fromEl) {
        fromEl.value = firstDay;
    }
    if (toEl) {
        toEl.value = lastDay;
    }`,
`    if (fromEl) {
        fromEl.value = firstDay;
        fromEl.dispatchEvent(new Event('change'));
    }
    if (toEl) {
        toEl.value = lastDay;
        toEl.dispatchEvent(new Event('change'));
    }`
);

const newJS = `

/**
 * Global initialization for date formatting to dd/mm/yyyy
 * Relies on CSS trick using ::before and attr(data-date)
 */
function initDateFormats() {
    document.querySelectorAll('input[type="date"]').forEach(inp => {
        inp.addEventListener('change', function() {
            if (this.value) {
                const parts = this.value.split('-');
                if (parts.length === 3) {
                    this.setAttribute('data-date', parts[2] + '/' + parts[1] + '/' + parts[0]);
                }
            } else {
                this.setAttribute('data-date', '');
            }
        });
        // Initial setup
        if (inp.value) {
            inp.dispatchEvent(new Event('change'));
        }
    });
}

document.addEventListener('DOMContentLoaded', initDateFormats);
`;

if (!js.includes('initDateFormats')) {
   js += newJS;
}

fs.writeFileSync('shared/utils.js', js);
console.log('Appended JS successfully.');
