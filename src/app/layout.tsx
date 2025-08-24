import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import AppBar from "@/components/app-bar";
import { AppProvider } from "@/context/AppContext";
import InstallBanner from "@/components/InstallBanner";
import Script from "next/script";
import Analytics from "@/components/analytics";
import { Suspense } from "react";
import { GA_MEASUREMENT_ID } from "@/utils/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Prajnanam',
  description: 'Knowledge Base for Communities',
  manifest: '/manifest.json',

  icons: {
    icon: '/images/brand/icon-without-bg.png',
    apple: '/images/brand/icon-without-bg.png',
    shortcut: '/images/brand/icon-without-bg.png',
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Prajnanam',
  },

  applicationName: 'Prajnanam',
  generator: 'Next.js',
  keywords: [
    'Prajnanam',
    'Knowledge App',
    'Community Learning',
    'Indian Culture',
    'Education',
    'Kannada',
    'Cultural App',
  ],
  authors: [{ name: 'Prajnanam Team', url: 'https://prajnanam.netlify.app' }],
  creator: 'Prajnanam Team',
  publisher: 'Prajnanam',
  category: 'education',

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://prajnanam.netlify.app',
    title: 'Prajnanam',
    description:
      'Prajnanam is a knowledge-based mobile application that makes cultural, educational, and social subjects easily accessible to everyone.',
    siteName: 'Prajnanam',
    images: [
      {
        url: '/images/brand/social-preview.png',
        width: 1200,
        height: 630,
        alt: 'Prajnanam Social Preview',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Prajnanam',
    description:
      'Prajnanam is a knowledge-based mobile application that makes cultural, educational, and social subjects easily accessible to everyone.',
    images: ['/images/brand/social-preview.png'],
    creator: '@prajnanamapp', // update with your real handle
  },

  metadataBase: new URL('https://prajnanam.netlify.app'),

  alternates: {
    canonical: 'https://prajnanam.netlify.app',
    languages: {
      en: 'https://prajnanam.app/en',
      kn: 'https://prajnanam.app/kn',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1749890353284281"
          crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-17 pb-20 px-3 min-h-screen bg-gray-50`}
      >
        <AppProvider>
          <AppBar />
          <Suspense>
            <Analytics />
          </Suspense>
          {children}
          <Footer />
          <InstallBanner />
        </AppProvider>
      </body>
    </html>
  );
}
