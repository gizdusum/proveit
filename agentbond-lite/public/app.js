import EthereumProvider from "https://esm.sh/@walletconnect/ethereum-provider@2.21.1";

const { ethers } = window;

const REOWN_PROJECT_ID = "2c7675603bcfd9904aa52c32e6ce9a34";

const state = {
  provider: null,
  signer: null,
  account: null,
  contract: null,
  config: null,
  abi: null,
  selectedTemplate: "governance",
  language: "en",
  currentProviderType: null,
  walletConnectProvider: null,
  discoveredWallets: new Map(),
  countdownInterval: null,
  countdownEndAt: 0,
  lastReport: ""
};

const TASK_PRESETS = {
  governance: {
    en: {
      request: "Summarize this governance proposal, surface treasury risk, and finish with a clear go / revise / avoid recommendation.",
      title: "Produce governance intelligence for a new Etherlink launch",
      focus: "proposal intent, treasury controls, upgrade risk, execution recommendation",
      brief:
        "Read the governance proposal, identify treasury and upgrade risks, summarize the tradeoffs, and end with a clear execution recommendation."
    },
    tr: {
      request: "Bu yönetişim teklifini özetle, treasury riskini çıkar ve net bir devam et / revize et / kaçın tavsiyesi ver.",
      title: "Yeni bir Etherlink lansmanı için yönetişim istihbaratı üret",
      focus: "teklif amacı, treasury kontrolleri, upgrade riski, uygulama tavsiyesi",
      brief:
        "Yönetişim teklifini oku, treasury ve upgrade risklerini tespit et, ödünleşimleri özetle ve net bir uygulama tavsiyesiyle bitir."
    }
  },
  token: {
    en: {
      request: "Create a market signals brief for MON token using token risk, narrative momentum, event expectations, and crowd conviction.",
      title: "Produce a market signals brief for MON token",
      focus: "token utility, narrative momentum, event expectations, liquidity risk, crowd conviction",
      brief:
        "Analyze the token structure, supply schedule, admin permissions, launch mechanics, market narrative, and crowd expectations. Highlight where crowd conviction diverges from fundamentals."
    },
    tr: {
      request: "MON token için token riski, anlatı momentumu, olay beklentileri ve kalabalık inancını kullanan bir piyasa sinyalleri özeti hazırla.",
      title: "MON token için piyasa sinyalleri özeti üret",
      focus: "token faydası, anlatı momentumu, olay beklentileri, likidite riski, kalabalık inancı",
      brief:
        "Token yapısını, arz takvimini, yönetici izinlerini, lansman mekaniklerini, piyasa anlatısını ve kalabalık beklentilerini analiz et. Kalabalık inancının temellerden nerede ayrıştığını özellikle vurgula."
    }
  },
  identity: {
    en: {
      request: "Audit suspicious wallet or collection activity and map reputation-sensitive behavior, wash activity, and suspicious clusters.",
      title: "Map identity risk in an NFT collection",
      focus: "wash trading, wallet clustering, suspicious volume, reputation risk",
      brief:
        "Inspect collection or wallet activity, identify clusters that may indicate wash trading, and summarize whether the behavior appears organic, coordinated, or reputation-sensitive."
    },
    tr: {
      request: "Şüpheli cüzdan veya koleksiyon hareketlerini denetle; itibar hassas davranışları, wash activity izlerini ve şüpheli kümeleri haritala.",
      title: "Bir NFT koleksiyonunda kimlik riskini haritala",
      focus: "wash trading, cüzdan kümelenmesi, şüpheli hacim, itibar riski",
      brief:
        "Koleksiyon veya cüzdan aktivitesini incele, wash trading işareti verebilecek kümeleri tespit et ve davranışın organik mi, koordineli mi yoksa itibara hassas mı göründüğünü özetle."
    }
  }
};

