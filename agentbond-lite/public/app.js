const state = {
  provider: null,
  signer: null,
  account: null,
  contract: null,
  config: null,
  abi: null,
  selectedTemplate: "governance",
  language: "en"
};

const translations = {
  en: {
    brandTagline: "Tezos EVM AI task market",
    languageLabel: "Language",
    hackathonLink: "Hackathon",
    connectWallet: "Connect wallet",
    heroEyebrow: "Lite release // Etherlink deployed",
    heroTitle: "Stake AI work. Settle it on Etherlink.",
    heroText:
      "AgentBond Lite turns one AI task into one clean onchain flow: escrow the reward, lock stake, anchor the report hash, then accept or slash.",
    switchEtherlink: "Switch to Etherlink",
    viewExplorer: "View explorer",
    network: "Network",
    aiMode: "AI mode",
    deployedContract: "Deployed contract",
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
    governanceTitle: "Governance intel",
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
    createTask: "Create task",
    generateReport: "Generate report",
    resetDemo: "Reset demo",
    settlementConsole: "Settlement console",
    runOnchain: "Run the onchain flow",
    onchainSubtitle: "One task. One report. One hash. One acceptance path.",
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
      "Governance Intel, Market Signals, and Identity Graph each produce a different style of research result while sharing the same accountable settlement rail.",
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
    walletNotConnected: "Wallet not connected.",
    liveContract: "Live contract",
    awaitingDeploy: "Awaiting deploy",
    noTaskLoaded: "No task loaded yet.",
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
    noWallet: "No injected wallet found. Install MetaMask, Rabby, or another EVM wallet.",
    noWalletSwitch: "No wallet available for network switching.",
    connectFirst: "Connect a wallet first.",
    generateFirst: "Generate a report first.",
    configFailed: "Failed to load app config."
  },
  tr: {
    brandTagline: "Tezos EVM AI gorev pazari",
    languageLabel: "Dil",
    hackathonLink: "Hackathon",
    connectWallet: "Cuzdan bagla",
    heroEyebrow: "Lite surum // Etherlink deploy edildi",
    heroTitle: "AI isini stake et. Etherlink uzerinde sonuclandir.",
    heroText:
      "AgentBond Lite tek bir AI gorevini temiz bir onchain akisina cevirir: odulu escrow'a alir, stake'i kilitler, rapor hash'ini zincire yazar, sonra kabul eder ya da slash uygular.",
    switchEtherlink: "Etherlink'e gec",
    viewExplorer: "Explorer'i gor",
    network: "Ag",
    aiMode: "AI modu",
    deployedContract: "Deploy edilen kontrat",
    heroNote:
      "Tezos EVM AI Hackathon icin gercek deploy edilmis kontrat, acik kaynak repo ve 3 dakikalik demo akisiyla hazirlandi.",
    summaryWhat: "Nedir",
    summaryWhatValue: "Bonded agentlarla AI arastirma settlement kati",
    summaryWhy: "Neden onemli",
    summaryWhyValue: "Arastirma ciktilari zincir uzerinde hesap verebilir ise donusur",
    summaryFit: "Hackathon uyumu",
    summaryFitValue: "AI agentlar + smart contractlar + deploy edilmis Etherlink kontrati",
    researchModes: "Arastirma modlari",
    pickLane: "Bir arastirma hattı sec",
    laneSubtitle: "Uc odakli mod. Tek bir temiz onchain settlement akisi.",
    governanceTag: "Governance",
    governanceTitle: "Governance intel",
    governanceDesc:
      "Bir teklifi ozetle, upgrade ve treasury risklerini cikar ve uygulama tavsiyesi don.",
    marketTag: "Market signals",
    marketTitle: "Token + kitle okuması",
    marketDesc:
      "Token riskini piyasa anlatısı, event beklentisi ve prediction-market benzeri sinyallerle birlestir.",
    identityTag: "Identity",
    identityTitle: "Identity graph",
    identityDesc:
      "Supheli cluster, wash activity ve itibar riskleri icin cuzdan veya koleksiyon davranisini denetle.",
    modeNote:
      "Lite su anda uc farkli otonom veri motoru degil, odakli arastirma sablonlari kullanir. Full AgentBond daha derin baglayicilar, daha iyi dogrulama ve coklu ajan rekabeti ekler.",
    taskTitle: "Gorev basligi",
    focus: "Odak",
    taskBrief: "Gorev ozeti",
    reward: "Odul (XTZ)",
    agentStake: "Ajan stake'i (XTZ)",
    createTask: "Gorev olustur",
    generateReport: "Rapor uret",
    resetDemo: "Demoyu sifirla",
    settlementConsole: "Settlement konsolu",
    runOnchain: "Onchain akisı calistir",
    onchainSubtitle: "Tek gorev. Tek rapor. Tek hash. Tek kabul yolu.",
    reportOutput: "Rapor cikisi",
    reportPlaceholder: "AI raporu burada gorunur. Hash'i zincire gonderilir.",
    taskId: "Gorev ID",
    submissionUri: "Submission URI",
    stakeClaim: "Stake + claim",
    submitHash: "Hash gonder",
    accept: "Kabul et",
    reject: "Reddet",
    refresh: "Yenile",
    judgesCare: "Jurinin dikkat ettigi",
    meaningfulAi: "Anlamli AI",
    meaningfulAiDesc:
      "Rapor dekor degil, urun akisinin parcasi. AgentBond AI'i arastirmayi yapilandirmak ve onchain sonuclanan submission'i uretmek icin kullanir.",
    usersCare: "Kullanicinin dikkat ettigi",
    clearCategories: "Net kategoriler, gercek ciktilar",
    clearCategoriesDesc:
      "Governance Intel, Market Signals ve Identity Graph farkli arastirma ciktilari uretir ama ayni hesap verebilir settlement rayini kullanir.",
    etherlinkFits: "Neden Etherlink uygun",
    visibleLogic: "Gorunur smart contract mantigi",
    visibleLogicDesc:
      "Kontrat odulu escrow'a alir, stake'i kilitler, rapor hash'ini kabul eder ve sonuca gore degeri serbest birakir ya da keser.",
    comingSoon: "Cok yakinda",
    fullAgentBond: "Full AgentBond",
    fullAgentBondDesc:
      "Lite ilk surum. Full AgentBond ayni primitive'i gercek bir AI is gucu pazarina tasir; application, challenge window, daha guclu reputation ve coklu ajan rekabeti ekler.",
    multiAgent: "Coklu ajan basvurulari",
    multiAgentDesc: "Musteri bonded bir ajan secmeden once birden fazla operator basvurabilir.",
    challengeWindow: "Challenge window",
    challengeWindowDesc: "Ihtilafli teslimler aninda cozulmek yerine inceleme suresine girer.",
    reputationLayer: "Reputation katmani",
    reputationLayerDesc: "Kabul edilen isler ajan kalitesi icin zamanla public onchain sinyal uretir.",
    walletNotConnected: "Cuzdan bagli degil.",
    liveContract: "Canli kontrat",
    awaitingDeploy: "Deploy bekleniyor",
    noTaskLoaded: "Henuz gorev yuklenmedi.",
    connectedWallet: "{address} Etherlink uzerinde baglandi.",
    contractLive: "Kontrat {address} adresinde canli. Demoyu calistirmak icin bir cuzdan bagla.",
    loadedTemplate: "{mode} demo sablonu yuklendi.",
    creatingTask: "Gorev olusturuluyor... {hash}",
    taskCreated: "Gorev {id}, {block}. blokta olusturuldu.",
    reportReady: "Rapor hazir. Hazir oldugunda hash'i zincire sabitle.",
    claimingTask: "Gorev {id} claim ediliyor... {hash}",
    taskClaimed: "Gorev {id} bonded stake ile claim edildi.",
    submittingHash: "Rapor hash'i gonderiliyor... {hash}",
    taskSubmitted: "Gorev {id} gonderildi. Hash zincire sabitlendi.",
    acceptingTask: "Gorev {id} kabul ediliyor... {hash}",
    taskAccepted: "Gorev {id} kabul edildi. Odul acildi ve stake iade edildi.",
    rejectingTask: "Gorev {id} reddediliyor... {hash}",
    taskRejected: "Gorev {id} reddedildi. Odul iade edildi ve stake slashed oldu.",
    noWallet: "Entegre cüzdan bulunamadi. MetaMask, Rabby veya baska bir EVM cüzdani kur.",
    noWalletSwitch: "Ag degistirmek icin cüzdan bulunamadi.",
    connectFirst: "Once bir cüzdan bagla.",
    generateFirst: "Once bir rapor uret.",
    configFailed: "Uygulama ayarlari yuklenemedi."
  },
  es: {
    brandTagline: "Mercado de tareas de IA en Tezos EVM",
    languageLabel: "Idioma",
    hackathonLink: "Hackathon",
    connectWallet: "Conectar wallet",
    heroEyebrow: "Lanzamiento Lite // Etherlink desplegado",
    heroTitle: "Haz stake del trabajo de IA. Liquídalo en Etherlink.",
    heroText: "AgentBond Lite convierte una tarea de IA en un flujo onchain claro: escrow del premio, bloqueo del stake, anclaje del hash del reporte y luego aceptar o castigar.",
    switchEtherlink: "Cambiar a Etherlink",
    viewExplorer: "Ver explorer",
    network: "Red",
    aiMode: "Modo IA",
    deployedContract: "Contrato desplegado",
    heroNote: "Construido para el Tezos EVM AI Hackathon con un contrato real desplegado, repo open source y un flujo demo de 3 minutos.",
    summaryWhat: "Que es",
    summaryWhatValue: "Capa de settlement de investigacion IA con agentes bondados",
    summaryWhy: "Por que importa",
    summaryWhyValue: "Los resultados de investigacion se vuelven trabajo onchain verificable",
    summaryFit: "Encaje hackathon",
    summaryFitValue: "Agentes IA + smart contracts + contrato desplegado en Etherlink",
    researchModes: "Modos de investigacion",
    pickLane: "Elige una linea de investigacion",
    laneSubtitle: "Tres modos enfocados. Un flujo onchain limpio.",
    governanceTag: "Governance",
    governanceTitle: "Governance intel",
    governanceDesc: "Resume una propuesta, destaca riesgos de upgrade y tesoreria y devuelve una recomendacion.",
    marketTag: "Market signals",
    marketTitle: "Token + lectura de la multitud",
    marketDesc: "Combina riesgo del token con narrativa de mercado, expectativas de eventos y senales tipo prediction market.",
    identityTag: "Identity",
    identityTitle: "Identity graph",
    identityDesc: "Audita comportamiento de wallets o colecciones para clusters sospechosos, wash activity y riesgo reputacional.",
    modeNote: "Lite usa plantillas de investigacion enfocadas, no tres motores de datos autonomos. Full AgentBond agrega conectores mas profundos, mejor verificacion y competencia multiagente.",
    taskTitle: "Titulo de la tarea",
    focus: "Enfoque",
    taskBrief: "Resumen de la tarea",
    reward: "Recompensa (XTZ)",
    agentStake: "Stake del agente (XTZ)",
    createTask: "Crear tarea",
    generateReport: "Generar reporte",
    resetDemo: "Reiniciar demo",
    settlementConsole: "Consola de settlement",
    runOnchain: "Ejecutar flujo onchain",
    onchainSubtitle: "Una tarea. Un reporte. Un hash. Una ruta de aceptacion.",
    reportOutput: "Salida del reporte",
    reportPlaceholder: "El reporte de IA aparece aqui. Su hash se enviara onchain.",
    taskId: "ID de tarea",
    submissionUri: "URI de envio",
    stakeClaim: "Stake + claim",
    submitHash: "Enviar hash",
    accept: "Aceptar",
    reject: "Rechazar",
    refresh: "Actualizar",
    judgesCare: "Lo que importa al jurado",
    meaningfulAi: "IA con sentido",
    meaningfulAiDesc: "El reporte es parte del flujo del producto, no decoracion. AgentBond usa IA para estructurar la investigacion y producir el envio que se liquida onchain.",
    usersCare: "Lo que importa al usuario",
    clearCategories: "Categorias claras, resultados reales",
    clearCategoriesDesc: "Governance Intel, Market Signals e Identity Graph producen estilos distintos de investigacion sobre el mismo rail de settlement.",
    etherlinkFits: "Por que Etherlink encaja",
    visibleLogic: "Logica visible del smart contract",
    visibleLogicDesc: "El contrato mantiene el premio en escrow, bloquea el stake, acepta el hash del reporte y libera o castiga valor segun el resultado.",
    comingSoon: "Muy pronto",
    fullAgentBond: "Full AgentBond",
    fullAgentBondDesc: "Lite es el primer lanzamiento. Full AgentBond expande el mismo primitivo hacia un verdadero mercado laboral de IA con aplicaciones, disputas, reputacion y competencia multiagente.",
    multiAgent: "Aplicaciones multiagente",
    multiAgentDesc: "Mas de un operador puede aplicar antes de que el cliente seleccione un agente bondado.",
    challengeWindow: "Ventana de disputa",
    challengeWindowDesc: "Las entregas disputadas entran en revision en lugar de resolverse al instante.",
    reputationLayer: "Capa de reputacion",
    reputationLayerDesc: "El trabajo aceptado crea una senal publica onchain sobre la calidad del agente.",
    walletNotConnected: "Wallet no conectada.",
    liveContract: "Contrato activo",
    awaitingDeploy: "Esperando deploy",
    noTaskLoaded: "No hay tarea cargada.",
    connectedWallet: "{address} conectado en Etherlink.",
    contractLive: "Contrato activo en {address}. Conecta una wallet para ejecutar la demo.",
    loadedTemplate: "Plantilla demo {mode} cargada.",
    creatingTask: "Creando tarea... {hash}",
    taskCreated: "Tarea {id} creada en el bloque {block}.",
    reportReady: "Reporte listo. Ancla el hash onchain cuando quieras.",
    claimingTask: "Reclamando tarea {id}... {hash}",
    taskClaimed: "Tarea {id} reclamada con stake.",
    submittingHash: "Enviando hash del reporte... {hash}",
    taskSubmitted: "Tarea {id} enviada. Hash anclado onchain.",
    acceptingTask: "Aceptando tarea {id}... {hash}",
    taskAccepted: "Tarea {id} aceptada. Recompensa liberada y stake devuelto.",
    rejectingTask: "Rechazando tarea {id}... {hash}",
    taskRejected: "Tarea {id} rechazada. Recompensa reembolsada y stake castigado.",
    noWallet: "No se encontro una wallet inyectada. Instala MetaMask, Rabby u otra wallet EVM.",
    noWalletSwitch: "No hay wallet disponible para cambiar de red.",
    connectFirst: "Conecta una wallet primero.",
    generateFirst: "Genera un reporte primero.",
    configFailed: "No se pudo cargar la configuracion."
  },
  fr: {
    brandTagline: "Marche de taches IA sur Tezos EVM",
    languageLabel: "Langue",
    hackathonLink: "Hackathon",
    connectWallet: "Connecter le wallet",
    heroEyebrow: "Version Lite // Etherlink deploye",
    heroTitle: "Stakez le travail IA. Reglez-le sur Etherlink.",
    heroText: "AgentBond Lite transforme une tache IA en flux onchain clair: escrow de la recompense, verrouillage du stake, ancrage du hash du rapport, puis acceptation ou slash.",
    switchEtherlink: "Passer sur Etherlink",
    viewExplorer: "Voir l'explorer",
    network: "Reseau",
    aiMode: "Mode IA",
    deployedContract: "Contrat deploye",
    heroNote: "Construit pour le Tezos EVM AI Hackathon avec un vrai contrat deploye, un repo open source et un flux demo de 3 minutes.",
    summaryWhat: "Ce que c'est",
    summaryWhatValue: "Couche de settlement de recherche IA avec agents bondes",
    summaryWhy: "Pourquoi c'est important",
    summaryWhyValue: "Les resultats de recherche deviennent un travail onchain responsabilise",
    summaryFit: "Fit hackathon",
    summaryFitValue: "Agents IA + smart contracts + contrat Etherlink deploye",
    researchModes: "Modes de recherche",
    pickLane: "Choisissez une piste de recherche",
    laneSubtitle: "Trois modes focalises. Un flux onchain propre.",
    governanceTag: "Governance",
    governanceTitle: "Governance intel",
    governanceDesc: "Resumer une proposition, mettre en avant les risques de treasury et d'upgrade, puis rendre une recommandation.",
    marketTag: "Market signals",
    marketTitle: "Token + lecture du marche",
    marketDesc: "Melange le risque token avec la narration de marche, les attentes d'evenement et un cadrage type prediction market.",
    identityTag: "Identity",
    identityTitle: "Identity graph",
    identityDesc: "Audite le comportement d'un wallet ou d'une collection pour clusters suspects, wash activity et risque reputatif.",
    modeNote: "Lite utilise des templates de recherche focalises, pas trois moteurs de donnees autonomes. Full AgentBond ajoute des connecteurs plus profonds, une meilleure verification et une competition multi-agents.",
    taskTitle: "Titre de la tache",
    focus: "Focus",
    taskBrief: "Brief de la tache",
    reward: "Recompense (XTZ)",
    agentStake: "Stake de l'agent (XTZ)",
    createTask: "Creer la tache",
    generateReport: "Generer le rapport",
    resetDemo: "Reinitialiser la demo",
    settlementConsole: "Console de settlement",
    runOnchain: "Lancer le flux onchain",
    onchainSubtitle: "Une tache. Un rapport. Un hash. Une voie d'acceptation.",
    reportOutput: "Sortie du rapport",
    reportPlaceholder: "Le rapport IA apparait ici. Son hash sera soumis onchain.",
    taskId: "ID de tache",
    submissionUri: "URI de soumission",
    stakeClaim: "Stake + claim",
    submitHash: "Soumettre le hash",
    accept: "Accepter",
    reject: "Rejeter",
    refresh: "Rafraichir",
    judgesCare: "Ce qui compte pour le jury",
    meaningfulAi: "IA significative",
    meaningfulAiDesc: "Le rapport fait partie du flux produit, pas de la decoration. AgentBond utilise l'IA pour structurer la recherche et produire la soumission reglee onchain.",
    usersCare: "Ce qui compte pour l'utilisateur",
    clearCategories: "Categories claires, vrais resultats",
    clearCategoriesDesc: "Governance Intel, Market Signals et Identity Graph produisent des styles de recherche differents sur le meme rail de settlement.",
    etherlinkFits: "Pourquoi Etherlink convient",
    visibleLogic: "Logique de smart contract visible",
    visibleLogicDesc: "Le contrat met la recompense en escrow, verrouille le stake, accepte le hash du rapport et libere ou slash la valeur selon le resultat.",
    comingSoon: "Bientot",
    fullAgentBond: "Full AgentBond",
    fullAgentBondDesc: "Lite est la premiere version. Full AgentBond etend le meme primitive vers un vrai marche du travail IA avec candidatures, litiges, reputation et competition multi-agents.",
    multiAgent: "Candidatures multi-agents",
    multiAgentDesc: "Plus d'un operateur peut candidater avant que le client selectionne un agent bondé.",
    challengeWindow: "Fenetre de contestation",
    challengeWindowDesc: "Les soumissions contestees entrent en revue au lieu d'etre resolues instantanement.",
    reputationLayer: "Couche de reputation",
    reputationLayerDesc: "Le travail accepte cree un signal public onchain sur la qualite de l'agent.",
    walletNotConnected: "Wallet non connecte.",
    liveContract: "Contrat actif",
    awaitingDeploy: "En attente du deploy",
    noTaskLoaded: "Aucune tache chargee.",
    connectedWallet: "{address} connecte sur Etherlink.",
    contractLive: "Contrat actif a {address}. Connectez un wallet pour lancer la demo.",
    loadedTemplate: "Template demo {mode} charge.",
    creatingTask: "Creation de la tache... {hash}",
    taskCreated: "Tache {id} creee dans le bloc {block}.",
    reportReady: "Rapport pret. Ancrez le hash onchain quand vous voulez.",
    claimingTask: "Claim de la tache {id}... {hash}",
    taskClaimed: "Tache {id} claim avec stake.",
    submittingHash: "Soumission du hash du rapport... {hash}",
    taskSubmitted: "Tache {id} soumise. Hash ancre onchain.",
    acceptingTask: "Acceptation de la tache {id}... {hash}",
    taskAccepted: "Tache {id} acceptee. Recompense liberee et stake retourne.",
    rejectingTask: "Rejet de la tache {id}... {hash}",
    taskRejected: "Tache {id} rejetee. Recompense remboursee et stake slashe.",
    noWallet: "Aucun wallet injecte trouve. Installez MetaMask, Rabby ou un autre wallet EVM.",
    noWalletSwitch: "Aucun wallet disponible pour changer de reseau.",
    connectFirst: "Connectez d'abord un wallet.",
    generateFirst: "Generez d'abord un rapport.",
    configFailed: "Impossible de charger la configuration."
  },
  de: {
    brandTagline: "Tezos EVM KI-Aufgabenmarkt",
    languageLabel: "Sprache",
    hackathonLink: "Hackathon",
    connectWallet: "Wallet verbinden",
    heroEyebrow: "Lite Release // Etherlink deployed",
    heroTitle: "Stake KI-Arbeit. Settlen auf Etherlink.",
    heroText: "AgentBond Lite verwandelt eine KI-Aufgabe in einen klaren Onchain-Flow: Reward in Escrow, Stake sperren, Report-Hash verankern und dann akzeptieren oder slashen.",
    switchEtherlink: "Zu Etherlink wechseln",
    viewExplorer: "Explorer ansehen",
    network: "Netzwerk",
    aiMode: "KI-Modus",
    deployedContract: "Deployter Contract",
    heroNote: "Gebaut fur den Tezos EVM AI Hackathon mit echtem deploytem Contract, Open-Source-Repo und 3-Minuten-Demo.",
    summaryWhat: "Was es ist",
    summaryWhatValue: "KI-Research-Settlement mit gebondeten Agents",
    summaryWhy: "Warum es wichtig ist",
    summaryWhyValue: "Research-Ergebnisse werden zu nachvollziehbarer Onchain-Arbeit",
    summaryFit: "Hackathon-Fit",
    summaryFitValue: "KI-Agents + Smart Contracts + deployter Etherlink-Contract",
    researchModes: "Research-Modi",
    pickLane: "Wahle einen Research-Pfad",
    laneSubtitle: "Drei fokussierte Modi. Ein klarer Onchain-Settlement-Flow.",
    governanceTag: "Governance",
    governanceTitle: "Governance intel",
    governanceDesc: "Fasse einen Vorschlag zusammen, markiere Upgrade- und Treasury-Risiken und liefere eine Empfehlung.",
    marketTag: "Market signals",
    marketTitle: "Token + Crowd Read",
    marketDesc: "Kombiniert Token-Risiko mit Markt-Narrativ, Event-Erwartungen und Prediction-Market-artiger Signal-Logik.",
    identityTag: "Identity",
    identityTitle: "Identity graph",
    identityDesc: "Prufe Wallet- oder Collection-Verhalten auf verdachtige Cluster, Wash Activity und Reputationsrisiko.",
    modeNote: "Lite nutzt fokussierte Research-Templates und keine drei autonomen Daten-Engines. Full AgentBond bringt tiefere Konnektoren, bessere Verifikation und Multi-Agent-Wettbewerb.",
    taskTitle: "Aufgabentitel",
    focus: "Fokus",
    taskBrief: "Task Brief",
    reward: "Reward (XTZ)",
    agentStake: "Agent Stake (XTZ)",
    createTask: "Task erstellen",
    generateReport: "Report generieren",
    resetDemo: "Demo zurucksetzen",
    settlementConsole: "Settlement-Konsole",
    runOnchain: "Onchain-Flow ausfuhren",
    onchainSubtitle: "Eine Aufgabe. Ein Report. Ein Hash. Ein Akzeptanzpfad.",
    reportOutput: "Report-Ausgabe",
    reportPlaceholder: "Der KI-Report erscheint hier. Sein Hash wird onchain eingereicht.",
    taskId: "Task-ID",
    submissionUri: "Submission-URI",
    stakeClaim: "Stake + claim",
    submitHash: "Hash senden",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    refresh: "Aktualisieren",
    judgesCare: "Warum es Juroren interessiert",
    meaningfulAi: "Sinnvolle KI",
    meaningfulAiDesc: "Der Report ist Teil des Produktflusses, nicht Dekoration. AgentBond nutzt KI, um Research zu strukturieren und die onchain gesettelte Submission zu erzeugen.",
    usersCare: "Warum es Nutzer interessiert",
    clearCategories: "Klare Kategorien, echte Ergebnisse",
    clearCategoriesDesc: "Governance Intel, Market Signals und Identity Graph liefern unterschiedliche Research-Stile uber dieselbe Settlement-Schiene.",
    etherlinkFits: "Warum Etherlink passt",
    visibleLogic: "Sichtbare Smart-Contract-Logik",
    visibleLogicDesc: "Der Contract hält Rewards im Escrow, sperrt Stake, akzeptiert den Report-Hash und gibt Wert je nach Ergebnis frei oder slasht ihn.",
    comingSoon: "Bald verfugbar",
    fullAgentBond: "Full AgentBond",
    fullAgentBondDesc: "Lite ist der erste Release. Full AgentBond erweitert dasselbe Primitive zu einem echten KI-Arbeitsmarkt mit Applications, Disputes, Reputation und Multi-Agent-Wettbewerb.",
    multiAgent: "Multi-Agent-Bewerbungen",
    multiAgentDesc: "Mehr als ein Operator kann sich bewerben, bevor der Client einen gebondeten Agent auswählt.",
    challengeWindow: "Challenge Window",
    challengeWindowDesc: "Umstrittene Submissions gehen in eine Prufphase statt sofort gelost zu werden.",
    reputationLayer: "Reputation-Layer",
    reputationLayerDesc: "Akzeptierte Arbeit erzeugt mit der Zeit ein offentliches Onchain-Signal fur Agent-Qualitat.",
    walletNotConnected: "Wallet nicht verbunden.",
    liveContract: "Live Contract",
    awaitingDeploy: "Warte auf Deploy",
    noTaskLoaded: "Noch kein Task geladen.",
    connectedWallet: "{address} auf Etherlink verbunden.",
    contractLive: "Contract live auf {address}. Verbinde ein Wallet, um die Demo zu starten.",
    loadedTemplate: "{mode}-Demo-Template geladen.",
    creatingTask: "Task wird erstellt... {hash}",
    taskCreated: "Task {id} in Block {block} erstellt.",
    reportReady: "Report bereit. Verankere den Hash onchain, wenn du bereit bist.",
    claimingTask: "Task {id} wird geclaimt... {hash}",
    taskClaimed: "Task {id} mit Bonded Stake geclaimt.",
    submittingHash: "Report-Hash wird gesendet... {hash}",
    taskSubmitted: "Task {id} eingereicht. Hash onchain verankert.",
    acceptingTask: "Task {id} wird akzeptiert... {hash}",
    taskAccepted: "Task {id} akzeptiert. Reward freigegeben und Stake zuruckgegeben.",
    rejectingTask: "Task {id} wird abgelehnt... {hash}",
    taskRejected: "Task {id} abgelehnt. Reward erstattet und Stake geslashed.",
    noWallet: "Kein eingebettetes Wallet gefunden. Installiere MetaMask, Rabby oder ein anderes EVM-Wallet.",
    noWalletSwitch: "Kein Wallet fur den Netzwerkwechsel verfugbar.",
    connectFirst: "Verbinde zuerst ein Wallet.",
    generateFirst: "Erzeuge zuerst einen Report.",
    configFailed: "App-Konfiguration konnte nicht geladen werden."
  },
  ja: {
    brandTagline: "Tezos EVM AIタスクマーケット",
    languageLabel: "Language",
    hackathonLink: "Hackathon",
    connectWallet: "Connect wallet",
    heroEyebrow: "Lite release // Etherlink deployed",
    heroTitle: "Stake AI work. Settle it on Etherlink.",
    heroText: "AgentBond Lite converts one AI task into a clean onchain flow: escrow the reward, lock stake, anchor the report hash, then accept or slash.",
    switchEtherlink: "Switch to Etherlink",
    viewExplorer: "View explorer",
    network: "Network",
    aiMode: "AI mode",
    deployedContract: "Deployed contract",
    heroNote: "Built for the Tezos EVM AI Hackathon with a real deployed contract, open source repo, and a 3-minute demo flow.",
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
    governanceTitle: "Governance intel",
    governanceDesc: "Summarize a proposal, highlight upgrade and treasury risk, and return an execution recommendation.",
    marketTag: "Market signals",
    marketTitle: "Token + crowd read",
    marketDesc: "Blend token risk with market narrative, event expectations, and prediction-market style signal framing.",
    identityTag: "Identity",
    identityTitle: "Identity graph",
    identityDesc: "Audit wallet or collection behavior for suspicious clusters, wash activity, and reputation risk.",
    modeNote: "Lite uses focused research templates, not three separate autonomous data engines. Full AgentBond adds deeper connectors, richer verification, and multi-agent competition.",
    taskTitle: "Task title",
    focus: "Focus",
    taskBrief: "Task brief",
    reward: "Reward (XTZ)",
    agentStake: "Agent stake (XTZ)",
    createTask: "Create task",
    generateReport: "Generate report",
    resetDemo: "Reset demo",
    settlementConsole: "Settlement console",
    runOnchain: "Run the onchain flow",
    onchainSubtitle: "One task. One report. One hash. One acceptance path.",
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
    meaningfulAiDesc: "The report is part of the product flow, not decoration. AgentBond uses AI to structure research and produce the submission that gets settled onchain.",
    usersCare: "Why users care",
    clearCategories: "Clear categories, real outputs",
    clearCategoriesDesc: "Governance Intel, Market Signals, and Identity Graph each produce a different style of research result while sharing the same accountable settlement rail.",
    etherlinkFits: "Why Etherlink fits",
    visibleLogic: "Visible smart-contract logic",
    visibleLogicDesc: "The contract escrows rewards, locks stake, accepts the report hash, and releases or slashes value based on the result.",
    comingSoon: "Coming soon",
    fullAgentBond: "Full AgentBond",
    fullAgentBondDesc: "Lite is the first release. Full AgentBond expands the same primitive into a real AI labor market with applications, dispute windows, richer reputation, and multi-agent competition.",
    multiAgent: "Multi-agent applications",
    multiAgentDesc: "More than one operator can apply before the client selects a bonded agent.",
    challengeWindow: "Challenge window",
    challengeWindowDesc: "Disputed submissions enter a review period instead of resolving instantly.",
    reputationLayer: "Reputation layer",
    reputationLayerDesc: "Accepted work creates a public onchain signal for agent quality over time.",
    walletNotConnected: "Wallet not connected.",
    liveContract: "Live contract",
    awaitingDeploy: "Awaiting deploy",
    noTaskLoaded: "No task loaded yet.",
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
    noWallet: "No injected wallet found. Install MetaMask, Rabby, or another EVM wallet.",
    noWalletSwitch: "No wallet available for network switching.",
    connectFirst: "Connect a wallet first.",
    generateFirst: "Generate a report first.",
    configFailed: "Failed to load app config."
  }
};

