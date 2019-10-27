// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  phraseViewer: {
    display: 'flex',
    height: 80,
    marginBottom: theme.mediumLarge,
  },

  logo: {
    order: 0,
    width: '60px',
    height: '70px',
    marginLeft: theme.xxLarge,
    marginRight: theme.xxLarge,
  },

  phrases: {
    order: 1,
  },
})
