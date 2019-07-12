// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  btn: {
    border: '1px solid ' + theme.lightGreen,
    display: 'inline-block',
    padding: '6px 2px',
    position: 'relative',
    textAlign: 'center',
    transition: 'background 600ms ease, color 600ms ease',
  },

  toggle: {
    display: 'none',

    '& + label': {
      color: theme.darkGreen,
      cursor: 'pointer',
      minWidth: 50,
      fontFamily: theme.fontGroteskLight25,
      fontSize: theme.small,
      textTransform: 'uppercase',
      lineHeight: '20px',

      '&.disabled': {
        background: 'rgba(200, 200, 200, .6)',
        color: '#fff',
        cursor: 'default',
      },

      '&:after': {
        content: '""',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        zIndex: -1,
        transition: 'left 200ms cubic-bezier(0.77, 0, 0.175, 1)'
      }
    },

    '&.toggle-left + label': {
      borderRight: 0,

      '&:after': {
        left: '100%',
      }
    },

    '&.toggle-right + label': {
      '&:after': {
        left: '-100%',
      }
    },

    '&:checked + label': {
      background: theme.mediumGreen,
      color: theme.lightGreen,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      cursor: 'default',
      transition: 'color 200ms',

      '&.disabled': {
        boxShadow: 'none'
      },

      '&:after': {
        left: 0,
      }
    }
  },
})
