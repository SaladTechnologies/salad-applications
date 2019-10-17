// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  step: {
    color: theme.green,
    textTransform: 'uppercase',
    height: 25,
    padding: '5px 0',
  },

  completed: {
    // backgroundColor: theme.green,
    backgroundImage: `linear-gradient(70deg, ${theme.green} 85%, ${theme.darkGreen} 118%)`,
    color: theme.darkBlue,
  },

  label: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: '10px',
    letterSpacing: '1.5px',
    display: 'block',
    padding: '5px 0 5px 20px',
  },

  disabled: {
    color: theme.darkGreen,
  },
})
