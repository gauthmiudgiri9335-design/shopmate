// ============================================
// SHOPMATE — COMPLETE APP.JS — FINAL VERSION
// ============================================

function getNameFromRow(tr) {
  if (tr.dataset.productname) return tr.dataset.productname.trim();
  const nameSpan = tr.querySelector(".product-name-text");
  if (nameSpan) return nameSpan.textContent.trim();
  return "";
}

let PRODUCTS = [
  { id:"p1",  group:"g1", name:"टँगो पंच - F",  price:360 },
  { id:"p2",  group:"g1", name:"संत्रा - F",     price:360 },
  { id:"p3",  group:"g1", name:"टँगो पंच - N",   price:90  },
  { id:"p4",  group:"g1", name:"संत्रा - N",     price:90  },
  { id:"p5",  group:"g1", name:"जी. एम. - N",    price:90  },
  { id:"p6",  group:"g1", name:"सौफ - N",        price:90  },
  { id:"p7",  group:"g1", name:"Vodka - N",      price:90  },
  { id:"p8",  group:"g1", name:"मँगो - N",       price:90  },
  { id:"p9",  group:"g1", name:"ब्लू - N",       price:90  },
  { id:"p10", group:"g1", name:"ॲप्पल - N",      price:90  },
  { id:"p11", group:"g2", name:"टँगो 90",        price:46  },
  { id:"p12", group:"g2", name:"वोल्का 90",      price:46  },
  { id:"p13", group:"g2", name:"जामुन 90",       price:46  },
  { id:"p14", group:"g2", name:"CM 90",          price:60  },
  { id:"p15", group:"g2", name:"ब्लू 90",        price:46  },
  { id:"p16", group:"g2", name:"गोल्डी 90",      price:34  },
  { id:"p17", group:"g2", name:"पावर 90",        price:40  },
  { id:"p18", group:"g2", name:"Apple 90",       price:46  },
  { id:"p19", group:"g2", name:"संत्रा 90",      price:46  },
  { id:"p20", group:"g2", name:"GM 90",          price:46  },
  { id:"p21", group:"g2", name:"S 90",           price:46  },
  { id:"p22", group:"g2", name:"मँगो 90",        price:46  },
  { id:"p23", group:"g3", name:"स्प्राईट",       price:20  },
  { id:"p24", group:"g3", name:"Jeera सोडा",     price:12  },
  { id:"p25", group:"g3", name:"सोडा",           price:7   },
  { id:"p26", group:"g3", name:"लेमन",           price:10  },
  { id:"p27", group:"g3", name:"पाणी",           price:10  },
  { id:"p28", group:"g4", name:"A-10",           price:2   },
  { id:"p29", group:"g4", name:"गरम",            price:25  },
  { id:"p30", group:"g4", name:"ब्रिस्टॉल",      price:12  },
  { id:"p31", group:"g4", name:"गोल्ड फ्लॅक",   price:15  },
  { id:"p32", group:"g4", name:"इंडिमेंट",       price:15  },
  { id:"p33", group:"g4", name:"Focus",          price:8   },
];

const GROUP_NAMES = {
  g1:"बॉटल्स (F/N)", g2:"90 ml",
  g3:"कोल्ड ड्रिंक्स", g4:"सिगारेट"
};

let EXPENSES_LIST = [
  { id:"e1", name:"चहा" }, { id:"e2", name:"ॲप" },
  { id:"e3", name:"झार" }, { id:"e4", name:"पगार" },
  { id:"e5", name:"पिग्मी" }, { id:"e6", name:"सिगारेट" },
];

let currentRows = [], currentExpenses = [];
let rowCounter = 1000, yeneCounter = 3000;

// ── INIT ──
window.onload = function () {
  setDefaultDate();
  loadProductsFromStorage();
  buildMainTable();
  buildExpenseTable();
  buildYeneTable();
  loadYesterdayShillak();
  calculateAll();
  blockNumberScrollChange();
};

function blockNumberScrollChange() {
  document.addEventListener("wheel", function (e) {
    if (document.activeElement.type === "number") document.activeElement.blur();
  }, { passive: true });
}

function moveFocus(event, currentInput, columnClass) {
  if (event.key !== "Tab" && event.key !== "Enter") return;
  event.preventDefault();
  const allInputs = Array.from(document.querySelectorAll("#table-body ." + columnClass + "-input"));
  const currentIndex = allInputs.indexOf(currentInput);
  if (currentIndex === -1) return;
  const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
  if (nextIndex >= 0 && nextIndex < allInputs.length) {
    allInputs[nextIndex].focus();
    allInputs[nextIndex].select();
  }
}

