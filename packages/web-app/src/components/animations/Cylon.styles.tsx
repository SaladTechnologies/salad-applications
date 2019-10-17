// Theme
import { SaladTheme } from '../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  cylon: {
    backgroundColor: theme.green,
    width: '100%',
    height: 1,
    boxShadow: `0 0 10px 2px rgba(${theme.rgbGreen}, .25)`,
  },
})
