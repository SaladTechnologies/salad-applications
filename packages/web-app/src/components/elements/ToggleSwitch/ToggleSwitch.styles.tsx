// Theme
import { SaladTheme } from '../../../SaladTheme'

export const styles = (theme: SaladTheme) => ({
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '60px',
    height: '34px',

    '& .input': {
      opacity: 0,
      width: 0,
      height: 0,
    },
  },

  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    transition: '.4s',

    '&:before': {
      position: 'absolute',
      content: '',
      height: '26px',
      width: '26px',
      left: '4px',
      bottom: '4px',
      backgroundColor: 'white',
      transition: '.4s',
    },

    '&.round': {
      borderRadius: '34px',

      '&:before': {
        borderRadius: '50%',
      }
    }
  },

  input: {
    '&:checked': {
      '&:before': {
        transform: 'translateX(26px)'
      },

      '& + .slider': {
        backgroundColor: '#666',
      },
    },

    '&:focus': {
      '& + .slider': {
        boxShadow: '0 0 1px #ccc'
      },
    },
  },
})