const dictionary = {
  en: {
    brandName: "AgentBond Lite",
    brandTagline: "Etherlink AI Research Rail",
    languageLabel: "Language",
    hackathonLink: "Hackathon",
    connectWallet: "Connect wallet",
    disconnectWallet: "Disconnect",
    heroEyebrow: "Lite release // Etherlink deployed",
    heroTitle: "Ask one question. Get one clear report.",
    heroText:
      "AgentBond Lite turns a single prompt into one accountable AI report, then lets you settle that result on Etherlink.",
    requestLabel: "What do you want the agent to research?",
    requestPlaceholder:
      "Example: Create a market signals brief for MON token using token risk, sentiment, and crowd conviction.",
    generateReport: "Generate report",
    resetDemo: "Reset demo",
    viewExplorer: "View explorer",
    etaLabel: "Estimated time",
    statusLabel: "Status",
    network: "Network",
    readyState: "Ready",
    generatingState: "Generating",
    countdownTitle: "Report countdown",
    countdownGenerating: "Generating your report...",
    countdownSubline: "The result will appear automatically when it is ready.",
    walletNotConnected: "Wallet not connected.",
    advancedOptions: "Advanced options",
    deliveryWindow: "Delivery window",
    reviewMode: "Review mode",
    reward: "Reward (XTZ)",
    agentStake: "Agent stake (XTZ)",
    resultCardTitle: "Current result",
    summaryLabel: "Summary",
    keyFindingsLabel: "Key findings",
    recommendationLabel: "Recommendation",
    fullReportLabel: "Full report",
    nextStepHint: "After the report is ready, you can optionally send the hash onchain.",
    onchainPanelTitle: "Onchain settlement",
    onchainSubtitle: "Turn the report into a task, lock stake, submit the hash, then accept or reject the result.",
    taskTitle: "Task title",
    focus: "Focus",
    taskBrief: "Task brief",
    taskId: "Task ID",
    submissionUri: "Submission URI",
    switchEtherlink: "Switch to Etherlink",
    createTask: "Create task",
    stakeClaim: "Stake + claim",
    submitHash: "Submit hash",
    accept: "Accept",
    reject: "Reject",
    refresh: "Refresh",
    comingSoon: "Coming soon",
    fullAgentBondDesc:
      "Lite is the first release. Full AgentBond expands the same primitive into a real AI labor market with applications, dispute windows, richer reputation, and multi-agent competition.",
    walletModalEyebrow: "Wallet access",
    walletModalTitle: "Choose a wallet",
    walletConnectTitle: "WalletConnect",
    walletConnectDesc: "Scan a QR code or use a mobile wallet.",
    noInjected: "No injected wallet found",
    noInjectedDesc: "Install MetaMask or Rabby, or use WalletConnect below.",
    injectedConnectDesc: "Connect with the installed wallet",
    governanceTitle: "Governance intelligence",
    marketTitle: "Token + crowd read",
    identityTitle: "Identity graph",
    noTaskLoaded: "No task loaded yet.",
    resultAwaiting: "Awaiting report",
    connectedWallet: "Connected {address} on Etherlink.",
    walletDisconnected: "Wallet disconnected.",
    contractLive: "Contract live at {address}. Connect a wallet if you want to settle the report onchain.",
    loadedTemplate: "{mode} mode loaded.",
    noWallet: "No injected wallet found. Install MetaMask, Rabby, or use WalletConnect.",
    noWalletSwitch: "No wallet available for network switching.",
    connectFirst: "Connect a wallet first.",
    generateFirst: "Generate a report first.",
    configFailed: "Failed to load app config.",
    reportReady: "Report ready.",
    reportReadyNow: "Ready now",
    deliveryFast: "Fast // 15 min",
    deliveryNormal: "Normal // 1 hour",
    deliveryDeep: "Deep // 1 day",
    reviewOwner: "Owner acceptance",
    reviewOwnerPlus: "Owner + notes",
    reviewChallenge: "Challenge ready",
    creatingTask: "Creating task... {hash}",
    taskCreated: "Task {id} created in block {block}.",
    claimingTask: "Claiming task {id}... {hash}",
    taskClaimed: "Task {id} claimed with bonded stake.",
    submittingHash: "Submitting report hash... {hash}",
    taskSubmitted: "Task {id} submitted. Hash anchored onchain.",
    acceptingTask: "Accepting task {id}... {hash}",
    taskAccepted: "Task {id} accepted. Reward released and stake returned.",
    rejectingTask: "Rejecting task {id}... {hash}",
    taskRejected: "Task {id} rejected. Reward refunded and stake slashed."
  },
  tr: {
    brandName: "AgentBond Lite",
    brandTagline: "Etherlink yapay zekâ araştırma hattı",
    languageLabel: "Dil",
    hackathonLink: "Hackathon",
    connectWallet: "Cüzdan bağla",
    disconnectWallet: "Bağlantıyı kes",
    heroEyebrow: "Lite sürüm // Etherlink üzerinde canlı",
    heroTitle: "Tek bir soru sor. Tek bir net rapor al.",
    heroText:
      "AgentBond Lite tek bir prompt'u hesap verebilir bir yapay zekâ raporuna dönüştürür, ardından istersen bu sonucu Etherlink üzerinde settlement akışına sokar.",
    requestLabel: "Ajanın neyi araştırmasını istiyorsun?",
    requestPlaceholder:
      "Örnek: MON token için token riski, duygu ve kalabalık inancını kullanan bir piyasa sinyalleri özeti hazırla.",
    generateReport: "Rapor üret",
    resetDemo: "Demoyu sıfırla",
    viewExplorer: "Explorer’ı aç",
    etaLabel: "Tahmini süre",
    statusLabel: "Durum",
    network: "Ağ",
    readyState: "Hazır",
    generatingState: "Üretiliyor",
    countdownTitle: "Rapor geri sayımı",
    countdownGenerating: "Raporun hazırlanıyor...",
    countdownSubline: "Hazır olduğunda sonuç otomatik olarak aşağıda görünecek.",
    walletNotConnected: "Cüzdan bağlı değil.",
    advancedOptions: "Gelişmiş seçenekler",
    deliveryWindow: "Teslim süresi",
    reviewMode: "İnceleme modu",
    reward: "Ödül (XTZ)",
    agentStake: "Ajan stake’i (XTZ)",
    resultCardTitle: "Güncel sonuç",
    summaryLabel: "Özet",
    keyFindingsLabel: "Temel bulgular",
    recommendationLabel: "Öneri",
    fullReportLabel: "Tam rapor",
    nextStepHint: "Rapor hazır olduğunda istersen hash’i zincire gönderebilirsin.",
    onchainPanelTitle: "Onchain settlement",
    onchainSubtitle: "Raporu göreve dönüştür, stake’i kilitle, hash’i gönder ve sonucu kabul et ya da reddet.",
    taskTitle: "Görev başlığı",
    focus: "Odak",
    taskBrief: "Görev özeti",
    taskId: "Görev ID",
    submissionUri: "Teslim URI’si",
    switchEtherlink: "Etherlink’e geç",
    createTask: "Görev oluştur",
    stakeClaim: "Stake + claim",
    submitHash: "Hash gönder",
    accept: "Kabul et",
    reject: "Reddet",
    refresh: "Yenile",
    comingSoon: "Çok yakında",
    fullAgentBondDesc:
      "Lite ilk sürüm. Full AgentBond aynı primitive’i gerçek bir yapay zekâ iş gücü pazarına taşıyacak; başvurular, itiraz penceresi, daha güçlü itibar ve çoklu ajan rekabeti eklenecek.",
    walletModalEyebrow: "Cüzdan erişimi",
    walletModalTitle: "Bir cüzdan seç",
    walletConnectTitle: "WalletConnect",
    walletConnectDesc: "QR kod okut veya mobil cüzdan ile bağlan.",
    noInjected: "Kurulu cüzdan bulunamadı",
    noInjectedDesc: "MetaMask veya Rabby kurabilir ya da aşağıdan WalletConnect kullanabilirsin.",
    injectedConnectDesc: "Kurulu cüzdan ile bağlan",
    governanceTitle: "Yönetişim istihbaratı",
    marketTitle: "Token + kalabalık okuması",
    identityTitle: "Kimlik grafiği",
    noTaskLoaded: "Henüz görev yüklenmedi.",
    resultAwaiting: "Rapor bekleniyor",
    connectedWallet: "{address} adresi Etherlink üzerinde bağlandı.",
    walletDisconnected: "Cüzdan bağlantısı kesildi.",
    contractLive: "Kontrat {address} adresinde canlı. İstersen raporu onchain settlement akışına sokmak için cüzdan bağlayabilirsin.",
    loadedTemplate: "{mode} modu yüklendi.",
    noWallet: "Kurulu cüzdan bulunamadı. MetaMask, Rabby ya da WalletConnect kullan.",
    noWalletSwitch: "Ağ değişimi için kullanılabilir bir cüzdan bulunamadı.",
    connectFirst: "Önce bir cüzdan bağla.",
    generateFirst: "Önce bir rapor üret.",
    configFailed: "Uygulama ayarları yüklenemedi.",
    reportReady: "Rapor hazır.",
    reportReadyNow: "Şimdi hazır",
    deliveryFast: "Hızlı // 15 dk",
    deliveryNormal: "Normal // 1 saat",
    deliveryDeep: "Derin // 1 gün",
    reviewOwner: "Sahip onayı",
    reviewOwnerPlus: "Sahip + notlar",
    reviewChallenge: "İtiraza hazır",
    creatingTask: "Görev oluşturuluyor... {hash}",
    taskCreated: "Görev {id}, {block}. blokta oluşturuldu.",
    claimingTask: "Görev {id} alınıyor... {hash}",
    taskClaimed: "Görev {id} teminatlı stake ile alındı.",
    submittingHash: "Rapor hash’i gönderiliyor... {hash}",
    taskSubmitted: "Görev {id} gönderildi. Hash zincire sabitlendi.",
    acceptingTask: "Görev {id} kabul ediliyor... {hash}",
    taskAccepted: "Görev {id} kabul edildi. Ödül açıldı ve stake iade edildi.",
    rejectingTask: "Görev {id} reddediliyor... {hash}",
    taskRejected: "Görev {id} reddedildi. Ödül iade edildi ve stake kesildi."
  }
};