// ── DATE ──
function setDefaultDate() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date1").value = today;
  updateDayLabel("date1","day1");
  // Date change does NOT clear filled data
  document.getElementById("date1").addEventListener("change", function () {
    updateDayLabel("date1","day1");
    checkIfDateAlreadySaved();
  });
  document.getElementById("date2").addEventListener("change", function () {
    updateDayLabel("date2","day2");
  });
}

function updateDayLabel(dateId, labelId) {
  const val = document.getElementById(dateId).value;
  if (!val) return;
  const days = ["रविवार","सोमवार","मंगळवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"];
  document.getElementById(labelId).innerText = days[new Date(val+"T00:00:00").getDay()];
}

function addDate2() {
  document.getElementById("date2-row").classList.remove("hidden");
  if (!document.getElementById("date2").value) {
    document.getElementById("date2").value = document.getElementById("date1").value;
    updateDayLabel("date2","day2");
  }
}
function removeDate2() {
  document.getElementById("date2-row").classList.add("hidden");
  document.getElementById("date2").value = "";
}

// ── DATE EXISTS WARNING ──
async function checkIfDateAlreadySaved() {
  const sel = document.getElementById("date1").value;
  if (!sel) return;
  try {
    const { data, error } = await supabaseClient.from("records").select("data");
    if (error || !data) return;
    const found = data.find(r => r.data && (r.data.date1===sel || r.data.date2===sel));
    let banner = document.getElementById("date-warning-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "date-warning-banner";
      banner.style.cssText = "background:#fff3e0;color:#e65100;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;margin-bottom:8px;text-align:center;";
      const ds = document.querySelector(".date-section");
      ds.parentNode.insertBefore(banner, ds.nextSibling);
    }
    if (found) { banner.innerText = "⚠️ " + sel + " ची नोंद आधीच सेव्ह आहे!"; banner.style.display = "block"; }
    else banner.style.display = "none";
  } catch(e) { console.error(e); }
}

function hideDateWarning() {
  const b = document.getElementById("date-warning-banner");
  if (b) b.style.display = "none";
}

// ── SHILLAK CARRY-FORWARD (FULLY FIXED) ──
// Reads shillak directly from saved record's shillak field
// Fallback: calculates from ekun - vikri
// NEVER reads dilela field
async function loadYesterdayShillak() {
  const selectedDate = document.getElementById("date1").value;
  if (!selectedDate) { clearAllDilelaInputs(); return; }

  try {
    const { data: records, error } = await supabaseClient.from("records").select("*");
    if (error || !records || records.length === 0) { clearAllDilelaInputs(); return; }

    // Find latest non-holiday record before selected date
    let best = null, bestDate = null;
    records.forEach(function(rec) {
      const d = rec.data;
      if (!d || !d.date1 || d.isHoliday) return;
      const endDate = d.date2 ? d.date2 : d.date1;
      if (endDate >= selectedDate) return;
      if (!bestDate || endDate > bestDate) { bestDate = endDate; best = rec; }
    });

    if (!best) { clearAllDilelaInputs(); return; }

    console.log("✅ Carry-forward from:", bestDate);
    clearAllDilelaInputs();

    // Build shillak map — name → shillak value
    const shillakMap = {};
    (best.data.products || []).forEach(function(p) {
      if (!p.name || p.name.trim() === "") return;

      // METHOD 1: Read shillak field directly
      // shillak is what owner typed in शिल्लक box
      let shillakVal = 0;

      if (p.shillak !== undefined && p.shillak !== null && p.shillak !== "") {
        const parsed = parseFloat(String(p.shillak).trim());
        if (!isNaN(parsed) && parsed >= 0) shillakVal = parsed;
      }

      // METHOD 2: If shillak is 0 or missing, calculate from ekun - vikri
      if (shillakVal === 0) {
        const ekun  = parseFloat(String(p.ekun  || "0").trim()) || 0;
        const vikri = parseFloat(String(p.vikri || "0").trim()) || 0;
        const calc  = ekun - vikri;
        if (calc > 0) shillakVal = calc;
      }

      console.log("▶", p.name, "shillak:", p.shillak, "ekun:", p.ekun, "vikri:", p.vikri, "→ using:", shillakVal);

      // Store even if 0 — we want to fill 0 too so owner knows there's nothing left
      shillakMap[p.name.trim()] = shillakVal;
    });

    console.log("📦 शिल्लक map:", shillakMap);

    // Fill matching rows in today's table
    let filled = 0;
    document.querySelectorAll("#table-body tr[data-productname]").forEach(function(tr) {
      const name = (tr.getAttribute("data-productname") || "").trim();
      if (!name || !(name in shillakMap)) return;
      const shillak = shillakMap[name];
      const inp = tr.querySelector(".dilela-input");
      if (!inp) return;
      // Only fill if shillak > 0 (no point showing 0 in dilela maal)
      if (shillak > 0) {
        inp.value = shillak;
        inp.placeholder = "";
        calculateRow(tr.getAttribute("data-id"));
        filled++;
      }
    });

    console.log("✏️ Filled", filled, "rows");

  } catch(e) {
    console.error("Shillak error:", e);
    clearAllDilelaInputs();
  }
}

