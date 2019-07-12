// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  menu: {
    flex: '0 0 294px', // equates to: 358px total width
    position: 'relative',
    padding: '1.5rem 2rem'
  },

  menuItems: {
    '& .linkListUnstyled': {
      '& .linkListItem': {
        '& .menuTitle': {
          margin: 0,
          padding: 0,

          '& a': {
            display: 'block',
            margin: 0,
            padding: `${theme.small} 0`,
            cursor: 'pointer',

            '&:hover': {
              color: theme.lightGreen
            }
          }
        }
      },
    },
    '& hr': {
      border: `solid 1px ${theme.lightGreen}`
    },
  },

  settings: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    order: 1,
    width: '100%',
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

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: '1.5rem',
    left: '1.5rem',
  },

  closeButton: {
    border: 'solid 3px ' + theme.lightGreen,
    color: theme.lightGreen,
    position: 'absolute',
    top: 30,
    right: 30,
    cursor: 'pointer',
    transition: 'color 200ms',
    borderRadius: '50%',
    width: '20px !important',
    height: 20,
    padding: 3,

    '&:hover': {
      border: 'solid 3px ' + theme.darkGreen,
      color: theme.darkGreen,
      transition: 'all 200ms ease',
    }
  }
})
