// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  breadcrumb: {
    width: '100%',

    '& ul': {
      width: '100%',
    },
  },

  earnings: {
    display: 'flex',
  },

  earningsPerDay: {
    order: 0,
    width: '33%',
    marginRight: 22,
  },

  earningsOverTime: {
    order: 1,
    width: '33%',
  },
})