function clearAllDilelaInputs() {
  document.querySelectorAll("#table-body .dilela-input").forEach(function(inp) {
    inp.value = ""; inp.placeholder = "";
  });
  document.querySelectorAll("#table-body tr[data-id]").forEach(function(tr) {
    calculateRow(tr.getAttribute("data-id"));
  });
}

// ── BUILD TABLE ──
function buildMainTable() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = ""; currentRows = [];
  const order = ["g1","g2","g3","g4","custom"];
  const sorted = [...PRODUCTS].sort((a,b) => order.indexOf(a.group) - order.indexOf(b.group));
  let lastGroup = "";
  sorted.forEach(function(prod) {
    if (prod.group !== lastGroup) {
      const gr = document.createElement("tr");
      gr.className = "group-header";
      gr.innerHTML = `<td colspan="7">${GROUP_NAMES[prod.group]||"इतर माल"}</td>`;
      tbody.appendChild(gr);
      lastGroup = prod.group;
    }
    addProductRow(prod.id, prod.name, prod.price, "", "");
  });
}

function addProductRow(id, name, price, dilelaVal, shillakVal) {
  const tbody = document.getElementById("table-body");
  const tr = document.createElement("tr");
  tr.setAttribute("data-id", id);
  tr.setAttribute("data-price", price);
  tr.setAttribute("data-productname", name);
  tr.className = "product-row";
  tr.innerHTML = `
    <td class="name-cell" data-label="नाव">
      <span class="card-name-row">
        <span><span class="product-name-text">${name}</span><span class="price-tag">₹${price}/नग</span></span>
        <span class="rakkam-cell card-rakkam">₹0</span>
      </span>
    </td>
    <td data-label="दिलेला माल">
      <span class="cell-label">दिलेला</span>
      <input type="text" class="dilela-input" placeholder="" value="${dilelaVal||''}"
        oninput="calculateRow('${id}')" onkeydown="moveFocus(event,this,'dilela')" />
    </td>
    <td data-label="एकूण"><span class="cell-label">एकूण</span><span class="auto-cell ekun-cell">0</span></td>
    <td data-label="शिल्लक">
      <span class="cell-label">शिल्लक</span>
      <input type="number" class="shillak-input" placeholder="" value="${shillakVal||''}"
        oninput="calculateRow('${id}')" onkeydown="moveFocus(event,this,'shillak')" />
    </td>
    <td data-label="विक्री"><span class="cell-label">विक्री</span><span class="auto-cell vikri-cell">0</span></td>
    <td class="rakkam-cell table-only-rakkam" data-label="रक्कम">₹0</td>
    <td class="delete-cell"><button class="small-btn red" onclick="deleteRow('${id}')">✕</button></td>
  `;
  tbody.appendChild(tr);
  currentRows.push({ id, name, price });
}

function calculateRow(id) {
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  if (!tr) return;
  const price = parseFloat(tr.getAttribute("data-price")) || 0;
  const dilela = tr.querySelector(".dilela-input").value.trim();
  const shillakVal = tr.querySelector(".shillak-input").value.trim();
  let ekun = 0;
  if (dilela) {
    dilela.replace(/\s/g,"").split("+").forEach(p => { const n=parseFloat(p); if(!isNaN(n)) ekun+=n; });
  }
  const shillak = parseFloat(shillakVal) || 0;
  const vikri = Math.max(0, ekun - shillak);
  const rakkam = vikri * price;
  tr.querySelector(".ekun-cell").innerText = ekun;
  tr.querySelector(".vikri-cell").innerText = vikri;
  tr.querySelectorAll(".rakkam-cell").forEach(el => el.innerText = "₹" + rakkam);
  calculateAll();
}

