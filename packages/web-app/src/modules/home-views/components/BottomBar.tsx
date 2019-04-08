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
  versionText: {
    color: theme.lightGreen,
    display: 'inline-block',
    fontFamily: 'sharpGroteskMedium25',
    fontSize: theme.small,
    cursor: 'pointer',
    userSelect: 'none',
  },
  //Any subsequent buttons
  supportButton: {
    marginRight: '-.75rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  version?: string
  onVersionClick?: () => void
  onDiscordClick?: () => void
  onSupportClick?: () => void
}

class _BottomBar extends Component<Props> {
  handleVersionClick = () => {
    const { onVersionClick } = this.props

    if (onVersionClick) onVersionClick()
  }
  render() {
    const { version, onDiscordClick, onSupportClick, classes } = this.props
    return (
      <Fade direction="up" className={classnames(classes.container)}>
        {version && (
          <div className={classes.versionText} onClick={this.handleVersionClick}>
            v{version}
          </div>
        )}
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
