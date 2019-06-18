// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  menu: {
    position: 'relative',
    width: '30%',
    padding: '1.5rem 2rem'
  },
  menuItems: {
    '& .linkListUnstyled': {
      '& .linkListItem': {
        '& .menuTitle': {
          color: theme.green,
          display: 'block',
          padding: `${theme.small} 0`,
          cursor: 'pointer',

          '&:hover, &:active, &.active': {
            color: theme.lightGreen
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

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: '2rem',
    bottom: '1.5rem',
  },
})
