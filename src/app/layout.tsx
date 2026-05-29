import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/context/ToastContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MedSupply UZ - Tibbiyot Texnikalari",
  description: "B2B E-commerce platform for medical equipment and services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={inter.className} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <LanguageProvider>
          <ToastProvider>
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <MobileBottomNav />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
