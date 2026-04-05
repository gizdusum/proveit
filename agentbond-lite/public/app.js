const { ethers } = window;

const APP_LANG_KEY = "agentbond-lite-language";
const APP_MODE_KEY = "agentbond-lite-mode";
const REOWN_PROJECT_ID = "2c7675603bcfd9904aa52c32e6ce9a34";
const CHAIN_ID = 127823;
const CHAIN_HEX = "0x1f34f";

const TEMPLATES = {
  governance: {
    mode: "governance",
    title: {
      en: "Governance intelligence review",
      tr: "Yönetişim istihbaratı incelemesi"
    },
    focus: {
      en: "token design, treasury controls, upgrade path",
      tr: "token tasarımı, hazine kontrolleri, yükseltme yolu"
    },
    prompt: {
      en: "Review the token design, treasury controls, and upgrade risks. Produce a short report with concrete recommendations.",
      tr: "Token tasarımını, hazine kontrollerini ve yükseltme risklerini incele. Somut öneriler içeren kısa bir rapor üret."
    }
  },
  token: {
    mode: "token_risk",
    title: {
      en: "Token and market signals review",
      tr: "Token ve piyasa sinyalleri incelemesi"
    },
    focus: {
      en: "token utility, liquidity, crowd conviction",
      tr: "token faydası, likidite, kalabalık inancı"
    },
    prompt: {
      en: "Review the token design, liquidity setup, admin controls, and crowd expectations. Produce a short report with concrete recommendations.",
      tr: "Token tasarımını, likidite yapısını, admin kontrollerini ve kalabalık beklentilerini incele. Somut öneriler içeren kısa bir rapor üret."
    }
  },
  identity: {
    mode: "upgrade_risk",
    title: {
      en: "Identity and trust surface review",
      tr: "Kimlik ve güven yüzeyi incelemesi"
    },
    focus: {
      en: "trust signals, permissions, suspicious behavior",
      tr: "güven sinyalleri, izinler, şüpheli davranışlar"
    },
    prompt: {
      en: "Review the trust surface, privilege structure, and suspicious behavior patterns. Produce a short report with concrete recommendations.",
      tr: "Güven yüzeyini, yetki yapısını ve şüpheli davranış örüntülerini incele. Somut öneriler içeren kısa bir rapor üret."
    }
  }
};

