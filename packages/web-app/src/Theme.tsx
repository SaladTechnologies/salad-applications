import type { Theme } from '@emotion/react'

export type { Theme }

const fontFamilyPrimary =
  'Mallory, BlinkMacSystemFont, -apple-system, Work Sans, Segoe UI, Fira Sans, Helvetica Neue, Helvetica, Arial, sans-serif'
const fontFamilyMedium =
  'Mallory Medium, BlinkMacSystemFont, -apple-system, Work Sans, Segoe UI, Fira Sans, Helvetica Neue, Helvetica, Arial, sans-serif'

export const DefaultTheme: Theme = {
  colors: {
    black: '#000000',
    darkBlue: '#0A2133',
    darkGreen: '#1F4F22',
    gray: '#738188',
    green: '#B2D530',
    lightGreen: '#DBF1C1',
    mediumGreen: '#53A626',
    orange: '#FF9933',
    cyan: '#33CCCC',
    magenta: '#FF3399',
    purple: '#6600CC',
    red: '#EF502A',
    yellow: '#FFFF33',
    white: '#FFFFFF',
  },
  gradient: {
    primary: 'linear-gradient(to right, #56A431 , #AACF40)',
  },
  typography: {
    fontFamily: {
      primary: fontFamilyPrimary,
      medium: fontFamilyMedium,
    },
    variants: {
      base4XL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '64px',
        lineHeight: '64px',
      },
      base3XL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '48px',
        lineHeight: '54px',
      },
      baseXXL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '32px',
        lineHeight: '34px',
      },
      baseXL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '24px',
        lineHeight: '26px',
      },
      baseL: {
        fontFamily: fontFamilyPrimary,
        fontSize: '18px',
        lineHeight: '22px',
      },
      baseM: {
        fontFamily: fontFamilyPrimary,
        fontSize: '16px',
        lineHeight: '20px',
      },
      baseS: {
        fontFamily: fontFamilyPrimary,
        fontSize: '14px',
        lineHeight: '18px',
      },
      baseXS: {
        fontFamily: fontFamilyPrimary,
        fontSize: '12px',
        lineHeight: '16px',
      },
    },
  },
  boxShadow: {
    primary: '0px 0px 24px rgba(178, 213, 48, 0.7)',
  },
  breakPoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1280,
  },
}
