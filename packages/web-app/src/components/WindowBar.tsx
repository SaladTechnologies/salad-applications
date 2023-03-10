import { SvgIcon } from '@saladtechnologies/garden-components'
import { Minus, Square, X } from '@saladtechnologies/garden-icons'
import withStyles, { WithStyles } from 'react-jss'
import type { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  bar: {
    alignItems: 'center',
    background: theme.darkBlue,
    borderBottom: `solid 1px ${theme.lightGreen}`,
    color: theme.green,
    display: 'flex',
    height: '2rem',
    justifyContent: 'flex-end',
    userSelect: 'none',
    '-webkit-app-region': 'drag',
    zIndex: 1000,
    position: 'fixed',
    fontFamily: theme.fontGroteskLight25,
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
    paddingRight: 15,
    width: 80,
  },
  button: {
    '-webkit-app-region': 'none',
    cursor: 'pointer',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  onClose: () => void
  onMaximize: () => void
  onMinimize: () => void
}

const _WindowBar = ({ onClose, onMaximize, onMinimize, classes }: Props) => {
  return (
    <div className={classes.bar}>
      <div className={classes.iconContainer}>
        <div className={classes.button} onClick={onMinimize}>
          <SvgIcon stroke="light">
            <Minus />
          </SvgIcon>
        </div>
        <div className={classes.button} onClick={onMaximize}>
          <SvgIcon stroke="light">
            <Square />
          </SvgIcon>
        </div>
        <div className={classes.button} onClick={onClose}>
          <SvgIcon stroke="light">
            <X />
          </SvgIcon>
        </div>
      </div>
    </div>
  )
}

export const WindowBar = withStyles(styles)(_WindowBar)
