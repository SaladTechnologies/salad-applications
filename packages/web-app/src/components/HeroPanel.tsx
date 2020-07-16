import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'

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
}

class _HeroPanel extends Component<Props> {
  render() {
    const { classes, children } = this.props

    return <div className={classes.container}>{children}</div>
  }
}

export const HeroPanel = withStyles(styles)(_HeroPanel)
