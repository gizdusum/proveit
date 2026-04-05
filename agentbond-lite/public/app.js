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
  currentProviderName: null,
  walletConnectProvider: null,
  discoveredWallets: new Map()
};

const TASK_PRESETS = {
  governance: {
    en: {
      request:
        "Summarize a governance proposal, highlight treasury risk and upgrade risk, then return a clear execution recommendation.",
      title: "Produce governance intelligence for a new Etherlink app launch",
      focus: "proposal intent, treasury controls, upgrade risk, and execution recommendation",
      brief:
        "Read the launch proposal, identify treasury and upgrade risks, summarize the governance tradeoffs, and end with a clear recommendation."
    },
    tr: {
      request:
        "Bir yönetişim teklifini özetle, treasury ve upgrade risklerini çıkar, ardından net bir uygulama tavsiyesi ver.",
      title: "Yeni bir Etherlink uygulama lansmanı için yönetişim istihbaratı üret",
      focus: "teklif amacı, treasury kontrolleri, upgrade riski ve uygulama tavsiyesi",
      brief:
        "Lansman teklifini incele, treasury ve upgrade risklerini tespit et, yönetişim ödünleşimlerini özetle ve net bir tavsiyeyle bitir."
    }
  },
  token: {
    en: {
      request:
        "Create a market signals brief for a token launch using token structure, narrative momentum, crowd conviction, and prediction-market style sentiment framing.",
      title: "Produce a market signals brief for a token launch",
      focus: "token utility, narrative momentum, event expectations, liquidity risk, and crowd conviction",
      brief:
        "Analyze the token structure, supply schedule, admin permissions, launch mechanics, market narrative, and crowd expectations. Highlight where crowd conviction may diverge from fundamentals."
    },
    tr: {
      request:
        "Bir token lansmanı için token yapısı, anlatı momentumu, kalabalık inancı ve tahmin piyasası benzeri duygu çerçevesi kullanan bir piyasa sinyalleri özeti hazırla.",
      title: "Bir token lansmanı için piyasa sinyalleri özeti üret",
      focus: "token faydası, anlatı momentumu, olay beklentileri, likidite riski ve kalabalık inancı",
      brief:
        "Token yapısını, arz takvimini, yönetici izinlerini, lansman mekaniklerini, piyasa anlatısını ve kalabalık beklentilerini analiz et. Kalabalık inancının temellerden nerede ayrıştığını özellikle vurgula."
    }
  },
  identity: {
    en: {
      request:
        "Audit suspicious wallet or collection activity and map reputation-sensitive behavior, wash activity, and suspicious clusters.",
      title: "Map identity risk in an NFT collection",
      focus: "wash trading, wallet clustering, suspicious volume, and reputation risk",
      brief:
        "Inspect collection or wallet activity, identify clusters that may indicate wash trading, and summarize whether the behavior appears organic, coordinated, or reputation-sensitive."
    },
    tr: {
      request:
        "Şüpheli cüzdan veya koleksiyon hareketlerini denetle; itibar hassas davranışları, wash activity izlerini ve şüpheli kümeleri haritala.",
      title: "Bir NFT koleksiyonunda kimlik riskini haritala",
      focus: "wash trading, cüzdan kümelenmesi, şüpheli hacim ve itibar riski",
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
    heroTitle: "Stake AI research. Settle it on Etherlink.",
    heroText:
      "AgentBond Lite turns one AI research request into one clean onchain flow: escrow the reward, lock stake, anchor the report hash, then accept or slash.",
    requestLabel: "What do you want the agent to research?",
    requestPlaceholder:
      "Example: Create a market signals brief for MON token using token risk, sentiment, and crowd conviction.",
    applyPrompt: "Apply prompt",
    switchEtherlink: "Switch to Etherlink",
    viewExplorer: "View explorer",
    network: "Network",
    aiMode: "AI mode",
    readyState: "Ready",
    generatingState: "Generating",
    deployedContract: "Deployed contract",
    researchLanguage: "Research language",
    heroNote:
      "Built for the Tezos EVM AI Hackathon with a real deployed contract, open source repo, and a 3-minute demo flow.",
    summaryWhat: "What it is",
    summaryWhatValue: "AI research settlement with bonded agents",
    summaryWhy: "Why it matters",
    summaryWhyValue: "Research outputs become accountable onchain work",
    summaryFit: "Hackathon fit",
    summaryFitValue: "AI agents + smart contracts + deployed Etherlink contract",
    researchModes: "Research modes",
    pickLane: "Pick a research lane",
    laneSubtitle: "Three focused modes. One clean onchain settlement flow.",
    governanceTag: "Governance",
    governanceTitle: "Governance intelligence",
    governanceDesc:
      "Summarize a proposal, highlight upgrade and treasury risk, and return an execution recommendation.",
    marketTag: "Market signals",
    marketTitle: "Token + crowd read",
    marketDesc:
      "Blend token risk with market narrative, event expectations, and prediction-market style signal framing.",
    identityTag: "Identity",
    identityTitle: "Identity graph",
    identityDesc:
      "Audit wallet or collection behavior for suspicious clusters, wash activity, and reputation risk.",
    modeNote:
      "Lite uses focused research templates, not three separate autonomous data engines. Full AgentBond adds deeper connectors, richer verification, and multi-agent competition.",
    taskTitle: "Task title",
    focus: "Focus",
    taskBrief: "Task brief",
    reward: "Reward (XTZ)",
    agentStake: "Agent stake (XTZ)",
    deliveryWindow: "Delivery window",
    reviewMode: "Review mode",
    createTask: "Create task",
    generateReport: "Generate report",
    resetDemo: "Reset demo",
    settlementConsole: "Settlement console",
    runOnchain: "Run the onchain flow",
    onchainSubtitle: "One task. One report. One hash. One acceptance path.",
    resultCardTitle: "Current result",
    resultSummaryDefault:
      "Generate a report to see the research summary, what will be submitted onchain, and the next settlement step.",
    resultLanguage: "Language",
    resultSettlement: "Settlement",
    resultNextStep: "Next step",
    reportOutput: "Report output",
    reportPlaceholder: "The AI report appears here. Its hash will be submitted onchain.",
    taskId: "Task ID",
    submissionUri: "Submission URI",
    stakeClaim: "Stake + claim",
    submitHash: "Submit hash",
    accept: "Accept",
    reject: "Reject",
    refresh: "Refresh",
    judgesCare: "Why judges care",
    meaningfulAi: "Meaningful AI",
    meaningfulAiDesc:
      "The report is part of the product flow, not decoration. AgentBond uses AI to structure research and produce the submission that gets settled onchain.",
    usersCare: "Why users care",
    clearCategories: "Clear categories, real outputs",
    clearCategoriesDesc:
      "Governance Intelligence, Market Signals, and Identity Graph each produce a different style of research result while sharing the same accountable settlement rail.",
    etherlinkFits: "Why Etherlink fits",
    visibleLogic: "Visible smart-contract logic",
    visibleLogicDesc:
      "The contract escrows rewards, locks stake, accepts the report hash, and releases or slashes value based on the result.",
    comingSoon: "Coming soon",
    fullAgentBond: "Full AgentBond",
    fullAgentBondDesc:
      "Lite is the first release. Full AgentBond expands the same primitive into a real AI labor market with applications, dispute windows, richer reputation, and multi-agent competition.",
    multiAgent: "Multi-agent applications",
    multiAgentDesc: "More than one operator can apply before the client selects a bonded agent.",
    challengeWindow: "Challenge window",
    challengeWindowDesc: "Disputed submissions enter a review period instead of resolving instantly.",
    reputationLayer: "Reputation layer",
    reputationLayerDesc: "Accepted work creates a public onchain signal for agent quality over time.",
    walletModalEyebrow: "Wallet access",
    walletModalTitle: "Choose a wallet",
    walletConnectTitle: "WalletConnect",
    walletConnectDesc: "Scan a QR code or use a mobile wallet.",
    noInjected: "No injected wallet found",
    noInjectedDesc: "Install MetaMask or Rabby, or use WalletConnect below.",
    injectedConnectDesc: "Connect with the installed wallet",
    walletNotConnected: "Wallet not connected.",
    liveContract: "Live contract",
    awaitingDeploy: "Awaiting deploy",
    noTaskLoaded: "No task loaded yet.",
    resultAwaiting: "Awaiting report",
    nextGenerate: "Generate report",
    nextSubmit: "Submit hash",
    nextReview: "Review result",
    connectedWallet: "Connected {address} on Etherlink.",
    contractLive: "Contract live at {address}. Connect a wallet to run the demo.",
    loadedTemplate: "Loaded {mode} demo template.",
    creatingTask: "Creating task... {hash}",
    taskCreated: "Task {id} created in block {block}.",
    reportReady: "Report ready. Anchor the hash onchain when you are ready.",
    claimingTask: "Claiming task {id}... {hash}",
    taskClaimed: "Task {id} claimed with bonded stake.",
    submittingHash: "Submitting report hash... {hash}",
    taskSubmitted: "Task {id} submitted. Hash anchored onchain.",
    acceptingTask: "Accepting task {id}... {hash}",
    taskAccepted: "Task {id} accepted. Reward released and stake returned.",
    rejectingTask: "Rejecting task {id}... {hash}",
    taskRejected: "Task {id} rejected. Reward refunded and stake slashed.",
    walletDisconnected: "Wallet disconnected.",
    noWallet: "No injected wallet found. Install MetaMask, Rabby, or use WalletConnect.",
    noWalletSwitch: "No wallet available for network switching.",
    connectFirst: "Connect a wallet first.",
    generateFirst: "Generate a report first.",
    configFailed: "Failed to load app config.",
    deliveryFast: "Fast // 15 min",
    deliveryNormal: "Normal // 1 hour",
    deliveryDeep: "Deep // 1 day",
    reviewOwner: "Owner acceptance",
    reviewOwnerPlus: "Owner + notes",
    reviewChallenge: "Challenge ready"
  },
  tr: {
    brandName: "AgentBond Lite",
    brandTagline: "Etherlink yapay zekâ araştırma hattı",
    languageLabel: "Dil",
    hackathonLink: "Hackathon",
    connectWallet: "Cüzdan bağla",
    disconnectWallet: "Bağlantıyı kes",
    heroEyebrow: "Lite sürüm // Etherlink üzerinde canlı",
    heroTitle: "Yapay zekâ araştırmasını stake et. Etherlink üzerinde sonuçlandır.",
    heroText:
      "AgentBond Lite tek bir araştırma talebini temiz bir onchain akışa dönüştürür: ödül escrow’a alınır, stake kilitlenir, rapor hash’i zincire yazılır, sonra kabul edilir ya da kesinti uygulanır.",
    requestLabel: "Ajanın neyi araştırmasını istiyorsun?",
    requestPlaceholder:
      "Örnek: MON token için token riski, anlatı ve kalabalık inancını kullanan bir piyasa sinyalleri özeti hazırla.",
    applyPrompt: "İsteği uygula",
    switchEtherlink: "Etherlink’e geç",
    viewExplorer: "Explorer’ı aç",
    network: "Ağ",
    aiMode: "Yapay zekâ modu",
    readyState: "Hazır",
    generatingState: "Üretiliyor",
    deployedContract: "Canlı kontrat",
    researchLanguage: "Araştırma dili",
    heroNote:
      "Gerçek deploy edilmiş kontrat, açık kaynak repo ve üç dakikalık demo akışıyla Tezos EVM AI Hackathon için hazırlandı.",
    summaryWhat: "Nedir",
    summaryWhatValue: "Bağlı ajanlarla yapay zekâ araştırma settlement katmanı",
    summaryWhy: "Neden önemli",
    summaryWhyValue: "Araştırma çıktıları zincir üzerinde hesap verebilir işe dönüşür",
    summaryFit: "Hackathon uyumu",
    summaryFitValue: "Yapay zekâ ajanları + akıllı kontratlar + deploy edilmiş Etherlink kontratı",
    researchModes: "Araştırma modları",
    pickLane: "Bir araştırma hattı seç",
    laneSubtitle: "Üç odaklı mod. Tek bir temiz onchain settlement akışı.",
    governanceTag: "Yönetişim",
    governanceTitle: "Yönetişim istihbaratı",
    governanceDesc:
      "Bir teklifi özetle, yükseltme ve treasury risklerini çıkar, ardından net bir uygulama tavsiyesi ver.",
    marketTag: "Piyasa sinyalleri",
    marketTitle: "Token + kalabalık okuması",
    marketDesc:
      "Token riskini piyasa anlatısı, olay beklentisi ve prediction-market benzeri sinyal çerçevesiyle birleştir.",
    identityTag: "Kimlik",
    identityTitle: "Kimlik grafiği",
    identityDesc:
      "Cüzdan veya koleksiyon davranışını şüpheli kümeler, wash activity ve itibar riski açısından denetle.",
    modeNote:
      "Lite sürümü şu an üç ayrı otonom veri motoru değil; odaklı araştırma şablonları kullanıyor. Full AgentBond daha derin veri bağlayıcıları, daha güçlü doğrulama ve çoklu ajan rekabeti ekleyecek.",
    taskTitle: "Görev başlığı",
    focus: "Odak",
    taskBrief: "Görev özeti",
    reward: "Ödül (XTZ)",
    agentStake: "Ajan stake’i (XTZ)",
    deliveryWindow: "Teslim süresi",
    reviewMode: "İnceleme modu",
    createTask: "Görev oluştur",
    generateReport: "Rapor üret",
    resetDemo: "Demoyu sıfırla",
    settlementConsole: "Settlement konsolu",
    runOnchain: "Onchain akışı çalıştır",
    onchainSubtitle: "Tek görev. Tek rapor. Tek hash. Tek kabul yolu.",
    resultCardTitle: "Güncel sonuç",
    resultSummaryDefault:
      "Rapor ürettiğinde araştırma özetini, zincire neyin yazılacağını ve sonraki settlement adımını burada göreceksin.",
    resultLanguage: "Dil",
    resultSettlement: "Settlement",
    resultNextStep: "Sıradaki adım",
    reportOutput: "Rapor çıktısı",
    reportPlaceholder: "Yapay zekâ raporu burada görünür. Hash’i zincire gönderilir.",
    taskId: "Görev ID",
    submissionUri: "Teslim URI’si",
    stakeClaim: "Stake + claim",
    submitHash: "Hash gönder",
    accept: "Kabul et",
    reject: "Reddet",
    refresh: "Yenile",
    judgesCare: "Jürinin bakacağı nokta",
    meaningfulAi: "Anlamlı yapay zekâ",
    meaningfulAiDesc:
      "Rapor dekor değil, ürün akışının parçası. AgentBond, araştırmayı yapılandırmak ve zincir üzerinde sonuçlanan teslimi üretmek için yapay zekâ kullanır.",
    usersCare: "Kullanıcının göreceği değer",
    clearCategories: "Net kategoriler, gerçek çıktılar",
    clearCategoriesDesc:
      "Yönetişim istihbaratı, Piyasa sinyalleri ve Kimlik grafiği farklı araştırma stilleri üretir ama aynı hesap verebilir settlement rayını kullanır.",
    etherlinkFits: "Neden Etherlink uygun",
    visibleLogic: "Görünür akıllı kontrat mantığı",
    visibleLogicDesc:
      "Kontrat ödülü escrow’a alır, stake’i kilitler, rapor hash’ini kabul eder ve sonuca göre değeri serbest bırakır ya da keser.",
    comingSoon: "Çok yakında",
    fullAgentBond: "Full AgentBond",
    fullAgentBondDesc:
      "Lite ilk sürüm. Full AgentBond aynı primitive’i gerçek bir yapay zekâ iş gücü pazarına taşıyacak; başvurular, itiraz penceresi, daha güçlü itibar ve çoklu ajan rekabeti eklenecek.",
    multiAgent: "Çoklu ajan başvuruları",
    multiAgentDesc: "Müşteri bağlı bir ajan seçmeden önce birden fazla operatör başvurabilir.",
    challengeWindow: "İtiraz penceresi",
    challengeWindowDesc: "İhtilaflı teslimler anında çözülmek yerine inceleme süresine girer.",
    reputationLayer: "İtibar katmanı",
    reputationLayerDesc: "Kabul edilen işler zamanla ajan kalitesine dair herkese açık onchain sinyal üretir.",
    walletModalEyebrow: "Cüzdan erişimi",
    walletModalTitle: "Bir cüzdan seç",
    walletConnectTitle: "WalletConnect",
    walletConnectDesc: "QR kod okut veya mobil cüzdan ile bağlan.",
    noInjected: "Kurulu cüzdan bulunamadı",
    noInjectedDesc: "MetaMask veya Rabby kurabilir ya da aşağıdan WalletConnect kullanabilirsin.",
    injectedConnectDesc: "Kurulu cüzdan ile bağlan",
    walletNotConnected: "Cüzdan bağlı değil.",
    liveContract: "Canlı kontrat",
    awaitingDeploy: "Deploy bekleniyor",
    noTaskLoaded: "Henüz görev yüklenmedi.",
    resultAwaiting: "Rapor bekleniyor",
    nextGenerate: "Rapor üret",
    nextSubmit: "Hash gönder",
    nextReview: "Sonucu incele",
    connectedWallet: "{address} adresi Etherlink üzerinde bağlandı.",
    contractLive: "Kontrat {address} adresinde canlı. Demoyu çalıştırmak için bir cüzdan bağla.",
    loadedTemplate: "{mode} şablonu yüklendi.",
    creatingTask: "Görev oluşturuluyor... {hash}",
    taskCreated: "Görev {id}, {block}. blokta oluşturuldu.",
    reportReady: "Rapor hazır. Hazır olduğunda hash’i zincire sabitle.",
    claimingTask: "Görev {id} claim ediliyor... {hash}",
    taskClaimed: "Görev {id} teminatlı stake ile alındı.",
    submittingHash: "Rapor hash’i gönderiliyor... {hash}",
    taskSubmitted: "Görev {id} gönderildi. Hash zincire sabitlendi.",
    acceptingTask: "Görev {id} kabul ediliyor... {hash}",
    taskAccepted: "Görev {id} kabul edildi. Ödül açıldı ve stake iade edildi.",
    rejectingTask: "Görev {id} reddediliyor... {hash}",
    taskRejected: "Görev {id} reddedildi. Ödül iade edildi ve stake kesildi.",
    walletDisconnected: "Cüzdan bağlantısı kesildi.",
    noWallet: "Kurulu cüzdan bulunamadı. MetaMask, Rabby ya da WalletConnect kullan.",
    noWalletSwitch: "Ağ değişimi için kullanılabilir bir cüzdan bulunamadı.",
    connectFirst: "Önce bir cüzdan bağla.",
    generateFirst: "Önce bir rapor üret.",
    configFailed: "Uygulama ayarları yüklenemedi.",
    deliveryFast: "Hızlı // 15 dk",
    deliveryNormal: "Normal // 1 saat",
    deliveryDeep: "Derin // 1 gün",
    reviewOwner: "Sahip onayı",
    reviewOwnerPlus: "Sahip + notlar",
    reviewChallenge: "İtiraza hazır"
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
  aiModeLabel: document.getElementById("aiModeLabel"),
  contractAddressLabel: document.getElementById("contractAddressLabel"),
  languageValue: document.getElementById("languageValue"),
  requestInput: document.getElementById("requestInput"),
  applyRequestBtn: document.getElementById("applyRequestBtn"),
  switchBtn: document.getElementById("switchBtn"),
  titleInput: document.getElementById("titleInput"),
  briefInput: document.getElementById("briefInput"),
  rewardInput: document.getElementById("rewardInput"),
  stakeInput: document.getElementById("stakeInput"),
  focusInput: document.getElementById("focusInput"),
  deliveryWindowSelect: document.getElementById("deliveryWindowSelect"),
  reviewModeSelect: document.getElementById("reviewModeSelect"),
  reportOutput: document.getElementById("reportOutput"),
  taskIdInput: document.getElementById("taskIdInput"),
  submissionUriInput: document.getElementById("submissionUriInput"),
  createTaskBtn: document.getElementById("createTaskBtn"),
  loadDemoBtn: document.getElementById("loadDemoBtn"),
  generateReportBtn: document.getElementById("generateReportBtn"),
  claimTaskBtn: document.getElementById("claimTaskBtn"),
  submitTaskBtn: document.getElementById("submitTaskBtn"),
  acceptTaskBtn: document.getElementById("acceptTaskBtn"),
  rejectTaskBtn: document.getElementById("rejectTaskBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  taskState: document.getElementById("taskState"),
  resultModeLabel: document.getElementById("resultModeLabel"),
  resultSummary: document.getElementById("resultSummary"),
  resultLanguageLabel: document.getElementById("resultLanguageLabel"),
  resultSettlementLabel: document.getElementById("resultSettlementLabel"),
  resultNextStepLabel: document.getElementById("resultNextStepLabel"),
  presetCards: Array.from(document.querySelectorAll("[data-template]")),
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

function setStatus(message) {
  els.walletStatus.textContent = message;
}

function shorten(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "-";
}

function normalizeWalletName(name = "Wallet") {
  return name.replace(/\s+extension$/i, "").trim();
}

function presetCopy(templateName, language = state.language) {
  const preset = TASK_PRESETS[templateName];
  if (!preset) return null;
  return preset[language] || preset.en;
}

function walletMarkContent(wallet) {
  if (wallet?.icon) {
    return `<img src="${wallet.icon}" alt="${wallet.name} icon" />`;
  }
  return normalizeWalletName(wallet?.name || "Wallet").slice(0, 2).toUpperCase();
}

function isSupportedWallet(providerDetail) {
  const provider = providerDetail?.provider;
  if (!provider || typeof provider.request !== "function") return false;
  if (provider.isMetaMask || provider.isRabby || provider.isCoinbaseWallet || provider.isTrust) return true;
  const name = normalizeWalletName(providerDetail?.info?.name || "");
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
      description: "Bonded AI research on Tezos EVM",
      url: "https://agentbond-lite.vercel.app",
      icons: ["https://agentbond-lite.vercel.app/agentbond-mark.svg"]
    }
  });
  return state.walletConnectProvider;
}

function setWalletUiConnected() {
  els.walletBadge.hidden = false;
  els.walletBadge.textContent = shorten(state.account);
  els.connectBtn.hidden = true;
  els.disconnectBtn.hidden = false;
}

function setWalletUiDisconnected() {
  els.walletBadge.hidden = true;
  els.connectBtn.textContent = t("connectWallet");
  els.connectBtn.hidden = false;
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

  els.languageValue.textContent = els.languageSelect.options[els.languageSelect.selectedIndex]?.textContent || "English";
  els.deliveryWindowSelect.options[0].textContent = t("deliveryFast");
  els.deliveryWindowSelect.options[1].textContent = t("deliveryNormal");
  els.deliveryWindowSelect.options[2].textContent = t("deliveryDeep");
  els.reviewModeSelect.options[0].textContent = t("reviewOwner");
  els.reviewModeSelect.options[1].textContent = t("reviewOwnerPlus");
  els.reviewModeSelect.options[2].textContent = t("reviewChallenge");
  els.reportOutput.placeholder = t("reportPlaceholder");
  els.taskState.textContent = state.contract ? els.taskState.textContent : t("noTaskLoaded");
  updateResultCard();
  if (!state.account) setWalletUiDisconnected();
  renderWalletOptions();
}

function updateResultCard(reportText = "") {
  const preset = presetCopy(state.selectedTemplate);
  const titleMap = {
    governance: t("governanceTitle"),
    token: t("marketTitle"),
    identity: t("identityTitle")
  };
  els.resultModeLabel.textContent = titleMap[state.selectedTemplate];
  els.resultLanguageLabel.textContent = els.languageSelect.options[els.languageSelect.selectedIndex]?.textContent || "English";

  if (!reportText) {
    els.resultSummary.textContent = t("resultSummaryDefault");
    els.resultSettlementLabel.textContent = t("resultAwaiting");
    els.resultNextStepLabel.textContent = t("nextGenerate");
    return;
  }

  const lines = reportText.split("\n");
  const firstMeaningfulLine = lines
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#"));
  const recommendationHeading = state.language === "tr" ? "öneri" : "recommendation";
  const recommendationIndex = lines.findIndex((line) => line.trim().toLowerCase().includes(recommendationHeading));
  const recommendationLine =
    recommendationIndex >= 0
      ? lines
          .slice(recommendationIndex + 1)
          .map((line) => line.trim())
          .find(Boolean)
      : "";

  els.resultSummary.textContent = recommendationLine || firstMeaningfulLine || preset.brief;
  els.resultSettlementLabel.textContent = t("nextSubmit");
  els.resultNextStepLabel.textContent = t("nextReview");
}

function applyTemplate(templateName) {
  const template = presetCopy(templateName);
  if (!template) return;

  state.selectedTemplate = templateName;
  els.requestInput.value = template.request;
  els.titleInput.value = template.title;
  els.briefInput.value = template.brief;
  els.focusInput.value = template.focus;
  els.presetCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.template === templateName);
  });
  updateResultCard(els.reportOutput.value.trim());
  setStatus(t("loadedTemplate", { mode: normalizeWalletName(titleForTemplate(templateName)) }));
}

