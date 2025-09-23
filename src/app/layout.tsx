import type { Metadata } from "next";
import { Geist, Figtree } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import Script from 'next/script';
import { TomeProviderSWR } from '../contexts/TomeContextSWR';
import { SWRProvider } from '../contexts/SWRProvider';
import Header from '../components/Header';
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
  title: "Tome.gg - Alignment Calendar",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
      </head>
      <body className={`${geistSans.variable} ${figtree.variable} `}>
        <ThemeRegistry>
          <SWRProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <TomeProviderSWR>
                <Header />
                {children}
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
