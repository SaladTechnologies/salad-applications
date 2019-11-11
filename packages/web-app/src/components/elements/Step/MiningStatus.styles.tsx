// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  miningStatus: {
    display: 'flex',
  },

  indicator: {
    order: 0,
  },

  text: {
    order: 1,
  },

  checkmark: {
    width: 30,
    height: 40,
    marginRight: 10,
    position: 'relative',

    '& img': {
      position: 'absolute',
      top: -10,
      left: -10,
    },
  },

  logo: {
    animation: '$pulse 4s infinite',
  },

  '@keyframes pulse': {
    '0%, 100%': { opacity: 0 },
    '50%': { opacity: 1 },
  },
})