function titleForTemplate(templateName) {
  return templateName === "token" ? t("marketTitle") : templateName === "identity" ? t("identityTitle") : t("governanceTitle");
}

function applyPromptToFields() {
  const prompt = els.requestInput.value.trim();
  if (!prompt) return;
  els.titleInput.value = prompt.slice(0, 90);
  if (!els.briefInput.value.trim()) {
    els.briefInput.value = prompt;
  }
  if (!els.focusInput.value.trim()) {
    const template = presetCopy(state.selectedTemplate);
    els.focusInput.value = template.focus;
  }
  setStatus(prompt);
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

async function loadConfig() {
  const response = await fetch("/api/config");
  const data = await response.json();
  state.config = data;
  state.abi = data.abi;

  els.networkLabel.textContent = data.network.name;
  els.explorerLink.href = data.network.explorerUrl;
  els.aiModeLabel.textContent = t("readyState");
  els.contractAddressLabel.textContent = data.deployment?.address || t("awaitingDeploy");

  if (data.deployment?.address) {
    setStatus(t("contractLive", { address: shorten(data.deployment.address) }));
  }
}

async function switchToEtherlink(provider = state.provider?.providerInfo?.provider || state.provider) {
  const wallet = provider || state.provider;
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

async function connectWithProvider(provider, providerName, providerType) {
  if (!provider || typeof provider.request !== "function") {
    throw new Error(t("noWallet"));
  }

  await switchToEtherlink(provider);
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  const account = accounts?.[0];
  if (!account) {
    throw new Error(t("noWallet"));
  }

  const browserProvider = new ethers.BrowserProvider(provider);
  const signer = await browserProvider.getSigner();

  state.provider = provider;
  state.signer = signer;
  state.account = account;
  state.currentProviderName = providerName;
  state.currentProviderType = providerType;
  state.contract = new ethers.Contract(state.config.deployment.address, state.abi, signer);

  setWalletUiConnected();
  setStatus(t("connectedWallet", { address: shorten(account) }));
  closeWalletModal();
}

async function connectInjectedWallet(uuid) {
  const wallet = state.discoveredWallets.get(uuid);
  if (!wallet) {
    throw new Error(t("noWallet"));
  }
  await connectWithProvider(wallet.provider, wallet.info.name, "injected");
}

async function connectWalletConnect() {
  const provider = await getWalletConnectProvider();
  await connectWithProvider(provider, "WalletConnect", "walletconnect");
}

async function disconnectWallet() {
  if (state.currentProviderType === "walletconnect" && state.provider?.disconnect) {
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
  state.currentProviderName = null;
  state.currentProviderType = null;
  setWalletUiDisconnected();
  setStatus(t("walletDisconnected"));
  closeWalletModal();
}

async function createTask() {
  if (!state.contract) throw new Error(t("connectFirst"));

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
  updateResultCard(els.reportOutput.value.trim());
  await refreshTask();
}

async function generateReport() {
  els.aiModeLabel.textContent = t("generatingState");
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
  if (!response.ok || !data.ok) throw new Error(data.error || t("configFailed"));
  els.reportOutput.value = data.reportMarkdown;
  els.aiModeLabel.textContent = data.mode === "openai" ? `OpenAI // ${data.model}` : t("readyState");
  updateResultCard(data.reportMarkdown);
  setStatus(t("reportReady"));
}

async function claimTask() {
  if (!state.contract) throw new Error(t("connectFirst"));
  const taskId = BigInt(els.taskIdInput.value || "0");
  const task = await state.contract.getTask(taskId);
  const tx = await state.contract.claimTask(taskId, { value: task.stakeRequired });
  setStatus(t("claimingTask", { id: taskId.toString(), hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskClaimed", { id: taskId.toString() }));
  updateResultCard(els.reportOutput.value.trim());
  await refreshTask();
}

async function submitTask() {
  if (!state.contract) throw new Error(t("connectFirst"));
  const taskId = BigInt(els.taskIdInput.value || "0");
  const report = els.reportOutput.value.trim();
  if (!report) throw new Error(t("generateFirst"));
  const hash = ethers.keccak256(ethers.toUtf8Bytes(report));
  const tx = await state.contract.submitTask(taskId, els.submissionUriInput.value.trim(), hash);
  setStatus(t("submittingHash", { hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskSubmitted", { id: taskId.toString() }));
  els.resultSettlementLabel.textContent = t("nextReview");
  els.resultNextStepLabel.textContent = t("accept");
  await refreshTask();
}

async function acceptTask() {
  if (!state.contract) throw new Error(t("connectFirst"));
  const taskId = BigInt(els.taskIdInput.value || "0");
  const tx = await state.contract.acceptTask(taskId);
  setStatus(t("acceptingTask", { id: taskId.toString(), hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskAccepted", { id: taskId.toString() }));
  els.resultSettlementLabel.textContent = t("accept");
  els.resultNextStepLabel.textContent = t("refresh");
  await refreshTask();
}

async function rejectTask() {
  if (!state.contract) throw new Error(t("connectFirst"));
  const taskId = BigInt(els.taskIdInput.value || "0");
  const tx = await state.contract.rejectTask(taskId);
  setStatus(t("rejectingTask", { id: taskId.toString(), hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskRejected", { id: taskId.toString() }));
  els.resultSettlementLabel.textContent = t("reject");
  els.resultNextStepLabel.textContent = t("refresh");
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
  applyTemplate(state.selectedTemplate);
}

function initLanguage() {
  const saved = localStorage.getItem("agentbond-lite-language") || "en";
  applyLanguage(saved);
}

function bindEvents() {
  els.presetCards.forEach((card) => card.addEventListener("click", () => applyTemplate(card.dataset.template)));
  els.languageSelect.addEventListener("change", (event) => applyLanguage(event.target.value));
  els.connectBtn.addEventListener("click", openWalletModal);
  els.disconnectBtn.addEventListener("click", () => disconnectWallet().catch((error) => setStatus(error.message)));
  els.applyRequestBtn.addEventListener("click", applyPromptToFields);
  els.switchBtn.addEventListener("click", () => switchToEtherlink(state.provider).catch((error) => setStatus(error.message)));
  els.createTaskBtn.addEventListener("click", () => createTask().catch((error) => setStatus(error.message)));
  els.generateReportBtn.addEventListener("click", () => generateReport().catch((error) => setStatus(error.message)));
  els.loadDemoBtn.addEventListener("click", () => applyTemplate(state.selectedTemplate));
  els.claimTaskBtn.addEventListener("click", () => claimTask().catch((error) => setStatus(error.message)));
  els.submitTaskBtn.addEventListener("click", () => submitTask().catch((error) => setStatus(error.message)));
  els.acceptTaskBtn.addEventListener("click", () => acceptTask().catch((error) => setStatus(error.message)));
  els.rejectTaskBtn.addEventListener("click", () => rejectTask().catch((error) => setStatus(error.message)));
  els.refreshBtn.addEventListener("click", () => refreshTask().catch((error) => setStatus(error.message)));
  els.walletModalBackdrop.addEventListener("click", closeWalletModal);
  els.walletModalClose.addEventListener("click", closeWalletModal);
  els.walletModalList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-wallet-id]");
    if (!button) return;
    connectInjectedWallet(button.dataset.walletId).catch((error) => setStatus(error.message));
  });
  els.walletConnectQrButton.addEventListener("click", () => connectWalletConnect().catch((error) => setStatus(error.message)));
}

window.addEventListener("load", async () => {
  try {
    initLanguage();
    discoverInjectedWallets();
    bindEvents();
    await loadConfig();
    applyTemplate("governance");
    setWalletUiDisconnected();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : t("configFailed"));
  }
});
