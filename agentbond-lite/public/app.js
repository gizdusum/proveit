const state = {
  provider: null,
  signer: null,
  account: null,
  contract: null,
  config: null,
  abi: null
};

const els = {
  connectBtn: document.getElementById("connectBtn"),
  switchBtn: document.getElementById("switchBtn"),
  explorerLink: document.getElementById("explorerLink"),
  walletStatus: document.getElementById("walletStatus"),
  networkLabel: document.getElementById("networkLabel"),
  aiModeLabel: document.getElementById("aiModeLabel"),
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
  taskState: document.getElementById("taskState")
};

const STATUS_LABELS = ["Open", "Claimed", "Submitted", "Accepted", "Rejected", "Cancelled"];

function setStatus(message) {
  els.walletStatus.textContent = message;
}

function shorten(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "-";
}

function formatTask(task) {
  return JSON.stringify(
    {
      client: task.client,
      agent: task.agent,
      rewardXTZ: ethers.formatEther(task.reward),
      stakeXTZ: ethers.formatEther(task.stakeRequired),
      createdAt: Number(task.createdAt),
      claimedAt: Number(task.claimedAt),
      resolvedAt: Number(task.resolvedAt),
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
  els.aiModeLabel.textContent = data.deployment?.address ? "Contract ready" : "Awaiting deploy";

  if (data.deployment?.address) {
    setStatus(`Contract deployed at ${shorten(data.deployment.address)}. Connect a wallet to interact.`);
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
    throw new Error("Deploy the contract and connect a wallet first.");
  }

  const title = els.titleInput.value.trim();
  const brief = els.briefInput.value.trim();
  const reward = ethers.parseEther(els.rewardInput.value || "0");
  const stake = ethers.parseEther(els.stakeInput.value || "0");

  const tx = await state.contract.createTask(title, brief, stake, { value: reward });
  setStatus(`Creating task onchain... ${tx.hash}`);
  const receipt = await tx.wait();
  const taskId = await state.contract.nextTaskId() - 1n;
  els.taskIdInput.value = taskId.toString();
  setStatus(`Task ${taskId} created. Tx confirmed in block ${receipt.blockNumber}.`);
  await refreshTask();
}

async function generateReport() {
  els.aiModeLabel.textContent = "Generating";

  const response = await fetch("/api/ai/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
  els.aiModeLabel.textContent = data.mode === "openai" ? `Live AI (${data.model})` : "Template fallback";
  setStatus("AI report generated. You can now claim and submit.");
}

async function claimTask() {
  if (!state.contract) {
    throw new Error("Deploy the contract and connect a wallet first.");
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const task = await state.contract.getTask(taskId);
  const tx = await state.contract.claimTask(taskId, { value: task.stakeRequired });
  setStatus(`Claiming task ${taskId}... ${tx.hash}`);
  await tx.wait();
  setStatus(`Task ${taskId} claimed with stake locked.`);
  await refreshTask();
}

async function submitTask() {
  if (!state.contract) {
    throw new Error("Deploy the contract and connect a wallet first.");
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const report = els.reportOutput.value.trim();
  const uri = els.submissionUriInput.value.trim();

  if (!report) {
    throw new Error("Generate a report first so the submission hash can be anchored onchain.");
  }

  const hash = ethers.keccak256(ethers.toUtf8Bytes(report));
  const tx = await state.contract.submitTask(taskId, uri, hash);
  setStatus(`Submitting task ${taskId} hash... ${tx.hash}`);
  await tx.wait();
  setStatus(`Task ${taskId} submitted with hash ${hash.slice(0, 12)}...`);
  await refreshTask();
}

async function acceptTask() {
  if (!state.contract) {
    throw new Error("Deploy the contract and connect a wallet first.");
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const tx = await state.contract.acceptTask(taskId);
  setStatus(`Accepting task ${taskId}... ${tx.hash}`);
  await tx.wait();
  setStatus(`Task ${taskId} accepted. Reward and stake released.`);
  await refreshTask();
}

async function rejectTask() {
  if (!state.contract) {
    throw new Error("Deploy the contract and connect a wallet first.");
  }

  const taskId = BigInt(els.taskIdInput.value || "0");
  const tx = await state.contract.rejectTask(taskId);
  setStatus(`Rejecting task ${taskId}... ${tx.hash}`);
  await tx.wait();
  setStatus(`Task ${taskId} rejected. Stake slashed to treasury.`);
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
  const response = await fetch("/api/demo/task");
  const data = await response.json();
  els.titleInput.value = data.task.title;
  els.briefInput.value = data.task.brief;
  els.focusInput.value = data.task.focus;
  setStatus("Demo task loaded.");
}

async function runAction(action) {
  try {
    await action();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Unknown error.");
  }
}

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
    await loadConfig();
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Failed to load app config.");
  }
});
