import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { AngledButton } from '../../../components'
import { Fade } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    height: '10rem',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexWrap: 'nowrap',
  },
  //Any subsequent buttons
  supportButton: {
    marginRight: '-.75rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  onDiscordClick?: () => void
  onSupportClick?: () => void
}

class _BottomBar extends Component<Props> {
  render() {
    const { onDiscordClick, onSupportClick, classes } = this.props
    return (
      <Fade direction="up" className={classnames(classes.container)}>
        <AngledButton className={classes.supportButton} leftSide={'right'} rightSide={'right'} onClick={onSupportClick}>
          Salad Support
        </AngledButton>
        <AngledButton leftSide={'right'} onClick={onDiscordClick}>
          Discord
        </AngledButton>
      </Fade>
    )
  }
}

export const BottomBar = withStyles(styles)(_BottomBar)