const TEXT = {
  en: {
    brandName: "AgentBond Lite",
    brandTagline: "Etherlink Accountable AI Rail",
    languageLabel: "Language",
    hackathonLink: "Hackathon",
    connectWallet: "Connect wallet",
    disconnectWallet: "Disconnect",
    heroEyebrow: "Lite release // Etherlink deployed",
    heroTitle: "Ask one question. Get one clear report.",
    heroText:
      "AgentBond Lite turns a single prompt into one accountable AI report, then lets you anchor and settle that verdict on Etherlink.",
    governanceTitle: "Governance intelligence",
    marketTitle: "Token + crowd read",
    identityTitle: "Identity graph",
    requestLabel: "What should the agent review?",
    requestPlaceholder:
      "Example: Review the token design, treasury controls, and upgrade risks. Produce a short report with concrete recommendations.",
    generateReport: "Generate report",
    resetDemo: "Reset demo",
    viewExplorer: "View explorer",
    etaLabel: "Estimated time",
    statusLabel: "Status",
    network: "Network",
    readyState: "Ready",
    countdownTitle: "Report countdown",
    countdownGenerating: "Generating your report...",
    countdownSubline: "The result will appear automatically when it is ready.",
    walletNotConnected: "Connect a wallet to anchor and settle reports on Etherlink.",
    advancedOptions: "Advanced options",
    deliveryWindow: "Delivery window",
    reviewMode: "Review mode",
    settlementAmount: "Settlement amount (XTZ)",
    disputeTimeout: "Dispute timeout",
    resultCardTitle: "Current result",
    summaryLabel: "Summary",
    nextStepHint: "Generate a report first. Then you can anchor its verdict on Etherlink.",
    keyFindingsLabel: "Key findings",
    recommendationLabel: "Recommendation",
    fullReportLabel: "Full report",
    settlementTitle: "Accountable settlement",
    settlementHeading: "Anchor the verdict. Accept or dispute it onchain.",
    settlementExplain:
      "Anchoring stores a compact commitment to the report on Etherlink. Funding settlement creates a transparent accept / dispute trail for this specific verdict.",
    awaitingAnchor: "Awaiting anchor",
    onchainRecord: "Onchain record",
    verdictHash: "Verdict hash",
    confidenceScore: "Confidence",
    anchorVerdict: "Anchor verdict",
    fundSettlement: "Fund settlement",
    acceptReport: "Accept report",
    disputeReport: "Dispute report",
    refreshOnchain: "Refresh onchain",
    onchainPanelTitle: "Onchain settlement",
    onchainSubtitle:
      "The AI report is generated offchain. Etherlink stores the report commitment, then tracks whether that result is accepted or disputed.",
    taskTitle: "Report title",
    focus: "Focus",
    taskBrief: "Prompt brief",
    reportId: "Report ID",
    contentUri: "Content URI",
    disputeReasonUri: "Dispute reason URI",
    txExplorer: "Latest explorer link",
    switchEtherlink: "Switch to Etherlink",
    refresh: "Refresh",
    comingSoon: "Coming soon",
    fullAgentBondDesc:
      "Lite is the first release. Full AgentBond expands the same primitive into richer disputes, reputation, and multi-agent competition.",
    walletModalEyebrow: "Wallet access",
    walletModalTitle: "Choose a wallet",
    walletConnectTitle: "WalletConnect",
    walletConnectDesc: "Scan a QR code or use a mobile wallet.",
    anchorCtaHint: "Anchor the verdict on Etherlink to create an auditable report record.",
    settlementFundHint: "Fund settlement to enable an onchain accept / dispute trail.",
    settlementAcceptHint: "Settlement is funded. The requester can now accept or dispute the report onchain.",
    settlementAccepted: "Accepted onchain",
    settlementDisputed: "Disputed onchain",
    settlementFunded: "Settlement funded",
    settlementRefunded: "Settlement refunded",
    reportAnchored: "Verdict anchored on Etherlink",
    modeGovernance: "Governance intelligence",
    modeToken: "Token + crowd read",
    modeIdentity: "Identity graph",
    generatingStatus: "Generating report",
    anchoringStatus: "Anchoring verdict",
    fundingStatus: "Funding settlement",
    acceptingStatus: "Accepting report",
    disputingStatus: "Disputing report",
    refreshingStatus: "Refreshing onchain state",
    connectedStatus: "Wallet connected. You can anchor and settle reports on Etherlink.",
    explorerTx: "View transaction",
    reviewModeOwner: "Owner acceptance",
    reviewModeOwnerPlus: "Owner + notes",
    reviewModeChallenge: "Challenge ready",
    deliveryFast: "Fast // 15 min",
    deliveryNormal: "Normal // 1 hour",
    deliveryDeep: "Deep // 1 day",
    timeoutShort: "5 min",
    timeoutMid: "15 min",
    timeoutLong: "1 hour"
  },
  tr: {
    brandName: "AgentBond Lite",
    brandTagline: "Etherlink Hesap Verebilir Yapay Zeka Hattı",
    languageLabel: "Dil",
    hackathonLink: "Hackathon",
    connectWallet: "Cüzdan bağla",
    disconnectWallet: "Bağlantıyı kes",
    heroEyebrow: "Lite sürüm // Etherlink dağıtıldı",
    heroTitle: "Tek soru sor. Tek net rapor al.",
    heroText:
      "AgentBond Lite tek bir isteği hesap verebilir bir yapay zeka raporuna dönüştürür, ardından bu kararı Etherlink üzerinde anchor edip settlement akışına sokar.",
    governanceTitle: "Yönetişim istihbaratı",
    marketTitle: "Token + kalabalık okuması",
    identityTitle: "Kimlik grafiği",
    requestLabel: "Ajan neyi incelemeli?",
    requestPlaceholder:
      "Örnek: Token tasarımını, hazine kontrollerini ve yükseltme risklerini incele. Somut öneriler içeren kısa bir rapor üret.",
    generateReport: "Rapor üret",
    resetDemo: "Demoyu sıfırla",
    viewExplorer: "Explorer'ı aç",
    etaLabel: "Tahmini süre",
    statusLabel: "Durum",
    network: "Ağ",
    readyState: "Hazır",
    countdownTitle: "Rapor sayacı",
    countdownGenerating: "Raporun hazırlanıyor...",
    countdownSubline: "Sonuç hazır olduğunda otomatik olarak aşağıda görünecek.",
    walletNotConnected: "Raporları Etherlink üzerinde anchor edip settlement akışına sokmak için cüzdan bağla.",
    advancedOptions: "Gelişmiş seçenekler",
    deliveryWindow: "Teslim süresi",
    reviewMode: "İnceleme modu",
    settlementAmount: "Settlement tutarı (XTZ)",
    disputeTimeout: "İtiraz süresi",
    resultCardTitle: "Güncel sonuç",
    summaryLabel: "Özet",
    nextStepHint: "Önce raporu üret. Sonra verdict'i Etherlink üzerinde anchor edebilirsin.",
    keyFindingsLabel: "Temel bulgular",
    recommendationLabel: "Öneri",
    fullReportLabel: "Tam rapor",
    settlementTitle: "Hesap verebilir settlement",
    settlementHeading: "Verdict'i anchor et. Raporu zincir üstünde kabul et veya itiraz et.",
    settlementExplain:
      "Anchor işlemi raporun kompakt taahhüdünü Etherlink üzerinde saklar. Settlement fonlamak ise bu verdict için şeffaf bir kabul / itiraz izi oluşturur.",
    awaitingAnchor: "Anchor bekleniyor",
    onchainRecord: "Zincir üstü kayıt",
    verdictHash: "Verdict hash'i",
    confidenceScore: "Güven",
    anchorVerdict: "Verdict'i anchor et",
    fundSettlement: "Settlement fonla",
    acceptReport: "Raporu kabul et",
    disputeReport: "Rapor itirazı aç",
    refreshOnchain: "Zincir üstünü yenile",
    onchainPanelTitle: "Zincir üstü settlement",
    onchainSubtitle:
      "Yapay zeka raporu zincir dışında üretilir. Etherlink bu raporun taahhüdünü saklar ve sonucun kabul mü itiraz mı aldığını izler.",
    taskTitle: "Rapor başlığı",
    focus: "Odak",
    taskBrief: "Prompt özeti",
    reportId: "Rapor ID",
    contentUri: "İçerik URI'si",
    disputeReasonUri: "İtiraz gerekçesi URI'si",
    txExplorer: "Son explorer linki",
    switchEtherlink: "Etherlink'e geç",
    refresh: "Yenile",
    comingSoon: "Çok yakında",
    fullAgentBondDesc:
      "Lite ilk sürüm. Full AgentBond aynı primitive'i daha güçlü itirazlar, itibar yapısı ve çoklu ajan rekabetiyle genişletecek.",
    walletModalEyebrow: "Cüzdan erişimi",
    walletModalTitle: "Bir cüzdan seç",
    walletConnectTitle: "WalletConnect",
    walletConnectDesc: "QR kod okut veya mobil cüzdan kullan.",
    anchorCtaHint: "Denetlenebilir bir rapor kaydı oluşturmak için verdict'i Etherlink üzerinde anchor et.",
    settlementFundHint: "Zincir üstü kabul / itiraz izi başlatmak için settlement fonla.",
    settlementAcceptHint: "Settlement fonlandı. İstek sahibi artık raporu zincir üstünde kabul edebilir veya itiraz açabilir.",
    settlementAccepted: "Zincir üstünde kabul edildi",
    settlementDisputed: "Zincir üstünde itiraz edildi",
    settlementFunded: "Settlement fonlandı",
    settlementRefunded: "Settlement iade edildi",
    reportAnchored: "Verdict Etherlink üzerinde anchor edildi",
    modeGovernance: "Yönetişim istihbaratı",
    modeToken: "Token + kalabalık okuması",
    modeIdentity: "Kimlik grafiği",
    generatingStatus: "Rapor üretiliyor",
    anchoringStatus: "Verdict anchor ediliyor",
    fundingStatus: "Settlement fonlanıyor",
    acceptingStatus: "Rapor kabul ediliyor",
    disputingStatus: "İtiraz gönderiliyor",
    refreshingStatus: "Zincir üstü durum yenileniyor",
    connectedStatus: "Cüzdan bağlı. Raporları Etherlink üzerinde anchor edip settlement akışına sokabilirsin.",
    explorerTx: "İşlemi görüntüle",
    reviewModeOwner: "Sahip onayı",
    reviewModeOwnerPlus: "Sahip + notlar",
    reviewModeChallenge: "İtiraza hazır",
    deliveryFast: "Hızlı // 15 dk",
    deliveryNormal: "Normal // 1 saat",
    deliveryDeep: "Derin // 1 gün",
    timeoutShort: "5 dk",
    timeoutMid: "15 dk",
    timeoutLong: "1 saat"
  }
};

