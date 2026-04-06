"use client";

import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import InheritanceForm from "@/components/IntentParserCard";
import VaultStatus from "@/components/VaultStatusCard";
import Footer from "@/components/Footer";

export default function HomeClient() {
  const { address, isConnected } = useAccount();

  return (
    <main className="min-h-screen bg-[#050510]">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#050510]/80 px-6 py-5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚰️</span>
          <div>
            <h1 className="text-base font-bold leading-none tracking-tight">DeadDrop</h1>
            <p className="text-[10px] tracking-[0.3em] text-gray-500">
              ETHERLINK INHERITANCE PROTOCOL
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs text-green-400 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            Etherlink Deployed
          </span>
          <ConnectWallet />
        </div>
      </nav>

      {!isConnected ? (
        <section className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 flex items-center gap-2">
            <span className="rounded-full border border-cyan-400/30 px-4 py-1.5 text-xs tracking-[0.3em] text-cyan-400">
              LITE RELEASE // ETHERLINK DEPLOYED // TEZOS EVM
            </span>
          </div>

          <h2 className="text-5xl font-black leading-[0.9] tracking-tight sm:text-7xl">
            Your crypto.
            <br />
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Even after
              <br />
              you&apos;re gone.
            </span>
          </h2>

          <p className="mb-10 mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
            DeadDrop turns your natural language into an onchain inheritance plan.
            If your wallet goes silent for <strong className="text-white">300 days</strong>,
            your assets go exactly where you said.
          </p>

          <ConnectWallet large />

          <p className="mt-4 text-xs text-gray-600">
            Powered by Etherlink (Tezos EVM) · Low gas · Fast finality
          </p>

          <div className="mt-16 grid w-full max-w-lg grid-cols-3 gap-4 text-center sm:gap-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-black text-red-400 sm:text-3xl">$140B+</p>
              <p className="mt-1 text-xs text-gray-500">
                Lost crypto
                <br />
                globally
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-black text-cyan-400 sm:text-3xl">300</p>
              <p className="mt-1 text-xs text-gray-500">
                Day inactivity
                <br />
                threshold
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-black text-green-400 sm:text-3xl">0</p>
              <p className="mt-1 text-xs text-gray-500">
                Trusted third
                <br />
                parties needed
              </p>
            </div>
          </div>

          <div className="mt-20 w-full max-w-2xl text-left">
            <h3 className="mb-6 text-center text-xs tracking-[0.3em] text-gray-500">
              HOW IT WORKS
            </h3>
            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Write your plan",
                  desc: 'Type your inheritance in plain English. "Send 70% to my wife and 30% to charity."',
                },
                {
                  step: "02",
                  title: "AI parses it",
                  desc: "Our AI converts your words into a structured onchain inheritance contract on Etherlink.",
                },
                {
                  step: "03",
                  title: "Vault monitors you",
                  desc: "AI agent checks your wallet every 24 hours. At day 293, you get a warning email.",
                },
                {
                  step: "04",
                  title: "Automatic execution",
                  desc: "At day 300, if no response, the smart contract executes your plan. Trustless. Permanent.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="shrink-0 text-2xl font-black text-gray-700">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="mt-1 text-xs text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-2xl px-4 py-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black">Your DeadDrop Vault</h2>
            <p className="mt-1 text-sm text-gray-400">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>

          <VaultStatus address={address!} />
          <InheritanceForm address={address!} />
        </section>
      )}

      <Footer />
    </main>
  );
}
