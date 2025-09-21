"use client"
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
 
export function ThemeProviderClient({
  children,
  ...props
}) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}