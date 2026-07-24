/* ================================================================
 * shared/xlsx-export.js
 * Helper xuất Excel dùng chung cho toàn app iHRP MPHG (LSP/LNS).
 *
 * SỬ DỤNG:
 *   <script src="../shared/xlsx-export.js"></script>
 *
 *   // 1 sheet:
 *   XLSXExport.export({
 *     filename: 'DanhSach_KyLuong_2026-07-24',
 *     sheetName: 'Kỳ lương',
 *     columns: [
 *       { key: 'ten',    header: 'Tên kỳ',   width: 30 },
 *       { key: 'thang',  header: 'Tháng',    width: 8 },
 *       ...
 *     ],
 *     data: [{ ten:'...', thang:5, ... }, ...]
 *   });
 *
 *   // Multi-sheet (1 file, nhiều sheet):
 *   XLSXExport.exportMulti({
 *     filename: 'DS_NV_TinhLuong_KY_202605.xlsx',
 *     sheets: [
 *       { name: 'NV chưa tính', columns: [...], data: [...] },
 *       { name: 'NV đã tính',   columns: [...], data: [...] }
 *     ]
 *   });
 *
 * Nếu SheetJS chưa load xong → retry ngắn ~300ms trước khi fallback CSV.
 * ================================================================ */
(function () {
  'use strict';

  var CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
  var _cdnInjected = false;

  function injectCDN() {
    if (_cdnInjected || window.XLSX) return;
    _cdnInjected = true;
    try {
      var s = document.createElement('script');
      s.src = CDN_URL;
      s.async = true;
      s.onerror = function () {
        console.warn('[XLSXExport] Không tải được SheetJS CDN — sẽ fallback CSV.');
      };
      document.head.appendChild(s);
    } catch (e) {
      console.warn('[XLSXExport] Inject CDN lỗi:', e);
    }
  }

  injectCDN();

  function _sanitizeFilename(name) {
    return String(name || 'export').replace(/[\\/:*?"<>|]/g, '_');
  }

  function _cellValue(row, col) {
    var v = row ? row[col.key] : '';
    if (v == null) return '';
    if (Array.isArray(v)) return v.join(', ');
    if (typeof v === 'object') {
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return v;
  }

  function _buildAoA(columns, data) {
    var rows = [columns.map(function (c) { return c.header; })];
    (data || []).forEach(function (row) {
      rows.push(columns.map(function (c) { return _cellValue(row, c); }));
    });
    return rows;
  }

  function _buildSheet(columns, data) {
    var ws = XLSX.utils.aoa_to_sheet(_buildAoA(columns, data));
    if (columns.some(function (c) { return c.width; })) {
      ws['!cols'] = columns.map(function (c) { return { wch: c.width || 15 }; });
    }
    return ws;
  }

  function _exportXLSX_single(opts) {
    var wb = XLSX.utils.book_new();
    var ws = _buildSheet(opts.columns, opts.data);
    var sheetName = _safeSheetName(opts.sheetName || 'Sheet1');
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    var fname = _sanitizeFilename(opts.filename);
    if (!/\.xlsx$/i.test(fname)) fname += '.xlsx';
    XLSX.writeFile(wb, fname);
  }

  function _exportXLSX_multi(opts) {
    var wb = XLSX.utils.book_new();
    var used = {};
    (opts.sheets || []).forEach(function (sh, i) {
      var name = _safeSheetName(sh.name || ('Sheet' + (i + 1)));
      // Excel: tên sheet phải unique
      var base = name, k = 2;
      while (used[name]) { name = (base + '_' + k).slice(0, 31); k++; }
      used[name] = true;
      XLSX.utils.book_append_sheet(wb, _buildSheet(sh.columns, sh.data), name);
    });
    var fname = _sanitizeFilename(opts.filename);
    if (!/\.xlsx$/i.test(fname)) fname += '.xlsx';
    XLSX.writeFile(wb, fname);
  }

  function _safeSheetName(name) {
    // Excel giới hạn 31 ký tự, cấm  \ / ? * [ ]
    return String(name).replace(/[\\/?*\[\]]/g, '').slice(0, 31) || 'Sheet';
  }

  function _csvEscape(s) {
    s = String(s == null ? '' : s);
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function _exportCSV(opts) {
    var BOM = '\uFEFF';
    var columns = opts.columns || [];
    var lines = [columns.map(function (c) { return _csvEscape(c.header); }).join(',')];
    (opts.data || []).forEach(function (row) {
      lines.push(columns.map(function (c) { return _csvEscape(_cellValue(row, c)); }).join(','));
    });
    var csv = BOM + lines.join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var fname = _sanitizeFilename(opts.filename).replace(/\.xlsx$/i, '') + '.csv';
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
    console.info('[XLSXExport] Fallback CSV (SheetJS chưa sẵn sàng): ' + fname);
  }

  function _exportCSV_multi(opts) {
    // CSV không hỗ trợ multi-sheet → xuất từng file .csv riêng.
    var sheets = opts.sheets || [];
    sheets.forEach(function (sh, i) {
      var name = (opts.filename || 'export').replace(/\.xlsx$/i, '')
        + '__' + _sanitizeFilename(sh.name || ('sheet' + (i + 1)));
      _exportCSV({ filename: name, columns: sh.columns, data: sh.data });
    });
  }

  // Retry chờ SheetJS load (max ~1.2s) rồi fallback
  function _whenReady(cb) {
    if (window.XLSX) { cb(true); return; }
    injectCDN();
    var tries = 0, MAX = 12; // 12 * 100ms ≈ 1.2s
    var iv = setInterval(function () {
      tries++;
      if (window.XLSX) { clearInterval(iv); cb(true); }
      else if (tries >= MAX) { clearInterval(iv); cb(false); }
    }, 100);
  }

  window.XLSXExport = {
    /** Xuất 1 file .xlsx 1 sheet. */
    export: function (opts) {
      if (!opts || !opts.columns) {
        console.warn('[XLSXExport] Thiếu opts.columns'); return;
      }
      _whenReady(function (ok) {
        if (ok) { try { _exportXLSX_single(opts); return; } catch (e) { console.error(e); } }
        _exportCSV(opts);
      });
    },
    /** Xuất 1 file .xlsx N sheet. sheets = [{name, columns, data}, ...] */
    exportMulti: function (opts) {
      if (!opts || !opts.sheets) {
        console.warn('[XLSXExport] Thiếu opts.sheets'); return;
      }
      _whenReady(function (ok) {
        if (ok) { try { _exportXLSX_multi(opts); return; } catch (e) { console.error(e); } }
        _exportCSV_multi(opts);
      });
    },
    /** true nếu SheetJS đã load (kiểm tra sync). */
    isReady: function () { return !!window.XLSX; }
  };
})();
