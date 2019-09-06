// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  container: {},

  logoutButton: {
    backgroundColor: theme.darkBlue,
    position: 'absolute',
    bottom: theme.large,
    right: '2rem',

    '& button': {
      color: theme.lightGreen,
    },
  },
})
