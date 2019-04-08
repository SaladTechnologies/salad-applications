import React, { ReactNode, Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import { AngledPanel, AngleDirection } from './AngledPanel'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    margin: 0,
    padding: 0,
    '&:focus': {
      outline: 0,
    },
  },
  angledPanel: {
    padding: '.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    color: theme.mediumGreen,
    backgroundColor: theme.darkGreen,
    fontSize: theme.small,
    fontFamily: 'sharpGroteskMedium25',
    '&:hover': {
      opacity: 0.7,
    },
  },
  leftPadding: {
    paddingLeft: '1.75rem',
  },
  rightPadding: {
    paddingRight: '1.75rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  leftSide?: AngleDirection
  rightSide?: AngleDirection
  disabled?: boolean
  children?: ReactNode
  className?: string
  onClick?: () => void
}

class _AngledButton extends Component<Props> {
  handleClick = () => {
    const { disabled, onClick } = this.props
    if (!disabled && onClick != null) {
      onClick()
    }
  }

  render() {
    const { className, classes, children, onClick, ...rest } = this.props
    return (
      <button className={classnames(classes.button, className)} onClick={this.handleClick}>
        <AngledPanel
          {...rest}
          className={classnames(classes.angledPanel, {
            [classes.leftPadding]: this.props.leftSide && this.props.leftSide !== 'none',
            [classes.rightPadding]: this.props.rightSide && this.props.rightSide !== 'none',
          })}
        >
          {children}
        </AngledPanel>
      </button>
    )
  }
}

export const AngledButton = withStyles(styles)(_AngledButton)
