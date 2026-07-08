// ============================================
// SHOPMATE — COMPLETE APP.JS — FULLY UPDATED
// Changes:
// 1. Date change keeps filled data intact
// 2. Auto refresh after saving
// 3. No placeholder text in dilela maal boxes
// ============================================

// ── HELPER: safely get product name from a table row ──
function getNameFromRow(tr) {
  if (tr.dataset.productname) return tr.dataset.productname.trim();
  const nameSpan = tr.querySelector(".product-name-text");
  if (nameSpan) return nameSpan.textContent.trim();
  return "";
}

// ── PRODUCT DATA ──
let PRODUCTS = [
  { id: "p1",  group: "g1", name: "टँगो पंच - F",  price: 360 },
  { id: "p2",  group: "g1", name: "संत्रा - F",     price: 360 },
  { id: "p3",  group: "g1", name: "टँगो पंच - N",   price: 90  },
  { id: "p4",  group: "g1", name: "संत्रा - N",     price: 90  },
  { id: "p5",  group: "g1", name: "जी. एम. - N",    price: 90  },
  { id: "p6",  group: "g1", name: "सौफ - N",        price: 90  },
  { id: "p7",  group: "g1", name: "Vodka - N",      price: 90  },
  { id: "p8",  group: "g1", name: "मँगो - N",       price: 90  },
  { id: "p9",  group: "g1", name: "ब्लू - N",       price: 90  },
  { id: "p10", group: "g1", name: "ॲप्पल - N",      price: 90  },
  { id: "p11", group: "g2", name: "टँगो 90",        price: 46  },
  { id: "p12", group: "g2", name: "वोल्का 90",      price: 46  },
  { id: "p13", group: "g2", name: "जामुन 90",       price: 46  },
  { id: "p14", group: "g2", name: "CM 90",          price: 60  },
  { id: "p15", group: "g2", name: "ब्लू 90",        price: 46  },
  { id: "p16", group: "g2", name: "गोल्डी 90",      price: 34  },
  { id: "p17", group: "g2", name: "पावर 90",        price: 40  },
  { id: "p18", group: "g2", name: "Apple 90",       price: 46  },
  { id: "p19", group: "g2", name: "संत्रा 90",      price: 46  },
  { id: "p20", group: "g2", name: "GM 90",          price: 46  },
  { id: "p21", group: "g2", name: "S 90",           price: 46  },
  { id: "p22", group: "g2", name: "मँगो 90",        price: 46  },
  { id: "p23", group: "g3", name: "स्प्राईट",       price: 20  },
  { id: "p24", group: "g3", name: "Jeera सोडा",     price: 12  },
  { id: "p25", group: "g3", name: "सोडा",           price: 7   },
  { id: "p26", group: "g3", name: "लेमन",           price: 10  },
  { id: "p27", group: "g3", name: "पाणी",           price: 10  },
  { id: "p28", group: "g4", name: "A-10",           price: 1   },
  { id: "p29", group: "g4", name: "गरम",            price: 25  },
  { id: "p30", group: "g4", name: "ब्रिस्टॉल",      price: 12  },
  { id: "p31", group: "g4", name: "गोल्ड फ्लॅक",   price: 15  },
  { id: "p32", group: "g4", name: "इंडिमेंट",       price: 15  },
  { id: "p33", group: "g4", name: "Focus",          price: 8   },
];

const GROUP_NAMES = {
  g1: "बॉटल्स (F/N)",
  g2: "90 ml",
  g3: "कोल्ड ड्रिंक्स",
  g4: "सिगारेट"
};

// ── EXPENSE DATA ──
let EXPENSES_LIST = [
  { id: "e1", name: "चहा"    },
  { id: "e2", name: "ॲप"     },
  { id: "e3", name: "झार"    },
  { id: "e4", name: "पगार"   },
  { id: "e5", name: "पिग्मी" },
  { id: "e6", name: "सिगारेट"},
];

let currentRows     = [];
let currentExpenses = [];
let rowCounter      = 1000;
let yeneCounter     = 3000;

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

// ── SCROLL WHEEL PROTECTION ──
function blockNumberScrollChange() {
  document.addEventListener("wheel", function (e) {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  }, { passive: true });
}

// ── TAB/ENTER MOVES DOWN SAME COLUMN ──
function moveFocus(event, currentInput, columnClass) {
  if (event.key !== "Tab" && event.key !== "Enter") return;
  event.preventDefault();
  const allInputs = Array.from(
    document.querySelectorAll("#table-body ." + columnClass + "-input")
  );
  const currentIndex = allInputs.indexOf(currentInput);
  if (currentIndex === -1) return;
  const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
  if (nextIndex >= 0 && nextIndex < allInputs.length) {
    allInputs[nextIndex].focus();
    allInputs[nextIndex].select();
  }
}