const state = {
  lang: localStorage.getItem(APP_LANG_KEY) || "en",
  modeKey: localStorage.getItem(APP_MODE_KEY) || "governance",
  config: null,
  currentReport: null,
  onchainReport: null,
  currentReportId: null,
  settlement: null,
  currentTxHash: null,
  walletProvider: null,
  rawProvider: null,
  signer: null,
  account: null,
  walletconnectProvider: null,
  injectedProviders: new Map(),
  countdownTimer: null,
  countdownEndsAt: 0,
  readProvider: null
};

const els = {};

function $(id) {
  return document.getElementById(id);
}

function t(key) {
  const langPack = TEXT[state.lang] || TEXT.en;
  return langPack[key] || TEXT.en[key] || key;
}

function shortAddress(value) {
  if (!value) return "-";
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function shortHash(value) {
  if (!value) return "-";
  return `${value.slice(0, 10)}…${value.slice(-8)}`;
}

function formatConfidence(bps) {
  const value = Number(bps || 0) / 100;
  return `${value.toFixed(1)}%`;
}

function formatModeLabel(modeKey) {
  if (modeKey === "governance") return t("modeGovernance");
  if (modeKey === "token") return t("modeToken");
  return t("modeIdentity");
}

function setStatus(message, kind = "neutral") {
  els.liveStatusValue.textContent = message;
  els.walletStatus.textContent = message;
  els.walletStatus.style.color = kind === "error" ? "#ffd3dd" : "#d4e2f8";
}

function setEta(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const mins = String(Math.floor(safe / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  els.etaValue.textContent = `${mins}:${secs}`;
  els.countdownTimer.textContent = `${mins}:${secs}`;
}

function getEtaSeconds() {
  const value = els.deliveryWindowSelect.value;
  if (value === "fast") return 25;
  if (value === "deep") return 65;
  return 45;
}

function startCountdown(seconds) {
  stopCountdown();
  state.countdownEndsAt = Date.now() + seconds * 1000;
  els.countdownCard.hidden = false;
  setEta(seconds);
  state.countdownTimer = window.setInterval(() => {
    const remaining = Math.max(0, Math.ceil((state.countdownEndsAt - Date.now()) / 1000));
    setEta(remaining);
    if (remaining <= 0) {
      stopCountdown();
      els.countdownHeadline.textContent = t("countdownGenerating");
      els.countdownSubline.textContent = t("countdownSubline");
      els.countdownCard.hidden = true;
    }
  }, 250);
}

function stopCountdown() {
  if (state.countdownTimer) {
    window.clearInterval(state.countdownTimer);
    state.countdownTimer = null;
  }
}

function applyI18n() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const value = t(key);
    if (value) node.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    const value = t(key);
    if (value) node.setAttribute("placeholder", value);
  });

  els.reviewModeSelect.options[0].textContent = t("reviewModeOwner");
  els.reviewModeSelect.options[1].textContent = t("reviewModeOwnerPlus");
  els.reviewModeSelect.options[2].textContent = t("reviewModeChallenge");
  els.deliveryWindowSelect.options[0].textContent = t("deliveryFast");
  els.deliveryWindowSelect.options[1].textContent = t("deliveryNormal");
  els.deliveryWindowSelect.options[2].textContent = t("deliveryDeep");
  els.timeoutSelect.options[0].textContent = t("timeoutShort");
  els.timeoutSelect.options[1].textContent = t("timeoutMid");
  els.timeoutSelect.options[2].textContent = t("timeoutLong");

  const selectedOption = els.languageSelect.querySelector(`option[value="${state.lang}"]`);
  els.resultLanguageLabel.textContent = selectedOption ? selectedOption.textContent : "English";

  if (!state.currentReport) {
    els.resultModeLabel.textContent = formatModeLabel(state.modeKey);
    els.resultSummary.textContent = t("nextStepHint");
    els.resultNextStepHint.textContent = t("anchorCtaHint");
  }

  renderWalletState();
}

