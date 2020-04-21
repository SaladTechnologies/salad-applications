import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    padding: '0.25rem 0',
    userSelect: 'none',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.lightGreen,
  },
  checkBox: {
    width: '1rem',
    height: '1rem',
    flex: 'none',
    borderWidth: '1px',
    borderColor: 'inherit',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabled: {
    cursor: 'pointer',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  checkmark: {
    color: 'inherit',
    position: 'absolute',
  },
  text: {
    paddingLeft: 8,
    fontFamily: 'sharpGroteskBook19',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'capitalize',
  },
  errorText: {
    margin: '.25rem',
    color: theme.red,
    fontFamily: 'sharpGroteskBook25',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  name?: string
  value?: any
  checked?: boolean
  disabled?: boolean
  text?: string
  errorText?: string
  textClassName?: string
  className?: string
  onClick?: () => void
}

class _Checkbox extends Component<Props> {
  handleClick = () => {
    const { onClick, disabled } = this.props

    if (disabled) return

    onClick?.()
  }

  render() {
    const { textClassName, disabled, className, text, errorText, checked, classes } = this.props
    return (
      <div className={classnames(classes.container, className)}>
        <label
          className={classnames(classes.checkboxContainer, {
            [classes.enabled]: !disabled,
            [classes.disabled]: disabled,
          })}
        >
          <div className={classes.checkBox} onClick={this.handleClick}>
            {checked && <FontAwesomeIcon size="xs" className={classes.checkmark} icon={faCheck} />}
          </div>
          <p className={classnames(textClassName, classes.text)} onClick={this.handleClick}>
            {text}
          </p>
        </label>
        {errorText && <div className={classes.errorText}>{errorText}</div>}
      </div>
    )
  }
}

export const Checkbox = withStyles(styles)(_Checkbox)
