import localFont from 'next/font/local'

// Same font files as before (still installed via the @fontsource packages),
// just loaded through next/font/local instead of a CSS @import. This gets
// automatic <link rel="preload">, font-display handling, and a fallback
// metric match to reduce layout shift while the font loads - none of which
// a plain @import gives you.

export const archivo = localFont({
  src: '../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-archivo',
  display: 'swap',
})

export const interTight = localFont({
  src: '../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-inter-tight',
  display: 'swap',
})

export const caveat = localFont({
  src: [
    {
      path: '../node_modules/@fontsource/caveat/files/caveat-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/caveat/files/caveat-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-caveat',
  display: 'swap',
})

export const fontVariables = `${archivo.variable} ${interTight.variable} ${caveat.variable}`
