
> lns\fn6-tinh-lns.html:389:  <script src="../shared/mockdata.js"></script>
> lns\fn6-tinh-lns.html:390:  <script src="../shared/utils.js"></script>
> lns\fn6-tinh-lns.html:391:  <script>
  lns\fn6-tinh-lns.html:392:    // ============================================================
  lns\fn6-tinh-lns.html:393:    // MOCK DATA
  lns\fn6-tinh-lns.html:394:    // ============================================================
  lns\fn6-tinh-lns.html:395:    const FN6_NHOM_NS = [
  lns\fn6-tinh-lns.html:396:      { id:"NS-001", ten:"Bàn 1 Ka Sáng", th:"TH2", level5:["CB101"], thanhVien:12, 
locked:false },
  lns\fn6-tinh-lns.html:397:      { id:"NS-002", ten:"Nhóm NL+PC Ka Sáng", th:"TH3", level5:["NL1PV","PC1T","PC1PV"], 
thanhVien:35, locked:false },
  lns\fn6-tinh-lns.html:398:      { id:"NS-003", ten:"Nhóm NL+PC Ka Chiều", th:"TH3", level5:["NL2PV","PC2T","PC2PV"], 
thanhVien:30, locked:true },
  lns\fn6-tinh-lns.html:399:      { id:"NS-004", ten:"Nhóm NO Ka Sáng", th:"TH4", 
level5:["NO101","NO102","NO103","NO1PV"], thanhVien:48, pv_level5:["NO1PV"], locked:false },
  lns\fn6-tinh-lns.html:400:      { id:"NS-005", ten:"Nhóm Sushi Ka Sáng", th:"TH4", 
level5:["SU1D101","SU1D102","SU1PV"], thanhVien:36, pv_level5:["SU1PV"], locked:true },
  lns\fn6-tinh-lns.html:401:      { id:"NS-006", ten:"Bàn 2 Ka Sáng", th:"TH2", level5:["CB102"], thanhVien:10, 
locked:false },
  lns\fn6-tinh-lns.html:402:      { id:"NS-007", ten:"Nhóm CB Ka Sáng", th:"TH3", level5:["CB103","CB104","CB1PV"], 
thanhVien:28, locked:false },
  lns\fn6-tinh-lns.html:403:      { id:"NS-008", ten:"Nhóm PTO Ka Sáng", th:"TH4", 
level5:["PTO101","PTO102","PTO1PV"], thanhVien:25, pv_level5:["PTO1PV"], locked:false },
  lns\fn6-tinh-lns.html:404:    ];
  lns\fn6-tinh-lns.html:405:
  lns\fn6-tinh-lns.html:406:    function fn6GenMockNV() {
  lns\fn6-tinh-lns.html:407:      const names = ["Nguyễn Văn A","Trần Thị B","Lê Văn C","Phạm Thị D","Hoàng Văn 
E","Ngô Thị F","Đặng Văn G","Bùi Thị H","Vũ Văn I","Đỗ Thị K","Nguyễn Văn L","Trần Văn M","Lê Thị N","Phạm Văn 
O","Hoàng Thị P","Đinh Văn Q","Mai Thị R","Lý Văn S","Cao Thị T","Hà Văn U","Trịnh Thị V","Phan Văn W","Dương Thị 
X","Lương Văn Y","Tạ Thị Z","Châu Văn AA","Huỳnh Thị AB","Tô Văn AC","Thái Thị AD","La Văn AE","Kiều Thị AF","Từ Văn 
AG","Âu Thị AH","Sơn Văn AI","Kim Thị AK","Ông Văn AL","Bà Thị AM","Quách Văn AN","Mạc Thị AO","Lục Văn AP"];
  lns\fn6-tinh-lns.html:408:      const hsts = [110,100,100,85,90,105,100,102,100,95,108,100,100,88,92,103,100,100,97,1
00,110,105,100,90,100,100,100,85,100,105,100,100,95,100,100,100,100,100,90,100];
  lns\fn6-tinh-lns.html:409:      const bspvPct = 10;
  lns\fn6-tinh-lns.html:410:      let nvs = [], id = 1;
  lns\fn6-tinh-lns.html:411:
  lns\fn6-tinh-lns.html:412:      FN6_NHOM_NS.forEach(nhom => {
  lns\fn6-tinh-lns.html:413:        const pvL5s = nhom.pv_level5 || [];
  lns\fn6-tinh-lns.html:414:        nhom.level5.forEach(l5 => {
  lns\fn6-tinh-lns.html:415:          const vaiTro = pvL5s.includes(l5) ? "PV" : "SX";
  lns\fn6-tinh-lns.html:416:          const countInL5 = nhom.th === "TH2" ? nhom.thanhVien : Math.max(3, 
Math.floor(nhom.thanhVien / nhom.level5.length));
  lns\fn6-tinh-lns.html:417:          for (let j = 0; j < Math.min(countInL5, 5); j++) {
  lns\fn6-tinh-lns.html:418:            const ni = (id - 1) % names.length;
  lns\fn6-tinh-lns.html:419:            const ctt = +(25 + Math.random() * 3).toFixed(1);
  lns\fn6-tinh-lns.html:420:            const hst = hsts[ni] || 100;
  lns\fn6-tinh-lns.html:421:            let cns;
  lns\fn6-tinh-lns.html:422:            if (vaiTro === "PV" && hst >= 100) cns = ctt * (hst / 100 + bspvPct / 100);
  lns\fn6-tinh-lns.html:423:            else if (vaiTro === "PV") cns = ctt;
  lns\fn6-tinh-lns.html:424:            else cns = ctt * (hst / 100);
  lns\fn6-tinh-lns.html:425:            nvs.push({
  lns\fn6-tinh-lns.html:426:              stt: id, ma: "NV" + String(id).padStart(3, "0"), ten: names[ni],
  lns\fn6-tinh-lns.html:427:              th: nhom.th, loai: nhom.th === "TH2" ? "A" : "B",
  lns\fn6-tinh-lns.html:428:              vai_tro: vaiTro, nhom_id: nhom.id, nhom_ten: nhom.ten, level5: l5,
  lns\fn6-tinh-lns.html:429:              ctt, hst, bspv: vaiTro === "PV" ? bspvPct : 0,
  lns\fn6-tinh-lns.html:430:              cns: +cns.toFixed(3), locked: nhom.locked,
  lns\fn6-tinh-lns.html:431:            });
  lns\fn6-tinh-lns.html:432:            id++;
  lns\fn6-tinh-lns.html:433:          }
  lns\fn6-tinh-lns.html:434:        });
  lns\fn6-tinh-lns.html:435:      });
  lns\fn6-tinh-lns.html:436:
  lns\fn6-tinh-lns.html:437:      // Inject anomaly: 1 NV with NS=0 but has công, 1 NV with unusually high NS
  lns\fn6-tinh-lns.html:438:      if (nvs.length > 3) { nvs[2].cns = 0; nvs[2].hst = 0; }
  lns\fn6-tinh-lns.html:439:      return nvs;
  lns\fn6-tinh-lns.html:440:    }
  lns\fn6-tinh-lns.html:441:
  lns\fn6-tinh-lns.html:442:    let FN6_DATA = null;
  lns\fn6-tinh-lns.html:443:
  lns\fn6-tinh-lns.html:444:    function fn6CalcEngine() {
  lns\fn6-tinh-lns.html:445:      const nvs = fn6GenMockNV();
  lns\fn6-tinh-lns.html:446:      const nhomMap = {};
  lns\fn6-tinh-lns.html:447:      FN6_NHOM_NS.forEach(n => { nhomMap[n.id] = { ...n, cns_sx:0, cns_pv:0, cns_total:0, 
nstt:0, ns_giam_pv:0, ns_sau_giam:0, cns_pv_phanbo:0, cns_sau_pv:0, sum_final:0, nv_count:0, nv_sx:0, nv_pv:0 }; });
  lns\fn6-tinh-lns.html:448:
  lns\fn6-tinh-lns.html:449:      nvs.forEach(nv => {
  lns\fn6-tinh-lns.html:450:        const nh = nhomMap[nv.nhom_id];
  lns\fn6-tinh-lns.html:451:        if (nv.vai_tro === "SX") nh.cns_sx += nv.cns;
  lns\fn6-tinh-lns.html:452:        else nh.cns_pv += nv.cns;
  lns\fn6-tinh-lns.html:453:        nh.cns_total += nv.cns;
  lns\fn6-tinh-lns.html:454:        nh.nv_count++;
  lns\fn6-tinh-lns.html:455:        if (nv.vai_tro === "SX") nh.nv_sx++; else nh.nv_pv++;
  lns\fn6-tinh-lns.html:456:      });
  lns\fn6-tinh-lns.html:457:
  lns\fn6-tinh-lns.html:458:      const nsttBase = {"NS-001":300000,"NS-002":1000000,"NS-003":850000,"NS-004":1500000,"
NS-005":900000,"NS-006":250000,"NS-007":700000,"NS-008":600000};
  lns\fn6-tinh-lns.html:459:      Object.keys(nhomMap).forEach(id => { nhomMap[id].nstt = nsttBase[id] || 500000; });
  lns\fn6-tinh-lns.html:460:
  lns\fn6-tinh-lns.html:461:      Object.keys(nhomMap).forEach(id => {
  lns\fn6-tinh-lns.html:462:        const nh = nhomMap[id];
  lns\fn6-tinh-lns.html:463:        if (nh.th === "TH4") {
  lns\fn6-tinh-lns.html:464:          nh.cns_sau_pv = nh.cns_sx + nh.cns_pv;
  lns\fn6-tinh-lns.html:465:          if (nh.cns_sau_pv > 0) { nh.cns_pv_phanbo = nh.cns_pv; nh.ns_giam_pv = nh.nstt * 
(nh.cns_pv / nh.cns_sau_pv); nh.ns_sau_giam = nh.nstt - nh.ns_giam_pv; }
  lns\fn6-tinh-lns.html:466:        } else { nh.cns_sau_pv = nh.cns_total; nh.ns_sau_giam = nh.nstt; }
  lns\fn6-tinh-lns.html:467:      });
  lns\fn6-tinh-lns.html:468:
  lns\fn6-tinh-lns.html:469:      nvs.forEach(nv => {
  lns\fn6-tinh-lns.html:470:        const nh = nhomMap[nv.nhom_id];
  lns\fn6-tinh-lns.html:471:        if (nv.th === "TH2" || nv.th === "TH3") {
  lns\fn6-tinh-lns.html:472:          nv.ns_tl = nh.cns_total > 0 ? nh.nstt * (nv.cns / nh.cns_total) : 0;
  lns\fn6-tinh-lns.html:473:          nv.ns_final = nv.ns_tl;
  lns\fn6-tinh-lns.html:474:          nv.nguon = nv.th === "TH2" ? "Chia theo ĐV" : "Chia nhiều ĐV";
  lns\fn6-tinh-lns.html:475:          nv.nstt_nhom = nh.nstt; nv.ns_giam = 0; nv.ns_sau_giam = nh.nstt;
  lns\fn6-tinh-lns.html:476:        } else if (nv.th === "TH4") {
  lns\fn6-tinh-lns.html:477:          if (nv.vai_tro === "SX") {
  lns\fn6-tinh-lns.html:478:            nv.ns_tl = nh.cns_sx > 0 ? nh.ns_sau_giam * (nv.cns / nh.cns_sx) : 0;
  lns\fn6-tinh-lns.html:479:            nv.nguon = "SX (sau trích PV)";
  lns\fn6-tinh-lns.html:480:          } else {
  lns\fn6-tinh-lns.html:481:            nv.ns_tl = nh.cns_pv > 0 ? nh.ns_giam_pv * (nv.cns / nh.cns_pv) : 0;
  lns\fn6-tinh-lns.html:482:            nv.nguon = "PV (nhận trích)";
  lns\fn6-tinh-lns.html:483:          }
  lns\fn6-tinh-lns.html:484:          nv.ns_final = nv.ns_tl;
  lns\fn6-tinh-lns.html:485:          nv.nstt_nhom = nh.nstt; nv.ns_giam = nh.ns_giam_pv; nv.ns_sau_giam = 
nh.ns_sau_giam;
  lns\fn6-tinh-lns.html:486:        }
  lns\fn6-tinh-lns.html:487:        nhomMap[nv.nhom_id].sum_final += nv.ns_final;
  lns\fn6-tinh-lns.html:488:      });
  lns\fn6-tinh-lns.html:489:
  lns\fn6-tinh-lns.html:490:      // Anomaly detection
  lns\fn6-tinh-lns.html:491:      const anomalies = [];
  lns\fn6-tinh-lns.html:492:      nvs.forEach(nv => {
  lns\fn6-tinh-lns.html:493:        nv.anomaly = null;
  lns\fn6-tinh-lns.html:494:        if (nv.ctt > 0 && nv.ns_final === 0) { nv.anomaly = "NS=0 dù có công"; 
anomalies.push({ type:"error", ma:nv.ma, ten:nv.ten, msg:`NS_FINAL = 0 nhưng CTT = ${nv.ctt}. Kiểm tra HST%.` }); }
  lns\fn6-tinh-lns.html:495:        const nh = nhomMap[nv.nhom_id];
  lns\fn6-tinh-lns.html:496:        const avg = nh.nstt / Math.max(nh.nv_count, 1);
  lns\fn6-tinh-lns.html:497:        if (nv.ns_final > avg * 1.5 && nv.ns_final > 0) { nv.anomaly = "NS cao bất 
thường"; anomalies.push({ type:"warn", ma:nv.ma, ten:nv.ten, msg:`NS_FINAL = ${fn6Fmt(nv.ns_final)} Kg, cao hơn 50% so 
với TB nhóm (${fn6Fmt(avg)} Kg).` }); }
  lns\fn6-tinh-lns.html:498:      });
  lns\fn6-tinh-lns.html:499:
  lns\fn6-tinh-lns.html:500:      Object.values(nhomMap).forEach(nh => {
  lns\fn6-tinh-lns.html:501:        const diff = Math.abs(nh.nstt - nh.sum_final);
  lns\fn6-tinh-lns.html:502:        if (diff > 1 && nh.nstt > 0) { anomalies.push({ type:"error", ma:nh.id, 
ten:nh.ten, msg:`Mất cân bằng: NSTT = ${fn6Fmt(nh.nstt)}, Σ NS_FINAL = ${fn6Fmt(nh.sum_final)}, chênh lệch 
${fn6Fmt(diff)} Kg.` }); }
  lns\fn6-tinh-lns.html:503:      });
  lns\fn6-tinh-lns.html:504:
  lns\fn6-tinh-lns.html:505:      const now = new Date();
  lns\fn6-tinh-lns.html:506:      const calcTime = 
String(now.getDate()).padStart(2,'0')+'/'+String(now.getMonth()+1).padStart(2,'0')+'/'+now.getFullYear()+' '+String(now
.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')+':'+String(now.getSeconds()).padStart(2,'0');
  lns\fn6-tinh-lns.html:507:      FN6_DATA = { nvs, nhomMap, anomalies, calcTime };
  lns\fn6-tinh-lns.html:508:      return FN6_DATA;
  lns\fn6-tinh-lns.html:509:    }
  lns\fn6-tinh-lns.html:510:
  lns\fn6-tinh-lns.html:511:    // ============================================================
  lns\fn6-tinh-lns.html:512:    // RENDER
  lns\fn6-tinh-lns.html:513:    // ============================================================
  lns\fn6-tinh-lns.html:514:    function fn6Render() {
  lns\fn6-tinh-lns.html:515:      if (!FN6_DATA) return;
  lns\fn6-tinh-lns.html:516:      const { nvs, nhomMap, anomalies } = FN6_DATA;
  lns\fn6-tinh-lns.html:517:      let html = "";
  lns\fn6-tinh-lns.html:518:      let cTH2=0, cTH3=0, cTH4=0, cSX=0, cPV=0, sumNS=0;
  lns\fn6-tinh-lns.html:519:
  lns\fn6-tinh-lns.html:520:      nvs.forEach((nv, i) => {
  lns\fn6-tinh-lns.html:521:        cSX += nv.vai_tro === "SX" ? 1 : 0;
  lns\fn6-tinh-lns.html:522:        cPV += nv.vai_tro === "PV" ? 1 : 0;
  lns\fn6-tinh-lns.html:523:        if (nv.th==="TH2") cTH2++; else if (nv.th==="TH3") cTH3++; else cTH4++;
  lns\fn6-tinh-lns.html:524:        sumNS += nv.ns_final;
  lns\fn6-tinh-lns.html:525:
  lns\fn6-tinh-lns.html:526:        const rowCls = nv.anomaly ? " row-anomaly" : (nv.locked ? " row-locked" : "");
  lns\fn6-tinh-lns.html:527:        const thBadge = `<span class="badge-th ${nv.th}">${nv.th}</span>`;
  lns\fn6-tinh-lns.html:528:        const loaiBadge = `<span class="badge-loai ${nv.loai}">${nv.loai}</span>`;
  lns\fn6-tinh-lns.html:529:        const vaiBadge = `<span class="badge-vai ${nv.vai_tro}">${nv.vai_tro}</span>`;
  lns\fn6-tinh-lns.html:530:        const lockBadge = nv.locked ? `<span class="badge-lock locked">✓</span>` : `<span 
class="badge-lock unlocked">—</span>`;
  lns\fn6-tinh-lns.html:531:        const nhomCell = `${nv.nhom_id}<span class="nhom-tag">${nv.nhom_ten}</span>`;
  lns\fn6-tinh-lns.html:532:        const anomalyIcon = nv.anomaly ? `<span title="${nv.anomaly}" 
style="color:#e65100;cursor:help;">⚠️</span>` : "";
  lns\fn6-tinh-lns.html:533:
  lns\fn6-tinh-lns.html:534:        const lockIcon = nv.locked ? '🔒' : '🔓';
  lns\fn6-tinh-lns.html:535:        const calcTime = FN6_DATA.calcTime || '';
  lns\fn6-tinh-lns.html:536:        html += `<tr class="${rowCls}">
  lns\fn6-tinh-lns.html:537:          <td><input type="checkbox" class="fn6-res-chk" value="${i}"></td>
  lns\fn6-tinh-lns.html:538:          <td style="font-size:14px">${lockIcon}</td>
  lns\fn6-tinh-lns.html:539:          <td>${i+1}</td>
  lns\fn6-tinh-lns.html:540:          <td><button onclick="fn6ShowDetail(${i})" 
style="background:#007bff;color:#fff;border:none;border-radius:3px;padding:2px 6px;cursor:pointer;font-size:10px;" 
title="Xem chi tiết logic">🔍</button></td>
  lns\fn6-tinh-lns.html:541:          <td>${nv.ma}</td>
  lns\fn6-tinh-lns.html:542:          <td class="tl">${nv.ten} ${anomalyIcon}</td>
  lns\fn6-tinh-lns.html:543:          <td>${thBadge}</td>
  lns\fn6-tinh-lns.html:544:          <td>${vaiBadge}</td>
  lns\fn6-tinh-lns.html:545:          <td style="font-size:10px;text-align:left">${nhomCell}</td>
  lns\fn6-tinh-lns.html:546:          <td style="font-size:10px">${nv.level5}</td>
  lns\fn6-tinh-lns.html:547:          <td 
style="font-weight:bold;color:#c0392b;font-size:12px">${fn6Fmt(nv.ns_final)}</td>
  lns\fn6-tinh-lns.html:548:          <td style="font-size:10px">FPT Admin</td>
  lns\fn6-tinh-lns.html:549:          <td style="font-size:10px">${calcTime}</td>
  lns\fn6-tinh-lns.html:550:        </tr>`;
  lns\fn6-tinh-lns.html:551:      });
  lns\fn6-tinh-lns.html:552:
  lns\fn6-tinh-lns.html:553:      document.getElementById("fn6-tbody-result").innerHTML = html;
  lns\fn6-tinh-lns.html:554:      document.getElementById("fn6-s-nv").textContent = nvs.length;
  lns\fn6-tinh-lns.html:555:      document.getElementById("fn6-s-sx").textContent = cSX;
  lns\fn6-tinh-lns.html:556:      document.getElementById("fn6-s-pv").textContent = cPV;
  lns\fn6-tinh-lns.html:557:      document.getElementById("fn6-s-th2").textContent = cTH2 + " NV";
  lns\fn6-tinh-lns.html:558:      document.getElementById("fn6-s-th3").textContent = cTH3 + " NV";
  lns\fn6-tinh-lns.html:559:      document.getElementById("fn6-s-th4").textContent = cTH4 + " NV";
  lns\fn6-tinh-lns.html:560:      document.getElementById("fn6-s-ns").textContent = fn6Fmt(sumNS) + " Kg";
  lns\fn6-tinh-lns.html:561:      document.getElementById("fn6-showing").textContent = nvs.length;
  lns\fn6-tinh-lns.html:562:      document.getElementById("fn6-total").textContent = nvs.length;
  lns\fn6-tinh-lns.html:563:
  lns\fn6-tinh-lns.html:564:      // Anomalies
  lns\fn6-tinh-lns.html:565:      fn6RenderAnomalies(anomalies);
  lns\fn6-tinh-lns.html:566:    }
  lns\fn6-tinh-lns.html:567:
  lns\fn6-tinh-lns.html:568:    function fn6RenderAnomalies(anomalies) {
  lns\fn6-tinh-lns.html:569:      const panel = document.getElementById("fn6-anomaly");
  lns\fn6-tinh-lns.html:570:      const list = document.getElementById("fn6-anomaly-list");
  lns\fn6-tinh-lns.html:571:      document.getElementById("fn6-anomaly-count").textContent = anomalies.length;
  lns\fn6-tinh-lns.html:572:      if (anomalies.length === 0) { panel.className = "anomaly-panel"; return; }
  lns\fn6-tinh-lns.html:573:      panel.className = "anomaly-panel show";
  lns\fn6-tinh-lns.html:574:      list.innerHTML = anomalies.map(a => `<li>
  lns\fn6-tinh-lns.html:575:        <span class="anomaly-icon">${a.type === "error" ? "🔴" : "🟡"}</span>
  lns\fn6-tinh-lns.html:576:        <span class="anomaly-tag ${a.type}">${a.type === "error" ? "LỖI" : "CẢNH 
BÁO"}</span>
  lns\fn6-tinh-lns.html:577:        <b>${a.ma}</b> ${a.ten}: ${a.msg}
  lns\fn6-tinh-lns.html:578:      </li>`).join("");
  lns\fn6-tinh-lns.html:579:    }
  lns\fn6-tinh-lns.html:580:
  lns\fn6-tinh-lns.html:581:    function fn6RenderGroups(nhomMap, nvs) {
  lns\fn6-tinh-lns.html:582:      const tbody = document.getElementById("fn6-grp-tbody");
  lns\fn6-tinh-lns.html:583:      let html = "";
  lns\fn6-tinh-lns.html:584:      let stt = 0;
  lns\fn6-tinh-lns.html:585:      Object.values(nhomMap).forEach(nh => {
  lns\fn6-tinh-lns.html:586:        stt++;
  lns\fn6-tinh-lns.html:587:        const diff = Math.abs(nh.nstt - nh.sum_final);
  lns\fn6-tinh-lns.html:588:        const balanced = diff < 1;
  lns\fn6-tinh-lns.html:589:        html += `<tr class="${nh.locked ? 'row-locked' : ''}">
  lns\fn6-tinh-lns.html:590:          <td><input type="checkbox" class="fn6-lock-cb" data-id="${nh.id}"></td>
  lns\fn6-tinh-lns.html:591:          <td>${stt}</td>
  lns\fn6-tinh-lns.html:592:          <td style="font-weight:bold">${nh.id}</td>
  lns\fn6-tinh-lns.html:593:          <td class="tl">${nh.ten}</td>
  lns\fn6-tinh-lns.html:594:          <td><span class="badge-th ${nh.th}">${nh.th}</span></td>
  lns\fn6-tinh-lns.html:595:          <td>${nh.nv_count}</td>
  lns\fn6-tinh-lns.html:596:          <td>${nh.nv_sx}</td>
  lns\fn6-tinh-lns.html:597:          <td>${nh.nv_pv}</td>
  lns\fn6-tinh-lns.html:598:          <td 
style="font-size:10px;text-align:left;max-width:180px;white-space:normal">${nh.level5.join(", ")}</td>
  lns\fn6-tinh-lns.html:599:          <td>${fn6Fmt(nh.nstt)}</td>
  lns\fn6-tinh-lns.html:600:          <td>${fn6Fmt(nh.sum_final)}</td>
  lns\fn6-tinh-lns.html:601:          <td>${balanced ? '<span style="color:#28a745">✅ OK</span>' : '<span 
style="color:#dc3545">❌ ' + fn6Fmt(diff) + '</span>'}</td>
  lns\fn6-tinh-lns.html:602:          <td><span class="badge-lock ${nh.locked ? 'locked' : 'unlocked'}">${nh.locked ? 
'✓ Đã khóa' : '— Chưa khóa'}</span></td>
  lns\fn6-tinh-lns.html:603:          <td><button class="lock-btn ${nh.locked ? 'do-unlock' : 'do-lock'}" 
onclick="fn6ToggleLock('${nh.id}')" style="padding:3px 
10px;border:none;border-radius:3px;cursor:pointer;font-size:10px;font-weight:bold;color:#fff;">${nh.locked ? '🔓 Mở' : 
'🔒 Khóa'}</button></td>
  lns\fn6-tinh-lns.html:604:        </tr>`;
  lns\fn6-tinh-lns.html:605:      });
  lns\fn6-tinh-lns.html:606:      tbody.innerHTML = html;
  lns\fn6-tinh-lns.html:607:    }
  lns\fn6-tinh-lns.html:608:
  lns\fn6-tinh-lns.html:609:    function fn6Fmt(n) { return n == null || isNaN(n) ? "—" : n.toLocaleString("vi-VN", { 
maximumFractionDigits: 2 }); }
  lns\fn6-tinh-lns.html:610:
  lns\fn6-tinh-lns.html:611:    // ============================================================
  lns\fn6-tinh-lns.html:612:    // TABS
  lns\fn6-tinh-lns.html:613:    // ============================================================
  lns\fn6-tinh-lns.html:614:
  lns\fn6-tinh-lns.html:615:    // ============================================================
  lns\fn6-tinh-lns.html:616:    // ACTIONS
  lns\fn6-tinh-lns.html:617:    // ============================================================
  lns\fn6-tinh-lns.html:618:    function fn6RunCalc() {
  lns\fn6-tinh-lns.html:619:      if (!document.getElementById("fn6-thang").value) { fn6Alert("⚠️ Vui lòng nhập 
<b>Tháng</b>.", "error"); return; }
  lns\fn6-tinh-lns.html:620:      fn6CalcEngine(); fn6Render();
  lns\fn6-tinh-lns.html:621:      fn6Alert("✅ Engine hoàn tất! <b>" + FN6_DATA.nvs.length + "</b> NV. " + 
(FN6_DATA.anomalies.length > 0 ? "⚠️ " + FN6_DATA.anomalies.length + " cảnh báo." : "Không có cảnh báo."), 
FN6_DATA.anomalies.length > 0 ? "warning" : "success");
  lns\fn6-tinh-lns.html:622:      document.getElementById("fn6-status").className = "fn6-status ready";
  lns\fn6-tinh-lns.html:623:      document.getElementById("fn6-status").innerHTML = '<span class="icon" 
style="font-size:18px">✅</span><span>Đã tính xong lúc ' + new Date().toLocaleTimeString("vi-VN") + '. Tổng <b>' + 
FN6_DATA.nvs.length + '</b> NV.</span>';
  lns\fn6-tinh-lns.html:624:    }
  lns\fn6-tinh-lns.html:625:
  lns\fn6-tinh-lns.html:626:    function fn6LoadData() {
  lns\fn6-tinh-lns.html:627:      if (!document.getElementById("fn6-thang").value) { fn6Alert("⚠️ Vui lòng nhập 
<b>Tháng</b>.", "error"); return; }
  lns\fn6-tinh-lns.html:628:      fn6CalcEngine(); fn6Render();
  lns\fn6-tinh-lns.html:629:      fn6Alert("🔍 Đã load kết quả gần nhất.", "success");
  lns\fn6-tinh-lns.html:630:      document.getElementById("fn6-status").className = "fn6-status ready";
  lns\fn6-tinh-lns.html:631:      document.getElementById("fn6-status").innerHTML = '<span class="icon" 
style="font-size:18px">📋</span><span>Hiển thị dữ liệu đã tính. Tổng <b>' + FN6_DATA.nvs.length + '</b> NV.</span>';
  lns\fn6-tinh-lns.html:632:    }
  lns\fn6-tinh-lns.html:633:
  lns\fn6-tinh-lns.html:634:    function fn6Reset() {
  lns\fn6-tinh-lns.html:635:      FN6_DATA = null;
  lns\fn6-tinh-lns.html:636:      document.getElementById("fn6-tbody-result").innerHTML = '<tr><td colspan="13" 
class="empty-state">ⓘ Bấm "Tính lương NS" hoặc "Xem dữ liệu" để hiển thị.</td></tr>';
  lns\fn6-tinh-lns.html:637:      
["fn6-s-nv","fn6-s-sx","fn6-s-pv","fn6-s-th2","fn6-s-th3","fn6-s-th4","fn6-s-ns"].forEach(id => 
document.getElementById(id).textContent = "-");
  lns\fn6-tinh-lns.html:638:      document.getElementById("fn6-status").className = "fn6-status empty";
  lns\fn6-tinh-lns.html:639:      document.getElementById("fn6-status").innerHTML = '<span class="icon" 
style="font-size:18px">⏳</span><span>Chưa tính.</span>';
  lns\fn6-tinh-lns.html:640:      document.getElementById("fn6-anomaly").className = "anomaly-panel";
  lns\fn6-tinh-lns.html:641:      document.getElementById("fn6-alert").className = "fn6-alert";
  lns\fn6-tinh-lns.html:642:    }
  lns\fn6-tinh-lns.html:643:
  lns\fn6-tinh-lns.html:644:    function fn6Alert(msg, type) {
  lns\fn6-tinh-lns.html:645:      const el = document.getElementById("fn6-alert");
  lns\fn6-tinh-lns.html:646:      el.innerHTML = msg; el.className = "fn6-alert show " + type;
  lns\fn6-tinh-lns.html:647:      if (type !== "error") setTimeout(() => { el.className = "fn6-alert"; }, 5000);
  lns\fn6-tinh-lns.html:648:    }
  lns\fn6-tinh-lns.html:649:
  lns\fn6-tinh-lns.html:650:    // ============================================================
  lns\fn6-tinh-lns.html:651:    // LOCK / UNLOCK
  lns\fn6-tinh-lns.html:652:    // ============================================================
  lns\fn6-tinh-lns.html:653:    function fn6ToggleLock(nhomId) {
  lns\fn6-tinh-lns.html:654:      if (!FN6_DATA) return;
  lns\fn6-tinh-lns.html:655:      const nh = FN6_DATA.nhomMap[nhomId];
  lns\fn6-tinh-lns.html:656:      nh.locked = !nh.locked;
  lns\fn6-tinh-lns.html:657:      const srcNhom = FN6_NHOM_NS.find(n => n.id === nhomId);
  lns\fn6-tinh-lns.html:658:      if (srcNhom) srcNhom.locked = nh.locked;
  lns\fn6-tinh-lns.html:659:      FN6_DATA.nvs.forEach(nv => { if (nv.nhom_id === nhomId) nv.locked = nh.locked; });
  lns\fn6-tinh-lns.html:660:      fn6Render();
  lns\fn6-tinh-lns.html:661:      fn6Alert(nh.locked ? `🔒 Đã khóa nhóm <b>${nhomId}</b>.` : `🔓 Đã mở khóa nhóm 
<b>${nhomId}</b>.`, "success");
  lns\fn6-tinh-lns.html:662:    }
  lns\fn6-tinh-lns.html:663:
  lns\fn6-tinh-lns.html:664:    function fn6LockAll() {
  lns\fn6-tinh-lns.html:665:      if (!FN6_DATA) return;
  lns\fn6-tinh-lns.html:666:      const chkLock = document.getElementById('fn6-chk-lockall');
  lns\fn6-tinh-lns.html:667:      if (chkLock && chkLock.checked) {
  lns\fn6-tinh-lns.html:668:        FN6_DATA.nvs.forEach(nv => { nv.locked = true; FN6_DATA.nhomMap[nv.nhom_id].locked 
= true; });
  lns\fn6-tinh-lns.html:669:        chkLock.checked = false;
  lns\fn6-tinh-lns.html:670:      } else {
  lns\fn6-tinh-lns.html:671:        Object.keys(FN6_DATA.nhomMap).forEach(id => { FN6_DATA.nhomMap[id].locked = true; 
FN6_DATA.nvs.forEach(nv => { if (nv.nhom_id === id) nv.locked = true; }); });
  lns\fn6-tinh-lns.html:672:      }
  lns\fn6-tinh-lns.html:673:      fn6Render(); fn6Alert("🔒 Đã khóa tất cả.", "success");
  lns\fn6-tinh-lns.html:674:    }
  lns\fn6-tinh-lns.html:675:    function fn6UnlockAll() {
  lns\fn6-tinh-lns.html:676:      if (!FN6_DATA) return;
  lns\fn6-tinh-lns.html:677:      const chkUnlock = document.getElementById('fn6-chk-unlockall');
  lns\fn6-tinh-lns.html:678:      if (chkUnlock && chkUnlock.checked) {
  lns\fn6-tinh-lns.html:679:        FN6_DATA.nvs.forEach(nv => { nv.locked = false; 
FN6_DATA.nhomMap[nv.nhom_id].locked = false; });
  lns\fn6-tinh-lns.html:680:        chkUnlock.checked = false;
  lns\fn6-tinh-lns.html:681:      } else {
  lns\fn6-tinh-lns.html:682:        Object.keys(FN6_DATA.nhomMap).forEach(id => { FN6_DATA.nhomMap[id].locked = false; 
FN6_DATA.nvs.forEach(nv => { if (nv.nhom_id === id) nv.locked = false; }); });
  lns\fn6-tinh-lns.html:683:      }
  lns\fn6-tinh-lns.html:684:      fn6Render(); fn6Alert("🔓 Đã mở khóa tất cả.", "success");
  lns\fn6-tinh-lns.html:685:    }
  lns\fn6-tinh-lns.html:686:    function fn6ToggleLockTo(id, val) { if (!FN6_DATA) return; FN6_DATA.nhomMap[id].locked 
= val; FN6_DATA.nvs.forEach(nv => { if (nv.nhom_id === id) nv.locked = val; }); }
  lns\fn6-tinh-lns.html:687:    function fn6ToggleCheckAll(el) { document.querySelectorAll('.fn6-lock-cb').forEach(cb 
=> cb.checked = el.checked); }
  lns\fn6-tinh-lns.html:688:    function fn6LockSelected() { const cbs = 
document.querySelectorAll('.fn6-lock-cb:checked'); if(!cbs.length) return fn6Alert('Vui lòng chọn nhóm.','warning'); 
cbs.forEach(cb => fn6ToggleLockTo(cb.dataset.id, true)); fn6Render(); fn6Alert('🔒 Đã khóa '+cbs.length+' nhóm đã 
chọn.','success'); }
  lns\fn6-tinh-lns.html:689:    function fn6UnlockSelected() { const cbs = 
document.querySelectorAll('.fn6-lock-cb:checked'); if(!cbs.length) return fn6Alert('Vui lòng chọn nhóm.','warning'); 
cbs.forEach(cb => fn6ToggleLockTo(cb.dataset.id, false)); fn6Render(); fn6Alert('🔓 Đã mở khóa '+cbs.length+' nhóm đã 
chọn.','success'); }
  lns\fn6-tinh-lns.html:690:
  lns\fn6-tinh-lns.html:691:    // ============================================================
  lns\fn6-tinh-lns.html:692:    // DETAIL POPUP — Excel-like full logic per TH
  lns\fn6-tinh-lns.html:693:    // ============================================================
  lns\fn6-tinh-lns.html:694:    let fn6DetailIdx = null;
  lns\fn6-tinh-lns.html:695:
  lns\fn6-tinh-lns.html:696:    function fn6ShowDetail(idx) {
  lns\fn6-tinh-lns.html:697:      if (!FN6_DATA) return;
  lns\fn6-tinh-lns.html:698:      fn6DetailIdx = idx;
  lns\fn6-tinh-lns.html:699:      const nv = FN6_DATA.nvs[idx];
  lns\fn6-tinh-lns.html:700:      const nh = FN6_DATA.nhomMap[nv.nhom_id];
  lns\fn6-tinh-lns.html:701:      const grpNvs = FN6_DATA.nvs.filter(v => v.nhom_id === nv.nhom_id);
  lns\fn6-tinh-lns.html:702:      const grpSX = grpNvs.filter(v => v.vai_tro === "SX");
  lns\fn6-tinh-lns.html:703:      const grpPV = grpNvs.filter(v => v.vai_tro === "PV");
  lns\fn6-tinh-lns.html:704:      const thLabel = nv.th === "TH2" ? "Chung 1 ĐV cấp 5" : nv.th === "TH3" ? "Chung 
nhiều ĐV cấp 5" : "Tách Phục vụ";
  lns\fn6-tinh-lns.html:705:      const hl = (m) => m === nv.ma ? ' style="background:#fff3cd;font-weight:bold"' : '';
  lns\fn6-tinh-lns.html:706:
  lns\fn6-tinh-lns.html:707:      document.getElementById("fn6-detail-title").textContent = `🔍 Chi tiết logic — 
[${nv.th}] — Đang xem: ${nv.ma} ${nv.ten}`;
  lns\fn6-tinh-lns.html:708:
  lns\fn6-tinh-lns.html:709:      let html = '';
  lns\fn6-tinh-lns.html:710:
  lns\fn6-tinh-lns.html:711:      // ── HEADER INFO ──
  lns\fn6-tinh-lns.html:712:      const nvCountLabel = nv.th === "TH4" ? `${nh.nv_count} (${nh.nv_sx} SX + ${nh.nv_pv} 
PV)` : `${nh.nv_count}`;
  lns\fn6-tinh-lns.html:713:      html += `<div class="trace-section"><div class="trace-header">Thông tin <span 
class="step-badge">INFO</span></div><div class="trace-body">
  lns\fn6-tinh-lns.html:714:        <table style="width:auto;font-size:12px">
  lns\fn6-tinh-lns.html:715:          <tr><td 
style="font-weight:bold;text-align:left;padding-right:20px;width:130px">Trường hợp</td><td><span class="badge-th 
${nv.th}">${nv.th}</span> — ${thLabel}</td></tr>
  lns\fn6-tinh-lns.html:716:          <tr><td style="font-weight:bold;text-align:left">Level 
5</td><td>${nh.level5.join(", ")}</td></tr>
  lns\fn6-tinh-lns.html:717:          <tr><td style="font-weight:bold;text-align:left">Số 
NV</td><td>${nvCountLabel}</td></tr>
  lns\fn6-tinh-lns.html:718:          <tr><td style="font-weight:bold;text-align:left">NSTT nhóm</td><td 
style="font-weight:bold;color:#c0392b;font-size:14px">${fn6Fmt(nh.nstt)} Kg</td></tr>
  lns\fn6-tinh-lns.html:719:          <tr><td style="font-weight:bold;text-align:left">Đang xem NV</td><td 
style="background:#fff3cd;padding:4px 8px"><b>${nv.ma}</b> — ${nv.ten} — <span class="badge-vai 
${nv.vai_tro}">${nv.vai_tro}</span> — Level 5: ${nv.level5}</td></tr>
  lns\fn6-tinh-lns.html:720:        </table></div></div>`;
  lns\fn6-tinh-lns.html:721:
  lns\fn6-tinh-lns.html:722:      // ── MOCK DATA FOR ALL EMPLOYEES IF MISSING ──
  lns\fn6-tinh-lns.html:723:      const thangStr = document.getElementById('fn6-thang').value || '07/2026';
  lns\fn6-tinh-lns.html:724:      const tParts = thangStr.split('/');
  lns\fn6-tinh-lns.html:725:      const tMM = parseInt(tParts[0]) || 7, tYYYY = parseInt(tParts[1]) || 2026;
  lns\fn6-tinh-lns.html:726:      const daysInMonth = new Date(tYYYY, tMM, 0).getDate();
  lns\fn6-tinh-lns.html:727:      const bspvFactor = nv.vai_tro === "PV" ? 0.1 : 0;
  lns\fn6-tinh-lns.html:728:
  lns\fn6-tinh-lns.html:729:      grpNvs.forEach(g => {
  lns\fn6-tinh-lns.html:730:        if (!g._days) {
  lns\fn6-tinh-lns.html:731:          const activeDays = [];
  lns\fn6-tinh-lns.html:732:          for (let d = 1; d <= daysInMonth; d++) { if (new Date(tYYYY, tMM - 1, 
d).getDay() !== 0) activeDays.push(d); }
  lns\fn6-tinh-lns.html:733:          const base = g.ctt / Math.max(activeDays.length, 1);
  lns\fn6-tinh-lns.html:734:          let cttArr = activeDays.map(() => Math.max(0, +(base + (Math.random() - 0.5) * 
0.4).toFixed(1)));
  lns\fn6-tinh-lns.html:735:          const diff = +(g.ctt - cttArr.reduce((s, v) => s + v, 0)).toFixed(1);
  lns\fn6-tinh-lns.html:736:          if (cttArr.length) cttArr[cttArr.length - 1] = Math.max(0, 
+(cttArr[cttArr.length - 1] + diff).toFixed(1));
  lns\fn6-tinh-lns.html:737:          let ai = 0;
  lns\fn6-tinh-lns.html:738:          const days = [];
  lns\fn6-tinh-lns.html:739:          for (let d = 1; d <= daysInMonth; d++) {
  lns\fn6-tinh-lns.html:740:            const isOff = new Date(tYYYY, tMM - 1, d).getDay() === 0;
  lns\fn6-tinh-lns.html:741:            const ctt = isOff ? 0 : (cttArr[ai++] || 0);
  lns\fn6-tinh-lns.html:742:            const bspv = g.vai_tro === "PV" ? (g.bspv > 0 ? g.bspv/100 : 0.1) : 0;
  lns\fn6-tinh-lns.html:743:            const cns = +(ctt * (g.hst / 100 + bspv)).toFixed(3);
  lns\fn6-tinh-lns.html:744:            days.push({ d, isOff, ctt, cns });
  lns\fn6-tinh-lns.html:745:          }
  lns\fn6-tinh-lns.html:746:          g._days = days;
  lns\fn6-tinh-lns.html:747:        }
  lns\fn6-tinh-lns.html:748:      });
  lns\fn6-tinh-lns.html:749:
  lns\fn6-tinh-lns.html:750:      if (nv.th === "TH4") {
  lns\fn6-tinh-lns.html:751:        const renderHeader = (title, color) => {
  lns\fn6-tinh-lns.html:752:          let h = '<tr>';
  lns\fn6-tinh-lns.html:753:          h += \`<th 
style="background:\${color};color:#fff;min-width:140px;text-align:left">\${title}</th>\`;
  lns\fn6-tinh-lns.html:754:          for(let d=1; d<=daysInMonth; d++) h += \`<th 
style="background:\${color};color:#fff;min-width:35px">N\${String(d).padStart(2,'0')}</th>\`;
  lns\fn6-tinh-lns.html:755:          h += \`<th 
style="background:\${color};color:#fff;min-width:60px">Tổng</th></tr>\`;
  lns\fn6-tinh-lns.html:756:          return h;
  lns\fn6-tinh-lns.html:757:        };
  lns\fn6-tinh-lns.html:758:        const renderRow = (label, arr, isBold=false, highlight=false, formatSum=false) => {
  lns\fn6-tinh-lns.html:759:          let h = \`<tr\${highlight ? ' style="background:#fff3cd;font-weight:bold"' : 
(isBold?' style="font-weight:bold"':'')}>\`;
  lns\fn6-tinh-lns.html:760:          h += \`<td class="tl">\${label}</td>\`;
  lns\fn6-tinh-lns.html:761:          let total = 0;
  lns\fn6-tinh-lns.html:762:          for(let d=1; d<=daysInMonth; d++) {
  lns\fn6-tinh-lns.html:763:             let v = arr[d-1];
  lns\fn6-tinh-lns.html:764:             total += v;
  lns\fn6-tinh-lns.html:765:             h += \`<td\${v===0?' style="color:#aaa"':''}>\${v===0 ? '-' : (formatSum ? 
fn6Fmt(v) : v.toFixed(3))}</td>\`;
  lns\fn6-tinh-lns.html:766:          }
  lns\fn6-tinh-lns.html:767:          h += \`<td style="color:#c0392b;font-weight:bold">\${formatSum ? fn6Fmt(total) : 
total.toFixed(3)}</td></tr>\`;
  lns\fn6-tinh-lns.html:768:          return h;
  lns\fn6-tinh-lns.html:769:        };
  lns\fn6-tinh-lns.html:770:        const createTbl = (step, title, color, renderRowsBody) => {
  lns\fn6-tinh-lns.html:771:          return \`<div class="trace-section"><div class="trace-header">Bước \${step}: 
\${title} <span class="step-badge" style="background:\${color}">BƯỚC \${step}</span></div><div class="trace-body">
  lns\fn6-tinh-lns.html:772:            <div style="overflow-x:auto"><table style="font-size:10px">
  lns\fn6-tinh-lns.html:773:              \${renderHeader(title, color)}
  lns\fn6-tinh-lns.html:774:              \${renderRowsBody()}
  lns\fn6-tinh-lns.html:775:            </table></div></div></div>\`;
  lns\fn6-tinh-lns.html:776:        };
  lns\fn6-tinh-lns.html:777:
  lns\fn6-tinh-lns.html:778:        const daysArr = Array.from({length:daysInMonth}, (_,i)=>i+1);
  lns\fn6-tinh-lns.html:779:        const getDailyCtt = (g) => g._days.map(d=>d.ctt);
  lns\fn6-tinh-lns.html:780:        const getDailyCns = (g) => g._days.map(d=>d.cns);
  lns\fn6-tinh-lns.html:781:        const sumArrs = (arrs) => daysArr.map((_,i) => arrs.reduce((s,a) => s + (a[i]||0), 
0));
  lns\fn6-tinh-lns.html:782:        
  lns\fn6-tinh-lns.html:783:        const pvCtts = grpPV.map(getDailyCtt);
  lns\fn6-tinh-lns.html:784:        const pvCnss = grpPV.map(getDailyCns);
  lns\fn6-tinh-lns.html:785:        const totCttPV = sumArrs(pvCtts);
  lns\fn6-tinh-lns.html:786:        const totCnsPV = sumArrs(pvCnss);
  lns\fn6-tinh-lns.html:787:
  lns\fn6-tinh-lns.html:788:        const sxByL5 = {};
  lns\fn6-tinh-lns.html:789:        grpSX.forEach(g => {
  lns\fn6-tinh-lns.html:790:           if(!sxByL5[g.level5]) sxByL5[g.level5] = [];
  lns\fn6-tinh-lns.html:791:           sxByL5[g.level5].push(g);
  lns\fn6-tinh-lns.html:792:        });
  lns\fn6-tinh-lns.html:793:        const l5Keys = Object.keys(sxByL5);
  lns\fn6-tinh-lns.html:794:        const banCnss = l5Keys.map(l5 => sumArrs(sxByL5[l5].map(getDailyCns)));
  lns\fn6-tinh-lns.html:795:        const totCnsSX = sumArrs(banCnss);
  lns\fn6-tinh-lns.html:796:        const totCnsKa = sumArrs([totCnsSX, totCnsPV]);
  lns\fn6-tinh-lns.html:797:
  lns\fn6-tinh-lns.html:798:        const banCnsWithPv = l5Keys.map((l5, idx) => {
  lns\fn6-tinh-lns.html:799:           return daysArr.map((_, i) => {
  lns\fn6-tinh-lns.html:800:              if (totCnsSX[i]===0) return 0;
  lns\fn6-tinh-lns.html:801:              return banCnss[idx][i] + (banCnss[idx][i] / totCnsSX[i]) * totCnsPV[i];
  lns\fn6-tinh-lns.html:802:           });
  lns\fn6-tinh-lns.html:803:        });
  lns\fn6-tinh-lns.html:804:        
  lns\fn6-tinh-lns.html:805:        const activeDaysCount = totCnsKa.filter(v=>v>0).length || 1;
  lns\fn6-tinh-lns.html:806:        const dailyNstt = nh.nstt / activeDaysCount;
  lns\fn6-tinh-lns.html:807:        const nsttTotalArr = totCnsKa.map(v => v>0 ? dailyNstt : 0);
  lns\fn6-tinh-lns.html:808:        const totCnsWithPv = sumArrs(banCnsWithPv);
  lns\fn6-tinh-lns.html:809:        const banNstt = l5Keys.map((l5, idx) => {
  lns\fn6-tinh-lns.html:810:           return daysArr.map((_, i) => {
  lns\fn6-tinh-lns.html:811:              if (totCnsWithPv[i]===0) return 0;
  lns\fn6-tinh-lns.html:812:              return (banCnsWithPv[idx][i] / totCnsWithPv[i]) * nsttTotalArr[i];
  lns\fn6-tinh-lns.html:813:           });
  lns\fn6-tinh-lns.html:814:        });
  lns\fn6-tinh-lns.html:815:
  lns\fn6-tinh-lns.html:816:        const banDonGia = l5Keys.map((l5, idx) => {
  lns\fn6-tinh-lns.html:817:           return daysArr.map((_, i) => {
  lns\fn6-tinh-lns.html:818:              if (banCnss[idx][i]===0) return 0;
  lns\fn6-tinh-lns.html:819:              return banNstt[idx][i] / banCnss[idx][i];
  lns\fn6-tinh-lns.html:820:           });
  lns\fn6-tinh-lns.html:821:        });
  lns\fn6-tinh-lns.html:822:
  lns\fn6-tinh-lns.html:823:        const banTrichPv = l5Keys.map((l5, idx) => {
  lns\fn6-tinh-lns.html:824:           return daysArr.map((_, i) => {
  lns\fn6-tinh-lns.html:825:              if (totCnsKa[i]===0) return 0;
  lns\fn6-tinh-lns.html:826:              return banNstt[idx][i] * (totCnsPV[i] / totCnsKa[i]);
  lns\fn6-tinh-lns.html:827:           });
  lns\fn6-tinh-lns.html:828:        });
  lns\fn6-tinh-lns.html:829:        const totTrichPv = sumArrs(banTrichPv);
  lns\fn6-tinh-lns.html:830:
  lns\fn6-tinh-lns.html:831:        const getSxNs = (g) => {
  lns\fn6-tinh-lns.html:832:           const bIdx = l5Keys.indexOf(g.level5);
  lns\fn6-tinh-lns.html:833:           const arr = getDailyCns(g);
  lns\fn6-tinh-lns.html:834:           return daysArr.map((_,i) => arr[i] * banDonGia[bIdx][i]);
  lns\fn6-tinh-lns.html:835:        };
  lns\fn6-tinh-lns.html:836:        const getPvNs = (g) => {
  lns\fn6-tinh-lns.html:837:           const arr = getDailyCns(g);
  lns\fn6-tinh-lns.html:838:           return daysArr.map((_,i) => {
  lns\fn6-tinh-lns.html:839:              if (totCnsPV[i]===0) return 0;
  lns\fn6-tinh-lns.html:840:              return arr[i] / totCnsPV[i] * totTrichPv[i];
  lns\fn6-tinh-lns.html:841:           });
  lns\fn6-tinh-lns.html:842:        };
  lns\fn6-tinh-lns.html:843:
  lns\fn6-tinh-lns.html:844:        html += createTbl(1, 'CÔNG THỰC TẾ PHỤC VỤ', '#2980b9', () => {
  lns\fn6-tinh-lns.html:845:           let r = '';
  lns\fn6-tinh-lns.html:846:           grpPV.forEach((g,i) => r += renderRow(g.ma+' - '+g.ten, pvCtts[i], false, 
g.ma===nv.ma));
  lns\fn6-tinh-lns.html:847:           r += renderRow('Tổng PV1', totCttPV, true);
  lns\fn6-tinh-lns.html:848:           return r;
  lns\fn6-tinh-lns.html:849:        });
  lns\fn6-tinh-lns.html:850:        
  lns\fn6-tinh-lns.html:851:        html += createTbl(2, 'CÔNG NĂNG SUẤT PHỤC VỤ', '#2980b9', () => {
  lns\fn6-tinh-lns.html:852:           let r = '';
  lns\fn6-tinh-lns.html:853:           grpPV.forEach((g,i) => r += renderRow(g.ma+' - '+g.ten, pvCnss[i], false, 
g.ma===nv.ma));
  lns\fn6-tinh-lns.html:854:           r += renderRow('Tổng PV1', totCnsPV, true);
  lns\fn6-tinh-lns.html:855:           return r;
  lns\fn6-tinh-lns.html:856:        });
  lns\fn6-tinh-lns.html:857:
  lns\fn6-tinh-lns.html:858:        html += createTbl(3, 'CÔNG NĂNG SUẤT CÁC BÀN', '#27ae60', () => {
  lns\fn6-tinh-lns.html:859:           let r = '';
  lns\fn6-tinh-lns.html:860:           l5Keys.forEach((l5,i) => r += renderRow(l5, banCnss[i]));
  lns\fn6-tinh-lns.html:861:           r += renderRow('PV1', totCnsPV);
  lns\fn6-tinh-lns.html:862:           r += renderRow('Tổng Ka1', totCnsKa, true);
  lns\fn6-tinh-lns.html:863:           return r;
  lns\fn6-tinh-lns.html:864:        });
  lns\fn6-tinh-lns.html:865:
  lns\fn6-tinh-lns.html:866:        html += createTbl(4, 'CÔNG NĂNG SUẤT SẢN XUẤT (SAU KHI BỎ PHẦN PV)', '#27ae60', () 
=> {
  lns\fn6-tinh-lns.html:867:           let r = '';
  lns\fn6-tinh-lns.html:868:           l5Keys.forEach((l5,i) => r += renderRow(l5, banCnss[i]));
  lns\fn6-tinh-lns.html:869:           r += renderRow('Tổng SX', totCnsSX, true);
  lns\fn6-tinh-lns.html:870:           return r;
  lns\fn6-tinh-lns.html:871:        });
  lns\fn6-tinh-lns.html:872:
  lns\fn6-tinh-lns.html:873:        html += createTbl(5, 'TỔNG CÔNG NĂNG SUẤT (THÊM CÔNG PV)', '#8e44ad', () => {
  lns\fn6-tinh-lns.html:874:           let r = '';
  lns\fn6-tinh-lns.html:875:           l5Keys.forEach((l5,i) => r += renderRow(l5, banCnsWithPv[i]));
  lns\fn6-tinh-lns.html:876:           r += renderRow('Tổng Ka1', totCnsWithPv, true);
  lns\fn6-tinh-lns.html:877:           return r;
  lns\fn6-tinh-lns.html:878:        });
  lns\fn6-tinh-lns.html:879:
  lns\fn6-tinh-lns.html:880:        html += createTbl(6, 'NĂNG SUẤT THỰC TẾ', '#c0392b', () => {
  lns\fn6-tinh-lns.html:881:           let r = '';
  lns\fn6-tinh-lns.html:882:           l5Keys.forEach((l5,i) => r += renderRow(l5, banNstt[i], false, false, true));
  lns\fn6-tinh-lns.html:883:           r += renderRow('Tổng Ka1', nsttTotalArr, true, false, true);
  lns\fn6-tinh-lns.html:884:           return r;
  lns\fn6-tinh-lns.html:885:        });
  lns\fn6-tinh-lns.html:886:
  lns\fn6-tinh-lns.html:887:        html += createTbl(7, 'BC2 - ĐƠN GIÁ 1 CÔNG NS (ĐÃ TRỪ PV)', '#d35400', () => {
  lns\fn6-tinh-lns.html:888:           let r = '';
  lns\fn6-tinh-lns.html:889:           l5Keys.forEach((l5,i) => r += renderRow(l5, banDonGia[i], false, false, true));
  lns\fn6-tinh-lns.html:890:           return r;
  lns\fn6-tinh-lns.html:891:        });