// ── DATE SETUP ──
function setDefaultDate() {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];
  document.getElementById("date1").value = dateStr;
  updateDayLabel("date1", "day1");

  // CHANGE 1: Date change does NOT call loadYesterdayShillak()
  // so all filled data stays intact when owner changes date
  document.getElementById("date1").addEventListener("change", function () {
    updateDayLabel("date1", "day1");
    checkIfDateAlreadySaved();
    // NOTE: loadYesterdayShillak() removed here intentionally
    // Filled data is preserved when date changes
  });

  document.getElementById("date2").addEventListener("change", function () {
    updateDayLabel("date2", "day2");
  });
}

function updateDayLabel(dateId, labelId) {
  const val = document.getElementById(dateId).value;
  if (!val) return;
  const days = ["रविवार","सोमवार","मंगळवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"];
  const d = new Date(val + "T00:00:00");
  document.getElementById(labelId).innerText = days[d.getDay()];
}

function addDate2() {
  document.getElementById("date2-row").classList.remove("hidden");
  if (!document.getElementById("date2").value) {
    document.getElementById("date2").value = document.getElementById("date1").value;
    updateDayLabel("date2", "day2");
  }
}

function removeDate2() {
  document.getElementById("date2-row").classList.add("hidden");
  document.getElementById("date2").value = "";
}

// ── WARN IF DATE ALREADY SAVED ──
async function checkIfDateAlreadySaved() {
  const selectedDate = document.getElementById("date1").value;
  if (!selectedDate) return;
  try {
    const { data: records, error } = await supabaseClient.from("records").select("data");
    if (error || !records) return;
    const existing = records.find(function (rec) {
      const d = rec.data;
      if (!d) return false;
      return d.date1 === selectedDate || d.date2 === selectedDate;
    });
    if (existing) {
      showDateWarning("⚠️ " + selectedDate + " ची नोंद आधीच सेव्ह आहे! इतिहासात बघा किंवा थेट सेव्ह केल्यास अपडेट होईल.");
    } else {
      hideDateWarning();
    }
  } catch (err) { console.error(err); }
}

function showDateWarning(msg) {
  let banner = document.getElementById("date-warning-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "date-warning-banner";
    banner.style.cssText = "background:#fff3e0;color:#e65100;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;margin-bottom:8px;text-align:center;";
    const dateSec = document.querySelector(".date-section");
    dateSec.parentNode.insertBefore(banner, dateSec.nextSibling);
  }
  banner.innerText = msg;
  banner.style.display = "block";
}

function hideDateWarning() {
  const banner = document.getElementById("date-warning-banner");
  if (banner) banner.style.display = "none";
}

// ── SHILLAK CARRY-FORWARD ──
// Only called on page load (not on date change)
async function loadYesterdayShillak() {
  const selectedDate = document.getElementById("date1").value;
  if (!selectedDate) { clearAllDilelaInputs(); return; }

  console.log("🔍 Looking for most recent record before:", selectedDate);

  try {
    const { data: records, error } = await supabaseClient.from("records").select("*");
    if (error || !records || records.length === 0) {
      clearAllDilelaInputs(); return;
    }

    let bestRecord  = null;
    let bestEndDate = null;

    records.forEach(function (rec) {
      const d = rec.data;
      if (!d || !d.date1) return;
      if (d.isHoliday) return;
      const recordEndDate = d.date2 ? d.date2 : d.date1;
      if (recordEndDate >= selectedDate) return;
      if (bestEndDate === null || recordEndDate > bestEndDate) {
        bestEndDate = recordEndDate;
        bestRecord  = rec;
      }
    });

    if (!bestRecord) {
      console.log("❌ No earlier non-holiday record found");
      clearAllDilelaInputs(); return;
    }

    console.log("✅ Using record ending on:", bestEndDate);
    clearAllDilelaInputs();

    const shillakMap = {};
(bestRecord.data.products || []).forEach(function (p) {
  if (!p.name) return;

  // CORRECT ORDER OF PRIORITY:
  // 1. Use p.shillak directly (what owner typed in शिल्लक box)
  // 2. If missing/zero, calculate from ekun - vikri
  // 3. Never use dilela or its first number

  let shillak = 0;

  // Try direct shillak field first
  const directShillak = parseFloat(p.shillak);
  if (!isNaN(directShillak) && directShillak > 0) {
    shillak = directShillak;
  } else {
    // Fallback: calculate from ekun - vikri
    const ekun  = parseFloat(p.ekun)  || 0;
    const vikri = parseFloat(p.vikri) || 0;
    const calculated = ekun - vikri;
    if (calculated > 0) shillak = calculated;
  }

  console.log(
    "▶", p.name,
    "| shillak field:", p.shillak,
    "| ekun:", p.ekun,
    "| vikri:", p.vikri,
    "| USING:", shillak
  );

  if (shillak > 0) {
    shillakMap[p.name.trim()] = shillak;
  }
});

    console.log("📦 शिल्लक map keys:", Object.keys(shillakMap));

    let filled = 0;
    document.querySelectorAll("#table-body tr[data-id]").forEach(function (tr) {
      const name = getNameFromRow(tr);
      if (!name) return;
      const shillak = shillakMap[name];
      if (shillak && shillak > 0) {
        const inp = tr.querySelector(".dilela-input");
        if (inp) {
          inp.value       = shillak;
          inp.placeholder = ""; // CHANGE 3: no placeholder text
          calculateRow(tr.dataset.id);
          filled++;
        }
      }
    });

    console.log("✏️ Filled", filled, "rows with carry-forward शिल्लक");

  } catch (err) {
    console.error("Shillak carry-forward error:", err);
    clearAllDilelaInputs();
  }
}

