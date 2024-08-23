import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  errorText: {
    color: theme.darkBlue,
    fontFamily: theme.fontMallory,
    fontSize: theme.medium,
    padding: '8px 12px',
    background: theme.green,
    boxShadow: `${theme.green} 0px 0px 30px`,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _SuccessText extends Component<Props> {
  public override render(): ReactNode {
    const { children, classes } = this.props

    return <div className={classnames(classes.errorText)}>{children}</div>
  }
}

export const SuccessText = withStyles(styles)(_SuccessText)
