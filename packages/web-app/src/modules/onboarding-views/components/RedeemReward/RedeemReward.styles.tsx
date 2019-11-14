// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  startTestBtn: {
    backgroundColor: theme.green,
    boxShadow: `0 0 10px 2px rgba(${theme.rgbGreen}, .25)`,
    border: 'none 0',
    width: '32.5%',
    margin: `0 0 ${theme.mediumLarge}`,
    padding: 0,

    '& .btn': {
      color: theme.darkBlue,
      fontFamily: theme.fontGroteskBook25,
      fontSize: theme.small,
      lineHeight: '1.75rem',
      width: '100%',
      margin: 0,
      padding: 0,
    },
  },

  marginTop: {
    marginTop: theme.xLarge,
  },

  appStartButton: {
    marginLeft: 'auto',
  },

  userStatsSummary: {
    marginTop: theme.small,
    display: 'flex',

    '& > div': {
      marginLeft: 'auto',
    },
  },

  displayFlex: {
    display: 'flex',
    flexDirection: 'column',
  },

  nextButtonContainer: {
    display: 'flex',
  },

  pullRight: {
    marginLeft: 'auto',
  },

  selectedRewardContainer: {
    '& > div': {
      marginLeft: 'auto',
    },
  },
})
