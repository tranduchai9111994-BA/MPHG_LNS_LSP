/**
 * MPHG Luong San Pham - Shared Utility Functions
 * Extracted from MPHG_LuongSanPham_Full.html (pg1 through pg10)
 *
 * These functions appear in 2+ embedded pages with identical or near-identical logic.
 * Centralising them here eliminates duplication and ensures consistent behaviour.
 */

/**
 * Show an alert box by element ID, with a message and type (success/error/warning).
 * Auto-hides after the specified duration.
 * @param {string} boxId - The ID of the alert-box element.
 * @param {string} msg - HTML message to display inside the alert.
 * @param {string} type - CSS class suffix: "success", "error", or "warning".
 * @param {number} [autoHideMs=4000] - Milliseconds before auto-hide. Pass 0 to disable.
 */
function showAlert(boxId, msg, type, autoHideMs) {
    if (autoHideMs === undefined) {
        autoHideMs = 4000;
    }
    var box = document.getElementById(boxId);
    if (!box) {
        return;
    }
    box.style.display = 'block';
    box.className = 'alert-box alert-' + type;
    box.innerHTML = msg;
    if (autoHideMs > 0) {
        setTimeout(function () {
            box.style.display = 'none';
        }, autoHideMs);
    }
}

/**
 * Backward-compatible alias for showAlert.
 * Original signature used in pg10: showAlert2(id, msg, type).
 * Errors stay visible (no auto-hide); other types auto-hide after 4 seconds.
 * @param {string} id - The ID of the alert-box element.
 * @param {string} msg - HTML message to display.
 * @param {string} type - CSS class suffix: "success", "error", or "warning".
 */
function showAlert2(id, msg, type) {
    var autoHide = (type !== 'error') ? 4000 : 0;
    showAlert(id, msg, type, autoHide);
}

/**
 * Show a modal overlay by setting its display to 'flex'.
 * Assumes the modal element uses class="modal-overlay" with display:none by default.
 * @param {string} id - The ID of the modal-overlay element.
 */
function showModal(id) {
    var el = document.getElementById(id);
    if (el) {
        el.style.display = 'flex';
    }
}

/**
 * Hide a modal overlay by setting its display to 'none'.
 * @param {string} id - The ID of the modal-overlay element.
 */
function hideModal(id) {
    var el = document.getElementById(id);
    if (el) {
        el.style.display = 'none';
    }
}

/**
 * Toggle all child checkboxes using a master checkbox identified by its element ID.
 * Used in pg10 where the master checkbox ID and child selector are passed as strings.
 * @param {string} masterChkId - The ID of the master (header) checkbox element.
 * @param {string} childChkSelector - CSS selector for child checkboxes (e.g. '.chk-row').
 */
function toggleAll(masterChkId, childChkSelector) {
    var master = document.getElementById(masterChkId);
    if (!master) {
        return;
    }
    var checked = master.checked;
    var checkboxes = document.querySelectorAll(childChkSelector);
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = checked;
    }
}

/**
 * Toggle all child checkboxes using a direct element reference for the master checkbox.
 * Used in pg1, pg3, pg5, pg7, pg8, pg9 where the master element itself is passed.
 * @param {HTMLInputElement} source - The master checkbox element (e.g. passed via onchange="toggleAllCheckboxes(this)").
 * @param {string} selector - CSS selector for child checkboxes. Defaults to '.chk-row'.
 */
function toggleAllCheckboxes(source, selector) {
    if (!selector) {
        selector = '.chk-row';
    }
    var checkboxes = document.querySelectorAll(selector);
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = source.checked;
    }
}

/**
 * Format a number with thousand separators and optional decimal places.
 * Uses the browser's toLocaleString for locale-aware formatting.
 * @param {number} n - The number to format.
 * @param {number} [decimals=0] - Number of decimal places.
 * @returns {string} Formatted number string (e.g. "1,234,567" or "1,234.56").
 */