const els = {
  languageSelect: document.getElementById("languageSelect"),
  connectBtn: document.getElementById("connectBtn"),
  disconnectBtn: document.getElementById("disconnectBtn"),
  walletBadge: document.getElementById("walletBadge"),
  explorerLink: document.getElementById("explorerLink"),
  walletStatus: document.getElementById("walletStatus"),
  networkLabel: document.getElementById("networkLabel"),
  requestInput: document.getElementById("requestInput"),
  generateReportBtn: document.getElementById("generateReportBtn"),
  loadDemoBtn: document.getElementById("loadDemoBtn"),
  deliveryWindowSelect: document.getElementById("deliveryWindowSelect"),
  reviewModeSelect: document.getElementById("reviewModeSelect"),
  rewardInput: document.getElementById("rewardInput"),
  stakeInput: document.getElementById("stakeInput"),
  liveStatusValue: document.getElementById("liveStatusValue"),
  etaValue: document.getElementById("etaValue"),
  countdownCard: document.getElementById("countdownCard"),
  countdownHeadline: document.getElementById("countdownHeadline"),
  countdownSubline: document.getElementById("countdownSubline"),
  countdownTimer: document.getElementById("countdownTimer"),
  resultPanel: document.getElementById("resultPanel"),
  resultModeLabel: document.getElementById("resultModeLabel"),
  resultLanguageLabel: document.getElementById("resultLanguageLabel"),
  resultSettlementLabel: document.getElementById("resultSettlementLabel"),
  resultSummary: document.getElementById("resultSummary"),
  resultNextStepHint: document.getElementById("resultNextStepHint"),
  resultFindingsList: document.getElementById("resultFindingsList"),
  resultRecommendation: document.getElementById("resultRecommendation"),
  reportOutput: document.getElementById("reportOutput"),
  modeChips: Array.from(document.querySelectorAll("[data-template]")),
  switchBtn: document.getElementById("switchBtn"),
  titleInput: document.getElementById("titleInput"),
  focusInput: document.getElementById("focusInput"),
  briefInput: document.getElementById("briefInput"),
  taskIdInput: document.getElementById("taskIdInput"),
  submissionUriInput: document.getElementById("submissionUriInput"),
  createTaskBtn: document.getElementById("createTaskBtn"),
  claimTaskBtn: document.getElementById("claimTaskBtn"),
  submitTaskBtn: document.getElementById("submitTaskBtn"),
  acceptTaskBtn: document.getElementById("acceptTaskBtn"),
  rejectTaskBtn: document.getElementById("rejectTaskBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  taskState: document.getElementById("taskState"),
  walletModal: document.getElementById("walletModal"),
  walletModalBackdrop: document.getElementById("walletModalBackdrop"),
  walletModalClose: document.getElementById("walletModalClose"),
  walletModalList: document.getElementById("walletModalList"),
  walletConnectQrButton: document.getElementById("walletConnectQrButton")
};

const STATUS_LABELS = ["Open", "Claimed", "Submitted", "Accepted", "Rejected", "Cancelled"];

function t(key, vars = {}) {
  const lang = dictionary[state.language] ? state.language : "en";
  const base = dictionary[lang][key] || dictionary.en[key] || key;
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), base);
}

