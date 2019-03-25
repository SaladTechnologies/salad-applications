export interface SaladTheme {
  //Colors
  darkBlue: string
  darkGreen: string
  mediumGreen: string
  green: string
  lightGreen: string

  red: string
  //Font sizes
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
}

export const DefaultTheme: SaladTheme = {
  //Colors
  darkBlue: '#0A2133',
  darkGreen: '#1F4F22',
  mediumGreen: '#53A626',
  green: '#B2D530',
  lightGreen: '#DBF1C1',

  red: '#EF502A',
  //Font sizes
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
}