function formatNumber(n, decimals) {
    if (decimals === undefined) {
        decimals = 0;
    }
    if (n === null || n === undefined || isNaN(n)) {
        return '0';
    }
    return Number(n).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Convert a date string from yyyy-mm-dd (input[type=date] value) to dd/mm/yyyy display format.
 * Returns the original string unchanged if it does not match the expected format.
 * @param {string} dateStr - Date in yyyy-mm-dd format.
 * @returns {string} Date in dd/mm/yyyy format, or original string if parsing fails.
 */
function formatDate(dateStr) {
    if (!dateStr) {
        return '';
    }
    var parts = dateStr.split('-');
    if (parts.length === 3) {
        return parts[2] + '/' + parts[1] + '/' + parts[0];
    }
    return dateStr;
}

/**
 * Parse a dd/mm/yyyy string into a JavaScript Date object.
 * Returns null if the input does not match the expected format.
 * @param {string} ddmmyyyy - Date string in dd/mm/yyyy format.
 * @returns {Date|null} Parsed Date object, or null on invalid input.
 */
function parseDateInput(ddmmyyyy) {
    if (!ddmmyyyy) {
        return null;
    }
    var parts = ddmmyyyy.split('/');
    if (parts.length !== 3) {
        return null;
    }
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return null;
    }
    return new Date(year, month - 1, day);
}

/**
 * Validate that a string matches the MM/yyyy format used throughout the application
 * for month-based period fields (e.g. "01/2026", "12/2025").
 * @param {string} val - The string to validate.
 * @returns {boolean} True if val matches MM/yyyy with valid month (01-12).
 */
function validateMonthFormat(val) {
    if (!val) {
        return false;
    }
    return /^(0[1-9]|1[0-2])\/\d{4}$/.test(val.trim());
}

/**
 * Auto-fill period fields (from-date, to-date, and optionally a code field) based on
 * a MM/yyyy month value. Sets from-date to the 1st of the month and to-date to the
 * last day of the month. Optionally fills a code field with a prefix + YYYYMM.
 *
 * This pattern is used in pg1 (autoFillData) and pg10 (fn1AutoFill).
 *
 * @param {string} monthVal - The MM/yyyy string (e.g. "06/2026").
 * @param {string} fromId - Element ID for the from-date input (type="date").
 * @param {string} toId - Element ID for the to-date input (type="date").
 * @param {string} [codeId] - Optional element ID for a code/period-name input. If provided,
 *   the value is set to "LSP_" + YYYYMM.
 */
function autoFillPeriod(monthVal, fromId, toId, codeId) {
    if (!validateMonthFormat(monthVal)) {
        return;
    }
    var parts = monthVal.trim().split('/');
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[1], 10);
    var mm = String(month).padStart(2, '0');

    var firstDay = year + '-' + mm + '-01';
    var lastDayObj = new Date(year, month, 0);
    var lastDay = year + '-' + mm + '-' + String(lastDayObj.getDate()).padStart(2, '0');

    var fromEl = document.getElementById(fromId);
    var toEl = document.getElementById(toId);
    if (fromEl) {
        fromEl.value = firstDay;
        fromEl.dispatchEvent(new Event('change'));
    }
    if (toEl) {
        toEl.value = lastDay;
        toEl.dispatchEvent(new Event('change'));
    }

    if (codeId) {
        var codeEl = document.getElementById(codeId);
        if (codeEl) {
            codeEl.value = 'LSP_' + year + mm;
        }
    }
}

/**
 * Toggle the display of a collapsible content element between 'none' and 'block'.
 * Used across pg2 (toggleElement) and pg10 (toggleCollapse) with identical logic.
 * @param {string} id - The ID of the element to toggle.
 */