function presetCopy(templateName, language = state.language) {
  const preset = TASK_PRESETS[templateName];
  if (!preset) return null;
  return preset[language] || preset.en;
}

function shorten(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "-";
}

function setStatus(message) {
  els.walletStatus.textContent = message;
}

function normalizeWalletName(name = "Wallet") {
  return name.replace(/\s+extension$/i, "").trim();
}

function walletMarkContent(wallet) {
  if (wallet?.icon) {
    return `<img src="${wallet.icon}" alt="${wallet.name} icon" />`;
  }
  return normalizeWalletName(wallet?.name || "Wallet").slice(0, 2).toUpperCase();
}

function setWalletUiConnected() {
  els.walletBadge.hidden = false;
  els.walletBadge.textContent = shorten(state.account);
  els.connectBtn.hidden = true;
  els.disconnectBtn.hidden = false;
}

function setWalletUiDisconnected() {
  els.walletBadge.hidden = true;
  els.connectBtn.hidden = false;
  els.connectBtn.textContent = t("connectWallet");
  els.disconnectBtn.hidden = true;
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  els.deliveryWindowSelect.options[0].textContent = t("deliveryFast");
  els.deliveryWindowSelect.options[1].textContent = t("deliveryNormal");
  els.deliveryWindowSelect.options[2].textContent = t("deliveryDeep");
  els.reviewModeSelect.options[0].textContent = t("reviewOwner");
  els.reviewModeSelect.options[1].textContent = t("reviewOwnerPlus");
  els.reviewModeSelect.options[2].textContent = t("reviewChallenge");
  els.liveStatusValue.textContent = state.lastReport ? t("reportReadyNow") : t("readyState");
  updateEtaPreview();
  applyTemplate(state.selectedTemplate, false);
  if (!state.account) setWalletUiDisconnected();
}

