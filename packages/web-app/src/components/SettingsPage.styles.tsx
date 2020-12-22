import { SaladTheme } from '../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  menu: {
    // flex: '0 0 294px', // equates to: 358px total width
    flex: '0 0 200px', // equates to: 304px total width
    position: 'relative',
    padding: '1.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '3px 0px 3px 0px rgba(0,0,0,0.4)',
  },

  menuItem: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: theme.fontGroteskBook25,
    fontSize: theme.small,
    lineHeight: theme.small,
    letterSpacing: '0.01rem',
    fontWeight: 'normal',
    color: theme.green,
    cursor: 'pointer',
    '&:hover': {
      color: theme.lightGreen,
    },
  },
  backButton: {
    paddingRight: 5,
    width: 15,
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
              color: theme.lightGreen,
            },
          },
        },
      },
    },
    '& hr': {
      border: `solid 1px ${theme.lightGreen}`,
    },
  },

  settings: {
    backgroundColor: theme.darkBlue,
    color: theme.lightGreen,
    order: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
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
  updateSalad: {
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  versionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    color: theme.mediumGreen,
    paddingTop: '1rem',
  },
  outOfDateLabel: {
    color: theme.darkRed,
  },
})
