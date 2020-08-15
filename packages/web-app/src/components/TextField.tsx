import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { ErrorText } from '.'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'inline-block',
  },
  text: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.lightGreen}`,
    padding: '.5rem',
    color: theme.lightGreen,
    fontSize: '.625rem',
    fontFamily: 'sharpGroteskLight25',
    '&::placeholder': {
      opacity: 0.5,
      color: theme.lightGreen,
    },
    '&:focus': {
      outlineColor: theme.mediumGreen,
    },
  },
  errorBorder: {
    borderColor: `${theme.red} !important`,
    '&:focus': {
      outlineColor: `${theme.red} !important`,
    },
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
  placeholder?: string
  className?: string
  onBlur?: (event?: React.FocusEvent<any>) => void
  onChange?: (event: React.ChangeEvent<any>) => void
  onFocus?: (event?: React.FocusEvent<any>) => void
  value?: any
  errorText?: string
}

class _TextField extends Component<Props> {
  render() {
    const { className, errorText, classes, ...input } = this.props
    return (
      <div className={classes.container}>
        <input
          className={classnames(classes.text, className, { [classes.errorBorder]: errorText })}
          {...input}
          type="text"
        />
        {errorText && <ErrorText>{errorText}</ErrorText>}
      </div>
    )
  }
}

export const TextField = withStyles(styles)(_TextField)
