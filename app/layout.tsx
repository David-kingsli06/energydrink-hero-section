import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA Energy | Sub-Zero Interactive 3D Showcase",
  description: "Next-generation cryogenic energy drink crafted for peak human endurance and focus.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