function bindElements() {
  [
    "languageSelect",
    "walletBadge",
    "connectBtn",
    "disconnectBtn",
    "requestInput",
    "generateReportBtn",
    "loadDemoBtn",
    "explorerLink",
    "etaValue",
    "liveStatusValue",
    "networkLabel",
    "countdownCard",
    "countdownHeadline",
    "countdownSubline",
    "countdownTimer",
    "walletStatus",
    "deliveryWindowSelect",
    "reviewModeSelect",
    "rewardInput",
    "timeoutSelect",
    "resultPanel",
    "resultModeLabel",
    "resultLanguageLabel",
    "resultSettlementLabel",
    "resultSummary",
    "resultNextStepHint",
    "resultFindingsList",
    "resultRecommendation",
    "reportOutput",
    "settlementStatusBadge",
    "reportIdValue",
    "verdictHashValue",
    "confidenceValue",
    "anchorReportBtn",
    "fundSettlementBtn",
    "acceptSettlementBtn",
    "disputeSettlementBtn",
    "refreshSettlementBtn",
    "titleInput",
    "focusInput",
    "briefInput",
    "reportIdInput",
    "contentUriInput",
    "disputeReasonInput",
    "txExplorerLink",
    "switchBtn",
    "anchorReportBtnSecondary",
    "fundSettlementBtnSecondary",
    "acceptSettlementBtnSecondary",
    "disputeSettlementBtnSecondary",
    "refreshBtn",
    "taskState",
    "walletModal",
    "walletModalBackdrop",
    "walletModalClose",
    "walletModalList",
    "walletConnectQrButton"
  ].forEach((id) => {
    els[id] = $(id);
  });
}

function getTemplate(modeKey = state.modeKey) {
  return TEMPLATES[modeKey] || TEMPLATES.governance;
}

function applyTemplate(modeKey, { resetPrompt = false } = {}) {
  state.modeKey = modeKey;
  localStorage.setItem(APP_MODE_KEY, modeKey);
  const template = getTemplate(modeKey);
  const localizedTitle = template.title[state.lang] || template.title.en;
  const localizedFocus = template.focus[state.lang] || template.focus.en;
  const localizedPrompt = template.prompt[state.lang] || template.prompt.en;

  els.titleInput.value = localizedTitle;
  els.focusInput.value = localizedFocus;
  els.briefInput.value = localizedPrompt;
  if (resetPrompt || !els.requestInput.value.trim()) {
    els.requestInput.value = localizedPrompt;
  }

  document.querySelectorAll(".mode-chip").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.template === modeKey);
  });

  if (!state.currentReport) {
    els.resultModeLabel.textContent = formatModeLabel(modeKey);
  }
}

async function loadConfig() {
  const response = await fetch("/api/config");
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error || "Failed to load config.");
  state.config = payload;
  state.readProvider = new ethers.JsonRpcProvider(payload.network.rpcUrl);
  els.networkLabel.textContent = payload.network.name;
  els.explorerLink.href = payload.network.explorerUrl;
  els.txExplorerLink.href = payload.network.explorerUrl;
}

