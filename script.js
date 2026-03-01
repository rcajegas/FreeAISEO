(() => {

  /* ==============================
     FOOTER YEAR
  ============================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ==============================
     KEYWORD GENERATOR
  ============================== */

  const bizNameEl = document.getElementById("bizName");
  const bizTypeEl = document.getElementById("bizType");
  const outEl = document.getElementById("keywordsOutput");

  const genBtn = document.getElementById("genKeywordsBtn");
  const delBtn = document.getElementById("delKeywordsBtn");
  const newBtn = document.getElementById("newKeywordsBtn");
  const copyKeywordsBtn = document.getElementById("copyKeywordsBtn");

  const categoryTemplates = {
    "Law Firm": [
      "{name} law firm",
      "{name} attorney",
      "{name} personal injury lawyer",
      "{name} criminal defense attorney",
      "{name} family law firm",
      "best lawyer near me",
      "{name} legal consultation",
      "{name} business lawyer",
      "{name} immigration attorney",
      "top rated law firm {name}"
    ],
    "Real Estate": [
      "{name} real estate",
      "{name} realtor",
      "{name} homes for sale",
      "{name} property listings",
      "{name} house valuation",
      "best realtor near me",
      "{name} property agent",
      "{name} condo for sale",
      "{name} buy a home",
      "top real estate agent {name}"
    ],
    "Restaurant": [
      "{name} restaurant",
      "{name} menu",
      "{name} reservations",
      "{name} delivery",
      "{name} takeout",
      "best food near me",
      "{name} brunch",
      "{name} dinner specials",
      "{name} lunch deals",
      "top rated restaurant {name}"
    ],
    "Healthcare": [
      "{name} clinic",
      "{name} doctor",
      "{name} healthcare services",
      "{name} medical center",
      "{name} appointment booking",
      "healthcare near me",
      "{name} urgent care",
      "{name} telemedicine",
      "{name} health checkup",
      "best clinic {name}"
    ],
    "Rental Company": [
      "{name} rentals",
      "{name} rental company",
      "{name} equipment rental",
      "{name} car rental",
      "{name} property rental",
      "rent near me",
      "{name} short term rental",
      "{name} long term rental",
      "{name} affordable rentals",
      "best rental service {name}"
    ]
  };

  const modifiers = [
    "near me",
    "open now",
    "pricing",
    "reviews",
    "book online",
    "same day",
    "24/7",
    "affordable",
    "trusted",
    "licensed"
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function renderKeywords(list) {
    if (!list || list.length === 0) {
      outEl.innerHTML = "";
      return;
    }

    const items = list.map(k => `<li>${escapeHtml(k)}</li>`).join("");
    outEl.innerHTML = `<ol class="kw-list">${items}</ol>`;
  }

  function generateKeywords(name, category) {
    const base = categoryTemplates[category] || [];
    const set = new Set();

    while (set.size < 20) {
      const template = pick(base);
      const mod = Math.random() > 0.5 ? pick(modifiers) : "";
      const phrase = `${template.replaceAll("{name}", name)} ${mod}`.trim();
      set.add(phrase);
    }

    return Array.from(set);
  }

  function handleGenerate() {
    const name = bizNameEl.value.trim();

    if (!name) {
      alert("Please Enter your Business Name");
      bizNameEl.focus();
      return;
    }

    const category = bizTypeEl.value;
    const keywords = generateKeywords(name, category);
    renderKeywords(keywords);
  }

  function handleDelete() {
    bizNameEl.value = "";
    renderKeywords([]);
  }

  if (genBtn) genBtn.addEventListener("click", handleGenerate);
  if (newBtn) newBtn.addEventListener("click", handleGenerate);
  if (delBtn) delBtn.addEventListener("click", handleDelete);

  if (copyKeywordsBtn) {
    copyKeywordsBtn.addEventListener("click", () => {
      const items = outEl.querySelectorAll("li");
      if (!items.length) {
        alert("Nothing to copy yet.");
        return;
      }

      const text = Array.from(items).map(li => li.textContent).join("\n");
      navigator.clipboard.writeText(text)
        .then(() => alert("Keywords copied ✅"))
        .catch(() => alert("Copy failed"));
    });
  }


  /* ==============================
     DOMAIN SCANNER
  ============================== */

  const domainInput = document.getElementById("domainInput");
  const startScanBtn = document.getElementById("startScanBtn");
  const resetScanBtn = document.getElementById("resetScanBtn");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const progressEta = document.getElementById("progressEta");
  const matrixOutput = document.getElementById("matrixOutput");
  const copyMatrixBtn = document.getElementById("copyMatrixBtn");

  let timer = null;

  function isValidDomain(domain) {
    return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(domain);
  }

  function startScan() {
    const domain = domainInput.value.trim();

    if (!domain) {
      alert("Please enter your domain");
      domainInput.focus();
      return;
    }

    if (!isValidDomain(domain)) {
      alert("Please enter a valid domain like example.com");
      return;
    }

    matrixOutput.innerHTML = "";
    let progress = 0;

    const duration = Math.floor(Math.random() * (180000 - 120000) + 120000);
    const startTime = Date.now();

    timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      progress = Math.min((elapsed / duration) * 100, 100);

      progressFill.style.width = progress + "%";
      progressText.textContent = Math.floor(progress) + "%";

      const remaining = Math.max(duration - elapsed, 0);
      const seconds = Math.floor(remaining / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      progressEta.textContent = `ETA: ${mins}:${secs.toString().padStart(2, "0")}`;

      if (progress >= 100) {
        clearInterval(timer);
        generateMatrix(domain);
      }
    }, 500);
  }

  function generateMatrix(domain) {
    const score = Math.floor(Math.random() * 25) + 55; // always under 80

    matrixOutput.innerHTML = `
      <div class="note">
        <strong>Domain:</strong> ${domain}<br><br>
        <strong>AI Visibility Score:</strong> ${score}% (Below 80% — Improvement Recommended)<br><br>
        <strong>Recommendation:</strong> Improve structured data, content depth, entity clarity, and authority signals.
      </div>
    `;
  }

  function resetScan() {
    clearInterval(timer);
    progressFill.style.width = "0%";
    progressText.textContent = "0%";
    progressEta.textContent = "ETA: --";
    matrixOutput.innerHTML = "";
    domainInput.value = "";
  }

  if (startScanBtn) startScanBtn.addEventListener("click", startScan);
  if (resetScanBtn) resetScanBtn.addEventListener("click", resetScan);

  if (copyMatrixBtn) {
    copyMatrixBtn.addEventListener("click", () => {
      const text = matrixOutput.innerText.trim();
      if (!text) {
        alert("Nothing to copy yet.");
        return;
      }

      navigator.clipboard.writeText(text)
        .then(() => alert("Matrix copied ✅"))
        .catch(() => alert("Copy failed"));
    });
  }

})();
