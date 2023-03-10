import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: (props: Props) => {
      switch (props.color) {
        case 'red':
          return theme.red
        case 'purple':
          return theme.purple
        case 'cyan':
          return theme.cyan
        case 'green':
        default:
          return theme.green
      }
    },
    color: (props: Props) => {
      switch (props.color) {
        case 'red':
        case 'purple':
          return theme.lightGreen
        case 'green':
        case 'cyan':
        default:
          return theme.darkBlue
      }
    },
    padding: 80,
    fontFamily: theme.fontGroteskBook19,
    fontSize: 16,
    lineHeight: '150%',
    display: 'flex',
    marginBottom: 40,
  },
})

interface Props extends WithStyles<typeof styles> {
  color: 'red' | 'purple' | 'green' | 'cyan'
  className?: string
  children?: ReactNode
}

class _HeroPanel extends Component<Props> {
  public override render(): ReactNode {
    const { className, classes, children } = this.props

    return <div className={classnames(classes.container, className)}>{children}</div>
  }
}

export const HeroPanel = withStyles(styles)(_HeroPanel)
