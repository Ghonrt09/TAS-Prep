import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileMenuDrawer from "@/components/MobileMenuDrawer";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { MobileMenuProvider } from "@/context/MobileMenuContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BilimBridge | Подготовка к НИШ, БИЛ, РФМШ",
  description:
    "Платформа для учеников 5–6 классов, готовящихся к вступительным экзаменам НИШ, БИЛ и РФМШ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <LanguageProvider>
          <AuthProvider>
            <MobileMenuProvider>
              <div className="min-h-screen">
                <Navbar />
                <MobileMenuDrawer />
                <main>{children}</main>
              </div>
            </MobileMenuProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
