// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  menu: {
    width: '30%',
    padding: '1.5rem 2rem'
  },
  menuItems: {
    '& .menuTitle': {
      color: theme.lightGreen
    },
    '& .linkListUnstyled': {
      '& .linkListItem': {
        '&:hover': {
          backgroundColor: 'rgba(10, 23, 41, 0.9)',
        },

        '& .menuTitle': {
          color: theme.green,
          display: 'block',
          padding: `${theme.xSmall} 0`,
          cursor: 'pointer',
        }
      },
    }
  },

  settings: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    order: 1,
    width: '70%',
    padding: '1.5rem 2rem',
  },

  bugButton: {
    display: 'inline-block',
    padding: '.25rem 1rem',
    backgroundColor: theme.darkBlue,
    color: theme.green,
    marginLeft: '1rem',
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
})
