import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import AppBar from "@/components/app-bar";
import { AppProvider } from "@/context/AppContext";
import InstallBanner from "@/components/InstallBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prajnanam",
  description: "Knowledge Base for Communities",
  // manifest: "/manifest.json",
  icons: {
    apple: "/images/brand/icon-without-bg.png",
    icon: "/images/brand/icon-without-bg.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Prajnanam",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-17 pb-20 px-3 min-h-screen bg-gray-50`}
      >
        <AppProvider>
          <AppBar />
          {children}
          <Footer />
          <InstallBanner />
        </AppProvider>
      </body>
    </html>
  );
}
