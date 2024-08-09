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
  },
  text: {
    border: `1px solid ${theme.lightGreen}`,
    padding: '.5rem',
    backgroundColor: theme.white,
    height: '28px',
    width: '450px',
    color: '#000000',
    fontFamily: theme.fontMallory,
    fontSize: theme.medium,
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
})

interface Props extends WithStyles<typeof styles> {
  name?: string
  placeholder?: string
  className?: string
  onBlur?: (event?: FocusEvent<any>) => void
  onChange?: (event: ChangeEvent<any>) => void
  onFocus?: (event?: FocusEvent<any>) => void
  value?: any
  errorText?: string
}

class _TextField extends Component<Props> {
  public override render(): ReactNode {
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