function estimateSeconds() {
  const byWindow = {
    fast: 18,
    normal: 42,
    deep: 75
  };
  const byMode = {
    governance: 0,
    token: 6,
    identity: 10
  };
  return (byWindow[els.deliveryWindowSelect.value] || 42) + (byMode[state.selectedTemplate] || 0);
}

function formatCountdown(seconds) {
  const clamped = Math.max(0, seconds);
  const minutes = String(Math.floor(clamped / 60)).padStart(2, "0");
  const remainder = String(clamped % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function updateEtaPreview() {
  if (state.countdownInterval) return;
  els.etaValue.textContent = formatCountdown(estimateSeconds());
}

function startCountdown() {
  stopCountdown();
  const seconds = estimateSeconds();
  state.countdownEndAt = Date.now() + seconds * 1000;
  els.countdownCard.hidden = false;
  els.countdownHeadline.textContent = t("countdownGenerating");
  els.countdownSubline.textContent = t("countdownSubline");
  els.liveStatusValue.textContent = t("generatingState");
  els.resultSettlementLabel.textContent = t("generatingState");
  const tick = () => {
    const remaining = Math.max(0, Math.ceil((state.countdownEndAt - Date.now()) / 1000));
    const text = formatCountdown(remaining);
    els.countdownTimer.textContent = text;
    els.etaValue.textContent = text;
    if (remaining <= 0) {
      stopCountdown(false);
    }
  };
  tick();
  state.countdownInterval = window.setInterval(tick, 1000);
}

function stopCountdown(markReady = true) {
  if (state.countdownInterval) {
    window.clearInterval(state.countdownInterval);
    state.countdownInterval = null;
  }
  if (markReady) {
    els.countdownCard.hidden = true;
    els.etaValue.textContent = t("reportReadyNow");
    els.liveStatusValue.textContent = state.lastReport ? t("reportReadyNow") : t("readyState");
  } else {
    els.countdownTimer.textContent = "00:00";
  }
}

function extractSections(markdown) {
  const lines = markdown.split("\n");
  const findings = [];
  let summary = "";
  let recommendation = "";
  let currentSection = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      currentSection = line.replace(/^##\s+/, "").toLowerCase();
      continue;
    }
    if (line.startsWith("# ")) {
      continue;
    }
    if (!summary && !line.startsWith("-") && !line.startsWith("*")) {
      summary = line;
    }
    if (line.startsWith("-") || line.startsWith("*")) {
      findings.push(line.replace(/^[-*]\s*/, ""));
      continue;
    }
    if (currentSection.includes("recommendation") || currentSection.includes("öneri")) {
      recommendation = recommendation ? `${recommendation} ${line}` : line;
    }
  }

  return {
    summary,
    findings,
    recommendation
  };
}

function renderReport(markdown) {
  state.lastReport = markdown;
  const sections = extractSections(markdown);
  const modeLabel =
    state.selectedTemplate === "token"
      ? t("marketTitle")
      : state.selectedTemplate === "identity"
        ? t("identityTitle")
        : t("governanceTitle");

  els.resultPanel.hidden = false;
  els.resultModeLabel.textContent = modeLabel;
  els.resultLanguageLabel.textContent =
    els.languageSelect.options[els.languageSelect.selectedIndex]?.textContent || "English";
  els.resultSettlementLabel.textContent = t("reportReadyNow");
  els.resultSummary.textContent = sections.summary || t("reportReady");
  els.resultNextStepHint.textContent = t("nextStepHint");
  els.resultRecommendation.textContent = sections.recommendation || sections.summary || "";
  els.resultFindingsList.innerHTML = "";
  (sections.findings.length ? sections.findings : [sections.summary || t("reportReady")]).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    els.resultFindingsList.appendChild(li);
  });
  els.reportOutput.textContent = markdown;
  stopCountdown(true);
  setStatus(t("reportReady"));
}

