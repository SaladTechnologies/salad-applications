import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  divider: {
    borderColor: theme.lightGreen,
    borderWidth: '0 0 1px',
    marginTop: (props: Props) => (props.narrow ? 5 : theme.mediumLarge),
    marginBottom: (props: Props) => (props.narrow ? 5 : theme.large),
    width: '100%',
    opacity: (props: Props) => props.opacity || '1',
  },
})

interface Props extends WithStyles<typeof styles> {
  opacity?: string
  className?: string
  narrow?: boolean
}

class _Divider extends Component<Props> {
  public override render(): ReactNode {
    const { classes, className } = this.props

    return <hr className={classnames(classes.divider, className)} />
  }
}

export const Divider = withStyles(styles)(_Divider)
