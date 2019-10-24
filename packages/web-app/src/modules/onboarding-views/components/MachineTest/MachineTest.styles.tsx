// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  textContainer: {
    color: theme.lightGreen,
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    padding: '0 5rem',
  },

  breadcrumb: {
    width: '100%',

    '& ul': {
      width: '100%',
    },
  },

  content: {
    color: theme.lightGreen,
    fontSize: theme.medium,
  },
})