function t(key, vars = {}) {
  const dictionary = translations[state.language] || translations.en;
  const template = dictionary[key] || translations.en[key] || key;
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

const TASK_PRESETS = {
  governance: {
    title: "Produce governance intel for a new Etherlink dApp launch",
    focus: "proposal intent, treasury controls, upgrade risk, and execution recommendation",
    brief:
      "Read the launch proposal, identify treasury and upgrade risks, summarize the governance tradeoffs, and end with a clear recommendation."
  },
  token: {
    title: "Produce a market signals brief for a token launch",
    focus: "token utility, narrative momentum, event expectations, liquidity risk, and crowd conviction",
    brief:
      "Analyze the token structure, supply schedule, admin permissions, launch mechanics, and market narrative. Include what a prediction-market style crowd signal would imply and where crowd conviction may diverge from fundamentals."
  },
  nft: {
    title: "Map identity risk in an NFT collection",
    focus: "wash trading, wallet clustering, suspicious volume, and reputation risk",
    brief:
      "Inspect the collection activity, identify wallet clusters that may indicate wash trading, and summarize whether the activity appears organic, coordinated, or reputation-sensitive."
  }
};

const els = {
  languageSelect: document.getElementById("languageSelect"),
  connectBtn: document.getElementById("connectBtn"),
  switchBtn: document.getElementById("switchBtn"),
  explorerLink: document.getElementById("explorerLink"),
  walletStatus: document.getElementById("walletStatus"),
  networkLabel: document.getElementById("networkLabel"),
  aiModeLabel: document.getElementById("aiModeLabel"),
  contractAddressLabel: document.getElementById("contractAddressLabel"),
  titleInput: document.getElementById("titleInput"),
  briefInput: document.getElementById("briefInput"),
  rewardInput: document.getElementById("rewardInput"),
  stakeInput: document.getElementById("stakeInput"),
  focusInput: document.getElementById("focusInput"),
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
  presetCards: Array.from(document.querySelectorAll("[data-template]"))
};

const STATUS_LABELS = ["Open", "Claimed", "Submitted", "Accepted", "Rejected", "Cancelled"];

function setStatus(message) {
  els.walletStatus.textContent = message;
}

function applyTranslations() {
  document.documentElement.lang = state.language === "tr" ? "tr" : state.language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });

  els.reportOutput.placeholder = t("reportPlaceholder");
  els.walletStatus.textContent = state.account
    ? t("connectedWallet", { address: shorten(state.account) })
    : t("walletNotConnected");

  if (!state.contract) {
    els.taskState.textContent = t("noTaskLoaded");
  }
}

