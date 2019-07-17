// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  hr: {
    borderColor: theme.lightGreen,
    borderWidth: '0 0 1px',
    marginTop: theme.mediumLarge,
  },

  main: {
    display: 'flex',
    marginTop: theme.large,
  },

  toggler: {
    flex: '0 0 auto', 
    margin: '0 1.5rem 0 0',
  },

  description: {
    order: 1,
  }
})