function clearAllDilelaInputs() {
  document.querySelectorAll("#table-body .dilela-input").forEach(function (inp) {
    inp.value       = "";
    inp.placeholder = ""; // CHANGE 3: no placeholder text
  });
  document.querySelectorAll("#table-body tr[data-id]").forEach(function (tr) {
    calculateRow(tr.dataset.id);
  });
}

// ── TABLE BUILDING ──
function buildMainTable() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";
  currentRows     = [];

  const groupOrder     = ["g1", "g2", "g3", "g4", "custom"];
  const sortedProducts = [...PRODUCTS].sort(function (a, b) {
    return groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group);
  });

  let lastGroup = "";
  sortedProducts.forEach(function (prod) {
    if (prod.group !== lastGroup) {
      const groupRow = document.createElement("tr");
      groupRow.className = "group-header";
      groupRow.innerHTML = `<td colspan="7">${GROUP_NAMES[prod.group] || "इतर माल"}</td>`;
      tbody.appendChild(groupRow);
      lastGroup = prod.group;
    }
    addProductRow(prod.id, prod.name, prod.price, "", "");
  });
}

// ── ADD PRODUCT ROW ──
function addProductRow(id, name, price, dilelaVal, shillakVal) {
  const tbody = document.getElementById("table-body");
  const tr    = document.createElement("tr");
  tr.dataset.id          = id;
  tr.dataset.price       = price;
  tr.dataset.productname = name;
  tr.className           = "product-row";

  tr.innerHTML = `
    <td class="name-cell" data-label="नाव">
      <span class="card-name-row">
        <span>
          <span class="product-name-text">${name}</span>
          <span class="price-tag">₹${price}/नग</span>
        </span>
        <span class="rakkam-cell card-rakkam">₹0</span>
      </span>
    </td>
    <td data-label="दिलेला माल">
      <span class="cell-label">दिलेला</span>
      <input type="text" class="dilela-input" placeholder=""
        value="${dilelaVal || ''}"
        oninput="calculateRow('${id}')"
        onkeydown="moveFocus(event, this, 'dilela')" />
    </td>
    <td data-label="एकूण">
      <span class="cell-label">एकूण</span>
      <span class="auto-cell ekun-cell">0</span>
    </td>
    <td data-label="शिल्लक">
      <span class="cell-label">शिल्लक</span>
      <input type="number" class="shillak-input" placeholder=""
        value="${shillakVal || ''}"
        oninput="calculateRow('${id}')"
        onkeydown="moveFocus(event, this, 'shillak')" />
    </td>
    <td data-label="विक्री">
      <span class="cell-label">विक्री</span>
      <span class="auto-cell vikri-cell">0</span>
    </td>
    <td class="rakkam-cell table-only-rakkam" data-label="रक्कम">₹0</td>
    <td class="delete-cell">
      <button class="small-btn red" onclick="deleteRow('${id}')">✕</button>
    </td>
  `;
  tbody.appendChild(tr);
  currentRows.push({ id, name, price });
}

// ── ROW CALCULATION ──
function calculateRow(id) {
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  if (!tr) return;

  const price       = parseFloat(tr.dataset.price) || 0;
  const dilelaInput = tr.querySelector(".dilela-input").value.trim();
  const shillakVal  = tr.querySelector(".shillak-input").value.trim();

  let ekun = 0;
  if (dilelaInput) {
    dilelaInput.replace(/\s/g, "").split("+").forEach(function (p) {
      const n = parseFloat(p);
      if (!isNaN(n)) ekun += n;
    });
  }

  const shillak = parseFloat(shillakVal) || 0;
  let vikri     = ekun - shillak;
  if (vikri < 0) vikri = 0;
  const rakkam  = vikri * price;

  tr.querySelector(".ekun-cell").innerText  = ekun;
  tr.querySelector(".vikri-cell").innerText = vikri;
  tr.querySelectorAll(".rakkam-cell").forEach(function (el) {
    el.innerText = "₹" + rakkam;
  });

  calculateAll();
}