function currentContracts(providerOrSigner) {
  const registry = new ethers.Contract(
    state.config.contracts.reportRegistry.address,
    state.config.contracts.reportRegistry.abi,
    providerOrSigner
  );
  const escrow = new ethers.Contract(
    state.config.contracts.settlementEscrow.address,
    state.config.contracts.settlementEscrow.abi,
    providerOrSigner
  );
  return { registry, escrow };
}

function getRecommendationText(recommendation) {
  if (!recommendation) return "-";
  return `${recommendation} // ${formatConfidence(state.currentReport?.confidence_bps || 0)}`;
}

function setButtonsDisabled(ids, disabled) {
  ids.forEach((id) => {
    const button = els[id];
    if (button) button.disabled = disabled;
  });
}

function updateActionState() {
  const connected = Boolean(state.signer && state.account);
  const hasReport = Boolean(state.currentReport);
  const hasReportId = Boolean(state.currentReportId || Number(els.reportIdInput.value));
  const settlementStatus = Number(state.settlement?.status ?? 0);

  setButtonsDisabled(["generateReportBtn"], false);
  setButtonsDisabled(["anchorReportBtn", "anchorReportBtnSecondary"], !connected || !hasReport || hasReportId);
  setButtonsDisabled(["fundSettlementBtn", "fundSettlementBtnSecondary"], !connected || !hasReportId || settlementStatus !== 0);
  setButtonsDisabled(
    ["acceptSettlementBtn", "acceptSettlementBtnSecondary", "disputeSettlementBtn", "disputeSettlementBtnSecondary"],
    !connected || !hasReportId || settlementStatus !== 1
  );
  setButtonsDisabled(["refreshSettlementBtn", "refreshBtn"], !hasReportId);
}

function setExplorerTx(hash) {
  const base = state.config?.network?.explorerUrl || "https://shadownet.explorer.etherlink.com";
  const href = hash ? `${base}/tx/${hash}` : base;
  els.txExplorerLink.href = href;
  els.txExplorerLink.textContent = hash ? t("explorerTx") : t("viewExplorer");
}

function renderTaskState(extra = {}) {
  const snapshot = {
    reportId: state.currentReportId || null,
    report: state.currentReport
      ? {
          title: state.currentReport.title,
          recommendation: state.currentReport.recommendation,
          confidence_bps: state.currentReport.confidence_bps,
          verdict_hash: state.currentReport.verdict_hash,
          content_uri: state.currentReport.content_uri
        }
      : null,
    settlement: state.settlement,
    ...extra
  };
  els.taskState.textContent = JSON.stringify(snapshot, null, 2);
}

function settlementStatusLabel(status) {
  if (status === 1) return t("settlementFunded");
  if (status === 2) return t("settlementAccepted");
  if (status === 3) return t("settlementDisputed");
  if (status === 4) return t("settlementRefunded");
  if (state.currentReportId) return t("reportAnchored");
  return t("awaitingAnchor");
}

function renderSettlementState() {
  const status = Number(state.settlement?.status ?? 0);
  const verdictHash = state.currentReport?.verdict_hash || state.onchainReport?.verdictHash || null;
  const confidenceBps = state.currentReport?.confidence_bps ?? state.onchainReport?.confidenceBps ?? 0;
  els.reportIdValue.textContent = state.currentReportId ? String(state.currentReportId) : "-";
  els.verdictHashValue.textContent = verdictHash ? shortHash(verdictHash) : "-";
  els.confidenceValue.textContent = confidenceBps ? formatConfidence(confidenceBps) : "-";
  els.settlementStatusBadge.textContent = settlementStatusLabel(status);

  if (status === 1) {
    els.resultSettlementLabel.textContent = t("settlementFunded");
    els.resultNextStepHint.textContent = t("settlementAcceptHint");
  } else if (status === 2) {
    els.resultSettlementLabel.textContent = t("settlementAccepted");
    els.resultNextStepHint.textContent = t("settlementAccepted");
  } else if (status === 3) {
    els.resultSettlementLabel.textContent = t("settlementDisputed");
    els.resultNextStepHint.textContent = t("settlementDisputed");
  } else if (state.currentReportId) {
    els.resultSettlementLabel.textContent = t("reportAnchored");
    els.resultNextStepHint.textContent = t("settlementFundHint");
  } else {
    els.resultSettlementLabel.textContent = t("awaitingAnchor");
    els.resultNextStepHint.textContent = t("anchorCtaHint");
  }

  updateActionState();
  renderTaskState();
}

function renderReport(report) {
  state.currentReport = report;
  state.onchainReport = null;
  state.settlement = null;
  state.currentReportId = null;
  els.resultPanel.hidden = false;
  els.resultModeLabel.textContent = formatModeLabel(state.modeKey);
  els.resultSummary.textContent = report.short_summary;
  els.resultRecommendation.textContent = getRecommendationText(report.recommendation);
  els.reportOutput.textContent = report.full_report_markdown;
  els.resultFindingsList.innerHTML = "";
  report.key_findings.forEach((finding) => {
    const li = document.createElement("li");
    li.textContent = finding;
    els.resultFindingsList.appendChild(li);
  });

  els.titleInput.value = report.title || els.titleInput.value;
  els.briefInput.value = report.prompt || els.briefInput.value;
  els.contentUriInput.value = report.content_uri || `ipfs://agentbond-lite/reports/${report.request_id}`;
  els.reportIdInput.value = "";
  setExplorerTx(null);
  renderSettlementState();
  renderTaskState();
  window.scrollTo({ top: els.resultPanel.offsetTop - 24, behavior: "smooth" });
}

