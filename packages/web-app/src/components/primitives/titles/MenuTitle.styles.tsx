// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  menuTitle: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: theme.small,
    lineHeight: theme.small,
    letterSpacing: '0.01rem',
    fontWeight: 'normal',

    '& a': {
      color: theme.green,
      textDecoration: 'none',

      '&:hover, &:active, &.active': {
        color: `${theme.lightGreen} !important`
      }
    },
  }
})