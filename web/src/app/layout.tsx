import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "TravelTrack AI | SIH 2025",
  description: "AI-powered travel data collection platform",
};
import { Navigation } from "@/components/layout/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50">
        <Providers>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 pb-20 lg:pb-0">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
