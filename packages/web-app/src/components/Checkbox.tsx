import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  container: {
    padding: '0 .5rem',
    userSelect: 'none',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    color: (props: Props) => (props.dark ? theme.darkBlue : theme.lightGreen),
  },
  checkBox: {
    width: '1rem',
    height: '1rem',
    flex: 'none',
    borderWidth: '1px',
    borderColor: (props: Props) => (props.dark ? theme.darkBlue : theme.lightGreen),
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  checkmark: {
    color: (props: Props) => (props.dark ? theme.darkBlue : theme.lightGreen),
    position: 'absolute',
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer',
    height: 0,
    width: 0,
  },
  text: {
    paddingLeft: '.25rem',
    fontFamily: 'sharpGroteskBook19',
    cursor: 'pointer',
    margin: 0,
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
  dark?: boolean
  placeholder?: string
  onBlur?: (event?: React.FocusEvent<any>) => void
  onChange?: (event: React.ChangeEvent<any>) => void
  onFocus?: (event?: React.FocusEvent<any>) => void
  value?: any
  checked?: boolean
  text?: string
  errorText?: string
  textClassName?: string
  onClick?: () => void
}

class _Checkbox extends Component<Props> {
  handleClick = () => {
    const { onClick } = this.props
    if (onClick) {
      onClick()
    }
  }
  render() {
    const { textClassName, text, dark, errorText, checked, classes, onChange, ...input } = this.props
    return (
      <div className={classes.container}>
        <label className={classes.checkboxContainer}>
          {onChange && (
            <input onChange={onChange} checked={checked} className={classes.hidden} {...input} type="checkbox" />
          )}
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
