// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  avError: {
    display: 'flex',
    flexDirection: 'column',
  },

  avSelectContainer: {
    flex: '0 1 100%',
    margin: `${theme.mediumLarge} 0 ${theme.large}`, //'20px 0 40px',
  },

  pathContainer: {

  },

  installPath: {
    color: theme.green,
    letterSpacing: '0.05rem !important'
  },

  iconButton: {
    color: theme.green,
    cursor: 'pointer',
    marginLeft: '1rem',
    
    '&:active': {
      opacity: 0.75,
    },
  },
})
