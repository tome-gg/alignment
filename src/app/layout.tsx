import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { Typography, Box, Container, Link } from '@mui/material';
import Image from 'next/image';
import Script from 'next/script';

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
          <Box sx={{ 
            borderBottom: '1px solid', 
            borderColor: 'divider',
            bgcolor: 'background.default'
          }}>
            <Container maxWidth="lg">
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                py: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Link style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, textDecoration: 'none', cursor: 'pointer', color: 'black' }} href="https://tome.gg" target="_blank" rel="noopener noreferrer"> 
                  <Image src="/tome_gg_logo.avif" alt="Tome.gg" width={32} height={32} />
                  <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                    Tome.gg
                  </Typography>
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    darrensapalo
                  </Typography>
                  <Link 
                    href="https://github.com/darrensapalo/growth-journal" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ 
                      textDecoration: 'underline',
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Growth Journal
                  </Link>
                </Box>
              </Box>
            </Container>
          </Box>
          {children}
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
