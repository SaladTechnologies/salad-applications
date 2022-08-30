import classnames from 'classnames'
import { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  errorText: {
    margin: '.25rem',
    color: theme.red,
    fontFamily: 'sharpGroteskBook25',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _ErrorText extends Component<Props> {
  render() {
    const { children, classes } = this.props

    return <div className={classnames(classes.errorText)}>{children}</div>
  }
}

export const ErrorText = withStyles(styles)(_ErrorText)