function deleteRow(id) {
  if (!confirm("हा माल कायमचा यादीतून काढायचा का?")) return;
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  if (tr) tr.remove();
  PRODUCTS = PRODUCTS.filter(p => p.id !== id);
  saveProductsToStorage();
  calculateAll();
}

function addCustomRow() {
  document.getElementById("modal-name").value = "";
  document.getElementById("modal-price").value = "";
  document.getElementById("modal-group").value = "g1";
  document.getElementById("add-product-modal").classList.add("active");
}
function closeAddProductModal() {
  document.getElementById("add-product-modal").classList.remove("active");
}
function confirmAddProduct() {
  const name = document.getElementById("modal-name").value.trim();
  const price = parseFloat(document.getElementById("modal-price").value) || 0;
  const group = document.getElementById("modal-group").value;
  if (!name) { alert("कृपया मालाचे नाव लिहा!"); return; }
  rowCounter++;
  PRODUCTS.push({ id:"c"+rowCounter, group, name, price });
  saveProductsToStorage();
  closeAddProductModal();
  buildMainTable();
}

// ── EXPENSE TABLE ──
function buildExpenseTable() {
  document.getElementById("expense-body").innerHTML = ""; currentExpenses = [];
  EXPENSES_LIST.forEach(e => addExpenseRowToDOM(e.id, e.name, ""));
}
function addExpenseRowToDOM(id, name, val) {
  const tbody = document.getElementById("expense-body");
  const tr = document.createElement("tr");
  tr.dataset.id = id;
  tr.innerHTML = `
    <td class="name-cell">${name}</td>
    <td><input type="number" class="expense-input" placeholder="" value="${val||''}" oninput="calculateAll()" /></td>
    <td><button class="small-btn red" onclick="deleteExpenseRow('${id}')">✕</button></td>
  `;
  tbody.appendChild(tr);
  currentExpenses.push({ id, name });
}
function addExpenseRow() {
  const name = prompt("नवीन खर्चाचे नाव लिहा:");
  if (!name) return;
  rowCounter++;
  const id = "exp"+rowCounter;
  addExpenseRowToDOM(id, name, "");
  EXPENSES_LIST.push({ id, name });
  saveExpensesToStorage();
}
function deleteExpenseRow(id) {
  if (!confirm("हा खर्च काढायचा का?")) return;
  const tr = document.querySelector(`#expense-body tr[data-id="${id}"]`);
  if (tr) tr.remove();
  calculateAll();
}

// ── YENE TABLE (1 row default) ──
function buildYeneTable() {
  document.getElementById("yene-body").innerHTML = "";
  addYeneRow();
}
function addYeneRow(nv, av) {
  yeneCounter++;
  const id = "yn"+yeneCounter;
  const tbody = document.getElementById("yene-body");
  const tr = document.createElement("tr");
  tr.dataset.id = id;
  tr.innerHTML = `
    <td><input type="text" class="yene-name-input" placeholder="नाव लिहा" value="${nv||''}" /></td>
    <td><input type="number" class="yene-amount-input" placeholder="" value="${av||''}" oninput="calcYene()" /></td>
    <td><button class="small-btn red" onclick="deleteYeneRow('${id}')">✕</button></td>
  `;
  tbody.appendChild(tr);
}
function deleteYeneRow(id) {
  const tr = document.querySelector(`#yene-body tr[data-id="${id}"]`);
  if (tr) tr.remove();
  calcYene();
}
function calcYene() {
  let t = 0;
  document.querySelectorAll("#yene-body .yene-amount-input").forEach(i => t += parseFloat(i.value)||0);
  document.getElementById("yene-total").innerText = "₹"+t;
}
// alias
function calculateYeneTotal() { calcYene(); }

function calculateBaki() {
  const nafa = parseFloat(document.getElementById("rakh-nafa").innerText.replace("₹",""))||0;
  const rakh = parseFloat(document.getElementById("rakh-input").value)||0;
  const baki = nafa - rakh;
  const el = document.getElementById("baki-amount");
  el.innerText = "₹"+baki;
  el.className = baki===0 ? "baki-zero" : "baki-nonzero";
}

