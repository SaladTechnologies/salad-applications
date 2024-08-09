import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  errorText: {
    margin: '.25rem',
    color: '#c90000',
    fontFamily: theme.fontMallory,
    fontSize: theme.medium,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _ErrorText extends Component<Props> {
  public override render(): ReactNode {
    const { children, classes } = this.props

    return <div className={classnames(classes.errorText)}>{children}</div>
  }
}

export const ErrorText = withStyles(styles)(_ErrorText)