function syncTaskFields() {
  const prompt = els.requestInput.value.trim();
  const preset = presetCopy(state.selectedTemplate);
  els.titleInput.value = prompt.slice(0, 90) || preset.title;
  els.focusInput.value = preset.focus;
  els.briefInput.value = prompt || preset.brief;
}

function applyTemplate(templateName, updatePrompt = true) {
  state.selectedTemplate = templateName;
  const preset = presetCopy(templateName);
  els.modeChips.forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.template === templateName);
  });
  if (updatePrompt || !els.requestInput.value.trim()) {
    els.requestInput.value = preset.request;
  }
  syncTaskFields();
  updateEtaPreview();
  setStatus(t("loadedTemplate", { mode: titleForTemplate(templateName) }));
}

function titleForTemplate(templateName) {
  return templateName === "token" ? t("marketTitle") : templateName === "identity" ? t("identityTitle") : t("governanceTitle");
}

function isSupportedWallet(detail) {
  const provider = detail?.provider;
  if (!provider || typeof provider.request !== "function") return false;
  if (provider.isMetaMask || provider.isRabby || provider.isCoinbaseWallet || provider.isTrust) return true;
  const name = normalizeWalletName(detail?.info?.name || "");
  return ["MetaMask", "Rabby", "Coinbase Wallet", "Trust Wallet", "Brave Wallet", "Rainbow"].includes(name);
}

function rememberInjectedWallet(detail) {
  if (!detail?.info?.uuid || !detail?.provider) return;
  state.discoveredWallets.set(detail.info.uuid, detail);
}

function renderWalletOptions() {
  const wallets = Array.from(state.discoveredWallets.values())
    .filter(isSupportedWallet)
    .sort((a, b) => normalizeWalletName(a.info.name).localeCompare(normalizeWalletName(b.info.name)));

  if (!wallets.length) {
    els.walletModalList.innerHTML = `
      <div class="wallet-option">
        <span class="wallet-option-mark">--</span>
        <span class="wallet-option-copy">
          <strong>${t("noInjected")}</strong>
          <small>${t("noInjectedDesc")}</small>
        </span>
      </div>
    `;
    return;
  }

  els.walletModalList.innerHTML = wallets
    .map(
      (wallet) => `
      <button class="wallet-option" type="button" data-wallet-id="${wallet.info.uuid}">
        <span class="wallet-option-mark">${walletMarkContent({ icon: wallet.info.icon, name: wallet.info.name })}</span>
        <span class="wallet-option-copy">
          <strong>${normalizeWalletName(wallet.info.name)}</strong>
          <small>${t("injectedConnectDesc")}</small>
        </span>
      </button>
    `
    )
    .join("");
}

function discoverInjectedWallets() {
  window.addEventListener("eip6963:announceProvider", (event) => {
    rememberInjectedWallet(event.detail);
    renderWalletOptions();
  });

  window.dispatchEvent(new Event("eip6963:requestProvider"));

  if (window.ethereum && state.discoveredWallets.size === 0) {
    const providers = Array.isArray(window.ethereum.providers) && window.ethereum.providers.length
      ? window.ethereum.providers
      : [window.ethereum];
    providers.forEach((provider, index) => {
      rememberInjectedWallet({
        info: {
          uuid: `fallback-${index}`,
          name: provider.isRabby ? "Rabby" : provider.isMetaMask ? "MetaMask" : "Browser Wallet",
          icon: ""
        },
        provider
      });
    });
  }

  renderWalletOptions();
}

function openWalletModal() {
  renderWalletOptions();
  els.walletModal.hidden = false;
}

function closeWalletModal() {
  els.walletModal.hidden = true;
}

async function getWalletConnectProvider() {
  if (state.walletConnectProvider) return state.walletConnectProvider;
  state.walletConnectProvider = await EthereumProvider.init({
    projectId: REOWN_PROJECT_ID,
    chains: [127823],
    optionalChains: [127823],
    showQrModal: true,
    methods: [
      "eth_requestAccounts",
      "eth_accounts",
      "personal_sign",
      "wallet_switchEthereumChain",
      "wallet_addEthereumChain",
      "eth_chainId"
    ],
    events: ["accountsChanged", "chainChanged", "disconnect"],
    metadata: {
      name: "AgentBond Lite",
      description: "Etherlink AI research rail",
      url: "https://agentbond-lite.vercel.app",
      icons: ["https://agentbond-lite.vercel.app/agentbond-mark.svg"]
    }
  });
  return state.walletConnectProvider;
}

