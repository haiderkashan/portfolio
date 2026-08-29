import { Archivo, Inter_Tight } from 'next/font/google'

export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
})

export const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
})

export const fontVariables = `${archivo.variable} ${interTight.variable}`

