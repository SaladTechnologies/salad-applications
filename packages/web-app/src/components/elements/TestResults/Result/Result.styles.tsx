// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  result: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  pluginName: {
    width: '36%',

    '& label': {
      display: 'flex',
      height: '100%',
      alignItems: 'center',
    },
  },

  pluginStatus: {
    display: 'flex',

    '& label': {
      display: 'flex',
      height: '100%',
      marginLeft: '10px',
      alignItems: 'center',
    },
  },

  error: {
    flex: '0 1 100%',
    marginTop: theme.large,
  },
})