function shorten(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "-";
}

function applyTemplate(templateName) {
  const template = TASK_PRESETS[templateName];
  if (!template) return;

  state.selectedTemplate = templateName;
  els.titleInput.value = template.title;
  els.briefInput.value = template.brief;
  els.focusInput.value = template.focus;

  els.presetCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.template === templateName);
  });

  setStatus(t("loadedTemplate", { mode: templateName }));
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
  els.aiModeLabel.textContent = data.deployment?.address ? t("liveContract") : t("awaitingDeploy");
  els.contractAddressLabel.textContent = data.deployment?.address || "No deployment found";

  if (data.deployment?.address) {
    setStatus(t("contractLive", { address: shorten(data.deployment.address) }));
  }
}

async function ensureProvider() {
  if (!window.ethereum) {
    throw new Error(t("noWallet"));
  }

  if (!state.provider) {
    state.provider = new ethers.BrowserProvider(window.ethereum);
  }

  return state.provider;
}

async function switchToEtherlink() {
  if (!window.ethereum) {
    throw new Error(t("noWalletSwitch"));
  }

  const network = state.config.network;
  const chainIdHex = `0x${network.chainId.toString(16)}`;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }]
    });
  } catch (error) {
    if (error.code !== 4902) {
      throw error;
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainIdHex,
          chainName: network.name,
          nativeCurrency: {
            name: "Etherlink XTZ",
            symbol: network.currencySymbol,
            decimals: 18
          },
          rpcUrls: [network.rpcUrl],
          blockExplorerUrls: [network.explorerUrl]
        }
      ]
    });
  }
}

