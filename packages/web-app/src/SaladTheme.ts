export interface SaladTheme {
  // Colors
  darkBlue: string
  darkGreen: string
  mediumGreen: string
  green: string
  lightGreen: string
  red: string
  darkRed: string
  orange: string

  // Font sizes
  xxSmall: string
  xSmall: string
  small: string
  medium: string
  mediumLarge: string
  large: string
  singleLarge: string
  doubleLarge: string
  tripleLarge: string
  xLarge: string
  xxLarge: string

  // Font Family
  fontGroteskBook19: string
  fontGroteskBook25: string
  fontGroteskLight05: string
  fontGroteskLight09: string
  fontGroteskLight25: string
  fontGroteskMedium25: string
}

export const DefaultTheme: SaladTheme = {
  // Colors
  darkBlue: '#0A2133',
  darkGreen: '#1F4F22',
  mediumGreen: '#53A626',
  green: '#B2D530',
  lightGreen: '#DBF1C1',
  red: '#EF502A',
  darkRed: '#D61F28',
  orange: '#F6931D',

  // Font sizes
  xxSmall: '.375rem',
  xSmall: '.5rem',
  small: '.75rem',
  medium: '.875rem',
  mediumLarge: '1.125rem',
  large: '1.5rem',
  singleLarge: '2.375rem',
  doubleLarge: '2.5rem',
  tripleLarge: '2.625rem',
  xLarge: '3rem',
  xxLarge: '5rem',

  // Font Family
  fontGroteskBook19: 'sharpGroteskBook19',
  fontGroteskBook25: 'sharpGroteskBook25',
  fontGroteskLight05: 'SharpGroteskLight05',
  fontGroteskLight09: 'SharpGroteskLight09',
  fontGroteskLight25: 'SharpGroteskLight25',
  fontGroteskMedium25: 'sharpGroteskMedium25',
}
