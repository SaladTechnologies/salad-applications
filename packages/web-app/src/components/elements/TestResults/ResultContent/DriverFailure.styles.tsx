// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  supportButton: {
    backgroundColor: 'transparent',
    color: theme.green,
    border: `solid 1px ${theme.green}`,
    textAlign: 'center',
    fontSize: theme.small,
    fontFamily: theme.fontGroteskBook25,
    textTransform: 'uppercase',
    width: 160,
    margin: '0 15px 0 0',
    padding: '10px 20px',
    textDecoration: 'none',
    order: 1,

    '&:hover': {
      opacity: 0.8,
    },
    '&:focus': {
      outline: 0,
    },
  },

  buttonContainer: {
    display: 'flex',
    marginTop: 10
  },
})
