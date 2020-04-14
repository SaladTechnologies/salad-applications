// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  input: {
    marginTop: 5,
    width: 300,
  },

  row: {
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    cursor: 'pointer',
    paddingLeft: 10,
  },

  logoutButton: {
    display: 'inline-block',
    padding: '.25rem 1rem',
    backgroundColor: theme.darkBlue,
    color: theme.green,
    marginLeft: '60rem',
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.small,
    cursor: 'pointer',
    position: 'absolute',
    bottom: '25px',

    '&:hover': {
      opacity: 0.8,
    },
  },

  editIcon: {
    marginTop: '-5px',
  },

  textFieldContainer: {
    display: 'flex',
    height: 60,
  },

  updateButton: {
    top: '-3px',
    padding: 6,
  },

  buttonContainer: {
    display: 'flex',
    height: 47,
  },

  passwordRequirements: {
    margin: '0 0 0 40px',
    padding: 0,

    '& p': {
      marginBottom: 0
    }
  },
})