async function switchToEtherlink(provider = state.provider) {
  const wallet = provider;
  if (!wallet || typeof wallet.request !== "function") {
    throw new Error(t("noWalletSwitch"));
  }
  const chainIdHex = `0x${state.config.network.chainId.toString(16)}`;
  try {
    await wallet.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }]
    });
  } catch (error) {
    if (error.code !== 4902) throw error;
    await wallet.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainIdHex,
          chainName: state.config.network.name,
          nativeCurrency: { name: "Etherlink XTZ", symbol: "XTZ", decimals: 18 },
          rpcUrls: [state.config.network.rpcUrl],
          blockExplorerUrls: [state.config.network.explorerUrl]
        }
      ]
    });
  }
}

async function connectWithProvider(provider) {
  if (!provider || typeof provider.request !== "function") {
    throw new Error(t("noWallet"));
  }
  await switchToEtherlink(provider);
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  const account = accounts?.[0];
  if (!account) throw new Error(t("noWallet"));

  const browserProvider = new ethers.BrowserProvider(provider);
  const signer = await browserProvider.getSigner();

  state.provider = provider;
  state.signer = signer;
  state.account = account;
  state.contract = new ethers.Contract(state.config.deployment.address, state.abi, signer);

  setWalletUiConnected();
  setStatus(t("connectedWallet", { address: shorten(account) }));
  closeWalletModal();
}

async function connectInjectedWallet(uuid) {
  const wallet = state.discoveredWallets.get(uuid);
  if (!wallet) throw new Error(t("noWallet"));
  await connectWithProvider(wallet.provider);
}

async function connectWalletConnect() {
  const provider = await getWalletConnectProvider();
  await connectWithProvider(provider);
}

async function disconnectWallet() {
  if (state.walletConnectProvider && state.provider === state.walletConnectProvider && state.provider.disconnect) {
    try {
      await state.provider.disconnect();
    } catch (_error) {
      // ignore disconnect transport errors
    }
  }
  state.provider = null;
  state.signer = null;
  state.account = null;
  state.contract = null;
  setWalletUiDisconnected();
  setStatus(t("walletDisconnected"));
  closeWalletModal();
}

async function loadConfig() {
  const response = await fetch("/api/config");
  const data = await response.json();
  state.config = data;
  state.abi = data.abi;
  els.networkLabel.textContent = data.network.name;
  els.explorerLink.href = data.network.explorerUrl;
  setStatus(t("contractLive", { address: shorten(data.deployment.address) }));
}

async function generateReport() {
  syncTaskFields();
  startCountdown();
  const response = await fetch("/api/ai/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: state.selectedTemplate,
      language: state.language,
      title: els.titleInput.value.trim(),
      brief: els.briefInput.value.trim(),
      focus: els.focusInput.value.trim(),
      deliveryWindow: els.deliveryWindowSelect.value,
      reviewMode: els.reviewModeSelect.value
    })
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    stopCountdown(true);
    throw new Error(data.error || t("configFailed"));
  }
  renderReport(data.reportMarkdown);
}

function formatTask(task) {
  return JSON.stringify(
    {
      client: task.client,
      agent: task.agent,
      rewardXTZ: ethers.formatEther(task.reward),
      stakeXTZ: ethers.formatEther(task.stakeRequired),
      status: STATUS_LABELS[Number(task.status)] || Number(task.status),
      title: task.title,
      brief: task.brief,
      submissionURI: task.submissionURI,
      submissionHash: task.submissionHash
    },
    null,
    2
  );
}

async function createTask() {
  if (!state.contract) throw new Error(t("connectFirst"));
  syncTaskFields();
  const title = els.titleInput.value.trim();
  const brief = els.briefInput.value.trim();
  const reward = ethers.parseEther(els.rewardInput.value || "0");
  const stake = ethers.parseEther(els.stakeInput.value || "0");
  const tx = await state.contract.createTask(title, brief, stake, { value: reward });
  setStatus(t("creatingTask", { hash: tx.hash }));
  const receipt = await tx.wait();
  const taskId = (await state.contract.nextTaskId()) - 1n;
  els.taskIdInput.value = taskId.toString();
  els.submissionUriInput.value = `ipfs://agentbond-lite/${state.selectedTemplate}/task-${taskId.toString()}`;
  setStatus(t("taskCreated", { id: taskId.toString(), block: String(receipt.blockNumber) }));
  await refreshTask();
}