async function connectWallet() {
  const provider = await ensureProvider();
  await switchToEtherlink();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const account = await signer.getAddress();
  state.signer = signer;
  state.account = account;

  if (state.config?.deployment?.address && state.abi) {
    state.contract = new ethers.Contract(state.config.deployment.address, state.abi, signer);
  }

  setStatus(t("connectedWallet", { address: shorten(account) }));
}

async function createTask() {
  if (!state.contract) {
    throw new Error(t("connectFirst"));
  }

  const title = els.titleInput.value.trim();
  const brief = els.briefInput.value.trim();
  const reward = ethers.parseEther(els.rewardInput.value || "0");
  const stake = ethers.parseEther(els.stakeInput.value || "0");

  const tx = await state.contract.createTask(title, brief, stake, { value: reward });
  setStatus(t("creatingTask", { hash: tx.hash }));
  const receipt = await tx.wait();
  const taskId = await state.contract.nextTaskId() - 1n;

  els.taskIdInput.value = taskId.toString();
  els.submissionUriInput.value = `ipfs://agentbond-lite/${state.selectedTemplate}/task-${taskId.toString()}`;
  setStatus(t("taskCreated", { id: taskId.toString(), block: String(receipt.blockNumber) }));
  await refreshTask();
}

async function generateReport() {
  els.aiModeLabel.textContent = "Generating";

  const response = await fetch("/api/ai/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: state.selectedTemplate,
      language: state.language,
      title: els.titleInput.value.trim(),
      brief: els.briefInput.value.trim(),
      focus: els.focusInput.value.trim()
    })
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || "Failed to generate report.");
  }

  els.reportOutput.value = data.reportMarkdown;
  els.aiModeLabel.textContent = data.mode === "openai" ? `Live AI (${data.model})` : "Fallback report";
  setStatus(t("reportReady"));
}

