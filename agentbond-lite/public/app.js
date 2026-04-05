const state = {
  provider: null,
  signer: null,
  account: null,
  contract: null,
  config: null,
  abi: null,
  selectedTemplate: "governance"
};

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

  setStatus(`Loaded ${templateName} demo template.`);
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
  els.aiModeLabel.textContent = data.deployment?.address ? "Live contract" : "Awaiting deploy";
  els.contractAddressLabel.textContent = data.deployment?.address || "No deployment found";

  if (data.deployment?.address) {
    setStatus(`Contract live at ${shorten(data.deployment.address)}. Connect a wallet to run the demo.`);
  }
}

async function ensureProvider() {
  if (!window.ethereum) {
    throw new Error("No injected wallet found. Install MetaMask, Rabby, or another EVM wallet.");
  }

  if (!state.provider) {
    state.provider = new ethers.BrowserProvider(window.ethereum);
  }

  return state.provider;
}

async function switchToEtherlink() {
  if (!window.ethereum) {
    throw new Error("No wallet available for network switching.");
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

  setStatus(`Connected ${shorten(account)} on Etherlink.`);
}

async function createTask() {
  if (!state.contract) {
    throw new Error("Connect a wallet first.");
  }

  const title = els.titleInput.value.trim();
  const brief = els.briefInput.value.trim();
  const reward = ethers.parseEther(els.rewardInput.value || "0");
  const stake = ethers.parseEther(els.stakeInput.value || "0");

  const tx = await state.contract.createTask(title, brief, stake, { value: reward });
  setStatus(`Creating task... ${tx.hash}`);
  const receipt = await tx.wait();
  const taskId = await state.contract.nextTaskId() - 1n;

  els.taskIdInput.value = taskId.toString();
  els.submissionUriInput.value = `ipfs://agentbond-lite/${state.selectedTemplate}/task-${taskId.toString()}`;
  setStatus(`Task ${taskId} created in block ${receipt.blockNumber}.`);
  await refreshTask();
}

async function generateReport() {
  els.aiModeLabel.textContent = "Generating";

  const response = await fetch("/api/ai/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: state.selectedTemplate,
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
  setStatus("Report ready. Anchor the hash onchain when you are ready.");
}

async function claimTask() {
  if (!state.contract) {
    throw new Error("Connect a wallet first.");
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const task = await state.contract.getTask(taskId);
  const tx = await state.contract.claimTask(taskId, { value: task.stakeRequired });
  setStatus(`Claiming task ${taskId}... ${tx.hash}`);
  await tx.wait();
  setStatus(`Task ${taskId} claimed with bonded stake.`);
  await refreshTask();
}

async function submitTask() {
  if (!state.contract) {
    throw new Error("Connect a wallet first.");
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const report = els.reportOutput.value.trim();
  const uri = els.submissionUriInput.value.trim();

  if (!report) {
    throw new Error("Generate a report first.");
  }

  const hash = ethers.keccak256(ethers.toUtf8Bytes(report));
  const tx = await state.contract.submitTask(taskId, uri, hash);
  setStatus(`Submitting report hash... ${tx.hash}`);
  await tx.wait();
  setStatus(`Task ${taskId} submitted. Hash anchored onchain.`);
  await refreshTask();
}

async function acceptTask() {
  if (!state.contract) {
    throw new Error("Connect a wallet first.");
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const tx = await state.contract.acceptTask(taskId);
  setStatus(`Accepting task ${taskId}... ${tx.hash}`);
  await tx.wait();
  setStatus(`Task ${taskId} accepted. Reward released and stake returned.`);
  await refreshTask();
}

async function rejectTask() {
  if (!state.contract) {
    throw new Error("Connect a wallet first.");
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const tx = await state.contract.rejectTask(taskId);
  setStatus(`Rejecting task ${taskId}... ${tx.hash}`);
  await tx.wait();
  setStatus(`Task ${taskId} rejected. Reward refunded and stake slashed.`);
  await refreshTask();
}

async function refreshTask() {
  if (!state.contract) {
    els.taskState.textContent = "No deployment loaded yet.";
    return;
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const task = await state.contract.getTask(taskId);
  els.taskState.textContent = formatTask(task);
}

async function loadDemoTask() {
  applyTemplate("governance");
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
    applyTemplate(state.selectedTemplate);
    await loadConfig();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Failed to load app config.");
  }
});
