import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    width: 15,
    height: 15,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: '50%',
    height: '50%',
    borderRadius: '50%',
    border: `1px solid ${theme.lightGreen}`,
  },
  active: {
    backgroundColor: theme.lightGreen,
  },
})

interface Props extends WithStyles<typeof styles> {
  onClick?: () => void
  active?: boolean
}

class _RewardImageDot extends Component<Props> {
  handleClick = () => {
    const { onClick } = this.props

    if (onClick) {
      onClick()
    }
  }

  render() {
    const { active, classes } = this.props

    return (
      <div className={classes.container} onClick={this.handleClick}>
        <div className={classnames(classes.dot, { [classes.active]: active })}></div>
      </div>
    )
  }
}

export const RewardImageDot = withStyles(styles)(_RewardImageDot)