async function claimTask() {
  if (!state.contract) {
    throw new Error(t("connectFirst"));
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const task = await state.contract.getTask(taskId);
  const tx = await state.contract.claimTask(taskId, { value: task.stakeRequired });
  setStatus(t("claimingTask", { id: taskId.toString(), hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskClaimed", { id: taskId.toString() }));
  await refreshTask();
}

async function submitTask() {
  if (!state.contract) {
    throw new Error(t("connectFirst"));
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const report = els.reportOutput.value.trim();
  const uri = els.submissionUriInput.value.trim();

  if (!report) {
    throw new Error(t("generateFirst"));
  }

  const hash = ethers.keccak256(ethers.toUtf8Bytes(report));
  const tx = await state.contract.submitTask(taskId, uri, hash);
  setStatus(t("submittingHash", { hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskSubmitted", { id: taskId.toString() }));
  await refreshTask();
}

async function acceptTask() {
  if (!state.contract) {
    throw new Error(t("connectFirst"));
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const tx = await state.contract.acceptTask(taskId);
  setStatus(t("acceptingTask", { id: taskId.toString(), hash: tx.hash }));
  await tx.wait();
  setStatus(t("taskAccepted", { id: taskId.toString() }));
  await refreshTask();
}

async function rejectTask() {
  if (!state.contract) {
    throw new Error(t("connectFirst"));
  }

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

async function loadDemoTask() {
  applyTemplate("governance");
}

function applyLanguage(language) {
  state.language = translations[language] ? language : "en";
  localStorage.setItem("agentbond-lite-language", state.language);
  if (els.languageSelect.value !== state.language) {
    els.languageSelect.value = state.language;
  }
  applyTranslations();
}

async function runAction(action) {
  try {
    await action();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Unknown error.");
  }
}

els.presetCards.forEach((card) => {
  card.addEventListener("click", () => applyTemplate(card.dataset.template));
});

els.languageSelect.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
});

els.connectBtn.addEventListener("click", () => runAction(connectWallet));
els.switchBtn.addEventListener("click", () => runAction(switchToEtherlink));
els.createTaskBtn.addEventListener("click", () => runAction(createTask));
els.loadDemoBtn.addEventListener("click", () => runAction(loadDemoTask));
els.generateReportBtn.addEventListener("click", () => runAction(generateReport));
els.claimTaskBtn.addEventListener("click", () => runAction(claimTask));
els.submitTaskBtn.addEventListener("click", () => runAction(submitTask));
els.acceptTaskBtn.addEventListener("click", () => runAction(acceptTask));
els.rejectTaskBtn.addEventListener("click", () => runAction(rejectTask));
els.refreshBtn.addEventListener("click", () => runAction(refreshTask));

window.addEventListener("load", async () => {
  try {
    const savedLanguage = localStorage.getItem("agentbond-lite-language") || "en";
    applyLanguage(savedLanguage);
    applyTemplate(state.selectedTemplate);
    await loadConfig();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : t("configFailed"));
  }
});