function calculateAll() {
  let totalR = 0;
  document.querySelectorAll("#table-body tr[data-id]").forEach(tr => {
    const el = tr.querySelector(".table-only-rakkam");
    if (el) totalR += parseFloat(el.innerText.replace("₹",""))||0;
  });
  let totalE = 0;
  document.querySelectorAll("#expense-body tr[data-id]").forEach(tr => {
    totalE += parseFloat(tr.querySelector(".expense-input").value)||0;
  });
  const net = totalR - totalE;
  document.getElementById("total-rakkam").innerText  = "₹"+totalR;
  document.getElementById("total-expense").innerText = "₹"+totalE;
  document.getElementById("final-rakkam").innerText  = "₹"+totalR;
  document.getElementById("final-expense").innerText = "₹"+totalE;
  document.getElementById("final-total").innerText   = "₹"+net;
  document.getElementById("final-cash").innerText    = "₹"+net;
  document.getElementById("rakh-nafa").innerText     = "₹"+net;
  calculateBaki();
}

// ── STORAGE ──
function saveProductsToStorage() {
  localStorage.setItem("shopmate_products", JSON.stringify(PRODUCTS));
}
function loadProductsFromStorage() {
  const p = localStorage.getItem("shopmate_products");
  if (p) PRODUCTS = JSON.parse(p);
  const e = localStorage.getItem("shopmate_expenses");
  if (e) EXPENSES_LIST = JSON.parse(e);
}
function saveExpensesToStorage() {
  localStorage.setItem("shopmate_expenses", JSON.stringify(EXPENSES_LIST));
}

// ── COLLECT DATA ──
// Reads name from data-productname attribute — always reliable
function collectFormData() {
  const date1 = document.getElementById("date1").value;
  const date2 = document.getElementById("date2").value;
  const day1  = document.getElementById("day1").innerText;
  const day2  = document.getElementById("day2").innerText;

  const products = [];
  document.querySelectorAll("#table-body tr[data-productname]").forEach(function(tr) {
    const name    = (tr.getAttribute("data-productname")||"").trim();
    const price   = tr.getAttribute("data-price")||"0";
    const dilela  = tr.querySelector(".dilela-input").value;
    const ekun    = tr.querySelector(".ekun-cell").innerText;
    const shillak = tr.querySelector(".shillak-input").value;
    const vikri   = tr.querySelector(".vikri-cell").innerText;
    const rakkam  = tr.querySelector(".table-only-rakkam").innerText;
    products.push({ name, price, dilela, ekun, shillak, vikri, rakkam });
  });

  const expenses = [];
  document.querySelectorAll("#expense-body tr[data-id]").forEach(function(tr) {
    expenses.push({
      name:   tr.querySelector(".name-cell").innerText.trim(),
      amount: tr.querySelector(".expense-input").value||"0"
    });
  });

  const yene = [];
  document.querySelectorAll("#yene-body tr[data-id]").forEach(function(tr) {
    const n = tr.querySelector(".yene-name-input").value.trim();
    const a = tr.querySelector(".yene-amount-input").value||"0";
    if (n || parseFloat(a)>0) yene.push({ name:n, amount:a });
  });

  return {
    date1, date2, day1, day2, products, expenses, yeneEntries:yene,
    rakhRakkam:   document.getElementById("rakh-input").value||"0",
    baki:         document.getElementById("baki-amount").innerText,
    totalRakkam:  document.getElementById("total-rakkam").innerText,
    totalExpense: document.getElementById("total-expense").innerText,
    netProfit:    document.getElementById("final-total").innerText,
    recordKey:    date2 ? date1+"_"+date2 : date1,
    savedAt:      new Date().toISOString()
  };
}

// ── SAVE ──
async function saveRecord() {
  const data = collectFormData();
  if (!data.date1) { alert("कृपया तारीख निवडा!"); return; }
  try {
    const { data: all } = await supabaseClient.from("records").select("id, data");
    const dates = [data.date1];
    if (data.date2) dates.push(data.date2);
    const conflict = (all||[]).find(function(r) {
      const d = r.data; if (!d) return false;
      const rd = [d.date1]; if (d.date2) rd.push(d.date2);
      return dates.some(dt => rd.includes(dt));
    });
    if (conflict) {
      const lbl = conflict.data.date2
        ? conflict.data.date1+" ते "+conflict.data.date2
        : conflict.data.date1;
      if (!confirm("⚠️ "+lbl+" ची नोंद आधीच आहे. अपडेट करायची का?")) return;
      const { error:ue } = await supabaseClient.from("records").update({ data }).eq("id", conflict.id);
      if (ue) throw ue;
      alert("✅ नोंद अपडेट झाली!\n\nनवीन नोंदीसाठी पेज रिफ्रेश होत आहे...");
    } else {
      const { error:ie } = await supabaseClient.from("records").insert([{ data }]);
      if (ie) throw ie;
      alert("✅ नोंद सेव्ह झाली!\n\nनवीन नोंदीसाठी पेज रिफ्रेश होत आहे...");
    }
    hideDateWarning();
    setTimeout(() => window.location.reload(), 1000);
  } catch(e) {
    alert("❌ चूक: "+e.message);
  }
}

