import { Archivo, Inter_Tight, Caveat } from 'next/font/google'

export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

export const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

export const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-caveat',
  display: 'swap',
})

export const fontVariables = `${archivo.variable} ${interTight.variable} ${caveat.variable}`

