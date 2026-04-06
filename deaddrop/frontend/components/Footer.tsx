export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-4 text-xs text-gray-600 sm:flex-row">
        <div className="flex items-center gap-3">
          <span>⚰️ DeadDrop</span>
          <span className="text-gray-700">·</span>
          <span>Built for Tezos EVM AI Hackathon</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://shadownet.explorer.etherlink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan-400"
          >
            Etherlink Explorer
          </a>
          <a
            href="https://faucet.etherlink.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan-400"
          >
            Get Test XTZ
          </a>
          <a
            href="https://github.com/gizdusum/proveit/tree/codex/deaddrop/deaddrop"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cyan-400"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
