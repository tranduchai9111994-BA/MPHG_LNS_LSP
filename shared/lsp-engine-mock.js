/**
 * lsp-engine-mock.js
 * ------------------
 * Shared mock calculation engine for LSP (Luong San Pham) prototype.
 * Provides 2-phase salary calculation: Detail -> Summary/Aggregate.
 *
 * Usage: <script src="../shared/lsp-engine-mock.js"></script>
 *
 * All functions are in global scope for direct <script> inclusion.
 */

// ============================================================
//  DATA STRUCTURE REFERENCE
// ============================================================
// 1 slice = 1 giai doan QTLV (work history stage)
// { stage, ban, ka, dept, from, to, cong, ns, donGia }
//
// Criterion:
// { ma, rowClass, allocation, priority, calcLevel, aggScope, aggOp, expr(fn) }
// - rowClass: 'Detail' | 'Summary'
// - calcLevel: 'Detail' | 'Aggregate' | 'Summary'
// - allocation: 'Prorata' | 'MaxSalaryRow' | 'LastStageRow' | 'Accumulate' | null
// - aggScope: 'Ban' | 'Ka' | 'Dept' | 'CrossDept'
// - aggOp: 'Sum' | 'Avg' | 'Max' | 'Min'

// ============================================================
//  ALLOCATION FUNCTIONS
// ============================================================

/**
 * Prorata allocation: splits total proportionally by cong (work days) per row.
 * @param {number} total - The total value to distribute.
 * @param {Array<Object>} rows - Array of row objects, each with a `cong` property.
 * @returns {number[]} Allocated values per row.
 */
function lspProrata(total, rows) {
  var sumCong = rows.reduce(function (s, r) { return s + r.cong; }, 0) || 1;
  return rows.map(function (r) {
    return Math.round(total * (r.cong / sumCong));
  });
}

/**
 * MaxSalaryRow allocation: concentrates entire value on the row with the highest
 * salary (by a reference criterion field, default 'final').
 * Tie-break: choose the row with the larger `to` date.
 * @param {number} total - The total value to allocate.
 * @param {Array<Object>} rows - Array of row objects.
 * @param {string} [keyField='final'] - The field name to compare salary values.
 * @returns {number[]} Allocated values per row (only one row gets the total).
 */
function lspMaxSalaryRow(total, rows, keyField) {
  keyField = keyField || 'final';
  var maxIdx = 0;
  var maxVal = -Infinity;
  rows.forEach(function (r, i) {
    var v = (r.vals && r.vals[keyField]) || r[keyField] || 0;
    if (v > maxVal || (v === maxVal && r.to > rows[maxIdx].to)) {
      maxVal = v;
      maxIdx = i;
    }
  });
  return rows.map(function (r, i) {
    return i === maxIdx ? total : 0;
  });
}

/**
 * LastStageRow allocation: concentrates entire value on the row with the latest
 * ToDate (`to` field).
 * @param {number} total - The total value to allocate.
 * @param {Array<Object>} rows - Array of row objects with a `to` property.
 * @returns {number[]} Allocated values per row (only the last stage gets the total).
 */
function lspLastStageRow(total, rows) {
  var maxIdx = 0;
  var maxTo = '';
  rows.forEach(function (r, i) {
    if (r.to > maxTo) {
      maxTo = r.to;
      maxIdx = i;
    }
  });
  return rows.map(function (r, i) {
    return i === maxIdx ? total : 0;
  });
}

/**
 * Accumulate allocation: running cumulative sum across rows for a given criterion.
 * @param {Array<Object>} rows - Array of row objects, each with a `vals` map.
 * @param {string} keyMa - The criterion code to accumulate.
 * @returns {number[]} Cumulative sums per row.
 */
function lspAccumulate(rows, keyMa) {
  var running = 0;
  return rows.map(function (r) {
    running += (r.vals ? (r.vals[keyMa] || 0) : 0);
    return running;
  });
}

/**
 * Aggregate by scope: groups rows by scope field and applies an aggregate operator.
 * Each row in a group receives the same aggregated value.
 * @param {Array<Object>} rows - Array of row objects.
 * @param {Object} criterion - Criterion with aggScope, aggOp, srcMa, ma properties.
 */
function lspAggregate(rows, criterion) {
  var scopeField = criterion.aggScope === 'Dept' ? 'dept'
    : criterion.aggScope === 'Ka' ? 'ka' : 'ban';

  var groups = {};
  rows.forEach(function (r) {
    var key = r[scopeField] || 'default';
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });

  for (var key in groups) {
    if (!groups.hasOwnProperty(key)) continue;
    var g = groups[key];
    var vals = g.map(function (r) {
      return (r.vals && r.vals[criterion.srcMa]) || 0;
    });
    var agg;
    switch (criterion.aggOp) {
      case 'Sum':
        agg = vals.reduce(function (a, b) { return a + b; }, 0);
        break;
      case 'Avg':
        agg = vals.reduce(function (a, b) { return a + b; }, 0) / (vals.length || 1);
        break;
      case 'Max':
        agg = Math.max.apply(null, vals);
        break;
      case 'Min':
        agg = Math.min.apply(null, vals);
        break;
      default:
        agg = 0;
    }
    g.forEach(function (r) {
      if (!r.vals) r.vals = {};
      r.vals[criterion.ma] = agg;
    });
  }
}

// ============================================================
//  MAIN ENGINE FUNCTION
// ============================================================

