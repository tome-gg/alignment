import type { Metadata } from "next";
import { Geist, Figtree } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import Script from 'next/script';
import { TomeProviderSWR } from '../contexts/TomeContextSWR';
import { SWRProvider } from '../contexts/SWRProvider';
import Header from '../components/Header';
import PerformanceMonitor from '../components/PerformanceMonitor';
import { Suspense } from 'react';
// import { SWRDebugger } from '../components/SWRDebugger';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});


export const metadata: Metadata = {
  title: "Growth Journal | Tome.gg",
  description: "A calendar visualization showing daily percentage changes over time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
        
        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preload critical API route */}
        <link rel="prefetch" href="/api/repository" />
        
        {/* Resource hints for better performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
      </head>
      <body className={`${geistSans.variable} ${figtree.variable} `}>
        <ThemeRegistry>
          <SWRProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <TomeProviderSWR>
                <Header />
                {children}
                <PerformanceMonitor />
                {/* <SWRDebugger /> */}
              </TomeProviderSWR>
            </Suspense>
          </SWRProvider>
        </ThemeRegistry>
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9P755HMHC8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9P755HMHC8');
          `}
        </Script>
      </body>
    </html>
  );
}
