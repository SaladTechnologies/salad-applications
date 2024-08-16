import classnames from 'classnames'
import type { ChangeEvent, FocusEvent, ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ErrorText } from '.'
import type { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'inline-block',
    width: '100%',
  },
  text: {
    border: `1px solid ${theme.lightGreen}`,
    padding: '24px 16px 24px 16px',
    backgroundColor: theme.white,
    height: '28px',
    width: '100%',
    color: '#000000',
    fontFamily: theme.fontMallory,
    fontSize: theme.medium,
    boxSizing: 'border-box',
    '&::placeholder': {
      opacity: 0.5,
      color: '#000000',
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
    fontFamily: theme.fontMallory,
    fontSize: theme.medium,
  },
  label: {
    display: 'block',
    paddingBottom: '4px',
    fontFamily: theme.fontMallory,
    fontSize: theme.medium,
  },
})

interface Props extends WithStyles<typeof styles> {
  name?: string
  placeholder?: string
  inputClassName?: string
  containerClassName?: string
  onBlur?: (event?: FocusEvent<any>) => void
  onChange?: (event: ChangeEvent<any>) => void
  onFocus?: (event?: FocusEvent<any>) => void
  value?: any
  errorText?: string
  label?: string
}

class _TextField extends Component<Props> {
  public override render(): ReactNode {
    const { inputClassName, containerClassName, label, errorText, classes, ...input } = this.props
    return (
      <div className={classnames(classes.container, containerClassName)}>
        {label && <span className={classes.label}>{label}</span>}
        <input
          className={classnames(classes.text, inputClassName, {
            [classes.errorBorder]: errorText,
          })}
          {...input}
          type="text"
        />
        {errorText && <ErrorText>{errorText}</ErrorText>}
      </div>
    )
  }
}

export const TextField = withStyles(styles)(_TextField)
