import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeadDrop — Etherlink Inheritance Protocol",
  description:
    "AI-powered onchain inheritance. Your crypto, even after you're gone.",
  keywords: ["web3", "inheritance", "etherlink", "tezos", "blockchain", "defi"],
  openGraph: {
    title: "DeadDrop",
    description: "AI-powered onchain inheritance protocol on Etherlink",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#050510] font-mono text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
