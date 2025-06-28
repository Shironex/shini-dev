"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { TRPCReactProvider } from "@/trpc/client"
import { Toaster } from "@shini-dev/ui/components/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <TRPCReactProvider>{children}</TRPCReactProvider>
      <Toaster />
    </NextThemesProvider>
  )
}