// ── DELETE ROW ──
function deleteRow(id) {
  if (!confirm("हा माल कायमचा यादीतून काढायचा का?")) return;
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  if (tr) tr.remove();
  PRODUCTS = PRODUCTS.filter(function (p) { return p.id !== id; });
  saveProductsToStorage();
  calculateAll();
}

// ── ADD CUSTOM PRODUCT MODAL ──
function addCustomRow() {
  document.getElementById("modal-name").value  = "";
  document.getElementById("modal-price").value = "";
  document.getElementById("modal-group").value = "g1";
  document.getElementById("add-product-modal").classList.add("active");
}

function closeAddProductModal() {
  document.getElementById("add-product-modal").classList.remove("active");
}

function confirmAddProduct() {
  const name  = document.getElementById("modal-name").value.trim();
  const price = parseFloat(document.getElementById("modal-price").value) || 0;
  const group = document.getElementById("modal-group").value;
  if (!name) { alert("कृपया मालाचे नाव लिहा!"); return; }
  rowCounter++;
  const newId = "custom" + rowCounter;
  PRODUCTS.push({ id: newId, group: group, name: name, price: price });
  saveProductsToStorage();
  closeAddProductModal();
  buildMainTable();
}

// ── EXPENSE TABLE ──
function buildExpenseTable() {
  const tbody = document.getElementById("expense-body");
  tbody.innerHTML  = "";
  currentExpenses  = [];
  EXPENSES_LIST.forEach(function (exp) {
    addExpenseRowToDOM(exp.id, exp.name, "");
  });
}

function addExpenseRowToDOM(id, name, amountVal) {
  const tbody = document.getElementById("expense-body");
  const tr    = document.createElement("tr");
  tr.dataset.id = id;
  tr.innerHTML = `
    <td class="name-cell">${name}</td>
    <td><input type="number" class="expense-input" placeholder=""
      value="${amountVal || ''}" oninput="calculateAll()" /></td>
    <td><button class="small-btn red" onclick="deleteExpenseRow('${id}')">✕</button></td>
  `;
  tbody.appendChild(tr);
  currentExpenses.push({ id, name });
}

function addExpenseRow() {
  const name = prompt("नवीन खर्चाचे नाव लिहा:");
  if (!name) return;
  rowCounter++;
  const newId = "exp" + rowCounter;
  addExpenseRowToDOM(newId, name, "");
  EXPENSES_LIST.push({ id: newId, name: name });
  saveExpensesToStorage();
}

function deleteExpenseRow(id) {
  if (!confirm("हा खर्च काढायचा का?")) return;
  const tr = document.querySelector(`#expense-body tr[data-id="${id}"]`);
  if (tr) tr.remove();
  calculateAll();
}

// ── YENE AAH TABLE ──
function buildYeneTable() {
  const tbody = document.getElementById("yene-body");
  tbody.innerHTML = "";
  addYeneRow();
}

function addYeneRow(nameVal, amountVal) {
  const tbody = document.getElementById("yene-body");
  yeneCounter++;
  const rowId = "yene" + yeneCounter;
  const tr    = document.createElement("tr");
  tr.dataset.id = rowId;
  tr.innerHTML = `
    <td><input type="text" class="yene-name-input" placeholder="नाव लिहा" value="${nameVal || ''}" /></td>
    <td><input type="number" class="yene-amount-input" placeholder="" value="${amountVal || ''}" oninput="calculateYeneTotal()" /></td>
    <td><button class="small-btn red" onclick="deleteYeneRow('${rowId}')">✕</button></td>
  `;
  tbody.appendChild(tr);
}

function deleteYeneRow(id) {
  const tr = document.querySelector(`#yene-body tr[data-id="${id}"]`);
  if (tr) tr.remove();
  calculateYeneTotal();
}

function calculateYeneTotal() {
  let total = 0;
  document.querySelectorAll("#yene-body .yene-amount-input").forEach(function (inp) {
    total += parseFloat(inp.value) || 0;
  });
  document.getElementById("yene-total").innerText = "₹" + total;
}

// ── RAKH HISHEB ──
function calculateBaki() {
  const nafa = parseFloat(
    document.getElementById("rakh-nafa").innerText.replace("₹", "")
  ) || 0;
  const rakh = parseFloat(document.getElementById("rakh-input").value) || 0;
  const baki = nafa - rakh;
  const el   = document.getElementById("baki-amount");
  el.innerText = "₹" + baki;
  el.className = baki === 0 ? "baki-zero" : "baki-nonzero";
}