async function fetchJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || `Request failed for ${url}.`);
  }
  return data;
}

async function generateReport() {
  const prompt = els.requestInput.value.trim();
  if (!prompt) {
    els.requestInput.focus();
    return;
  }

  const template = getTemplate();
  const payload = {
    mode: template.mode,
    language: state.lang,
    prompt,
    title: els.titleInput.value.trim() || template.title[state.lang] || template.title.en,
    brief: els.briefInput.value.trim() || prompt,
    requester_address: state.account || null
  };

  setStatus(t("generatingStatus"));
  els.countdownHeadline.textContent = t("countdownGenerating");
  els.countdownSubline.textContent = t("countdownSubline");
  startCountdown(getEtaSeconds());

  try {
    const data = await fetchJson("/api/ai/report", payload);
    stopCountdown();
    els.countdownCard.hidden = true;
    setEta(getEtaSeconds());
    renderReport(data.report);
    setStatus(t("readyState"));
  } catch (error) {
    stopCountdown();
    els.countdownCard.hidden = true;
    setStatus(error.message, "error");
  }
}

function walletEntryKey(detail) {
  return detail.info?.rdns || detail.info?.name || Math.random().toString(36).slice(2);
}

function registerInjectedProvider(detail) {
  const key = walletEntryKey(detail);
  if (!state.injectedProviders.has(key)) {
    state.injectedProviders.set(key, detail);
  }
  renderWalletOptions();
}

function discoverInjectedProviders() {
  window.addEventListener("eip6963:announceProvider", (event) => {
    registerInjectedProvider(event.detail);
  });
  window.dispatchEvent(new Event("eip6963:requestProvider"));

  if (window.ethereum) {
    const providers = window.ethereum.providers || [window.ethereum];
    providers.forEach((provider) => {
      registerInjectedProvider({
        info: {
          name: provider.isRabby ? "Rabby" : provider.isMetaMask ? "MetaMask" : "Injected wallet",
          rdns: provider.isRabby ? "io.rabby" : provider.isMetaMask ? "io.metamask" : "injected"
        },
        provider
      });
    });
  }
}

function openWalletModal() {
  els.walletModal.hidden = false;
}

function closeWalletModal() {
  els.walletModal.hidden = true;
}

function renderWalletOptions() {
  els.walletModalList.innerHTML = "";
  const entries = Array.from(state.injectedProviders.values());
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "wallet-option";
    empty.innerHTML = `<span class="wallet-option-copy"><strong>No injected wallet found</strong><small>Install MetaMask or Rabby to connect directly.</small></span>`;
    els.walletModalList.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wallet-option";
    const label = entry.info?.name || "Injected wallet";
    const mark = label.slice(0, 2).toUpperCase();
    button.innerHTML = `
      <span class="wallet-option-mark">${mark}</span>
      <span class="wallet-option-copy">
        <strong>${label}</strong>
        <small>${shortAddress(entry.provider?.selectedAddress || "") || "Browser wallet connection"}</small>
      </span>
    `;
    button.addEventListener("click", () => connectInjectedWallet(entry));
    els.walletModalList.appendChild(button);
  });
}

async function ensureEtherlink(rawProvider) {
  try {
    await rawProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_HEX }]
    });
  } catch (error) {
    if (error?.code !== 4902) throw error;
    await rawProvider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: CHAIN_HEX,
          chainName: state.config.network.name,
          nativeCurrency: {
            name: "Tezos",
            symbol: state.config.network.currencySymbol,
            decimals: 18
          },
          rpcUrls: [state.config.network.rpcUrl],
          blockExplorerUrls: [state.config.network.explorerUrl]
        }
      ]
    });
  }
}

async function connectInjectedWallet(entry) {
  try {
    const rawProvider = entry.provider;
    await rawProvider.request({ method: "eth_requestAccounts" });
    await ensureEtherlink(rawProvider);
    const browserProvider = new ethers.BrowserProvider(rawProvider);
    const signer = await browserProvider.getSigner();
    const account = await signer.getAddress();

    state.rawProvider = rawProvider;
    state.walletProvider = browserProvider;
    state.signer = signer;
    state.account = account;
    closeWalletModal();
    renderWalletState();
    setStatus(t("connectedStatus"));
  } catch (error) {
    setStatus(error.message || "Wallet connection failed.", "error");
  }
}