function printRecord() { window.print(); }

// ── PAGE NAV WITH BACK BUTTON SUPPORT ──
function showPage(pageName, addToHistory) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-"+pageName).classList.add("active");
  if (pageName==="history")  loadHistory();
  if (pageName==="products") loadProductsPage();
  if (addToHistory !== false) {
    history.pushState({ page: pageName }, "", "#"+pageName);
  }
}

window.addEventListener("popstate", function(event) {
  if (event.state && event.state.page) showPage(event.state.page, false);
  else showPage("home", false);
});

// ── HISTORY ──
async function loadHistory() {
  const div = document.getElementById("history-list");
  div.innerHTML = "<p style='text-align:center;color:#888;padding:20px;'>लोड होत आहे...</p>";
  const { data: recs, error } = await supabaseClient.from("records").select("*").order("created_at", { ascending:false });
  if (error) { div.innerHTML = "<p style='color:red;padding:16px;'>चूक: "+error.message+"</p>"; return; }
  if (!recs || recs.length===0) { div.innerHTML = "<p style='text-align:center;color:#888;padding:20px;'>अजून कोणतीही नोंद नाही</p>"; return; }
  div.innerHTML = "";
  recs.forEach(function(rec) {
    const d = rec.data; if (!d) return;
    let lbl = (d.day1||"")+", "+fmtDate(d.date1);
    if (d.date2) lbl = (d.day1||"")+"-"+(d.day2||"")+", "+fmtDate(d.date1)+" ते "+fmtDate(d.date2);
    const card = document.createElement("div");
    card.className = "history-card";
    if (d.isHoliday) {
      card.style.borderLeft = "4px solid #c62828";
      card.innerHTML = `<div class="history-date">🏖️ ${lbl}</div>
        <div class="history-amount" style="color:#c62828;">सुट्टी</div>
        <div class="history-btns"><button class="small-btn red" onclick="deleteHistoryRecord(${rec.id})">🗑️ डिलीट</button></div>`;
    } else {
      card.innerHTML = `<div class="history-date">${lbl}</div>
        <div class="history-amount">निव्वळ नफा: ${d.netProfit||"₹0"}</div>
        <div class="history-btns">
          <button class="small-btn blue" onclick="viewHistoryRecord(${rec.id})">👁️ बघा</button>
          <button class="small-btn red" onclick="deleteHistoryRecord(${rec.id})">🗑️ डिलीट</button>
        </div>`;
    }
    div.appendChild(card);
  });
}

function fmtDate(s) {
  if (!s) return "";
  const p = s.split("-"); return p[2]+"/"+p[1]+"/"+p[0];
}
// alias used in older code
function formatDate(s) { return fmtDate(s); }

async function deleteHistoryRecord(id) {
  if (!confirm("ही नोंद कायमची डिलीट करायची का?")) return;
  await supabaseClient.from("records").delete().eq("id", id);
  loadHistory();
}

// ── VIEW / EDIT RECORD ──
let currentViewRecordId = null, isEditMode = false;

async function viewHistoryRecord(id) {
  const { data: rec, error } = await supabaseClient.from("records").select("*").eq("id", id).single();
  if (error) { alert("चूक: "+error.message); return; }
  currentViewRecordId = id;
  isEditMode = false;
  buildRecordViewPage(rec.data);
  setViewMode();
  showPage("record-view");
}