// ── CALCULATE ALL TOTALS ──
function calculateAll() {
  let totalRakkam = 0;
  document.querySelectorAll("#table-body tr[data-id]").forEach(function (tr) {
    const el = tr.querySelector(".table-only-rakkam");
    if (!el) return;
    totalRakkam += parseFloat(el.innerText.replace("₹", "")) || 0;
  });

  let totalExpense = 0;
  document.querySelectorAll("#expense-body tr[data-id]").forEach(function (tr) {
    totalExpense += parseFloat(tr.querySelector(".expense-input").value) || 0;
  });

  const netProfit = totalRakkam - totalExpense;

  document.getElementById("total-rakkam").innerText   = "₹" + totalRakkam;
  document.getElementById("total-expense").innerText  = "₹" + totalExpense;
  document.getElementById("final-rakkam").innerText   = "₹" + totalRakkam;
  document.getElementById("final-expense").innerText  = "₹" + totalExpense;
  document.getElementById("final-total").innerText    = "₹" + netProfit;
  document.getElementById("final-cash").innerText     = "₹" + netProfit;
  document.getElementById("rakh-nafa").innerText      = "₹" + netProfit;
  calculateBaki();
}

// ── LOCAL STORAGE ──
function saveProductsToStorage() {
  localStorage.setItem("shopmate_products", JSON.stringify(PRODUCTS));
}
function loadProductsFromStorage() {
  const saved = localStorage.getItem("shopmate_products");
  if (saved) PRODUCTS = JSON.parse(saved);
  const savedExp = localStorage.getItem("shopmate_expenses");
  if (savedExp) EXPENSES_LIST = JSON.parse(savedExp);
}
function saveExpensesToStorage() {
  localStorage.setItem("shopmate_expenses", JSON.stringify(EXPENSES_LIST));
}

// ── COLLECT FORM DATA ──
function collectFormData() {
  const date1 = document.getElementById("date1").value;
  const date2 = document.getElementById("date2").value;
  const day1  = document.getElementById("day1").innerText;
  const day2  = document.getElementById("day2").innerText;

  const products = [];
  document.querySelectorAll("#table-body tr[data-id]").forEach(function (tr) {
    const name    = getNameFromRow(tr);
    const dilela  = tr.querySelector(".dilela-input").value;
    const ekun    = tr.querySelector(".ekun-cell").innerText;
    const shillak = tr.querySelector(".shillak-input").value;
    const vikri   = tr.querySelector(".vikri-cell").innerText;
    const rakkam  = tr.querySelector(".table-only-rakkam").innerText;
    const price   = tr.dataset.price;
    products.push({ name, price, dilela, ekun, shillak, vikri, rakkam });
  });
 
  const expenses = [];
  document.querySelectorAll("#expense-body tr[data-id]").forEach(function (tr) {
    const name   = tr.querySelector(".name-cell").innerText.trim();
    const amount = tr.querySelector(".expense-input").value || "0";
    expenses.push({ name, amount });
  });

  const yeneEntries = [];
  document.querySelectorAll("#yene-body tr[data-id]").forEach(function (tr) {
    const name   = tr.querySelector(".yene-name-input").value.trim();
    const amount = tr.querySelector(".yene-amount-input").value || "0";
    if (name || parseFloat(amount) > 0) yeneEntries.push({ name, amount });
  });

  return {
    date1, date2, day1, day2, products, expenses, yeneEntries,
    rakhRakkam:   document.getElementById("rakh-input").value || "0",
    baki:         document.getElementById("baki-amount").innerText,
    totalRakkam:  document.getElementById("total-rakkam").innerText,
    totalExpense: document.getElementById("total-expense").innerText,
    netProfit:    document.getElementById("final-total").innerText,
    recordKey:    date2 ? (date1 + "_" + date2) : date1,
    savedAt:      new Date().toISOString()
  };
}

// ── SAVE RECORD ──
// CHANGE 2: Auto refresh after saving
async function saveRecord() {
  const data = collectFormData();
  if (!data.date1) { alert("कृपया तारीख निवडा!"); return; }

  try {
    const { data: allRecords, error: checkError } = await supabaseClient
      .from("records").select("id, data");
    if (checkError) throw checkError;

    const datesToCheck = [data.date1];
    if (data.date2) datesToCheck.push(data.date2);

    const conflicting = (allRecords || []).find(function (rec) {
      const d = rec.data;
      if (!d) return false;
      const recDates = [d.date1];
      if (d.date2) recDates.push(d.date2);
      return datesToCheck.some(function (dt) { return recDates.includes(dt); });
    });

    if (conflicting) {
      const existingLabel = conflicting.data.date2
        ? conflicting.data.date1 + " ते " + conflicting.data.date2
        : conflicting.data.date1;
      const ok = confirm(
        "⚠️ या तारखेची नोंद आधीच सेव्ह आहे!\n\nसेव्ह केलेली तारीख: " + existingLabel + "\n\nजुनी नोंद बदलायची का?"
      );
      if (!ok) return;
      const { error: upErr } = await supabaseClient
        .from("records").update({ data: data }).eq("id", conflicting.id);
      if (upErr) throw upErr;
      alert("✅ नोंद यशस्वीरित्या अपडेट झाली!\n\nनवीन नोंदीसाठी पेज रिफ्रेश होत आहे...");
    } else {
      const { error: insErr } = await supabaseClient
        .from("records").insert([{ data: data }]);
      if (insErr) throw insErr;
      alert("✅ नोंद यशस्वीरित्या सेव्ह झाली!\n\nनवीन नोंदीसाठी पेज रिफ्रेश होत आहे...");
    }

    hideDateWarning();

    // CHANGE 2: Auto refresh after 1 second
    setTimeout(function () {
      window.location.reload();
    }, 1000);

  } catch (err) {
    console.error(err);
    alert("❌ चूक झाली: " + err.message);
  }
}

