// Theme
import { SaladTheme } from '../../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  textContainer: {
    color: theme.lightGreen,
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    padding: '0 5rem',
  },

  content: {
    color: theme.lightGreen,
    fontSize: theme.medium,
  },

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

  stopTest: {
    display: 'flex',
  },

  stopTestBtn: {
    boxShadow: `0 0 10px 2px rgba(${theme.rgbGreen}, .25)`,
    width: '32.5%',
    margin: `0 0 ${theme.mediumLarge} auto`,
    padding: 0,
    opacity: '.5',

    '& .btn': {
      // color: theme.darkBlue,
      fontFamily: theme.fontGroteskBook25,
      fontSize: theme.small,
      lineHeight: '1.75rem',
      width: '100%',
      margin: 0,
      padding: 0,
    },
  },

  runTestLaterBtn: {
    backgroundColor: 'transparent !important',
    border: `solid 1px ${theme.green} !important`,
    boxShadow: `none !important`,

    '& .btn': {
      color: `${theme.green} !important`,
    },
  },

  errorText: {
    width: '45%',
    margin: 0,
  },

  marginTop: {
    marginTop: theme.xLarge,
  },

  nextButtonContainer: {
    display: 'flex',
  },

  pullRight: {
    marginLeft: 'auto'
  }
})