function toggleCollapse(id) {
    var el = document.getElementById(id);
    if (!el) {
        return;
    }
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

/**
 * Load a page URL into the main iframe and update the topbar title.
 * Used in the shell/index page to navigate between embedded pages.
 * @param {string} src - The URL or srcdoc content to load.
 * @param {string} title - The page title to display in the topbar.
 */
function loadPage(src, title) {
    var frame = document.getElementById('frame');
    if (!frame) {
        return;
    }
    frame.src = src;
    var titleEl = document.getElementById('pgTitle');
    if (titleEl && title) {
        titleEl.textContent = title;
    }
}

/**
 * Wrapper around window.confirm() that executes a callback only if the user confirms.
 * Simplifies the repeated pattern of confirm() + conditional logic found across pages.
 * @param {string} msg - The confirmation message to display.
 * @param {Function} onConfirm - Callback function to execute if the user clicks OK.
 * @returns {boolean} True if confirmed, false otherwise.
 */
function confirmAction(msg, onConfirm) {
    if (confirm(msg)) {
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
        return true;
    }
    return false;
}


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

/**
 * Tính đơn giá bình quân tháng của 1 NHÓM BÌNH QUÂN (Report2_BQTL dòng 40/52/54).
 * Dùng chung cho pg10-bq-tlsp (hiển thị kết quả BQ) và pg11-bang-tinh-vs (lấy đơn giá nguồn)
 * để đảm bảo 2 màn hình luôn ra cùng một con số.
 *
 * Công thức: BQ tháng = SUM(QTL thành viên) / SUM(Công thành viên) × BQ công đủ,
 * trong đó BQ công đủ = bình quân gia quyền công đủ theo SL bàn của các BP thành viên.
 *
 * @param {string} maNhom - Mã nhóm BQ trong MOCK.lsp.nhomBQ (VD "BQ_CB_XQ_PTO").
 * @param {string} [phamVi="ALL"] - "ALL" = tất cả NV; "3T" = loại LĐ mới <3 tháng khỏi tử số & mẫu số.
 * @returns {object|null} { nhom, bqCongDu, tongQTL, tongCong, bqNgay, bqThang } hoặc null nếu không tìm thấy nhóm.
 */
function computeBQNhomLSP(maNhom, phamVi) {
    if (!window.MOCK || !window.MOCK.lsp || !window.MOCK.lsp.nhomBQ) {
        return null;
    }
    var lsp = window.MOCK.lsp;
    var nhom = null;
    for (var i = 0; i < lsp.nhomBQ.length; i++) {
        if (lsp.nhomBQ[i].ma === maNhom) { nhom = lsp.nhomBQ[i]; break; }
    }
    if (!nhom) {
        return null;
    }
    var tongQTL = 0, tongCong = 0, sumBanCong = 0, sumBan = 0;
    lsp.bqBoPhan.forEach(function (r) {
        if (nhom.members.indexOf(r.ma) < 0) {
            return;
        }
        var qtl = r.qtl, cong = r.tongCong;
        if (phamVi === '3T') {
            qtl -= (r.qtlMoi || 0);
            cong -= (r.congMoi || 0);
        }
        tongQTL += qtl;
        tongCong += cong;
        sumBanCong += r.congDu * r.slBan;
        sumBan += r.slBan;
    });
    var bqCongDu = sumBan > 0 ? sumBanCong / sumBan : 0;
    var bqNgay = tongCong > 0 ? tongQTL / tongCong : 0;
    return {
        nhom: nhom,
        bqCongDu: bqCongDu,
        tongQTL: tongQTL,
        tongCong: tongCong,
        bqNgay: bqNgay,
        bqThang: Math.round(bqNgay * bqCongDu)
    };
}

/**
 * Engine tính toán trọn vẹn 1 dòng lương sản phẩm cá nhân (Tab 1)
 * Bao phủ đầy đủ sản lượng 4 ca kíp và các tầng hệ số
 */
function runCascadingSalEngine(row) {
    const tongSanLuong = row.ns_trong_gio + row.ns_ca_dem + row.ns_tang_ca + row.ns_tang_ca_dem;
    
    // Bước 3: Lương gốc
    const lspBase = tongSanLuong * row.unit_price; 
    
    // Bước 4: Áp dụng hệ số 1 (Năng suất)
    const lspHS1 = lspBase * (row.hs1 / 100);
    
    // Bước 5: Áp dụng tiếp hệ số 2 (Chất lượng ca) dựa trên kết quả bước trước
    const lspHS2 = lspHS1 * (row.hs2 / 100);
    
    // Bước 6: Áp dụng tiếp hệ số 3 (Kỷ luật) để ra cục tiền chốt mốc hệ số
    const lspHS3Amt = lspHS2 * (row.hs3 / 100);
    
    // Bước 7: Hỗ trợ bộ phận (Tính trên cục tiền sau HS3)
    const deptSupport = lspHS3Amt * (row.dept_support_pct / 100);
    
    // Bước 8: Hỗ trợ công đoạn (Lương gốc * %HTCĐ * Tích tổng hệ số)
    const tongTichHS = (row.hs1 / 100) * (row.hs2 / 100) * (row.hs3 / 100);
    const stageSupport = lspBase * (row.stage_support_pct / 100) * tongTichHS;
    
    // Bước 10: Tổng số tiền cuối cùng của dòng dữ liệu
    const lspTotal = lspHS3Amt + deptSupport + stageSupport + row.hazard_amt;
    
    return {
        base: Math.round(lspBase),
        hs3Amt: Math.round(lspHS3Amt),
        deptSup: Math.round(deptSupport),
        stageSup: Math.round(stageSupport),
        total: Math.round(lspTotal)
    };
}

function moModal4Ca(rowId) {
    const row = window.MOCK.lsp.ketQua.find(r => r.id === rowId);
    if(!row) return;
    const up = row.unit_price;
    const tg = row.ns_trong_gio, cd = row.ns_ca_dem, tc = row.ns_tang_ca, tcd = row.ns_tang_ca_dem;

    let html = `<table class="table table-sm table-bordered">
        <thead><tr><th>Ca làm việc</th><th class="text-right">Sản lượng</th><th class="text-right">Thành tiền</th></tr></thead>
        <tbody>
            <tr><td>Trong giờ</td><td class="text-right">${tg}</td><td class="text-right">${formatNumber(tg * up)}</td></tr>
            <tr><td>Ca đêm</td><td class="text-right">${cd}</td><td class="text-right">${formatNumber(cd * up)}</td></tr>
            <tr><td>Tăng ca</td><td class="text-right">${tc}</td><td class="text-right">${formatNumber(tc * up)}</td></tr>
            <tr><td>Tăng ca đêm</td><td class="text-right">${tcd}</td><td class="text-right">${formatNumber(tcd * up)}</td></tr>
        </tbody>
    </table>`;
    
    document.getElementById("modal-4-ca-content").innerHTML = html;
    document.getElementById("modal-4-ca").style.display = "flex";
}

function dongModal4Ca() {
    document.getElementById("modal-4-ca").style.display = "none";
}

// Tự động gắn nút Lưu ghi chú cho các Ghi chú nghiệp vụ (BA note)
function attachBANoteLogic() {
    var textareas = document.querySelectorAll('textarea[placeholder*="BA nhập ghi chú"]');
    if (textareas.length > 0) {
        textareas.forEach(function(ta, index) {
            // Không gắn 2 lần nếu đã có
            if (ta.getAttribute('data-ba-attached') === 'true') return;
            ta.setAttribute('data-ba-attached', 'true');

            // Tạo ID duy nhất cho mỗi màn hình
            var path = window.location.pathname;
            var pageName = path.substring(path.lastIndexOf('/') + 1).split('.')[0] || "index";
            // Lấy thêm query param nếu có để phân biệt (ví dụ lan=1, lan=2)
            var query = window.location.search || "";
            var pageId = pageName + query + '_ba_note_' + index;
            
            // Khôi phục note cũ nếu có
            var savedNote = localStorage.getItem(pageId);
            if (savedNote) {
                ta.value = savedNote;
            }
            
            // Tạo wrapper và nút Lưu
            var btnDiv = document.createElement("div");
            btnDiv.style.marginTop = "8px";
            btnDiv.style.textAlign = "right";
            
            var btnSave = document.createElement("button");
            btnSave.innerText = "💾 Lưu ghi chú";
            btnSave.style.padding = "4px 12px";
            btnSave.style.backgroundColor = "#ffc107";
            btnSave.style.color = "#333";
            btnSave.style.border = "1px solid #d39e00";
            btnSave.style.borderRadius = "4px";
            btnSave.style.cursor = "pointer";
            btnSave.style.fontSize = "12px";
            btnSave.style.fontWeight = "bold";
            
            btnSave.onmouseover = function() { btnSave.style.backgroundColor = "#e0a800"; };
            btnSave.onmouseout = function() { btnSave.style.backgroundColor = "#ffc107"; };
            
            btnSave.onclick = function() {
                localStorage.setItem(pageId, ta.value);
                // Hiển thị thông báo
                var alertBox = document.getElementById("alertBox") || document.querySelector('.alert-box');
                if (alertBox && typeof showAlert === "function") {
                    showAlert(alertBox.id || "alertBox", "Đã lưu ghi chú nghiệp vụ thành công!", "success");
                } else {
                    alert("Đã lưu ghi chú nghiệp vụ thành công!");
                }
            };
            
            btnDiv.appendChild(btnSave);
            ta.parentNode.insertBefore(btnDiv, ta.nextSibling);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachBANoteLogic);
} else {
    attachBANoteLogic();
}