// ── PRINT ──
function printRecord() { window.print(); }

// ── PAGE NAVIGATION ──
function showPage(pageName) {
  document.querySelectorAll(".page").forEach(function (p) {
    p.classList.remove("active");
  });
  document.getElementById("page-" + pageName).classList.add("active");
  if (pageName === "history")  loadHistory();
  if (pageName === "products") loadProductsPage();
}

// ── HISTORY PAGE ──
async function loadHistory() {
  const listDiv = document.getElementById("history-list");
  listDiv.innerHTML = "<p style='text-align:center;color:#888;padding:20px;'>लोड होत आहे...</p>";

  try {
    const { data: records, error } = await supabaseClient
      .from("records").select("*").order("created_at", { ascending: false });

    if (error) throw error;

    if (!records || records.length === 0) {
      listDiv.innerHTML = "<p style='text-align:center;color:#888;padding:20px;'>अजून कोणतीही नोंद नाही</p>";
      return;
    }

    listDiv.innerHTML = "";
    records.forEach(function (rec) {
      const d = rec.data;
      if (!d) return;

      let dateLabel = (d.day1 || "") + ", " + formatDate(d.date1);
      if (d.date2) {
        dateLabel = (d.day1 || "") + "-" + (d.day2 || "") + ", "
          + formatDate(d.date1) + " ते " + formatDate(d.date2);
      }

      const card = document.createElement("div");
      card.className = "history-card";

      if (d.isHoliday) {
        card.style.borderLeft = "4px solid #c62828";
        card.innerHTML = `
          <div class="history-date">🏖️ ${dateLabel}</div>
          <div class="history-amount" style="color:#c62828;">सुट्टी</div>
          <div class="history-btns">
            <button class="small-btn red" onclick="deleteHistoryRecord(${rec.id})">🗑️ डिलीट</button>
          </div>`;
      } else {
        card.innerHTML = `
          <div class="history-date">${dateLabel}</div>
          <div class="history-amount">निव्वळ नफा: ${d.netProfit || "₹0"}</div>
          <div class="history-btns">
            <button class="small-btn blue" onclick="viewHistoryRecord(${rec.id})">👁️ बघा</button>
            <button class="small-btn red"  onclick="deleteHistoryRecord(${rec.id})">🗑️ डिलीट</button>
          </div>`;
      }
      listDiv.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    listDiv.innerHTML = "<p style='color:red;padding:16px;'>चूक झाली: " + err.message + "</p>";
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

async function deleteHistoryRecord(id) {
  if (!confirm("ही नोंद कायमची डिलीट करायची का?")) return;
  try {
    const { error } = await supabaseClient.from("records").delete().eq("id", id);
    if (error) throw error;
    loadHistory();
  } catch (err) {
    alert("चूक झाली: " + err.message);
  }
}

// ── RECORD VIEW/EDIT PAGE ──
let currentViewRecordId = null;
let isEditMode          = false;

async function viewHistoryRecord(id) {
  try {
    const { data: rec, error } = await supabaseClient
      .from("records").select("*").eq("id", id).single();
    if (error) throw error;
    currentViewRecordId = id;
    isEditMode          = false;
    buildRecordViewPage(rec.data);
    setViewMode();
    showPage("record-view");
  } catch (err) {
    alert("चूक झाली: " + err.message);
  }
}

function buildRecordViewPage(d) {
  let dateLabel = (d.day1 || "") + ", " + formatDate(d.date1);
  if (d.date2) {
    dateLabel = (d.day1 || "") + "-" + (d.day2 || "") + ", "
      + formatDate(d.date1) + " ते " + formatDate(d.date2);
  }
  document.getElementById("rv-date-label").innerText = dateLabel;

  const tbody = document.getElementById("rv-table-body");
  tbody.innerHTML = "";
  (d.products || []).forEach(function (p, i) {
    if (!p.name) return;
    const tr = document.createElement("tr");
    tr.dataset.index = i;
    tr.dataset.price = p.price || 0;
    tr.innerHTML = `
      <td class="name-cell">
        ${p.name}
        <span class="price-tag">₹${p.price || 0}/नग</span>
      </td>
      <td><input type="text"   class="rv-dilela-input"  value="${p.dilela  || ''}" disabled oninput="rvCalculateRow(${i})" /></td>
      <td class="auto-cell rv-ekun-cell">${p.ekun  || 0}</td>
      <td><input type="number" class="rv-shillak-input" value="${p.shillak || ''}" disabled oninput="rvCalculateRow(${i})" /></td>
      <td class="auto-cell rv-vikri-cell">${p.vikri || 0}</td>
      <td class="rakkam-cell">${p.rakkam || '₹0'}</td>
    `;
    tbody.appendChild(tr);
  });

  const expBody = document.getElementById("rv-expense-body");
  expBody.innerHTML = "";
  (d.expenses || []).forEach(function (exp, i) {
    if (!exp.name) return;
    const tr = document.createElement("tr");
    tr.dataset.index = i;
    tr.innerHTML = `
      <td class="name-cell">${exp.name}</td>
      <td><input type="number" class="rv-expense-input" value="${exp.amount || ''}" disabled oninput="rvCalculateAll()" /></td>
    `;
    expBody.appendChild(tr);
  });

  document.getElementById("rv-total-rakkam").innerText  = d.totalRakkam  || "₹0";
  document.getElementById("rv-total-expense").innerText = d.totalExpense || "₹0";
  document.getElementById("rv-final-rakkam").innerText  = d.totalRakkam  || "₹0";
  document.getElementById("rv-final-expense").innerText = d.totalExpense || "₹0";
  document.getElementById("rv-final-total").innerText   = d.netProfit    || "₹0";

  const yeneEntries = d.yeneEntries || [];
  const yeneSection = document.getElementById("rv-yene-section");
  const yeneWrapper = document.getElementById("rv-yene-wrapper");
  const yeneBody    = document.getElementById("rv-yene-body");

  if (yeneEntries.length > 0) {
    yeneSection.style.display = "block";
    yeneWrapper.style.display = "block";
    yeneBody.innerHTML = "";
    yeneEntries.forEach(function (y) {
      if (!y.name) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="name-cell">${y.name}</td>
        <td style="text-align:right;padding-right:12px;font-weight:700;color:var(--navy);">₹${y.amount}</td>
      `;
      yeneBody.appendChild(tr);
    });
  } else {
    yeneSection.style.display = "none";
    yeneWrapper.style.display = "none";
  }
}

function rvCalculateRow(index) {
  const tr = document.querySelector(`#rv-table-body tr[data-index="${index}"]`);
  if (!tr) return;
  const price       = parseFloat(tr.dataset.price) || 0;
  const dilelaInput = tr.querySelector(".rv-dilela-input").value.trim();
  const shillakVal  = tr.querySelector(".rv-shillak-input").value.trim();

  let ekun = 0;
  if (dilelaInput) {
    dilelaInput.replace(/\s/g, "").split("+").forEach(function (p) {
      const n = parseFloat(p);
      if (!isNaN(n)) ekun += n;
    });
  }
  const shillak = parseFloat(shillakVal) || 0;
  let vikri     = ekun - shillak;
  if (vikri < 0) vikri = 0;

  tr.querySelector(".rv-ekun-cell").innerText  = ekun;
  tr.querySelector(".rv-vikri-cell").innerText = vikri;
  tr.querySelectorAll(".rakkam-cell").forEach(function (el) {
    el.innerText = "₹" + (vikri * price);
  });
  rvCalculateAll();
}

function rvCalculateAll() {
  let totalRakkam = 0;
  document.querySelectorAll("#rv-table-body tr[data-index]").forEach(function (tr) {
    const el = tr.querySelector(".rakkam-cell");
    if (el) totalRakkam += parseFloat(el.innerText.replace("₹", "")) || 0;
  });
  let totalExpense = 0;
  document.querySelectorAll("#rv-expense-body tr[data-index]").forEach(function (tr) {
    totalExpense += parseFloat(tr.querySelector(".rv-expense-input").value) || 0;
  });
  const netProfit = totalRakkam - totalExpense;
  document.getElementById("rv-total-rakkam").innerText  = "₹" + totalRakkam;
  document.getElementById("rv-total-expense").innerText = "₹" + totalExpense;
  document.getElementById("rv-final-rakkam").innerText  = "₹" + totalRakkam;
  document.getElementById("rv-final-expense").innerText = "₹" + totalExpense;
  document.getElementById("rv-final-total").innerText   = "₹" + netProfit;
}

function toggleEditMode() {
  isEditMode ? setViewMode() : setEditMode();
}

function setViewMode() {
  isEditMode = false;
  document.querySelectorAll("#rv-table-body input, #rv-expense-body input").forEach(function (i) {
    i.disabled = true;
  });
  document.getElementById("view-mode-banner").classList.remove("hidden");
  document.getElementById("edit-toggle-btn").innerText = "✏️ एडिट करा";
  document.getElementById("rv-save-section").style.display = "none";
}

function setEditMode() {
  isEditMode = true;
  document.querySelectorAll("#rv-table-body input, #rv-expense-body input").forEach(function (i) {
    i.disabled = false;
  });
  document.getElementById("view-mode-banner").classList.add("hidden");
  document.getElementById("edit-toggle-btn").innerText = "👁️ फक्त बघा";
  document.getElementById("rv-save-section").style.display = "flex";
}

async function saveEditedRecord() {
  if (!currentViewRecordId) return;

  const products = [];
  document.querySelectorAll("#rv-table-body tr[data-index]").forEach(function (tr) {
    const nameEl  = tr.querySelector(".name-cell");
    const name    = nameEl ? nameEl.childNodes[0].textContent.trim() : "";
    const price   = tr.dataset.price;
    const dilela  = tr.querySelector(".rv-dilela-input").value;
    const ekun    = tr.querySelector(".rv-ekun-cell").innerText;
    const shillak = tr.querySelector(".rv-shillak-input").value;
    const vikri   = tr.querySelector(".rv-vikri-cell").innerText;
    const rakkam  = tr.querySelector(".rakkam-cell").innerText;
    products.push({ name, price, dilela, ekun, shillak, vikri, rakkam });
  });

  const expenses = [];
  document.querySelectorAll("#rv-expense-body tr[data-index]").forEach(function (tr) {
    const name   = tr.querySelector(".name-cell").innerText.trim();
    const amount = tr.querySelector(".rv-expense-input").value || "0";
    expenses.push({ name, amount });
  });

  try {
    const { data: existing, error: fetchError } = await supabaseClient
      .from("records").select("data").eq("id", currentViewRecordId).single();
    if (fetchError) throw fetchError;

    const updatedData = {
      ...existing.data,
      products, expenses,
      totalRakkam:  document.getElementById("rv-total-rakkam").innerText,
      totalExpense: document.getElementById("rv-total-expense").innerText,
      netProfit:    document.getElementById("rv-final-total").innerText,
      editedAt:     new Date().toISOString()
    };

    const { error: upErr } = await supabaseClient
      .from("records").update({ data: updatedData }).eq("id", currentViewRecordId);
    if (upErr) throw upErr;

    alert("✅ बदल यशस्वीरित्या सेव्ह झाले!");
    setViewMode();
  } catch (err) {
    alert("❌ चूक झाली: " + err.message);
  }
}

// ── PRODUCTS PAGE ──
function loadProductsPage() {
  const listDiv = document.getElementById("products-list");
  listDiv.innerHTML = "";
  PRODUCTS.forEach(function (p) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">₹${p.price} / नग</div>
      </div>
      <div class="history-btns">
        <button class="small-btn blue" onclick="editProduct('${p.id}')">✏️ एडिट</button>
        <button class="small-btn red"  onclick="deleteProduct('${p.id}')">🗑️ डिलीट</button>
      </div>`;
    listDiv.appendChild(card);
  });
}

function editProduct(id) {
  const prod = PRODUCTS.find(function (p) { return p.id === id; });
  if (!prod) return;
  const newName  = prompt("नाव बदला:", prod.name);
  if (newName === null) return;
  const newPrice = prompt("किंमत बदला:", prod.price);
  if (newPrice === null) return;
  prod.name  = newName;
  prod.price = parseFloat(newPrice) || 0;
  saveProductsToStorage();
  loadProductsPage();
  buildMainTable();
}

function deleteProduct(id) {
  if (!confirm("हा माल कायमचा काढायचा का?")) return;
  PRODUCTS = PRODUCTS.filter(function (p) { return p.id !== id; });
  saveProductsToStorage();
  loadProductsPage();
  buildMainTable();
}

function addNewProduct() { addCustomRow(); }

// ── HOLIDAY MARKING ──
async function markHoliday() {
  const date1 = document.getElementById("date1").value;
  const day1  = document.getElementById("day1").innerText;
  if (!date1) { alert("कृपया तारीख निवडा!"); return; }

  const ok = confirm(
    "🏖️ " + day1 + ", " + date1 + " ला सुट्टी म्हणून सेव्ह करायची का?\n\nया दिवसाचा कोणताही हिशेब सेव्ह होणार नाही."
  );
  if (!ok) return;

  try {
    const { data: allRecords } = await supabaseClient.from("records").select("id, data");
    const existing = (allRecords || []).find(function (rec) {
      const d = rec.data;
      return d && (d.date1 === date1 || d.date2 === date1);
    });

    const holidayData = {
      date1: date1, date2: "", day1: day1,
      isHoliday: true, recordKey: date1,
      savedAt: new Date().toISOString()
    };

    if (existing) {
      await supabaseClient.from("records").update({ data: holidayData }).eq("id", existing.id);
    } else {
      await supabaseClient.from("records").insert([{ data: holidayData }]);
    }

    alert("✅ " + day1 + ", " + date1 + " सुट्टी म्हणून सेव्ह झाली!");
    hideDateWarning();

  } catch (err) {
    alert("❌ चूक झाली: " + err.message);
  }
}
