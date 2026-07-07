    function fn6ShowDetail(idx) {
      if (!FN6_DATA) return;
      fn6DetailIdx = idx;
      const nv = FN6_DATA.nvs[idx];
      const nh = FN6_DATA.nhomMap[nv.nhom_id];
      const grpNvs = FN6_DATA.nvs.filter(v => v.nhom_id === nv.nhom_id);
      const grpSX = grpNvs.filter(v => v.vai_tro === "SX");
      const grpPV = grpNvs.filter(v => v.vai_tro === "PV");
      const thLabel = nv.th === "TH2" ? "Chung 1 ĐV cấp 5" : nv.th === "TH3" ? "Chung nhiều ĐV cấp 5" : "Tách Phục vụ";
      const hl = (m) => m === nv.ma ? ' style="background:#fff3cd;font-weight:bold"' : '';

      document.getElementById("fn6-detail-title").textContent = `🔍 Chi tiết logic — [${nv.th}] — Đang xem: ${nv.ma} ${nv.ten}`;

      let html = '';

      // ── HEADER INFO ──
      const nvCountLabel = nv.th === "TH4" ? `${nh.nv_count} (${nh.nv_sx} SX + ${nh.nv_pv} PV)` : `${nh.nv_count}`;
      html += `<div class="trace-section"><div class="trace-header">Thông tin <span class="step-badge">INFO</span></div><div class="trace-body">
        <table style="width:auto;font-size:12px">
          <tr><td style="font-weight:bold;text-align:left;padding-right:20px;width:130px">Trường hợp</td><td><span class="badge-th ${nv.th}">${nv.th}</span> — ${thLabel}</td></tr>
          <tr><td style="font-weight:bold;text-align:left">Level 5</td><td>${nh.level5.join(", ")}</td></tr>
          <tr><td style="font-weight:bold;text-align:left">Số NV</td><td>${nvCountLabel}</td></tr>
          <tr><td style="font-weight:bold;text-align:left">NSTT nhóm</td><td style="font-weight:bold;color:#c0392b;font-size:14px">${fn6Fmt(nh.nstt)} Kg</td></tr>
          <tr><td style="font-weight:bold;text-align:left">Đang xem NV</td><td style="background:#fff3cd;padding:4px 8px"><b>${nv.ma}</b> — ${nv.ten} — <span class="badge-vai ${nv.vai_tro}">${nv.vai_tro}</span> — Level 5: ${nv.level5}</td></tr>
        </table></div></div>`;

      // ── MOCK DATA FOR ALL EMPLOYEES IF MISSING ──
      const thangStr = document.getElementById('fn6-thang').value || '07/2026';
      const tParts = thangStr.split('/');
      const tMM = parseInt(tParts[0]) || 7, tYYYY = parseInt(tParts[1]) || 2026;
      const daysInMonth = new Date(tYYYY, tMM, 0).getDate();
      const bspvFactor = nv.vai_tro === "PV" ? 0.1 : 0;

      grpNvs.forEach(g => {
        if (!g._days) {
          const activeDays = [];
          for (let d = 1; d <= daysInMonth; d++) { if (new Date(tYYYY, tMM - 1, d).getDay() !== 0) activeDays.push(d); }
          const base = g.ctt / Math.max(activeDays.length, 1);
          let cttArr = activeDays.map(() => Math.max(0, +(base + (Math.random() - 0.5) * 0.4).toFixed(1)));
          const diff = +(g.ctt - cttArr.reduce((s, v) => s + v, 0)).toFixed(1);
          if (cttArr.length) cttArr[cttArr.length - 1] = Math.max(0, +(cttArr[cttArr.length - 1] + diff).toFixed(1));
          let ai = 0;
          const days = [];
          for (let d = 1; d <= daysInMonth; d++) {
            const isOff = new Date(tYYYY, tMM - 1, d).getDay() === 0;
            const ctt = isOff ? 0 : (cttArr[ai++] || 0);
            const bspv = g.vai_tro === "PV" ? (g.bspv > 0 ? g.bspv/100 : 0.1) : 0;
            const cns = +(ctt * (g.hst / 100 + bspv)).toFixed(3);
            days.push({ d, isOff, ctt, cns });
          }
          g._days = days;
        }
      });

      if (nv.th === "TH4") {
        const renderHeader = (title, color) => {
          let h = '<tr>';
          h += '<th style="background:' + color + ';color:#fff;min-width:140px;text-align:left">' + title + '</th>';
          for(let d=1; d<=daysInMonth; d++) h += '<th style="background:' + color + ';color:#fff;min-width:35px">N' + String(d).padStart(2,'0') + '</th>';
          h += '<th style="background:' + color + ';color:#fff;min-width:60px">Tổng</th></tr>';
          return h;
        };
        const renderRow = (label, arr, isBold=false, highlight=false, formatSum=false) => {
          let h = '<tr' + (highlight ? ' style="background:#fff3cd;font-weight:bold"' : (isBold?' style="font-weight:bold"':'')) + '>';
          h += '<td class="tl">' + label + '</td>';
          let total = 0;
          for(let d=1; d<=daysInMonth; d++) {
             let v = arr[d-1];
             total += v;
             h += '<td' + (v===0?' style="color:#aaa"':'') + '>' + (v===0 ? '-' : (formatSum ? fn6Fmt(v) : v.toFixed(3))) + '</td>';
          }
          h += '<td style="color:#c0392b;font-weight:bold">' + (formatSum ? fn6Fmt(total) : total.toFixed(3)) + '</td></tr>';
          return h;
        };
        const createTbl = (step, title, color, renderRowsBody) => {
          return '<div class="trace-section"><div class="trace-header">Bước ' + step + ': ' + title + ' <span class="step-badge" style="background:' + color + '">BƯỚC ' + step + '</span></div><div class="trace-body">' +
            '<div style="overflow-x:auto"><table style="font-size:10px">' +
              renderHeader(title, color) +
              renderRowsBody() +
            '</table></div></div></div>';
        };

        const daysArr = Array.from({length:daysInMonth}, (_,i)=>i+1);
        const getDailyCtt = (g) => g._days.map(d=>d.ctt);
        const getDailyCns = (g) => g._days.map(d=>d.cns);
        const sumArrs = (arrs) => daysArr.map((_,i) => arrs.reduce((s,a) => s + (a[i]||0), 0));
        
        const pvCtts = grpPV.map(getDailyCtt);
        const pvCnss = grpPV.map(getDailyCns);
        const totCttPV = sumArrs(pvCtts);
        const totCnsPV = sumArrs(pvCnss);

        const sxByL5 = {};
        grpSX.forEach(g => {
           if(!sxByL5[g.level5]) sxByL5[g.level5] = [];
           sxByL5[g.level5].push(g);
        });
        const l5Keys = Object.keys(sxByL5);
        const banCnss = l5Keys.map(l5 => sumArrs(sxByL5[l5].map(getDailyCns)));
        const totCnsSX = sumArrs(banCnss);
        const totCnsKa = sumArrs([totCnsSX, totCnsPV]);

        const banCnsWithPv = l5Keys.map((l5, idx) => {
           return daysArr.map((_, i) => {
              if (totCnsSX[i]===0) return 0;
              return banCnss[idx][i] + (banCnss[idx][i] / totCnsSX[i]) * totCnsPV[i];
           });
        });
        
        const activeDaysCount = totCnsKa.filter(v=>v>0).length || 1;
        const dailyNstt = nh.nstt / activeDaysCount;
        const nsttTotalArr = totCnsKa.map(v => v>0 ? dailyNstt : 0);
        const totCnsWithPv = sumArrs(banCnsWithPv);
        const banNstt = l5Keys.map((l5, idx) => {
           return daysArr.map((_, i) => {
              if (totCnsWithPv[i]===0) return 0;
              return (banCnsWithPv[idx][i] / totCnsWithPv[i]) * nsttTotalArr[i];
           });
        });

        const banDonGia = l5Keys.map((l5, idx) => {
           return daysArr.map((_, i) => {
              if (banCnss[idx][i]===0) return 0;
              return banNstt[idx][i] / banCnss[idx][i];
           });
        });

        const banTrichPv = l5Keys.map((l5, idx) => {
           return daysArr.map((_, i) => {
              if (totCnsKa[i]===0) return 0;
              return banNstt[idx][i] * (totCnsPV[i] / totCnsKa[i]);
           });
        });
        const totTrichPv = sumArrs(banTrichPv);

        const getSxNs = (g) => {
           const bIdx = l5Keys.indexOf(g.level5);
           const arr = getDailyCns(g);
           return daysArr.map((_,i) => arr[i] * banDonGia[bIdx][i]);
        };
        const getPvNs = (g) => {
           const arr = getDailyCns(g);
           return daysArr.map((_,i) => {
              if (totCnsPV[i]===0) return 0;
              return arr[i] / totCnsPV[i] * totTrichPv[i];
           });
        };

        html += createTbl(1, 'CÔNG THỰC TẾ PHỤC VỤ', '#2980b9', () => {
           let r = '';
           grpPV.forEach((g,i) => r += renderRow(g.ma+' - '+g.ten, pvCtts[i], false, g.ma===nv.ma));
           r += renderRow('Tổng PV1', totCttPV, true);
           return r;
        });
        
        html += createTbl(2, 'CÔNG NĂNG SUẤT PHỤC VỤ', '#2980b9', () => {
           let r = '';
           grpPV.forEach((g,i) => r += renderRow(g.ma+' - '+g.ten, pvCnss[i], false, g.ma===nv.ma));
           r += renderRow('Tổng PV1', totCnsPV, true);
           return r;
        });

        html += createTbl(3, 'CÔNG NĂNG SUẤT CÁC BÀN', '#27ae60', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banCnss[i]));
           r += renderRow('PV1', totCnsPV);
           r += renderRow('Tổng Ka1', totCnsKa, true);
           return r;
        });

        html += createTbl(4, 'CÔNG NĂNG SUẤT SẢN XUẤT (SAU KHI BỎ PHẦN PV)', '#27ae60', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banCnss[i]));
           r += renderRow('Tổng SX', totCnsSX, true);
           return r;
        });

        html += createTbl(5, 'TỔNG CÔNG NĂNG SUẤT (THÊM CÔNG PV)', '#8e44ad', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banCnsWithPv[i]));
           r += renderRow('Tổng Ka1', totCnsWithPv, true);
           return r;
        });

        html += createTbl(6, 'NĂNG SUẤT THỰC TẾ', '#c0392b', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banNstt[i], false, false, true));
           r += renderRow('Tổng Ka1', nsttTotalArr, true, false, true);
           return r;
        });

        html += createTbl(7, 'BC2 - ĐƠN GIÁ 1 CÔNG NS (ĐÃ TRỪ PV)', '#d35400', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banDonGia[i], false, false, true));
           return r;
        });

        html += createTbl(8, 'SẢN LƯỢNG TRÍCH CHO BỘ PHẬN PV', '#16a085', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banTrichPv[i], false, false, true));
           r += renderRow('Tổng', totTrichPv, true, false, true);
           return r;
        });

        html += createTbl(9, 'BC 3 - NĂNG SUẤT TÍNH LƯƠNG CÁC BÀN (SX)', '#f39c12', () => {
           let r = '';
           grpSX.forEach(g => {
              r += renderRow(g.ma+' - '+g.ten+' ('+g.level5+')', getSxNs(g), false, g.ma===nv.ma, true);
           });
           return r;
        });

        html += createTbl(10, 'BC 3 - NĂNG SUẤT TÍNH LƯƠNG NHÂN VIÊN PHỤC VỤ', '#f39c12', () => {
           let r = '';
           grpPV.forEach(g => {
              r += renderRow(g.ma+' - '+g.ten, getPvNs(g), false, g.ma===nv.ma, true);
           });
           return r;
        });

        html += createTbl(11, 'TỔNG NĂNG SUẤT SAU KHI CỘNG PHỤ VỤ', '#2c3e50', () => {
           let r = '';
           const banFinalNstt = l5Keys.map((l5, idx) => {
              return daysArr.map((_, i) => banNstt[idx][i] - banTrichPv[idx][i]); 
           });
           l5Keys.forEach((l5,i) => r += renderRow(l5, banFinalNstt[i], false, false, true));
           r += renderRow('Tổng PV', totTrichPv, true, false, true);
           r += renderRow('Tổng Cộng', sumArrs([sumArrs(banFinalNstt), totTrichPv]), true, false, true);
           return r;
        });

      } else {

        html += '<div class="trace-section"><div class="trace-header">Bước 1: Công thực tế → Công năng suất theo ngày — ' + nv.ma + ' ' + nv.ten + ' <span class="step-badge">CALC-01</span></div><div class="trace-body">' +
          '<div style="margin-bottom:8px;font-size:11px;color:#555">' +
            '<b>Công thức:</b> ' + (nv.vai_tro === "PV" ? "CNS (PV) = CTT &times; (HST% + 10%)" : "CNS = CTT &times; HST%") + ' (Hệ số % = ' + nv.hst + '%' + (bspvFactor ? ', Phụ cấp PV = ' + bspvFactor : '') + ')' +
          '</div>' +
          '<div style="overflow-x:auto"><table>' +
            '<tr><th style="background:#2980b9;color:#fff;min-width:140px;text-align:left">Chỉ tiêu</th>';
        nv._days.forEach(dd => {
          html += '<th style="background:#2980b9;color:#fff;min-width:40px">N' + String(dd.d).padStart(2,'0') + '</th>';
        });
        html += '<th style="background:#2980b9;color:#fff;min-width:60px">Tổng</th></tr>';
        
        let sumDayCtt = 0, sumDayCns = 0;
        let trCtt = '<tr><td style="font-weight:bold;text-align:left">Công thực tế</td>';
        let trCns = '<tr><td style="font-weight:bold;text-align:left">Công năng suất</td>';
        
        nv._days.forEach(dd => {
          if (dd.isOff) { 
            trCtt += '<td style="color:#aaa;font-size:10px">—</td>';
            trCns += '<td style="color:#aaa;font-size:10px">—</td>';
          } else {
            sumDayCtt += dd.ctt; sumDayCns += dd.cns;
            trCtt += '<td>' + dd.ctt + '</td>';
            trCns += '<td style="font-weight:bold">' + dd.cns.toFixed(3) + '</td>';
          }
        });
        trCtt += '<td style="font-weight:bold">' + sumDayCtt.toFixed(1) + '</td></tr>';
        trCns += '<td style="font-weight:bold;color:#c0392b">' + sumDayCns.toFixed(3) + '</td></tr>';
        html += trCtt + trCns + '</table></div></div></div>';

        // ── BƯỚC 2: ĐƠN GIÁ 1 CÔNG NS & NĂNG SUẤT TÍNH LƯƠNG THEO NGÀY ──
        const denomCns = nv.th === "TH4" ? (nv.vai_tro === "SX" ? nh.cns_sx : nh.cns_pv) : nh.cns_total;
        const numerNstt = nv.th === "TH4" ? (nv.vai_tro === "SX" ? nh.ns_sau_giam : nh.ns_giam_pv) : nh.nstt;
        const unitRate = denomCns > 0 ? numerNstt / denomCns : 0;

        html += '<div class="trace-section"><div class="trace-header">Bước 2: Đơn giá 1 công NS & Năng suất tính lương theo ngày <span class="step-badge">CALC-02</span></div><div class="trace-body">' +
          '<div class="trace-formula">Đơn giá 1 công NS = ' + fn6Fmt(numerNstt) + ' / ' + denomCns.toFixed(3) + ' = <b>' + fn6Fmt(unitRate) + '</b> /công NS</div>' +
          '<div style="overflow-x:auto"><table>' +
            '<tr><th style="background:#e67e22;color:#fff;min-width:140px;text-align:left">Chỉ tiêu</th>';
        nv._days.forEach(dd => {
          html += '<th style="background:#e67e22;color:#fff;min-width:40px">N' + String(dd.d).padStart(2,'0') + '</th>';
        });
        html += '<th style="background:#e67e22;color:#fff;min-width:60px">Tổng</th></tr>';
        
        let sumDayNS = 0;
        let trCns2 = '<tr><td style="font-weight:bold;text-align:left">CNS ngày</td>';
        let trNsDay = '<tr><td style="font-weight:bold;text-align:left">NS tính lương</td>';
        
        nv._days.forEach(dd => {
          if (dd.isOff) {
            trCns2 += '<td style="color:#aaa;font-size:10px">—</td>';
            trNsDay += '<td style="color:#aaa;font-size:10px">—</td>';
          } else {
            const nsDay = dd.cns * unitRate;
            sumDayNS += nsDay;
            trCns2 += '<td>' + dd.cns.toFixed(3) + '</td>';
            trNsDay += '<td style="font-weight:bold">' + fn6Fmt(nsDay) + '</td>';
          }
        });
        trCns2 += '<td style="font-weight:bold">' + sumDayCns.toFixed(3) + '</td></tr>';
        trNsDay += '<td style="font-weight:bold;color:#c0392b">' + fn6Fmt(sumDayNS) + '</td></tr>';
        html += trCns2 + trNsDay + '</table></div></div></div>';

        // ── BƯỚC 3 ──
        const step1Title = nv.th === "TH3" ? "Tính tổng CNS của Level5" : "Công năng suất (CNS) — Tất cả NV trong nhóm";
        html += '<div class="trace-section"><div class="trace-header">Bước 3: ' + step1Title + ' <span class="step-badge">CALC-03</span></div><div class="trace-body">' +
          '<div style="margin-bottom:8px;font-size:11px;color:#555">' +
            '<b>Công thức:</b> CNS = CTT &times; (HST / 100)' +
          '</div>' +
          '<div style="overflow-x:auto"><table>' +
            '<tr><th style="background:#2980b9;color:#fff">STT</th><th style="background:#2980b9;color:#fff">Mã NV</th><th style="background:#2980b9;color:#fff;text-align:left">Họ tên</th><th style="background:#2980b9;color:#fff">Level 5</th><th style="background:#2980b9;color:#fff">CTT</th><th style="background:#2980b9;color:#fff">HST%</th><th style="background:#2980b9;color:#fff;min-width:200px">Công thức</th><th style="background:#2980b9;color:#fff">CNS</th><th style="background:#2980b9;color:#fff">Chi tiết</th></tr>';
        grpNvs.forEach((g, i) => {
          const formula = g.ctt + ' &times; ' + (g.hst/100).toFixed(2);
          html += '<tr' + hl(g.ma) + '><td>' + (i+1) + '</td><td>' + g.ma + '</td><td class="tl">' + g.ten + '</td><td>' + g.level5 + '</td><td>' + g.ctt + '</td><td>' + g.hst + '%</td><td style="text-align:left;font-family:monospace;font-size:10px">' + formula + ' = ' + g.cns.toFixed(3) + '</td><td style="font-weight:bold">' + g.cns.toFixed(3) + '</td><td><button onclick="fn6ShowCongDetail(\'' + g.ma + '\',\'' + g.ten + '\',' + g.ctt + ',' + g.hst + ')" style="background:#17a2b8;color:#fff;border:none;border-radius:3px;padding:2px 6px;cursor:pointer;font-size:10px;" title="Xem chi tiết công theo ngày">📋</button></td></tr>';
        });
        html += '<tr style="background:#e9ecef;font-weight:bold"><td colspan="7" style="text-align:right">TỔNG CNS NHÓM</td><td colspan="2" style="font-size:13px;color:#c0392b">' + nh.cns_total.toFixed(3) + '</td></tr>';
        if (nh.nv_pv > 0) html += '<tr style="background:#f8f9fa"><td colspan="7" style="text-align:right">CNS SX</td><td colspan="2">' + nh.cns_sx.toFixed(3) + '</td></tr><tr style="background:#f8f9fa"><td colspan="7" style="text-align:right">CNS PV</td><td colspan="2">' + nh.cns_pv.toFixed(3) + '</td></tr>';
        html += '</table></div></div></div>';

        if (nv.th === "TH3") {
          // ── TH3: BƯỚC 4 — TỔNG NSTT CỦA NHÓM NS ──
          const l5List = nh.level5 || [];
          const nsttPerL5 = [];
          let nsttTotal = 0;
          l5List.forEach((l5, idx) => {
            const val = Math.round(nh.nstt / l5List.length / 100) * 100 + (idx === 0 ? nh.nstt - Math.round(nh.nstt / l5List.length / 100) * 100 * l5List.length : 0);
            const mockVal = +(nh.nstt / l5List.length).toFixed(2);
            nsttPerL5.push({ level5: l5, nstt: mockVal });
            nsttTotal += mockVal;
          });

          html += '<div class="trace-section"><div class="trace-header">Bước 4: Tổng NSTT của Nhóm NS <span class="step-badge">CALC-04</span></div><div class="trace-body">' +
            '<div style="overflow-x:auto"><table>' +
              '<tr><th style="background:#27ae60;color:#fff">STT</th><th style="background:#27ae60;color:#fff;text-align:left">Level 5</th><th style="background:#27ae60;color:#fff">Sản lượng</th></tr>';
          nsttPerL5.forEach((r, i) => {
            html += '<tr><td>' + (i+1) + '</td><td class="tl">' + r.level5 + '</td><td style="font-weight:bold">' + fn6Fmt(r.nstt) + '</td></tr>';
          });
          html += '<tr style="background:#e9ecef;font-weight:bold"><td colspan="2" style="text-align:right">Tổng</td><td style="font-size:13px;color:#c0392b">' + fn6Fmt(nsttTotal) + '</td></tr>';
          html += '</table></div></div></div>';

          // ── TH3: BƯỚC 5 — CHIA NS THEO CNS ──
          html += '<div class="trace-section"><div class="trace-header">Bước 5: Chia NS theo CNS trong 1 ĐV cấp 5 <span class="step-badge">CALC-05</span></div><div class="trace-body">' +
            '<div style="margin-bottom:6px;font-size:11px;color:#555"><b>Công thức:</b> NS_TL = NSTT / CNS_Tổng &times; CNS_NV = ' + fn6Fmt(nh.nstt) + ' / ' + nh.cns_total.toFixed(3) + ' &times; CNS_NV</div>' +
            '<div style="overflow-x:auto"><table>' +
              '<tr><th style="background:#e67e22;color:#fff">STT</th><th style="background:#e67e22;color:#fff">Mã NV</th><th style="background:#e67e22;color:#fff;text-align:left">Họ tên</th><th style="background:#e67e22;color:#fff">Level 5</th><th style="background:#e67e22;color:#fff">CNS</th><th style="background:#e67e22;color:#fff;min-width:220px">Công thức</th><th style="background:#e67e22;color:#fff">NS_TL (Kg)</th></tr>';
          let sumTH3 = 0;
          grpNvs.forEach((g, i) => {
            sumTH3 += g.ns_final;
            html += '<tr' + hl(g.ma) + '><td>' + (i+1) + '</td><td>' + g.ma + '</td><td class="tl">' + g.ten + '</td><td>' + g.level5 + '</td><td>' + g.cns.toFixed(3) + '</td><td style="text-align:left;font-family:monospace;font-size:10px">' + fn6Fmt(nh.nstt) + ' / ' + nh.cns_total.toFixed(3) + ' &times; ' + g.cns.toFixed(3) + '</td><td style="font-weight:bold;color:#e67e22">' + fn6Fmt(g.ns_final) + '</td></tr>';
          });
          html += '<tr style="background:#e9ecef;font-weight:bold"><td colspan="6" style="text-align:right">TỔNG NS</td><td style="color:#e67e22">' + fn6Fmt(sumTH3) + '</td></tr></table></div></div></div>';

        } else {
          // ── TH2: BƯỚC 4 — CHIA NS THEO CNS ──
          html += '<div class="trace-section"><div class="trace-header">Bước 4: Chia NS theo CNS trong 1 ĐV cấp 5 <span class="step-badge">CALC-04</span></div><div class="trace-body">' +
            '<div style="margin-bottom:6px;font-size:11px;color:#555"><b>Công thức:</b> NS_TL = NSTT / CNS_Tổng &times; CNS_NV = ' + fn6Fmt(nh.nstt) + ' / ' + nh.cns_total.toFixed(3) + ' &times; CNS_NV</div>' +
            '<div style="overflow-x:auto"><table>' +
              '<tr><th style="background:#e67e22;color:#fff">STT</th><th style="background:#e67e22;color:#fff">Mã NV</th><th style="background:#e67e22;color:#fff;text-align:left">Họ tên</th><th style="background:#e67e22;color:#fff">Level 5</th><th style="background:#e67e22;color:#fff">CNS</th><th style="background:#e67e22;color:#fff;min-width:220px">Công thức</th><th style="background:#e67e22;color:#fff">NS_TL (Kg)</th></tr>';
          let sumAll = 0;
          grpNvs.forEach((g, i) => {
            sumAll += g.ns_final;
            html += '<tr' + hl(g.ma) + '><td>' + (i+1) + '</td><td>' + g.ma + '</td><td class="tl">' + g.ten + '</td><td>' + g.level5 + '</td><td>' + g.cns.toFixed(3) + '</td><td style="text-align:left;font-family:monospace;font-size:10px">' + fn6Fmt(nh.nstt) + ' / ' + nh.cns_total.toFixed(3) + ' &times; ' + g.cns.toFixed(3) + '</td><td style="font-weight:bold;color:#e67e22">' + fn6Fmt(g.ns_final) + '</td></tr>';
          });
          html += '<tr style="background:#e9ecef;font-weight:bold"><td colspan="6" style="text-align:right">TỔNG NS</td><td style="color:#e67e22">' + fn6Fmt(sumAll) + '</td></tr></table></div></div></div>';
        }
      }

      if (nv.th === "TH4") {
        const renderHeader = (title, color) => {
          let h = '<tr>';
          h += `<th style="background:\${color};color:#fff;min-width:140px;text-align:left">\${title}</th>`;
          for(let d=1; d<=daysInMonth; d++) h += `<th style="background:\${color};color:#fff;min-width:35px">N\${String(d).padStart(2,'0')}</th>`;
          h += `<th style="background:\${color};color:#fff;min-width:60px">Tổng</th></tr>`;
          return h;
        };
        const renderRow = (label, arr, isBold=false, highlight=false, formatSum=false) => {
          let h = `<tr\${highlight ? ' style="background:#fff3cd;font-weight:bold"' : (isBold?' style="font-weight:bold"':'')}>`;
          h += `<td class="tl">\${label}</td>`;
          let total = 0;
          for(let d=1; d<=daysInMonth; d++) {
             let v = arr[d-1];
             total += v;
             h += `<td\${v===0?' style="color:#aaa"':''}>\${v===0 ? '-' : (formatSum ? fn6Fmt(v) : v.toFixed(3))}</td>`;
          }
          h += `<td style="color:#c0392b;font-weight:bold">\${formatSum ? fn6Fmt(total) : total.toFixed(3)}</td></tr>`;
          return h;
        };
        const createTbl = (step, title, color, renderRowsBody) => {
          return `<div class="trace-section"><div class="trace-header">Bước \${step}: \${title} <span class="step-badge" style="background:\${color}">BƯỚC \${step}</span></div><div class="trace-body">
            <div style="overflow-x:auto"><table style="font-size:10px">
              \${renderHeader(title, color)}
              \${renderRowsBody()}
            </table></div></div></div>`;
        };

        const daysArr = Array.from({length:daysInMonth}, (_,i)=>i+1);
        const getDailyCtt = (g) => g._days.map(d=>d.ctt);
        const getDailyCns = (g) => g._days.map(d=>d.cns);
        const sumArrs = (arrs) => daysArr.map((_,i) => arrs.reduce((s,a) => s + (a[i]||0), 0));
        
        const pvCtts = grpPV.map(getDailyCtt);
        const pvCnss = grpPV.map(getDailyCns);
        const totCttPV = sumArrs(pvCtts);
        const totCnsPV = sumArrs(pvCnss);

        const sxByL5 = {};
        grpSX.forEach(g => {
           if(!sxByL5[g.level5]) sxByL5[g.level5] = [];
           sxByL5[g.level5].push(g);
        });
        const l5Keys = Object.keys(sxByL5);
        const banCnss = l5Keys.map(l5 => sumArrs(sxByL5[l5].map(getDailyCns)));
        const totCnsSX = sumArrs(banCnss);
        const totCnsKa = sumArrs([totCnsSX, totCnsPV]);

        const banCnsWithPv = l5Keys.map((l5, idx) => {
           return daysArr.map((_, i) => {
              if (totCnsSX[i]===0) return 0;
              return banCnss[idx][i] + (banCnss[idx][i] / totCnsSX[i]) * totCnsPV[i];
           });
        });
        
        const activeDaysCount = totCnsKa.filter(v=>v>0).length || 1;
        const dailyNstt = nh.nstt / activeDaysCount;
        const nsttTotalArr = totCnsKa.map(v => v>0 ? dailyNstt : 0);
        const totCnsWithPv = sumArrs(banCnsWithPv);
        const banNstt = l5Keys.map((l5, idx) => {
           return daysArr.map((_, i) => {
              if (totCnsWithPv[i]===0) return 0;
              return (banCnsWithPv[idx][i] / totCnsWithPv[i]) * nsttTotalArr[i];
           });
        });

        const banDonGia = l5Keys.map((l5, idx) => {
           return daysArr.map((_, i) => {
              if (banCnss[idx][i]===0) return 0;
              return banNstt[idx][i] / banCnss[idx][i];
           });
        });

        const banTrichPv = l5Keys.map((l5, idx) => {
           return daysArr.map((_, i) => {
              if (totCnsKa[i]===0) return 0;
              return banNstt[idx][i] * (totCnsPV[i] / totCnsKa[i]);
           });
        });
        const totTrichPv = sumArrs(banTrichPv);

        const getSxNs = (g) => {
           const bIdx = l5Keys.indexOf(g.level5);
           const arr = getDailyCns(g);
           return daysArr.map((_,i) => arr[i] * banDonGia[bIdx][i]);
        };
        const getPvNs = (g) => {
           const arr = getDailyCns(g);
           return daysArr.map((_,i) => {
              if (totCnsPV[i]===0) return 0;
              return arr[i] / totCnsPV[i] * totTrichPv[i];
           });
        };

        html += createTbl(1, 'CÔNG THỰC TẾ PHỤC VỤ', '#2980b9', () => {
           let r = '';
           grpPV.forEach((g,i) => r += renderRow(g.ma+' - '+g.ten, pvCtts[i], false, g.ma===nv.ma));
           r += renderRow('Tổng PV1', totCttPV, true);
           return r;
        });
        
        html += createTbl(2, 'CÔNG NĂNG SUẤT PHỤC VỤ', '#2980b9', () => {
           let r = '';
           grpPV.forEach((g,i) => r += renderRow(g.ma+' - '+g.ten, pvCnss[i], false, g.ma===nv.ma));
           r += renderRow('Tổng PV1', totCnsPV, true);
           return r;
        });

        html += createTbl(3, 'CÔNG NĂNG SUẤT CÁC BÀN', '#27ae60', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banCnss[i]));
           r += renderRow('PV1', totCnsPV);
           r += renderRow('Tổng Ka1', totCnsKa, true);
           return r;
        });

        html += createTbl(4, 'CÔNG NĂNG SUẤT SẢN XUẤT (SAU KHI BỎ PHẦN PV)', '#27ae60', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banCnss[i]));
           r += renderRow('Tổng SX', totCnsSX, true);
           return r;
        });

        html += createTbl(5, 'TỔNG CÔNG NĂNG SUẤT (THÊM CÔNG PV)', '#8e44ad', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banCnsWithPv[i]));
           r += renderRow('Tổng Ka1', totCnsWithPv, true);
           return r;
        });

        html += createTbl(6, 'NĂNG SUẤT THỰC TẾ', '#c0392b', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banNstt[i], false, false, true));
           r += renderRow('Tổng Ka1', nsttTotalArr, true, false, true);
           return r;
        });

        html += createTbl(7, 'BC2 - ĐƠN GIÁ 1 CÔNG NS (ĐÃ TRỪ PV)', '#d35400', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banDonGia[i], false, false, true));
           return r;
        });

        html += createTbl(8, 'SẢN LƯỢNG TRÍCH CHO BỘ PHẬN PV', '#16a085', () => {
           let r = '';
           l5Keys.forEach((l5,i) => r += renderRow(l5, banTrichPv[i], false, false, true));
           r += renderRow('Tổng', totTrichPv, true, false, true);
           return r;
        });

        html += createTbl(9, 'BC 3 - NĂNG SUẤT TÍNH LƯƠNG CÁC BÀN (SX)', '#f39c12', () => {
           let r = '';
           grpSX.forEach(g => {
              r += renderRow(g.ma+' - '+g.ten+' ('+g.level5+')', getSxNs(g), false, g.ma===nv.ma, true);
           });
           return r;
        });

        html += createTbl(10, 'BC 3 - NĂNG SUẤT TÍNH LƯƠNG NHÂN VIÊN PHỤC VỤ', '#f39c12', () => {
           let r = '';
           grpPV.forEach(g => {
              r += renderRow(g.ma+' - '+g.ten, getPvNs(g), false, g.ma===nv.ma, true);
           });
           return r;
        });

        html += createTbl(11, 'TỔNG NĂNG SUẤT SAU KHI CỘNG PHỤ VỤ', '#2c3e50', () => {
           let r = '';
           const banFinalNstt = l5Keys.map((l5, idx) => {
              return daysArr.map((_, i) => banNstt[idx][i] - banTrichPv[idx][i]); 
           });
           l5Keys.forEach((l5,i) => r += renderRow(l5, banFinalNstt[i], false, false, true));
           r += renderRow('Tổng PV', totTrichPv, true, false, true);
           r += renderRow('Tổng Cộng', sumArrs([sumArrs(banFinalNstt), totTrichPv]), true, false, true);
           return r;
        });

      } else {
        // ── BƯỚC 1: CÔNG THỰC TẾ → CÔNG NĂNG SUẤT THEO NGÀY (NV ĐANG XEM) ──
        html += `<div class="trace-section"><div class="trace-header">Bước 1: Công thực tế → Công năng suất theo ngày — \${nv.ma} \${nv.ten} <span class="step-badge">CALC-01</span></div><div class="trace-body">
          <div style="margin-bottom:8px;font-size:11px;color:#555">
            <b>Công thức:</b> \${nv.vai_tro === "PV" ? "CNS (PV) = CTT × (HST% + 10%)" : "CNS = CTT × HST%"} (Hệ số % = \${nv.hst}%\${bspvFactor ? `, Phụ cấp PV = \${bspvFactor}` : ''})
          </div>
          <div style="overflow-x:auto"><table>
            <tr><th style="background:#2980b9;color:#fff;min-width:140px;text-align:left">Chỉ tiêu</th>`;
        nv._days.forEach(dd => {
          html += `<th style="background:#2980b9;color:#fff;min-width:40px">N\${String(dd.d).padStart(2,'0')}</th>`;
        });
        html += `<th style="background:#2980b9;color:#fff;min-width:60px">Tổng</th></tr>`;
        
        let sumDayCtt = 0, sumDayCns = 0;
        let trCtt = `<tr><td style="font-weight:bold;text-align:left">Công thực tế</td>`;
        let trCns = `<tr><td style="font-weight:bold;text-align:left">Công năng suất</td>`;
        
        nv._days.forEach(dd => {
          if (dd.isOff) { 
            trCtt += `<td style="color:#aaa;font-size:10px">—</td>`;
            trCns += `<td style="color:#aaa;font-size:10px">—</td>`;
          } else {
            sumDayCtt += dd.ctt; sumDayCns += dd.cns;
            trCtt += `<td>\${dd.ctt}</td>`;
            trCns += `<td style="font-weight:bold">\${dd.cns.toFixed(3)}</td>`;
          }
        });
        trCtt += `<td style="font-weight:bold">\${sumDayCtt.toFixed(1)}</td></tr>`;
        trCns += `<td style="font-weight:bold;color:#c0392b">\${sumDayCns.toFixed(3)}</td></tr>`;
        html += trCtt + trCns + `</table></div></div></div>`;

        // ── BƯỚC 2: ĐƠN GIÁ 1 CÔNG NS & NĂNG SUẤT TÍNH LƯƠNG THEO NGÀY ──
        const denomCns = nv.th === "TH4" ? (nv.vai_tro === "SX" ? nh.cns_sx : nh.cns_pv) : nh.cns_total;
        const numerNstt = nv.th === "TH4" ? (nv.vai_tro === "SX" ? nh.ns_sau_giam : nh.ns_giam_pv) : nh.nstt;
        const unitRate = denomCns > 0 ? numerNstt / denomCns : 0;

        html += `<div class="trace-section"><div class="trace-header">Bước 2: Đơn giá 1 công NS & Năng suất tính lương theo ngày <span class="step-badge">CALC-02</span></div><div class="trace-body">
          <div class="trace-formula">Đơn giá 1 công NS = \${fn6Fmt(numerNstt)} / \${denomCns.toFixed(3)} = <b>\${fn6Fmt(unitRate)}</b> /công NS</div>
          <div style="overflow-x:auto"><table>
            <tr><th style="background:#e67e22;color:#fff;min-width:140px;text-align:left">Chỉ tiêu</th>`;
        nv._days.forEach(dd => {
          html += `<th style="background:#e67e22;color:#fff;min-width:40px">N\${String(dd.d).padStart(2,'0')}</th>`;
        });
        html += `<th style="background:#e67e22;color:#fff;min-width:60px">Tổng</th></tr>`;
        
        let sumDayNS = 0;
        let trCns2 = `<tr><td style="font-weight:bold;text-align:left">CNS ngày</td>`;
        let trNsDay = `<tr><td style="font-weight:bold;text-align:left">NS tính lương</td>`;
        
        nv._days.forEach(dd => {
          if (dd.isOff) {
            trCns2 += `<td style="color:#aaa;font-size:10px">—</td>`;
            trNsDay += `<td style="color:#aaa;font-size:10px">—</td>`;
          } else {
            const nsDay = dd.cns * unitRate;
            sumDayNS += nsDay;
            trCns2 += `<td>\${dd.cns.toFixed(3)}</td>`;
            trNsDay += `<td style="font-weight:bold">\${fn6Fmt(nsDay)}</td>`;
          }
        });
        trCns2 += `<td style="font-weight:bold">\${sumDayCns.toFixed(3)}</td></tr>`;
        trNsDay += `<td style="font-weight:bold;color:#c0392b">\${fn6Fmt(sumDayNS)}</td></tr>`;
        html += trCns2 + trNsDay + `</table></div></div></div>`;

        // ── BƯỚC 3 ──
        const step1Title = nv.th === "TH3" ? "Tính tổng CNS của Level5" : "Công năng suất (CNS) — Tất cả NV trong nhóm";
        html += `<div class="trace-section"><div class="trace-header">Bước 3: \${step1Title} <span class="step-badge">CALC-03</span></div><div class="trace-body">
          <div style="margin-bottom:8px;font-size:11px;color:#555">
            <b>Công thức:</b> CNS = CTT × (HST / 100)
          </div>
          <div style="overflow-x:auto"><table>
            <tr><th style="background:#2980b9;color:#fff">STT</th><th style="background:#2980b9;color:#fff">Mã NV</th><th style="background:#2980b9;color:#fff;text-align:left">Họ tên</th><th style="background:#2980b9;color:#fff">Level 5</th><th style="background:#2980b9;color:#fff">CTT</th><th style="background:#2980b9;color:#fff">HST%</th><th style="background:#2980b9;color:#fff;min-width:200px">Công thức</th><th style="background:#2980b9;color:#fff">CNS</th><th style="background:#2980b9;color:#fff">Chi tiết</th></tr>`;
        grpNvs.forEach((g, i) => {
          const formula = `\${g.ctt} × \${(g.hst/100).toFixed(2)}`;
          html += `<tr\${hl(g.ma)}><td>\${i+1}</td><td>\${g.ma}</td><td class="tl">\${g.ten}</td><td>\${g.level5}</td><td>\${g.ctt}</td><td>\${g.hst}%</td><td style="text-align:left;font-family:monospace;font-size:10px">\${formula} = \${g.cns.toFixed(3)}</td><td style="font-weight:bold">\${g.cns.toFixed(3)}</td><td><button onclick="fn6ShowCongDetail('\${g.ma}','\${g.ten}',\${g.ctt},\${g.hst})" style="background:#17a2b8;color:#fff;border:none;border-radius:3px;padding:2px 6px;cursor:pointer;font-size:10px;" title="Xem chi tiết công theo ngày">📋</button></td></tr>`;
        });
        html += `<tr style="background:#e9ecef;font-weight:bold"><td colspan="7" style="text-align:right">TỔNG CNS NHÓM</td><td colspan="2" style="font-size:13px;color:#c0392b">\${nh.cns_total.toFixed(3)}</td></tr>`;
        if (nh.nv_pv > 0) html += `<tr style="background:#f8f9fa"><td colspan="7" style="text-align:right">CNS SX</td><td colspan="2">\${nh.cns_sx.toFixed(3)}</td></tr><tr style="background:#f8f9fa"><td colspan="7" style="text-align:right">CNS PV</td><td colspan="2">\${nh.cns_pv.toFixed(3)}</td></tr>`;
        html += `</table></div></div></div>`;

        if (nv.th === "TH3") {
          // ── TH3: BƯỚC 4 — TỔNG NSTT CỦA NHÓM NS ──
          const l5List = nh.level5 || [];
          const nsttPerL5 = [];
          let nsttTotal = 0;
          l5List.forEach((l5, idx) => {
            const val = Math.round(nh.nstt / l5List.length / 100) * 100 + (idx === 0 ? nh.nstt - Math.round(nh.nstt / l5List.length / 100) * 100 * l5List.length : 0);
            const mockVal = +(nh.nstt / l5List.length).toFixed(2);
            nsttPerL5.push({ level5: l5, nstt: mockVal });
            nsttTotal += mockVal;
          });

          html += `<div class="trace-section"><div class="trace-header">Bước 4: Tổng NSTT của Nhóm NS <span class="step-badge">CALC-04</span></div><div class="trace-body">
            <div style="overflow-x:auto"><table>
              <tr><th style="background:#27ae60;color:#fff">STT</th><th style="background:#27ae60;color:#fff;text-align:left">Level 5</th><th style="background:#27ae60;color:#fff">Sản lượng</th></tr>`;
          nsttPerL5.forEach((r, i) => {
            html += `<tr><td>\${i+1}</td><td class="tl">\${r.level5}</td><td style="font-weight:bold">\${fn6Fmt(r.nstt)}</td></tr>`;
          });
          html += `<tr style="background:#e9ecef;font-weight:bold"><td colspan="2" style="text-align:right">Tổng</td><td style="font-size:13px;color:#c0392b">\${fn6Fmt(nsttTotal)}</td></tr>`;
          html += `</table></div></div></div>`;

          // ── TH3: BƯỚC 5 — CHIA NS THEO CNS ──
          html += `<div class="trace-section"><div class="trace-header">Bước 5: Chia NS theo CNS trong 1 ĐV cấp 5 <span class="step-badge">CALC-05</span></div><div class="trace-body">
            <div style="margin-bottom:6px;font-size:11px;color:#555"><b>Công thức:</b> NS_TL = NSTT / CNS_Tổng × CNS_NV = \${fn6Fmt(nh.nstt)} / \${nh.cns_total.toFixed(3)} × CNS_NV</div>
            <div style="overflow-x:auto"><table>
              <tr><th style="background:#e67e22;color:#fff">STT</th><th style="background:#e67e22;color:#fff">Mã NV</th><th style="background:#e67e22;color:#fff;text-align:left">Họ tên</th><th style="background:#e67e22;color:#fff">Level 5</th><th style="background:#e67e22;color:#fff">CNS</th><th style="background:#e67e22;color:#fff;min-width:220px">Công thức</th><th style="background:#e67e22;color:#fff">NS_TL (Kg)</th></tr>`;
          let sumTH3 = 0;
          grpNvs.forEach((g, i) => {
            sumTH3 += g.ns_final;
            html += `<tr\${hl(g.ma)}><td>\${i+1}</td><td>\${g.ma}</td><td class="tl">\${g.ten}</td><td>\${g.level5}</td><td>\${g.cns.toFixed(3)}</td><td style="text-align:left;font-family:monospace;font-size:10px">\${fn6Fmt(nh.nstt)} / \${nh.cns_total.toFixed(3)} × \${g.cns.toFixed(3)}</td><td style="font-weight:bold;color:#e67e22">\${fn6Fmt(g.ns_final)}</td></tr>`;
          });
          html += `<tr style="background:#e9ecef;font-weight:bold"><td colspan="6" style="text-align:right">TỔNG NS</td><td style="color:#e67e22">\${fn6Fmt(sumTH3)}</td></tr></table></div></div></div>`;

        } else {
          // ── TH2: BƯỚC 4 — CHIA NS THEO CNS ──
          html += `<div class="trace-section"><div class="trace-header">Bước 4: Chia NS theo CNS trong 1 ĐV cấp 5 <span class="step-badge">CALC-04</span></div><div class="trace-body">
            <div style="margin-bottom:6px;font-size:11px;color:#555"><b>Công thức:</b> NS_TL = NSTT / CNS_Tổng × CNS_NV = \${fn6Fmt(nh.nstt)} / \${nh.cns_total.toFixed(3)} × CNS_NV</div>
            <div style="overflow-x:auto"><table>
              <tr><th style="background:#e67e22;color:#fff">STT</th><th style="background:#e67e22;color:#fff">Mã NV</th><th style="background:#e67e22;color:#fff;text-align:left">Họ tên</th><th style="background:#e67e22;color:#fff">Level 5</th><th style="background:#e67e22;color:#fff">CNS</th><th style="background:#e67e22;color:#fff;min-width:220px">Công thức</th><th style="background:#e67e22;color:#fff">NS_TL (Kg)</th></tr>`;
          let sumAll = 0;
          grpNvs.forEach((g, i) => {
            sumAll += g.ns_final;
            html += `<tr\${hl(g.ma)}><td>\${i+1}</td><td>\${g.ma}</td><td class="tl">\${g.ten}</td><td>\${g.level5}</td><td>\${g.cns.toFixed(3)}</td><td style="text-align:left;font-family:monospace;font-size:10px">\${fn6Fmt(nh.nstt)} / \${nh.cns_total.toFixed(3)} × \${g.cns.toFixed(3)}</td><td style="font-weight:bold;color:#e67e22">\${fn6Fmt(g.ns_final)}</td></tr>`;
          });
          html += `<tr style="background:#e9ecef;font-weight:bold"><td colspan="6" style="text-align:right">TỔNG NS</td><td style="color:#e67e22">\${fn6Fmt(sumAll)}</td></tr></table></div></div></div>`;
        }
      }

      // ── KẾT QUẢ NV ĐANG XEM ──
      html += `<div class="trace-section" style="border-color:#28a745"><div class="trace-header" style="background:#d4edda;color:#155724">⭐ Kết quả NS_FINAL — ${nv.ma} ${nv.ten} <span class="step-badge" style="background:#28a745">FINAL</span></div><div class="trace-body" style="text-align:center;padding:20px">
        <div class="trace-result">${fn6Fmt(nv.ns_final)} Kg</div>
      </div></div>`;

      document.getElementById("fn6-detail-body").innerHTML = html;
      document.getElementById("fn6-detail-modal").classList.add("show");
    }

    function fn6CloseDetail() { document.getElementById("fn6-detail-modal").classList.remove("show"); }

    function fn6ExportDetailExcel() {
      if (!FN6_DATA || fn6DetailIdx == null) return;
      const nv = FN6_DATA.nvs[fn6DetailIdx];
      const nh = FN6_DATA.nhomMap[nv.nhom_id];
      const grpNvs = FN6_DATA.nvs.filter(v => v.nhom_id === nv.nhom_id);

      let csv = '﻿';
      csv += `CHI TIẾT LOGIC TÍNH NS — ${nv.nhom_id} ${nv.nhom_ten} — ${nv.th}\r\n`;
      csv += `Tháng,${document.getElementById('fn6-thang').value}\r\n`;
      csv += `NSTT nhóm (Kg),${nh.nstt}\r\n\r\n`;

      csv += `BƯỚC 1: CÔNG NS CÁC NV TRONG NHÓM\r\n`;
      csv += `STT,Mã NV,Họ tên,Level 5,Vai trò,CTT,HST%,BSPV%,CNS\r\n`;
      grpNvs.forEach((g, i) => {
        csv += `${i+1},${g.ma},${g.ten},${g.level5},${g.vai_tro},${g.ctt},${g.hst},${g.bspv},${g.cns.toFixed(3)}\r\n`;
      });
      csv += `,,,,,,,TỔNG CNS,${nh.cns_total.toFixed(3)}\r\n`;
      if (nh.nv_pv > 0) {
        csv += `,,,,,,,CNS SX,${nh.cns_sx.toFixed(3)}\r\n`;
        csv += `,,,,,,,CNS PV,${nh.cns_pv.toFixed(3)}\r\n`;
      }
      csv += `\r\n`;

      if (nv.th === "TH4") {
        csv += `BƯỚC 2: TRÍCH PHỤC VỤ\r\n`;
        csv += `NS Giảm PV (Kg),${nh.ns_giam_pv.toFixed(2)}\r\n`;
        csv += `NS Sau Giảm (Kg),${nh.ns_sau_giam.toFixed(2)}\r\n\r\n`;
        csv += `BƯỚC 3a: CHIA NS CHO SX\r\n`;
        csv += `STT,Mã NV,Họ tên,Level 5,CNS,Tỷ trọng,NS_TL (Kg)\r\n`;
        grpNvs.filter(v => v.vai_tro === "SX").forEach((g, i) => {
          csv += `${i+1},${g.ma},${g.ten},${g.level5},${g.cns.toFixed(3)},${(nh.cns_sx > 0 ? g.cns/nh.cns_sx*100 : 0).toFixed(4)}%,${g.ns_final.toFixed(2)}\r\n`;
        });
        csv += `\r\nBƯỚC 3b: CHIA NS CHO PV\r\n`;
        csv += `STT,Mã NV,Họ tên,Level 5,CNS,Tỷ trọng,NS_TL (Kg)\r\n`;
        grpNvs.filter(v => v.vai_tro === "PV").forEach((g, i) => {
          csv += `${i+1},${g.ma},${g.ten},${g.level5},${g.cns.toFixed(3)},${(nh.cns_pv > 0 ? g.cns/nh.cns_pv*100 : 0).toFixed(4)}%,${g.ns_final.toFixed(2)}\r\n`;
        });
      } else {
        csv += `BƯỚC 2: CHIA NS THEO CNS\r\n`;
        csv += `STT,Mã NV,Họ tên,Level 5,Vai trò,CNS,Tỷ trọng,NS_TL (Kg)\r\n`;
        grpNvs.forEach((g, i) => {
          csv += `${i+1},${g.ma},${g.ten},${g.level5},${g.vai_tro},${g.cns.toFixed(3)},${(nh.cns_total > 0 ? g.cns/nh.cns_total*100 : 0).toFixed(4)}%,${g.ns_final.toFixed(2)}\r\n`;
        });
      }

      csv += `\r\nKIỂM CHỨNG\r\n`;
      csv += `NSTT nhóm,${nh.nstt}\r\n`;
      csv += `Σ NS_FINAL,${grpNvs.reduce((s, g) => s + g.ns_final, 0).toFixed(2)}\r\n`;

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ChiTiet_${nv.nhom_id}_${nv.th}_${document.getElementById('fn6-thang').value.replace('/', '-')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      fn6Alert(`📥 Đã xuất file chi tiết nhóm <b>${nv.nhom_id}</b>.`, "success");
    }

    // ============================================================
    // PDF PREVIEW
    // ============================================================
    function fn6ShowPdf(idx) {
      if (!FN6_DATA) return;
      const nv = FN6_DATA.nvs[idx];
      const nh = FN6_DATA.nhomMap[nv.nhom_id];

      let html = `<div class="pdf-preview">
        <h2>PHIẾU NĂNG SUẤT CÁ NHÂN</h2>
        <div class="sub">CÔNG TY CỔ PHẦN THỦY SẢN MINH PHÚ - HẬU GIANG | Tháng 07/2026</div>
        <table>
          <tr><th style="width:140px">Mã nhân viên</th><td>${nv.ma}</td><th style="width:100px">Họ tên</th><td>${nv.ten}</td></tr>
          <tr><th>Trường hợp</th><td>${nv.th} — ${nv.th==="TH2"?"Chung 1 ĐV":nv.th==="TH3"?"Chung nhiều ĐV":"Tách PV"}</td><th>Vai trò</th><td>${nv.vai_tro === "SX" ? "Sản xuất" : "Phục vụ"}</td></tr>
          <tr><th>Nhóm NS</th><td>${nv.nhom_id} — ${nv.nhom_ten}</td><th>Level 5</th><td>${nv.level5}</td></tr>
        </table>
        <table>
          <tr style="background:#e8f4f8"><th colspan="4" style="text-align:center">CHI TIẾT TÍNH TOÁN</th></tr>
          <tr><th style="width:200px">Công thực tế (CTT)</th><td>${nv.ctt}</td><th style="width:200px">Hệ số TL (%)</th><td>${nv.hst}%</td></tr>
          <tr><th>Bổ sung PV (%)</th><td>${nv.bspv > 0 ? nv.bspv + "%" : "—"}</td><th>Công NS (CNS)</th><td style="font-weight:bold">${nv.cns.toFixed(3)}</td></tr>
          <tr><th>CNS tổng nhóm</th><td>${nh.cns_total.toFixed(2)}</td><th>NSTT nhóm (Kg)</th><td>${fn6Fmt(nh.nstt)}</td></tr>
          ${nv.th === "TH4" ? `<tr><th>NS giảm PV (Kg)</th><td>${fn6Fmt(nh.ns_giam_pv)}</td><th>NS sau giảm (Kg)</th><td>${fn6Fmt(nh.ns_sau_giam)}</td></tr>` : ""}
        </table>
        <table>
          <tr style="background:#d4edda"><th colspan="2" style="text-align:center">KẾT QUẢ</th></tr>
          <tr><th style="width:200px;font-size:14px">NS TÍNH LƯƠNG (NS_FINAL)</th><td style="font-size:18px;font-weight:bold;color:#c0392b">${fn6Fmt(nv.ns_final)} Kg</td></tr>
          <tr><th>Nguồn</th><td>${nv.nguon}</td></tr>
          <tr><th>Tỷ trọng trong nhóm</th><td>${nh.nstt > 0 ? (nv.ns_final/nh.nstt*100).toFixed(2) : 0}%</td></tr>
        </table>
        <div class="sign-area">
          <div><br><br><br>Người lập</div>
          <div><br><br><br>Quản lý bộ phận</div>
          <div><br><br><br>Nhân viên xác nhận</div>
        </div>
      </div>`;

      document.getElementById("fn6-pdf-body").innerHTML = html;
      document.getElementById("fn6-pdf-modal").classList.add("show");
    }

    function fn6CloseCong() { document.getElementById("fn6-cong-modal").classList.remove("show"); }