async function claimTask() {
  if (!state.contract) throw new Error(t("connectFirst"));
  const taskId = BigInt(els.taskIdInput.value || "0");
  const task = await state.contract.getTask(taskId);
  const tx = await state.contract.claimTask(taskId, { value: task.stakeRequired });
  setStatus(t("claimingTask", { id: taskId.toString(), hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskClaimed", { id: taskId.toString() }));
  await refreshTask();
}

async function submitTask() {
  if (!state.contract) throw new Error(t("connectFirst"));
  if (!state.lastReport.trim()) throw new Error(t("generateFirst"));
  const taskId = BigInt(els.taskIdInput.value || "0");
  const hash = ethers.keccak256(ethers.toUtf8Bytes(state.lastReport));
  const tx = await state.contract.submitTask(taskId, els.submissionUriInput.value.trim(), hash);
  setStatus(t("submittingHash", { hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskSubmitted", { id: taskId.toString() }));
  await refreshTask();
}

async function acceptTask() {
  if (!state.contract) throw new Error(t("connectFirst"));
  const taskId = BigInt(els.taskIdInput.value || "0");
  const tx = await state.contract.acceptTask(taskId);
  setStatus(t("acceptingTask", { id: taskId.toString(), hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskAccepted", { id: taskId.toString() }));
  await refreshTask();
}

async function rejectTask() {
  if (!state.contract) throw new Error(t("connectFirst"));
  const taskId = BigInt(els.taskIdInput.value || "0");
  const tx = await state.contract.rejectTask(taskId);
  setStatus(t("rejectingTask", { id: taskId.toString(), hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskRejected", { id: taskId.toString() }));
  await refreshTask();
}

async function refreshTask() {
  if (!state.contract) {
    els.taskState.textContent = t("noTaskLoaded");
    return;
  }
  const taskId = BigInt(els.taskIdInput.value || "0");
  const task = await state.contract.getTask(taskId);
  els.taskState.textContent = formatTask(task);
}

function applyLanguage(language) {
  state.language = dictionary[language] ? language : "en";
  localStorage.setItem("agentbond-lite-language", state.language);
  els.languageSelect.value = state.language;
  applyTranslations();
}

function initLanguage() {
  const saved = localStorage.getItem("agentbond-lite-language") || "en";
  applyLanguage(saved);
}

function bindEvents() {
  els.modeChips.forEach((chip) => {
    chip.addEventListener("click", () => applyTemplate(chip.dataset.template));
  });
  els.languageSelect.addEventListener("change", (event) => applyLanguage(event.target.value));
  els.deliveryWindowSelect.addEventListener("change", updateEtaPreview);
  els.connectBtn.addEventListener("click", openWalletModal);
  els.disconnectBtn.addEventListener("click", () => disconnectWallet().catch((error) => setStatus(error.message)));
  els.walletModalBackdrop.addEventListener("click", closeWalletModal);
  els.walletModalClose.addEventListener("click", closeWalletModal);
  els.walletModalList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-wallet-id]");
    if (!button) return;
    connectInjectedWallet(button.dataset.walletId).catch((error) => setStatus(error.message));
  });
  els.walletConnectQrButton.addEventListener("click", () => connectWalletConnect().catch((error) => setStatus(error.message)));
  els.generateReportBtn.addEventListener("click", () => generateReport().catch((error) => setStatus(error.message)));
  els.loadDemoBtn.addEventListener("click", () => {
    state.lastReport = "";
    els.resultPanel.hidden = true;
    applyTemplate(state.selectedTemplate);
    updateEtaPreview();
  });
  els.requestInput.addEventListener("input", syncTaskFields);
  els.switchBtn.addEventListener("click", () => switchToEtherlink(state.provider).catch((error) => setStatus(error.message)));
  els.createTaskBtn.addEventListener("click", () => createTask().catch((error) => setStatus(error.message)));
  els.claimTaskBtn.addEventListener("click", () => claimTask().catch((error) => setStatus(error.message)));
  els.submitTaskBtn.addEventListener("click", () => submitTask().catch((error) => setStatus(error.message)));
  els.acceptTaskBtn.addEventListener("click", () => acceptTask().catch((error) => setStatus(error.message)));
  els.rejectTaskBtn.addEventListener("click", () => rejectTask().catch((error) => setStatus(error.message)));
  els.refreshBtn.addEventListener("click", () => refreshTask().catch((error) => setStatus(error.message)));
}

window.addEventListener("load", async () => {
  try {
    initLanguage();
    discoverInjectedWallets();
    bindEvents();
    await loadConfig();
    applyTemplate("governance");
    setWalletUiDisconnected();
    els.taskState.textContent = t("noTaskLoaded");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : t("configFailed"));
  }
});
