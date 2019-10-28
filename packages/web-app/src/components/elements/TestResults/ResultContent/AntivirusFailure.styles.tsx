// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  avError: {
    display: 'flex',
    flexDirection: 'column',
  },

  avSelectContainer: {
    display: 'flex',
    flex: '0 1 100%',
    margin: `${theme.mediumLarge} 0 ${theme.large}`,
  },

  avSelect: {
    order: 1
  },

  supportButton: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    border: 'none',
    textAlign: 'center',
    fontSize: theme.small,
    fontFamily: theme.fontGroteskBook25,
    textTransform: 'uppercase',
    margin: '0 0 0 15px',
    padding: '12px 20px 8px',
    textDecoration: 'none',
    order: 1,

    '&:hover': {
      opacity: 0.8,
    },
    '&:focus': {
      outline: 0,
    },
  },

  pathContainer: {},

  installPath: {
    color: theme.green,
    letterSpacing: '0.05rem !important',
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
