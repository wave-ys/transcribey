import type {Metadata} from 'next'
import {Inter as FontSans} from "next/font/google"
import './globals.css'
import React from "react";
import {ThemeProvider} from "@/components/provider/theme-provider";
import {cn} from "@/lib/utils";
import {dir} from 'i18next'
import {languages} from "@/app/i18n/settings";
import {AlertProvider} from "@/components/provider/alert-provider";
import {Toaster} from "@/components/ui/toaster";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import {TooltipProvider} from "@/components/ui/tooltip";

export async function generateStaticParams() {
  return languages.map((lng) => ({lng}))
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Transcribey'
}

export default function RootLayout(
  {
    children,
    params: {
      lng
    }
  }: {
    children: React.ReactNode,
    params: {
      lng: string
    }
  }) {
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
    <body className={cn(
      "h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
    >
      <TooltipProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </TooltipProvider>
      <Toaster/>
    </ThemeProvider>
    </body>
    </html>
  )
}
