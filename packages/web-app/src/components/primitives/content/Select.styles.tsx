// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  prettySelect: {
    width: 250,

    '& select': {
      backgroundColor: theme.darkBlue,
      color: theme.green,
      border: `solid 1px ${theme.green}`,
      display: 'block',
      width: '100%',
      padding: '10px 5px',
      fontFamily: theme.fontGroteskBook25,
    },
  },
})
