import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    padding: '0.25rem 0',
    userSelect: 'none',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    color: theme.lightGreen,
    '&:hover': {
      opacity: 0.7,
    },
  },
  notClickable: {
    '&:hover': {
      opacity: 1,
    },
  },
  checkboxDark: {
    color: theme.darkBlue,
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
    marginRight: 8,
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
    fontFamily: 'sharpGroteskBook19',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'capitalize',
  },
  textElementEnabled: {
    '&:hover': {
      opacity: 0.7,
    },
  },
  textElementStyles: {
    cursor: 'default',
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
  hideCheckbox?: boolean
  disabled?: boolean
  text?: string
  textElement?: React.ReactElement
  errorText?: string
  textClassName?: string
  className?: string
  onClick?: (newState: boolean) => void
  dark?: boolean
}

class _Checkbox extends Component<Props> {
  handleClick = () => {
    const { checked, onClick, disabled } = this.props

    if (disabled) return

    onClick?.(!checked)
  }

  render() {
    const { textClassName, disabled, hideCheckbox, className, text, textElement, errorText, checked, dark, classes } =
      this.props

    const hasTextElement = textElement !== undefined
    return (
      <div className={classnames(classes.container, className)}>
        <label
          className={classnames(classes.checkboxContainer, {
            [classes.enabled]: !disabled,
            [classes.disabled]: disabled,
            [classes.checkboxDark]: dark,
            [classes.notClickable]: hasTextElement,
          })}
        >
          {!hideCheckbox && (
            <div
              className={classnames(classes.checkBox, { [classes.textElementEnabled]: hasTextElement })}
              onClick={this.handleClick}
            >
              {checked && <FontAwesomeIcon size="xs" className={classes.checkmark} icon={faCheck} />}
            </div>
          )}
          {text && (
            <p className={classnames(textClassName, classes.text)} onClick={this.handleClick}>
              {text}
            </p>
          )}
          {hasTextElement && <div className={classes.textElementStyles}>{textElement}</div>}
        </label>
        {errorText && <div className={classes.errorText}>{errorText}</div>}
      </div>
    )
  }
}

export const Checkbox = withStyles(styles)(_Checkbox)
