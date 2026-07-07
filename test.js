
    // ============================================================
    // MOCK DATA
    // ============================================================
    const FN6_NHOM_NS = [
      { id:"NS-001", ten:"Bàn 1 Ka Sáng", th:"TH2", level5:["CB101"], thanhVien:12, locked:false },
      { id:"NS-002", ten:"Nhóm NL+PC Ka Sáng", th:"TH3", level5:["NL1PV","PC1T","PC1PV"], thanhVien:35, locked:false },
      { id:"NS-003", ten:"Nhóm NL+PC Ka Chiều", th:"TH3", level5:["NL2PV","PC2T","PC2PV"], thanhVien:30, locked:true },
      { id:"NS-004", ten:"Nhóm NO Ka Sáng", th:"TH4", level5:["NO101","NO102","NO103","NO1PV"], thanhVien:48, pv_level5:["NO1PV"], locked:false },
      { id:"NS-005", ten:"Nhóm Sushi Ka Sáng", th:"TH4", level5:["SU1D101","SU1D102","SU1PV"], thanhVien:36, pv_level5:["SU1PV"], locked:true },
      { id:"NS-006", ten:"Bàn 2 Ka Sáng", th:"TH2", level5:["CB102"], thanhVien:10, locked:false },
      { id:"NS-007", ten:"Nhóm CB Ka Sáng", th:"TH3", level5:["CB103","CB104","CB1PV"], thanhVien:28, locked:false },
      { id:"NS-008", ten:"Nhóm PTO Ka Sáng", th:"TH4", level5:["PTO101","PTO102","PTO1PV"], thanhVien:25, pv_level5:["PTO1PV"], locked:false },
    ];

    function fn6GenMockNV() {
      const names = ["Nguyễn Văn A","Trần Thị B","Lê Văn C","Phạm Thị D","Hoàng Văn E","Ngô Thị F","Đặng Văn G","Bùi Thị H","Vũ Văn I","Đỗ Thị K","Nguyễn Văn L","Trần Văn M","Lê Thị N","Phạm Văn O","Hoàng Thị P","Đinh Văn Q","Mai Thị R","Lý Văn S","Cao Thị T","Hà Văn U","Trịnh Thị V","Phan Văn W","Dương Thị X","Lương Văn Y","Tạ Thị Z","Châu Văn AA","Huỳnh Thị AB","Tô Văn AC","Thái Thị AD","La Văn AE","Kiều Thị AF","Từ Văn AG","Âu Thị AH","Sơn Văn AI","Kim Thị AK","Ông Văn AL","Bà Thị AM","Quách Văn AN","Mạc Thị AO","Lục Văn AP"];
      const hsts = [110,100,100,85,90,105,100,102,100,95,108,100,100,88,92,103,100,100,97,100,110,105,100,90,100,100,100,85,100,105,100,100,95,100,100,100,100,100,90,100];
      const bspvPct = 10;
      let nvs = [], id = 1;

      FN6_NHOM_NS.forEach(nhom => {
        const pvL5s = nhom.pv_level5 || [];
        nhom.level5.forEach(l5 => {
          const vaiTro = pvL5s.includes(l5) ? "PV" : "SX";
          const countInL5 = nhom.th === "TH2" ? nhom.thanhVien : Math.max(3, Math.floor(nhom.thanhVien / nhom.level5.length));
          for (let j = 0; j < Math.min(countInL5, 5); j++) {
            const ni = (id - 1) % names.length;
            const ctt = +(25 + Math.random() * 3).toFixed(1);
            const hst = hsts[ni] || 100;
            let cns;
            if (vaiTro === "PV" && hst >= 100) cns = ctt * (hst / 100 + bspvPct / 100);
            else if (vaiTro === "PV") cns = ctt;
            else cns = ctt * (hst / 100);
            nvs.push({
              stt: id, ma: "NV" + String(id).padStart(3, "0"), ten: names[ni],
              th: nhom.th, loai: nhom.th === "TH2" ? "A" : "B",
              vai_tro: vaiTro, nhom_id: nhom.id, nhom_ten: nhom.ten, level5: l5,
              ctt, hst, bspv: vaiTro === "PV" ? bspvPct : 0,
              cns: +cns.toFixed(3), locked: nhom.locked,
            });
            id++;
          }
        });
      });

      // Inject anomaly: 1 NV with NS=0 but has công, 1 NV with unusually high NS
      if (nvs.length > 3) { nvs[2].cns = 0; nvs[2].hst = 0; }
      return nvs;
    }

    let FN6_DATA = null;

    function fn6CalcEngine() {
      const nvs = fn6GenMockNV();
      const nhomMap = {};
      FN6_NHOM_NS.forEach(n => { nhomMap[n.id] = { ...n, cns_sx:0, cns_pv:0, cns_total:0, nstt:0, ns_giam_pv:0, ns_sau_giam:0, cns_pv_phanbo:0, cns_sau_pv:0, sum_final:0, nv_count:0, nv_sx:0, nv_pv:0 }; });

      nvs.forEach(nv => {
        const nh = nhomMap[nv.nhom_id];
        if (nv.vai_tro === "SX") nh.cns_sx += nv.cns;
        else nh.cns_pv += nv.cns;
        nh.cns_total += nv.cns;
        nh.nv_count++;
        if (nv.vai_tro === "SX") nh.nv_sx++; else nh.nv_pv++;
      });

      const nsttBase = {"NS-001":300000,"NS-002":1000000,"NS-003":850000,"NS-004":1500000,"NS-005":900000,"NS-006":250000,"NS-007":700000,"NS-008":600000};
      Object.keys(nhomMap).forEach(id => { nhomMap[id].nstt = nsttBase[id] || 500000; });

      Object.keys(nhomMap).forEach(id => {
        const nh = nhomMap[id];
        if (nh.th === "TH4") {
          nh.cns_sau_pv = nh.cns_sx + nh.cns_pv;
          if (nh.cns_sau_pv > 0) { nh.cns_pv_phanbo = nh.cns_pv; nh.ns_giam_pv = nh.nstt * (nh.cns_pv / nh.cns_sau_pv); nh.ns_sau_giam = nh.nstt - nh.ns_giam_pv; }
        } else { nh.cns_sau_pv = nh.cns_total; nh.ns_sau_giam = nh.nstt; }
      });

      nvs.forEach(nv => {
        const nh = nhomMap[nv.nhom_id];
        if (nv.th === "TH2" || nv.th === "TH3") {
          nv.ns_tl = nh.cns_total > 0 ? nh.nstt * (nv.cns / nh.cns_total) : 0;
          nv.ns_final = nv.ns_tl;
          nv.nguon = nv.th === "TH2" ? "Chia theo ĐV" : "Chia nhiều ĐV";
          nv.nstt_nhom = nh.nstt; nv.ns_giam = 0; nv.ns_sau_giam = nh.nstt;
        } else if (nv.th === "TH4") {
          if (nv.vai_tro === "SX") {
            nv.ns_tl = nh.cns_sx > 0 ? nh.ns_sau_giam * (nv.cns / nh.cns_sx) : 0;
            nv.nguon = "SX (sau trích PV)";
          } else {
            nv.ns_tl = nh.cns_pv > 0 ? nh.ns_giam_pv * (nv.cns / nh.cns_pv) : 0;
            nv.nguon = "PV (nhận trích)";
          }
          nv.ns_final = nv.ns_tl;
          nv.nstt_nhom = nh.nstt; nv.ns_giam = nh.ns_giam_pv; nv.ns_sau_giam = nh.ns_sau_giam;
        }
        nhomMap[nv.nhom_id].sum_final += nv.ns_final;
      });

      // Anomaly detection
      const anomalies = [];
      nvs.forEach(nv => {
        nv.anomaly = null;
        if (nv.ctt > 0 && nv.ns_final === 0) { nv.anomaly = "NS=0 dù có công"; anomalies.push({ type:"error", ma:nv.ma, ten:nv.ten, msg:`NS_FINAL = 0 nhưng CTT = ${nv.ctt}. Kiểm tra HST%.` }); }
        const nh = nhomMap[nv.nhom_id];
        const avg = nh.nstt / Math.max(nh.nv_count, 1);
        if (nv.ns_final > avg * 1.5 && nv.ns_final > 0) { nv.anomaly = "NS cao bất thường"; anomalies.push({ type:"warn", ma:nv.ma, ten:nv.ten, msg:`NS_FINAL = ${fn6Fmt(nv.ns_final)} Kg, cao hơn 50% so với TB nhóm (${fn6Fmt(avg)} Kg).` }); }
      });

      Object.values(nhomMap).forEach(nh => {
        const diff = Math.abs(nh.nstt - nh.sum_final);
        if (diff > 1 && nh.nstt > 0) { anomalies.push({ type:"error", ma:nh.id, ten:nh.ten, msg:`Mất cân bằng: NSTT = ${fn6Fmt(nh.nstt)}, Σ NS_FINAL = ${fn6Fmt(nh.sum_final)}, chênh lệch ${fn6Fmt(diff)} Kg.` }); }
      });

      const now = new Date();
      const calcTime = String(now.getDate()).padStart(2,'0')+'/'+String(now.getMonth()+1).padStart(2,'0')+'/'+now.getFullYear()+' '+String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')+':'+String(now.getSeconds()).padStart(2,'0');
      FN6_DATA = { nvs, nhomMap, anomalies, calcTime };
      return FN6_DATA;
    }

    // ============================================================
    // RENDER
    // ============================================================
    function fn6Render() {
      if (!FN6_DATA) return;
      const { nvs, nhomMap, anomalies } = FN6_DATA;
      let html = "";
      let cTH2=0, cTH3=0, cTH4=0, cSX=0, cPV=0, sumNS=0;

      nvs.forEach((nv, i) => {
        cSX += nv.vai_tro === "SX" ? 1 : 0;
        cPV += nv.vai_tro === "PV" ? 1 : 0;
        if (nv.th==="TH2") cTH2++; else if (nv.th==="TH3") cTH3++; else cTH4++;
        sumNS += nv.ns_final;

        const rowCls = nv.anomaly ? " row-anomaly" : (nv.locked ? " row-locked" : "");
        const thBadge = `<span class="badge-th ${nv.th}">${nv.th}</span>`;
        const loaiBadge = `<span class="badge-loai ${nv.loai}">${nv.loai}</span>`;
        const vaiBadge = `<span class="badge-vai ${nv.vai_tro}">${nv.vai_tro}</span>`;
        const lockBadge = nv.locked ? `<span class="badge-lock locked">✓</span>` : `<span class="badge-lock unlocked">—</span>`;
        const nhomCell = `${nv.nhom_id}<span class="nhom-tag">${nv.nhom_ten}</span>`;
        const anomalyIcon = nv.anomaly ? `<span title="${nv.anomaly}" style="color:#e65100;cursor:help;">⚠️</span>` : "";

        const lockIcon = nv.locked ? '🔒' : '🔓';
        const calcTime = FN6_DATA.calcTime || '';
        html += `<tr class="${rowCls}">
          <td><input type="checkbox" class="fn6-res-chk" value="${i}"></td>
          <td style="font-size:14px">${lockIcon}</td>
          <td>${i+1}</td>
          <td><button onclick="fn6ShowDetail(${i})" style="background:#007bff;color:#fff;border:none;border-radius:3px;padding:2px 6px;cursor:pointer;font-size:10px;" title="Xem chi tiết logic">🔍</button></td>
          <td>${nv.ma}</td>
          <td class="tl">${nv.ten} ${anomalyIcon}</td>
          <td>${thBadge}</td>
          <td>${vaiBadge}</td>
          <td style="font-size:10px;text-align:left">${nhomCell}</td>
          <td style="font-size:10px">${nv.level5}</td>
          <td style="font-weight:bold;color:#c0392b;font-size:12px">${fn6Fmt(nv.ns_final)}</td>
          <td style="font-size:10px">FPT Admin</td>
          <td style="font-size:10px">${calcTime}</td>
        </tr>`;
      });

      document.getElementById("fn6-tbody-result").innerHTML = html;
      document.getElementById("fn6-s-nv").textContent = nvs.length;
      document.getElementById("fn6-s-sx").textContent = cSX;
      document.getElementById("fn6-s-pv").textContent = cPV;
      document.getElementById("fn6-s-th2").textContent = cTH2 + " NV";
      document.getElementById("fn6-s-th3").textContent = cTH3 + " NV";
      document.getElementById("fn6-s-th4").textContent = cTH4 + " NV";
      document.getElementById("fn6-s-ns").textContent = fn6Fmt(sumNS) + " Kg";
      document.getElementById("fn6-showing").textContent = nvs.length;
      document.getElementById("fn6-total").textContent = nvs.length;

      // Anomalies
      fn6RenderAnomalies(anomalies);
    }

    function fn6RenderAnomalies(anomalies) {
      const panel = document.getElementById("fn6-anomaly");
      const list = document.getElementById("fn6-anomaly-list");
      document.getElementById("fn6-anomaly-count").textContent = anomalies.length;
      if (anomalies.length === 0) { panel.className = "anomaly-panel"; return; }
      panel.className = "anomaly-panel show";
      list.innerHTML = anomalies.map(a => `<li>
        <span class="anomaly-icon">${a.type === "error" ? "🔴" : "🟡"}</span>
        <span class="anomaly-tag ${a.type}">${a.type === "error" ? "LỖI" : "CẢNH BÁO"}</span>
        <b>${a.ma}</b> ${a.ten}: ${a.msg}
      </li>`).join("");
    }

    function fn6RenderGroups(nhomMap, nvs) {
      const tbody = document.getElementById("fn6-grp-tbody");
      let html = "";
      let stt = 0;
      Object.values(nhomMap).forEach(nh => {
        stt++;
        const diff = Math.abs(nh.nstt - nh.sum_final);
        const balanced = diff < 1;
        html += `<tr class="${nh.locked ? 'row-locked' : ''}">
          <td><input type="checkbox" class="fn6-lock-cb" data-id="${nh.id}"></td>
          <td>${stt}</td>
          <td style="font-weight:bold">${nh.id}</td>
          <td class="tl">${nh.ten}</td>
          <td><span class="badge-th ${nh.th}">${nh.th}</span></td>
          <td>${nh.nv_count}</td>
          <td>${nh.nv_sx}</td>
          <td>${nh.nv_pv}</td>
          <td style="font-size:10px;text-align:left;max-width:180px;white-space:normal">${nh.level5.join(", ")}</td>
          <td>${fn6Fmt(nh.nstt)}</td>
          <td>${fn6Fmt(nh.sum_final)}</td>
          <td>${balanced ? '<span style="color:#28a745">✅ OK</span>' : '<span style="color:#dc3545">❌ ' + fn6Fmt(diff) + '</span>'}</td>
          <td><span class="badge-lock ${nh.locked ? 'locked' : 'unlocked'}">${nh.locked ? '✓ Đã khóa' : '— Chưa khóa'}</span></td>
          <td><button class="lock-btn ${nh.locked ? 'do-unlock' : 'do-lock'}" onclick="fn6ToggleLock('${nh.id}')" style="padding:3px 10px;border:none;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;color:#fff;">${nh.locked ? '🔓 Mở' : '🔒 Khóa'}</button></td>
        </tr>`;
      });
      tbody.innerHTML = html;
    }

    function fn6Fmt(n) { return n == null || isNaN(n) ? "—" : n.toLocaleString("vi-VN", { maximumFractionDigits: 2 }); }

    // ============================================================
    // TABS
    // ============================================================

    // ============================================================
    // ACTIONS
    // ============================================================
    function fn6RunCalc() {
      if (!document.getElementById("fn6-thang").value) { fn6Alert("⚠️ Vui lòng nhập <b>Tháng</b>.", "error"); return; }
      fn6CalcEngine(); fn6Render();
      fn6Alert("✅ Engine hoàn tất! <b>" + FN6_DATA.nvs.length + "</b> NV. " + (FN6_DATA.anomalies.length > 0 ? "⚠️ " + FN6_DATA.anomalies.length + " cảnh báo." : "Không có cảnh báo."), FN6_DATA.anomalies.length > 0 ? "warning" : "success");
      document.getElementById("fn6-status").className = "fn6-status ready";
      document.getElementById("fn6-status").innerHTML = '<span class="icon" style="font-size:18px">✅</span><span>Đã tính xong lúc ' + new Date().toLocaleTimeString("vi-VN") + '. Tổng <b>' + FN6_DATA.nvs.length + '</b> NV.</span>';
    }

    function fn6LoadData() {
      if (!document.getElementById("fn6-thang").value) { fn6Alert("⚠️ Vui lòng nhập <b>Tháng</b>.", "error"); return; }
      fn6CalcEngine(); fn6Render();
      fn6Alert("🔍 Đã load kết quả gần nhất.", "success");
      document.getElementById("fn6-status").className = "fn6-status ready";
      document.getElementById("fn6-status").innerHTML = '<span class="icon" style="font-size:18px">📋</span><span>Hiển thị dữ liệu đã tính. Tổng <b>' + FN6_DATA.nvs.length + '</b> NV.</span>';
    }

    function fn6Reset() {
      FN6_DATA = null;
      document.getElementById("fn6-tbody-result").innerHTML = '<tr><td colspan="13" class="empty-state">ⓘ Bấm "Tính lương NS" hoặc "Xem dữ liệu" để hiển thị.</td></tr>';
      ["fn6-s-nv","fn6-s-sx","fn6-s-pv","fn6-s-th2","fn6-s-th3","fn6-s-th4","fn6-s-ns"].forEach(id => document.getElementById(id).textContent = "-");
      document.getElementById("fn6-status").className = "fn6-status empty";
      document.getElementById("fn6-status").innerHTML = '<span class="icon" style="font-size:18px">⏳</span><span>Chưa tính.</span>';
      document.getElementById("fn6-anomaly").className = "anomaly-panel";
      document.getElementById("fn6-alert").className = "fn6-alert";
    }

    function fn6Alert(msg, type) {
      const el = document.getElementById("fn6-alert");
      el.innerHTML = msg; el.className = "fn6-alert show " + type;
      if (type !== "error") setTimeout(() => { el.className = "fn6-alert"; }, 5000);
    }

    // ============================================================
    // LOCK / UNLOCK
    // ============================================================
    function fn6ToggleLock(nhomId) {
      if (!FN6_DATA) return;
      const nh = FN6_DATA.nhomMap[nhomId];
      nh.locked = !nh.locked;
      const srcNhom = FN6_NHOM_NS.find(n => n.id === nhomId);
      if (srcNhom) srcNhom.locked = nh.locked;
      FN6_DATA.nvs.forEach(nv => { if (nv.nhom_id === nhomId) nv.locked = nh.locked; });
      fn6Render();
      fn6Alert(nh.locked ? `🔒 Đã khóa nhóm <b>${nhomId}</b>.` : `🔓 Đã mở khóa nhóm <b>${nhomId}</b>.`, "success");
    }

    function fn6LockAll() {
      if (!FN6_DATA) return;
      const chkLock = document.getElementById('fn6-chk-lockall');
      if (chkLock && chkLock.checked) {
        FN6_DATA.nvs.forEach(nv => { nv.locked = true; FN6_DATA.nhomMap[nv.nhom_id].locked = true; });
        chkLock.checked = false;
      } else {
        Object.keys(FN6_DATA.nhomMap).forEach(id => { FN6_DATA.nhomMap[id].locked = true; FN6_DATA.nvs.forEach(nv => { if (nv.nhom_id === id) nv.locked = true; }); });
      }
      fn6Render(); fn6Alert("🔒 Đã khóa tất cả.", "success");
    }
    function fn6UnlockAll() {
      if (!FN6_DATA) return;
      const chkUnlock = document.getElementById('fn6-chk-unlockall');
      if (chkUnlock && chkUnlock.checked) {
        FN6_DATA.nvs.forEach(nv => { nv.locked = false; FN6_DATA.nhomMap[nv.nhom_id].locked = false; });
        chkUnlock.checked = false;
      } else {
        Object.keys(FN6_DATA.nhomMap).forEach(id => { FN6_DATA.nhomMap[id].locked = false; FN6_DATA.nvs.forEach(nv => { if (nv.nhom_id === id) nv.locked = false; }); });
      }
      fn6Render(); fn6Alert("🔓 Đã mở khóa tất cả.", "success");
    }
    function fn6ToggleLockTo(id, val) { if (!FN6_DATA) return; FN6_DATA.nhomMap[id].locked = val; FN6_DATA.nvs.forEach(nv => { if (nv.nhom_id === id) nv.locked = val; }); }
    function fn6ToggleCheckAll(el) { document.querySelectorAll('.fn6-lock-cb').forEach(cb => cb.checked = el.checked); }
    function fn6LockSelected() { const cbs = document.querySelectorAll('.fn6-lock-cb:checked'); if(!cbs.length) return fn6Alert('Vui lòng chọn nhóm.','warning'); cbs.forEach(cb => fn6ToggleLockTo(cb.dataset.id, true)); fn6Render(); fn6Alert('🔒 Đã khóa '+cbs.length+' nhóm đã chọn.','success'); }
    function fn6UnlockSelected() { const cbs = document.querySelectorAll('.fn6-lock-cb:checked'); if(!cbs.length) return fn6Alert('Vui lòng chọn nhóm.','warning'); cbs.forEach(cb => fn6ToggleLockTo(cb.dataset.id, false)); fn6Render(); fn6Alert('🔓 Đã mở khóa '+cbs.length+' nhóm đã chọn.','success'); }

    // ============================================================
    // DETAIL POPUP — Excel-like full logic per TH
    // ============================================================
    let fn6DetailIdx = null;

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

      document.getElementById("fn6-detail-body").innerHTML = html;
      document.getElementById("fn6-detail-modal").classList.add("show");
    }

    function fn6ShowCongDetail(ma, ten, ctt, hst) {
      const thang = document.getElementById('fn6-thang').value || '07/2026';
      const parts = thang.split('/');
      const mm = parseInt(parts[0]) || 7, yyyy = parseInt(parts[1]) || 2026;
      const daysInMonth = new Date(yyyy, mm, 0).getDate();

      const daysNS = [], daysTT = [];
      let sumNS = 0, sumTT = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const dow = new Date(yyyy, mm - 1, d).getDay();
        const isOff = dow === 0;
        const ns = isOff ? 0 : +(0.5 + Math.random() * 0.8).toFixed(1);
        const tt = isOff ? 0 : +(0.5 + Math.random() * 0.7).toFixed(1);
        daysNS.push({ d, isOff, val: ns });
        daysTT.push({ d, isOff, val: tt });
        sumNS += ns; sumTT += tt;
      }

      document.getElementById('fn6-cong-title').textContent = `📋 Chi tiết công theo ngày — ${ma} ${ten} — Tháng ${thang}`;

      hst = hst || 100;
      let html = `<div style="overflow-x:auto;border:1px solid #ddd;">
        <table style="width:auto;"><thead>
          <tr><th style="background:#555;color:#fff;min-width:100px;position:sticky;left:0;z-index:3;"></th><th style="background:#555;color:#fff;min-width:50px;">% HST</th>`;
      for (let d = 1; d <= daysInMonth; d++) html += `<th style="background:#555;color:#fff;min-width:38px;font-size:10px;">N${String(d).padStart(2,'0')}</th>`;
      html += `<th style="background:#333;color:#fff;min-width:50px;">Tổng</th></tr></thead><tbody>`;

      // Row 1: Công thực tế
      html += `<tr><td style="background:#e67e22;color:#fff;font-weight:bold;position:sticky;left:0;z-index:2;">Công thực tế</td><td></td>`;
      daysTT.forEach(c => {
        const bg = c.isOff ? 'background:#f8d7da;color:#999;' : (c.val > 0 ? '' : 'color:#ccc;');
        html += `<td style="${bg}font-size:11px;text-align:center;">${c.isOff ? '' : c.val}</td>`;
      });
      html += `<td style="font-weight:bold;color:#c0392b;font-size:12px;text-align:center;">${sumTT.toFixed(1)}</td></tr>`;

      // Row 2: Công năng suất
      html += `<tr><td style="background:#2980b9;color:#fff;font-weight:bold;position:sticky;left:0;z-index:2;">Công năng suất</td><td style="text-align:center;font-weight:bold;color:#e67e22;">${hst}%</td>`;
      daysNS.forEach(c => {
        const bg = c.isOff ? 'background:#f8d7da;color:#999;' : (c.val > 0 ? '' : 'color:#ccc;');
        html += `<td style="${bg}font-size:11px;text-align:center;">${c.isOff ? '' : c.val}</td>`;
      });
      html += `<td style="font-weight:bold;color:#c0392b;font-size:12px;text-align:center;">${sumNS.toFixed(1)}</td></tr>`;

      html += `</tbody></table></div>`;

      document.getElementById('fn6-cong-body').innerHTML = html;
      document.getElementById('fn6-cong-modal').classList.add('show');
    }

    function fn6ClosePdf() { document.getElementById("fn6-pdf-modal").classList.remove("show"); }
    function fn6PrintDetail() { fn6CloseDetail(); }
    function fn6ExportPdfAll() { fn6Alert("📄 Đang tạo phiếu NS cho tất cả NV... (demo)", "success"); }

    document.addEventListener("keydown", e => { if (e.key === "Escape") { fn6CloseCong(); fn6CloseDetail(); fn6ClosePdf(); } });
  