function buildRecordViewPage(d) {
  let lbl = (d.day1||"")+", "+fmtDate(d.date1);
  if (d.date2) lbl = (d.day1||"")+"-"+(d.day2||"")+", "+fmtDate(d.date1)+" ते "+fmtDate(d.date2);
  document.getElementById("rv-date-label").innerText = lbl;

  const tbody = document.getElementById("rv-table-body");
  tbody.innerHTML = "";
  (d.products||[]).forEach(function(p, i) {
    const nm = (p.name||"").trim() || ("माल "+(i+1));
    const tr = document.createElement("tr");
    tr.dataset.index = i;
    tr.dataset.price = p.price||0;
    tr.innerHTML = `
      <td class="name-cell">${nm}<span class="price-tag">₹${p.price||0}/नग</span></td>
      <td><input type="text" class="rv-dilela-input" value="${p.dilela||''}" disabled oninput="rvCalculateRow(${i})" /></td>
      <td class="auto-cell rv-ekun-cell">${p.ekun||0}</td>
      <td><input type="number" class="rv-shillak-input" value="${p.shillak||''}" disabled oninput="rvCalculateRow(${i})" /></td>
      <td class="auto-cell rv-vikri-cell">${p.vikri||0}</td>
      <td class="rakkam-cell">${p.rakkam||'₹0'}</td>`;
    tbody.appendChild(tr);
  });

  const expBody = document.getElementById("rv-expense-body");
  expBody.innerHTML = "";
  (d.expenses||[]).forEach(function(exp, i) {
    if (!exp.name) return;
    const tr = document.createElement("tr");
    tr.dataset.index = i;
    tr.innerHTML = `<td class="name-cell">${exp.name}</td>
      <td><input type="number" class="rv-expense-input" value="${exp.amount||''}" disabled oninput="rvCalculateAll()" /></td>`;
    expBody.appendChild(tr);
  });

  document.getElementById("rv-total-rakkam").innerText  = d.totalRakkam  ||"₹0";
  document.getElementById("rv-total-expense").innerText = d.totalExpense||"₹0";
  document.getElementById("rv-final-rakkam").innerText  = d.totalRakkam  ||"₹0";
  document.getElementById("rv-final-expense").innerText = d.totalExpense||"₹0";
  document.getElementById("rv-final-total").innerText   = d.netProfit    ||"₹0";

  const yene = d.yeneEntries||[];
  const ys = document.getElementById("rv-yene-section");
  const yw = document.getElementById("rv-yene-wrapper");
  const yb = document.getElementById("rv-yene-body");
  if (yene.length>0) {
    ys.style.display="block"; yw.style.display="block"; yb.innerHTML="";
    yene.forEach(y => {
      if (!y.name) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td class="name-cell">${y.name}</td>
        <td style="text-align:right;padding-right:12px;font-weight:700;color:var(--navy);">₹${y.amount}</td>`;
      yb.appendChild(tr);
    });
  } else { ys.style.display="none"; yw.style.display="none"; }
}

function rvCalculateRow(i) {
  const tr = document.querySelector(`#rv-table-body tr[data-index="${i}"]`);
  if (!tr) return;
  const price = parseFloat(tr.dataset.price)||0;
  const d = tr.querySelector(".rv-dilela-input").value.trim();
  const sh = parseFloat(tr.querySelector(".rv-shillak-input").value)||0;
  let ek = 0;
  if (d) d.replace(/\s/g,"").split("+").forEach(p => { const n=parseFloat(p); if(!isNaN(n)) ek+=n; });
  const vk = Math.max(0,ek-sh);
  tr.querySelector(".rv-ekun-cell").innerText = ek;
  tr.querySelector(".rv-vikri-cell").innerText = vk;
  tr.querySelectorAll(".rakkam-cell").forEach(el => el.innerText="₹"+(vk*price));
  rvCalculateAll();
}

function rvCalculateAll() {
  let tr=0, te=0;
  document.querySelectorAll("#rv-table-body tr[data-index]").forEach(r => {
    const el=r.querySelector(".rakkam-cell"); if(el) tr+=parseFloat(el.innerText.replace("₹",""))||0;
  });
  document.querySelectorAll("#rv-expense-body tr[data-index]").forEach(r => {
    te+=parseFloat(r.querySelector(".rv-expense-input").value)||0;
  });
  const net=tr-te;
  document.getElementById("rv-total-rakkam").innerText  ="₹"+tr;
  document.getElementById("rv-total-expense").innerText ="₹"+te;
  document.getElementById("rv-final-rakkam").innerText  ="₹"+tr;
  document.getElementById("rv-final-expense").innerText ="₹"+te;
  document.getElementById("rv-final-total").innerText   ="₹"+net;
}

function toggleEditMode() { isEditMode ? setViewMode() : setEditMode(); }

function setViewMode() {
  isEditMode = false;
  document.querySelectorAll("#rv-table-body input, #rv-expense-body input").forEach(i => i.disabled=true);
  document.getElementById("view-mode-banner").classList.remove("hidden");
  document.getElementById("edit-toggle-btn").innerText = "✏️ एडिट करा";
  document.getElementById("rv-save-section").style.display = "none";
}
function setEditMode() {
  isEditMode = true;
  document.querySelectorAll("#rv-table-body input, #rv-expense-body input").forEach(i => i.disabled=false);
  document.getElementById("view-mode-banner").classList.add("hidden");
  document.getElementById("edit-toggle-btn").innerText = "👁️ फक्त बघा";
  document.getElementById("rv-save-section").style.display = "flex";
}

async function saveEditedRecord() {
  if (!currentViewRecordId) return;
  const products = [];
  document.querySelectorAll("#rv-table-body tr[data-index]").forEach(function(tr) {
    const nc = tr.querySelector(".name-cell");
    const nm = nc ? nc.childNodes[0].textContent.trim() : "";
    products.push({
      name:nm, price:tr.dataset.price,
      dilela:tr.querySelector(".rv-dilela-input").value,
      ekun:tr.querySelector(".rv-ekun-cell").innerText,
      shillak:tr.querySelector(".rv-shillak-input").value,
      vikri:tr.querySelector(".rv-vikri-cell").innerText,
      rakkam:tr.querySelector(".rakkam-cell").innerText
    });
  });
  const expenses = [];
  document.querySelectorAll("#rv-expense-body tr[data-index]").forEach(function(tr) {
    expenses.push({ name:tr.querySelector(".name-cell").innerText.trim(), amount:tr.querySelector(".rv-expense-input").value||"0" });
  });
  try {
    const { data:ex } = await supabaseClient.from("records").select("data").eq("id", currentViewRecordId).single();
    const upd = { ...ex.data, products, expenses,
      totalRakkam:  document.getElementById("rv-total-rakkam").innerText,
      totalExpense: document.getElementById("rv-total-expense").innerText,
      netProfit:    document.getElementById("rv-final-total").innerText,
      editedAt:     new Date().toISOString()
    };
    const { error:ue } = await supabaseClient.from("records").update({ data:upd }).eq("id", currentViewRecordId);
    if (ue) throw ue;
    alert("✅ बदल सेव्ह झाले!");
    setViewMode();
  } catch(e) { alert("❌ चूक: "+e.message); }
}

// ── PRODUCTS PAGE ──
function loadProductsPage() {
  const div = document.getElementById("products-list");
  div.innerHTML = "";
  PRODUCTS.forEach(function(p) {
    const c = document.createElement("div");
    c.className = "product-card";
    c.innerHTML = `<div><div class="product-name">${p.name}</div><div class="product-price">₹${p.price} / नग</div></div>
      <div class="history-btns">
        <button class="small-btn blue" onclick="editProduct('${p.id}')">✏️ एडिट</button>
        <button class="small-btn red" onclick="deleteProduct('${p.id}')">🗑️ डिलीट</button>
      </div>`;
    div.appendChild(c);
  });
}
function editProduct(id) {
  const p = PRODUCTS.find(x => x.id===id); if (!p) return;
  const nn = prompt("नाव बदला:", p.name); if (nn===null) return;
  const np = prompt("किंमत बदला:", p.price); if (np===null) return;
  p.name=nn; p.price=parseFloat(np)||0;
  saveProductsToStorage(); loadProductsPage(); buildMainTable();
}
function deleteProduct(id) {
  if (!confirm("हा माल कायमचा काढायचा का?")) return;
  PRODUCTS = PRODUCTS.filter(p => p.id!==id);
  saveProductsToStorage(); loadProductsPage(); buildMainTable();
}
function addNewProduct() { addCustomRow(); }

// ── HOLIDAY ──
async function markHoliday() {
  const date1 = document.getElementById("date1").value;
  const day1  = document.getElementById("day1").innerText;
  if (!date1) { alert("कृपया तारीख निवडा!"); return; }
  if (!confirm("🏖️ "+day1+", "+date1+" ला सुट्टी म्हणून सेव्ह करायची का?")) return;
  try {
    const { data:all } = await supabaseClient.from("records").select("id, data");
    const ex = (all||[]).find(r => r.data && (r.data.date1===date1||r.data.date2===date1));
    const hd = { date1, date2:"", day1, isHoliday:true, recordKey:date1, savedAt:new Date().toISOString() };
    if (ex) await supabaseClient.from("records").update({ data:hd }).eq("id", ex.id);
    else    await supabaseClient.from("records").insert([{ data:hd }]);
    alert("✅ "+day1+", "+date1+" सुट्टी म्हणून सेव्ह झाली!");
    hideDateWarning();
  } catch(e) { alert("❌ चूक: "+e.message); }
}
