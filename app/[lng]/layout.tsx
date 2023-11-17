import type {Metadata} from 'next'
import {Inter as FontSans} from "next/font/google"
import './globals.css'
import React from "react";
import {ThemeProvider} from "@/components/provider/theme-provider";
import {cn} from "@/lib/utils";
import {dir} from 'i18next'
import {languages} from "@/app/i18n/settings";
import {SettingsDialogProvider} from "@/components/provider/dialog-provider";

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
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <SettingsDialogProvider>
        {children}
      </SettingsDialogProvider>
    </ThemeProvider>
    </body>
    </html>
  )
}