async function connectWalletConnect() {
  try {
    const module = await import("https://esm.sh/@walletconnect/ethereum-provider@2.17.2");
    const EthereumProvider = module.default;
    const provider = await EthereumProvider.init({
      projectId: REOWN_PROJECT_ID,
      chains: [CHAIN_ID],
      optionalChains: [CHAIN_ID],
      showQrModal: true,
      methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData_v4"],
      rpcMap: {
        [CHAIN_ID]: state.config.network.rpcUrl
      }
    });
    await provider.connect();
    const browserProvider = new ethers.BrowserProvider(provider);
    const signer = await browserProvider.getSigner();
    const account = await signer.getAddress();

    state.walletconnectProvider = provider;
    state.rawProvider = provider;
    state.walletProvider = browserProvider;
    state.signer = signer;
    state.account = account;
    closeWalletModal();
    renderWalletState();
    setStatus(t("connectedStatus"));
  } catch (error) {
    setStatus(error.message || "WalletConnect failed.", "error");
  }
}

async function disconnectWallet() {
  if (state.walletconnectProvider) {
    try {
      await state.walletconnectProvider.disconnect();
    } catch (_error) {
      // ignore close issues on demo disconnect
    }
  }
  state.walletconnectProvider = null;
  state.walletProvider = null;
  state.rawProvider = null;
  state.signer = null;
  state.account = null;
  renderWalletState();
  setStatus(t("walletNotConnected"));
}

function renderWalletState() {
  const connected = Boolean(state.account);
  els.walletBadge.hidden = !connected;
  els.walletBadge.textContent = connected ? shortAddress(state.account) : "";
  els.connectBtn.hidden = connected;
  els.disconnectBtn.hidden = !connected;
  updateActionState();
}

function serializeSettlement(settlement) {
  if (!settlement) return null;
  return {
    reportId: settlement.reportId?.toString?.() || String(settlement.reportId),
    requester: settlement.requester,
    operator: settlement.operator,
    amount: settlement.amount?.toString?.() || String(settlement.amount),
    fundedAt: settlement.fundedAt?.toString?.() || String(settlement.fundedAt),
    resolveAfter: settlement.resolveAfter?.toString?.() || String(settlement.resolveAfter),
    status: Number(settlement.status),
    disputeReasonURI: settlement.disputeReasonURI
  };
}

async function anchorVerdict() {
  if (!state.currentReport) {
    setStatus(t("nextStepHint"), "error");
    return;
  }
  if (!state.signer) {
    openWalletModal();
    return;
  }

  try {
    setStatus(t("anchoringStatus"));
    const { registry } = currentContracts(state.signer);
    const operator = state.config.deployment?.operator || state.account;
    const payload = await fetchJson("/api/anchor-payload", {
      report: state.currentReport,
      requester_address: state.account,
      operator_address: operator
    });
    const nextId = await registry.nextReportId();
    const args = payload.registry_payload;
    const tx = await registry.registerReport(
      operator,
      args.mode_enum,
      args.recommendation_enum,
      args.confidence_bps,
      args.verdict_hash,
      args.report_hash,
      args.content_uri || els.contentUriInput.value,
      args.title || els.titleInput.value
    );
    state.currentTxHash = tx.hash;
    setExplorerTx(tx.hash);
    await tx.wait();
    state.currentReportId = Number(nextId);
    els.reportIdInput.value = String(state.currentReportId);
    renderSettlementState();
    await refreshOnchainState();
    setStatus(t("reportAnchored"));
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Anchor failed.", "error");
  }
}

async function fundSettlement() {
  const reportId = Number(els.reportIdInput.value || state.currentReportId || 0);
  if (!reportId) {
    setStatus("Anchor a report first.", "error");
    return;
  }
  if (!state.signer) {
    openWalletModal();
    return;
  }

  try {
    setStatus(t("fundingStatus"));
    const { escrow } = currentContracts(state.signer);
    const amount = ethers.parseEther(els.rewardInput.value || "0.03");
    const timeout = BigInt(els.timeoutSelect.value || "900");
    const tx = await escrow.fundSettlement(reportId, timeout, { value: amount });
    state.currentTxHash = tx.hash;
    setExplorerTx(tx.hash);
    await tx.wait();
    await refreshOnchainState(reportId);
    setStatus(t("settlementFunded"));
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Funding failed.", "error");
  }
}

async function acceptSettlement() {
  const reportId = Number(els.reportIdInput.value || state.currentReportId || 0);
  if (!reportId) return;
  if (!state.signer) {
    openWalletModal();
    return;
  }

  try {
    setStatus(t("acceptingStatus"));
    const { escrow } = currentContracts(state.signer);
    const tx = await escrow.acceptSettlement(reportId);
    state.currentTxHash = tx.hash;
    setExplorerTx(tx.hash);
    await tx.wait();
    await refreshOnchainState(reportId);
    setStatus(t("settlementAccepted"));
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Accept failed.", "error");
  }
}

async function disputeSettlement() {
  const reportId = Number(els.reportIdInput.value || state.currentReportId || 0);
  if (!reportId) return;
  if (!state.signer) {
    openWalletModal();
    return;
  }

  try {
    setStatus(t("disputingStatus"));
    const { escrow } = currentContracts(state.signer);
    const reason = els.disputeReasonInput.value.trim() || "ipfs://agentbond-lite/disputes/default";
    const tx = await escrow.disputeSettlement(reportId, reason);
    state.currentTxHash = tx.hash;
    setExplorerTx(tx.hash);
    await tx.wait();
    await refreshOnchainState(reportId);
    setStatus(t("settlementDisputed"));
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Dispute failed.", "error");
  }
}