/**
 * lspCalc - 2-phase salary calculation engine.
 *
 * Phase 1 (Detail): Evaluates Detail criteria per-row in priority order,
 *   then applies Prorata allocation for Detail criteria that need it.
 *
 * Phase 2 (Summary & Aggregate): Calculates Aggregate criteria by scope,
 *   then Summary criteria in priority order with allocation rules.
 *
 * @param {Object} emp - Employee object (e.g. { id, name }).
 * @param {Array<Object>} slices - QTLV stages (work history slices).
 * @param {Array<Object>} criteria - Array of criterion definitions.
 * @returns {Array<Object>} Rows with calculated `vals` map.
 */
function lspCalc(emp, slices, criteria) {
  // --- Phase 1: Detail calculation ---
  var detailCrit = criteria
    .filter(function (c) { return c.rowClass === 'Detail'; })
    .sort(function (a, b) { return a.priority - b.priority; });

  var rows = slices.map(function (s) {
    var row = {};
    for (var k in s) {
      if (s.hasOwnProperty(k)) row[k] = s[k];
    }
    row.vals = {};
    return row;
  });

  var i, c, r;
  for (i = 0; i < detailCrit.length; i++) {
    c = detailCrit[i];
    for (var j = 0; j < rows.length; j++) {
      r = rows[j];
      r.vals[c.ma] = typeof c.expr === 'function' ? c.expr(r, rows, emp) : 0;
    }
    // Apply Prorata for Detail criteria that need it
    if (c.allocation === 'Prorata') {
      var total = rows.reduce(function (s, r) { return s + (r.vals[c.ma] || 0); }, 0);
      var allocated = lspProrata(total, rows);
      rows.forEach(function (r, idx) { r.vals[c.ma] = allocated[idx]; });
    }
  }

  // --- Phase 2: Summary & Aggregate ---

  // 2a. Aggregate criteria
  var aggCrit = criteria.filter(function (c) { return c.calcLevel === 'Aggregate'; });
  for (i = 0; i < aggCrit.length; i++) {
    lspAggregate(rows, aggCrit[i]);
  }

  // 2b. Summary criteria
  var sumCrit = criteria
    .filter(function (c) { return c.rowClass === 'Summary'; })
    .sort(function (a, b) { return a.priority - b.priority; });

  for (i = 0; i < sumCrit.length; i++) {
    c = sumCrit[i];
    var total = typeof c.expr === 'function'
      ? c.expr(null, rows, emp)
      : rows.reduce(function (s, r) { return s + (r.vals[c.srcMa || c.ma] || 0); }, 0);

    var allocated;
    switch (c.allocation) {
      case 'Prorata':
        allocated = lspProrata(total, rows);
        break;
      case 'MaxSalaryRow':
        allocated = lspMaxSalaryRow(total, rows, c.refKey || 'final');
        break;
      case 'LastStageRow':
        allocated = lspLastStageRow(total, rows);
        break;
      case 'Accumulate':
        allocated = lspAccumulate(rows, c.srcMa || c.ma);
        break;
      default:
        // No allocation: every row gets the full total (broadcast)
        allocated = rows.map(function () { return total; });
    }
    rows.forEach(function (r, idx) { r.vals[c.ma] = allocated[idx]; });
  }

  return rows;
}

// ============================================================
//  HELPER: groupBy utility
// ============================================================

/**
 * Groups an array by a key function or property name.
 * @param {Array} arr - The array to group.
 * @param {Function|string} keyFn - A function returning the group key, or a property name.
 * @returns {Object} Map of key -> array of items.
 */
function lspGroupBy(arr, keyFn) {
  var result = {};
  arr.forEach(function (item) {
    var key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    if (!result[key]) result[key] = [];
    result[key].push(item);
  });
  return result;
}

// ============================================================
//  MOCK EMPLOYEE DATA
// ============================================================

/**
 * Mock employee data for QA/testing.
 * 2 QTLV stages (slices) for Nguyen Thi Loan.
 */
window.MOCK_LSP_EMP = {
  emp: { id: '1022907668', name: 'Nguyễn Thị Loan' },
  slices: [
    { stage: 1, ban: 'CB101', ka: 'CB1', dept: 'CB', from: '2026-05-01', to: '2026-05-15', cong: 12, ns: 800, donGia: 6200 },
    { stage: 2, ban: 'CB102', ka: 'CB1', dept: 'CB', from: '2026-05-16', to: '2026-05-31', cong: 13, ns: 900, donGia: 6400 }
  ]
};

// ============================================================
//  QA ASSERTIONS (reference for test verification)
// ============================================================
// QA assertions for MOCK_LSP_EMP:
// - 2 rows generated (2 QTLV stages)
// - TT_LSP_LuongThoiGian (Prorata): row1 = total*12/25, row2 = total*13/25
// - TT_LSP_LuongDongBH (MaxSalaryRow): 100% on row with higher Final (stage2), row1 = 0
// - TT_LSP_ThuNhapTinhThue (LastStageRow): 100% on row with to='2026-05-31' (stage2), row1 = 0
// - Sum of Detail rows per criterion = value if calculated as single row (no loss)
// Boundary: 1 slice -> all Allocation = same as that single row
// Negative: sum(cong) = 0 -> Prorata returns 0, no error
// Tie: 2 rows with equal salary -> MaxSalaryRow picks row with larger 'to'
