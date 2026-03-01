(() => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -------------------------
  // KEYWORD GENERATOR
  // -------------------------
  const bizNameEl = document.getElementById("bizName");
  const bizTypeEl = document.getElementById("bizType");
  const outEl = document.getElementById("keywordsOutput");
  const genBtn = document.getElementById("genKeywordsBtn");
  const delBtn = document.getElementById("delKeywordsBtn");
  const newBtn = document.getElementById("newKeywordsBtn");

  const categoryTemplates = {
    "Law Firm": [
      "{name} law firm",
      "{name} attorney",
      "best lawyer near me",
      "{name} legal services",
      "{name} personal injury lawyer",
      "{name} family law attorney",
      "{name} criminal defense lawyer",
      "{name} business lawyer",
      "free legal consultation {name}",
      "top rated law firm {name}"
    ],
    "Real Estate": [
      "{name} real estate",
      "{name} realtor",
      "homes for sale near me",
      "{name} property agent",
      "{name} condo for sale",
      "{name} house valuation",
      "{name} buy a home",
      "{name} sell my house",
      "{name} real estate listings",
      "best real estate agent {name}"
    ],
    "Restaurant": [
      "{name} restaurant",
      "{name} menu",
      "best food near me",
      "{name} reservations",
      "{name} delivery",
      "{name} takeout",
      "{name} brunch",
      "{name} lunch specials",
      "{name} dinner near me",
      "top rated restaurant {name}"
    ],
    "Healthcare": [
      "{name} clinic",
      "{name} doctor",
      "healthcare near me",
      "{name} appointment",
      "{name} urgent care",
      "{name} family medicine",
      "{name} health screening",
      "{name} telemedicine",
      "{name} medical services",
      "best clinic {name}"
    ],
    "Rental Company": [
      "{name} rentals",
      "{name} rental company",
      "rent near me",
      "{name} equipment rental",
      "{name} car rental",
      "{name} property rental",
      "{name} short term rental",
      "{name} long term rental",
      "{name} affordable rentals",
      "best rental service {name}"
    ]
  };

  const modifiers = [
    "near me", "in {city}", "open now", "pricing", "reviews",
    "book online", "same day", "24/7", "affordable", "premium",
    "top rated", "trusted", "licensed", "expert", "consultation",
    "for small business", "for families", "for startups", "free quote", "guide"
  ];

  const intentPhrases = [
    "how to", "best", "top", "compare", "cost of", "what is",
    "local", "emergency", "trusted", "recommended"
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function normalizeName(name) {
    const n = (name || "").trim();
    return n.length ? n : "Your Brand";
  }

  function renderKeywords(list) {
    if (!outEl) return;
    if (!list || list.length === 0) {
      outEl.innerHTML = `<div class="output-empty">Your generated keywords will appear here.</div>`;
      return;
    }
    const items = list.map(k => `<li>${escapeHtml(k)}</li>`).join("");
    outEl.innerHTML = `
      <ol class="kw-list">
        ${items}
      </ol>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function generateKeywords(name, category, count = 20) {
    const base = categoryTemplates[category] || [];
    const cleanName = normalizeName(name);

    // Optional "city" used in modifiers
    const cities = ["Singapore", "New York", "Los Angeles", "London", "Sydney", "Toronto", "Dubai", "Manila"];
    const city = pick(cities);

    const set = new Set();

    // Seed from templates
    while (set.size < Math.min(count, base.length * 2) && base.length) {
      const t = pick(base);
      const mod = pick(modifiers).replace("{city}", city);
      const phrase = `${t.replaceAll("{name}", cleanName)} ${Math.random() < 0.55 ? mod : ""}`.trim();
      set.add(phrase);
    }

    // Fill remaining with combos
    while (set.size < count) {
      const i = pick(intentPhrases);
      const mod = pick(modifiers).replace("{city}", city);
      const core = pick(base.length ? base : ["{name} services", "{name} near me", "{name} reviews"]).replaceAll("{name}", cleanName);
      const variant = `${i} ${core} ${Math.random() < 0.7 ? mod : ""}`.trim();
      set.add(variant.replace(/\s+/g, " "));
    }

    return Array.from(set).slice(0, count);
  }

  function handleGenerate() {
    const name = bizNameEl ? bizNameEl.value : "";
    const category = bizTypeEl ? bizTypeEl.value : "Law Firm";
    const list = generateKeywords(name, category, 20);
    renderKeywords(list);
  }

  function handleDelete() {
    if (bizNameEl) bizNameEl.value = "";
    renderKeywords([]);
  }

  if (genBtn) genBtn.addEventListener("click", handleGenerate);
  if (newBtn) newBtn.addEventListener("click", handleGenerate);
  if (delBtn) delBtn.addEventListener("click", handleDelete);

  // -------------------------
  // DOMAIN SCANNER (SIMULATED)
  // -------------------------
  const domainInput = document.getElementById("domainInput");
  const startScanBtn = document.getElementById("startScanBtn");
  const resetScanBtn = document.getElementById("resetScanBtn");
  const scanMsg = document.getElementById("scanMsg");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const progressEta = document.getElementById("progressEta");
  const matrixOutput = document.getElementById("matrixOutput");

  let scanTimer = null;
  let scanStartTs = null;
  let scanDurationMs = null;
  let currentProgress = 0;

  function setScanUI(progress, etaText) {
    const p = Math.max(0, Math.min(100, progress));
    if (progressFill) progressFill.style.width = `${p}%`;
    if (progressText) progressText.textContent = `${Math.round(p)}%`;
    if (progressEta) progressEta.textContent = etaText ? `ETA: ${etaText}` : `ETA: --`;
  }

  function disableScanControls(disabled) {
    if (startScanBtn) startScanBtn.disabled = disabled;
    if (domainInput) domainInput.disabled = disabled;
    if (startScanBtn) startScanBtn.style.opacity = disabled ? "0.65" : "1";
  }

  function isValidDomain(s) {
    const v = (s || "").trim();
    // Accept "example.com" or "sub.example.co"
    return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(v);
  }

  function fmtTime(msRemaining) {
    const sec = Math.max(0, Math.round(msRemaining / 1000));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function buildMatrix(domain) {
    // Force overall < 80
    const overall = randInt(52, 79);

    // Component metrics, biased to be around overall but varied
    const metrics = [
      ["Entity Clarity", clamp(overall + randInt(-12, 10))],
      ["Structured Data", clamp(overall + randInt(-18, 8))],
      ["Topical Authority", clamp(overall + randInt(-14, 10))],
      ["Cross-platform Consistency", clamp(overall + randInt(-16, 8))],
      ["Source-worthiness", clamp(overall + randInt(-14, 10))],
      ["Citation Potential", clamp(overall + randInt(-18, 6))],
      ["Content Depth", clamp(overall + randInt(-10, 12))],
      ["Knowledge Graph Signals", clamp(overall + randInt(-20, 6))]
    ];

    const rows = metrics.map(([k, v]) => {
      const label = v >= 70 ? "MODERATE" : "LOW";
      return `
        <tr>
          <td>${escapeHtml(k)}</td>
          <td><span class="badge">${v}%</span></td>
          <td>${label}</td>
        </tr>
      `;
    }).join("");

    const recommendations = [
      "Add Organization/LocalBusiness schema with consistent entities",
      "Create AI-friendly FAQ + explainer pages with clear citations",
      "Strengthen author & brand credibility signals across platforms",
      "Improve topical clusters and internal linking for context depth",
      "Build source-worthy assets (data, benchmarks, unique insights)",
      "Monitor AI responses and iterate toward citation triggers"
    ];

    const recList = recommendations.map(r => `<li>${escapeHtml(r)}</li>`).join("");

    const mailto = "mailto:reyvem.edu.1997@gmail.com?subject=AI%20SEO%20-%20Improve%20My%20AI%20Visibility%20(" + encodeURIComponent(domain) + ")";

    return `
      <div class="note">
        <div style="font-weight:950; margin-bottom:6px;">Domain: <span class="badge">${escapeHtml(domain)}</span></div>
        <div style="margin-bottom:10px;">AI Visibility Score: <span class="badge">${overall}%</span> (below 80% — improvement recommended)</div>
        <table class="matrix">
          <thead>
            <tr>
              <th>Signal</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div style="margin-top:12px; font-weight:950;">Suggested Improvements</div>
        <ul style="margin-top:8px; line-height:1.65; font-weight:800;">
          ${recList}
        </ul>

        <div style="margin-top:10px;">
          To boost your AI Visibility above 80%, contact us:
          <a href="${mailto}" style="font-weight:950;">Email AI SEO</a>
        </div>
      </div>
    `;
  }

  function clamp(n) {
    return Math.max(35, Math.min(79, n)); // keep all metrics under 80 too
  }

  function startScan() {
    const domain = (domainInput ? domainInput.value : "").trim();

    if (!domain) {
      alert("Please enter a domain (e.g., example.com).");
      return;
    }
    if (!isValidDomain(domain)) {
      alert("Please enter a valid domain like example.com (no http://, no paths).");
      return;
    }

    // Reset outputs
    if (matrixOutput) matrixOutput.innerHTML = `<div class="output-empty">Scanning... results will appear here.</div>`;
    currentProgress = 0;

    // Random duration: 2–3 minutes
    scanDurationMs = randInt(120000, 180000);
    scanStartTs = Date.now();

    disableScanControls(true);
    if (scanMsg) scanMsg.textContent = "Please be patient we are scanning your domain";

    setScanUI(0, fmtTime(scanDurationMs));

    // Ticking updates
    scanTimer = setInterval(() => {
      const elapsed = Date.now() - scanStartTs;
      const remaining = Math.max(0, scanDurationMs - elapsed);

      // Progress curve: mostly steady, with small randomness
      const target = Math.min(100, (elapsed / scanDurationMs) * 100);
      const jitter = Math.random() * 2.2; // subtle randomness
      currentProgress = Math.max(currentProgress, Math.min(100, target + jitter));

      // Don't hit 100 early
      if (remaining > 1500) currentProgress = Math.min(currentProgress, 98.5);

      setScanUI(currentProgress, fmtTime(remaining));

      if (elapsed >= scanDurationMs) {
        finishScan(domain);
      }
    }, 450);
  }

  function finishScan(domain) {
    if (scanTimer) clearInterval(scanTimer);
    scanTimer = null;
    currentProgress = 100;
    setScanUI(100, "0:00");

    if (scanMsg) scanMsg.textContent = "Scan complete. Generating AI Visibility Matrix…";

    // brief delay for effect
    setTimeout(() => {
      if (matrixOutput) matrixOutput.innerHTML = buildMatrix(domain);
      if (scanMsg) scanMsg.textContent = "Scan complete. Review the matrix and contact us to improve AI Visibility.";
      disableScanControls(false);
    }, 650);
  }

  function resetScan() {
    if (scanTimer) clearInterval(scanTimer);
    scanTimer = null;
    scanStartTs = null;
    scanDurationMs = null;
    currentProgress = 0;

    if (domainInput) domainInput.value = "";
    if (scanMsg) scanMsg.textContent = "Please be patient we are scanning your domain";
    setScanUI(0, null);

    if (matrixOutput) {
      matrixOutput.innerHTML = `<div class="output-empty">Run a scan to see your AI Visibility Matrix.</div>`;
    }
    disableScanControls(false);
  }

  if (startScanBtn) startScanBtn.addEventListener("click", startScan);
  if (resetScanBtn) resetScanBtn.addEventListener("click", resetScan);
})();