async function refreshOnchainState(reportIdParam) {
  const reportId = Number(reportIdParam || els.reportIdInput.value || state.currentReportId || 0);
  if (!reportId) {
    renderTaskState();
    return;
  }

  try {
    setStatus(t("refreshingStatus"));
    const provider = state.signer || state.readProvider;
    const { registry, escrow } = currentContracts(provider);
    const report = await registry.getReport(reportId);
    let settlement = null;
    try {
      settlement = await escrow.getSettlement(reportId);
    } catch (_error) {
      settlement = null;
    }

    state.currentReportId = reportId;
    state.onchainReport = {
      reportId: report.reportId?.toString?.() || String(report.reportId),
      requester: report.requester,
      operator: report.operator,
      mode: Number(report.mode),
      recommendation: Number(report.recommendation),
      confidenceBps: report.confidenceBps?.toString?.() || String(report.confidenceBps),
      createdAt: report.createdAt?.toString?.() || String(report.createdAt),
      verdictHash: report.verdictHash,
      reportHash: report.reportHash,
      contentURI: report.contentURI,
      title: report.title
    };
    state.settlement = settlement ? serializeSettlement(settlement) : null;
    if (!state.currentReport && report) {
      els.titleInput.value = report.title;
      els.contentUriInput.value = report.contentURI;
    }

    renderTaskState({
      onchainReport: state.onchainReport
    });
    renderSettlementState();
    setStatus(t("readyState"));
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Refresh failed.", "error");
  }
}

async function switchNetwork() {
  if (!state.rawProvider) {
    openWalletModal();
    return;
  }
  try {
    await ensureEtherlink(state.rawProvider);
    setStatus(t("connectedStatus"));
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Network switch failed.", "error");
  }
}

function resetDemo() {
  state.currentReport = null;
  state.onchainReport = null;
  state.currentReportId = null;
  state.settlement = null;
  state.currentTxHash = null;
  els.resultPanel.hidden = true;
  els.reportOutput.textContent = "";
  els.resultFindingsList.innerHTML = "";
  els.reportIdInput.value = "";
  els.contentUriInput.value = "ipfs://agentbond-lite/report-1";
  els.disputeReasonInput.value = "ipfs://agentbond-lite/disputes/reason-1";
  setExplorerTx(null);
  renderTaskState();
  renderSettlementState();
  applyTemplate(state.modeKey, { resetPrompt: true });
  setStatus(state.account ? t("connectedStatus") : t("walletNotConnected"));
}

function attachEvents() {
  els.languageSelect.addEventListener("change", (event) => {
    state.lang = event.target.value;
    localStorage.setItem(APP_LANG_KEY, state.lang);
    applyI18n();
    applyTemplate(state.modeKey, { resetPrompt: true });
  });

  document.querySelectorAll(".mode-chip").forEach((node) => {
    node.addEventListener("click", () => applyTemplate(node.dataset.template, { resetPrompt: true }));
  });

  els.connectBtn.addEventListener("click", openWalletModal);
  els.disconnectBtn.addEventListener("click", disconnectWallet);
  els.walletModalBackdrop.addEventListener("click", closeWalletModal);
  els.walletModalClose.addEventListener("click", closeWalletModal);
  els.walletConnectQrButton.addEventListener("click", connectWalletConnect);

  els.generateReportBtn.addEventListener("click", generateReport);
  els.loadDemoBtn.addEventListener("click", resetDemo);
  els.anchorReportBtn.addEventListener("click", anchorVerdict);
  els.anchorReportBtnSecondary.addEventListener("click", anchorVerdict);
  els.fundSettlementBtn.addEventListener("click", fundSettlement);
  els.fundSettlementBtnSecondary.addEventListener("click", fundSettlement);
  els.acceptSettlementBtn.addEventListener("click", acceptSettlement);
  els.acceptSettlementBtnSecondary.addEventListener("click", acceptSettlement);
  els.disputeSettlementBtn.addEventListener("click", disputeSettlement);
  els.disputeSettlementBtnSecondary.addEventListener("click", disputeSettlement);
  els.refreshSettlementBtn.addEventListener("click", () => refreshOnchainState());
  els.refreshBtn.addEventListener("click", () => refreshOnchainState());
  els.switchBtn.addEventListener("click", switchNetwork);
}

async function init() {
  bindElements();
  els.languageSelect.value = state.lang;
  applyI18n();
  applyTemplate(state.modeKey, { resetPrompt: true });
  renderTaskState();
  renderSettlementState();
  attachEvents();
  await loadConfig();
  discoverInjectedProviders();
  setStatus(t("walletNotConnected"));
  updateActionState();
}

init().catch((error) => {
  console.error(error);
  setStatus(error.message || "Initialization failed.", "error");
});
