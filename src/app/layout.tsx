import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { Typography, Box, Container } from '@mui/material';
import Image from 'next/image';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
                gap: 2, 
                py: 2
              }}>
                <Image src="/tome_gg_logo.avif" alt="Tome.gg" width={32} height={32} />
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                  Tome.gg
                </Typography>
              </Box>
            </Container>
          </Box>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
