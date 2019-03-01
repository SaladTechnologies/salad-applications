import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { AngledButton } from '../../../components/AngledButton'
import { AngleDirection } from '../../../components/AngledPanel'

const styles = (theme: SaladTheme) => ({
  container: {
    // backgroundColor: theme.appBackgroundColor,
  },
  //This is the button all the way in the corner
  cornerButton: {
    margin: '0px',
  },
  //Any subsequent buttons
  supportButton: {
    marginRight: '-1.125rem',
    marginBottom: '0',
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
      <div className={classnames(classes.container, 'level is-mobile')}>
        <div className="level-left" />
        <div className="level-right">
          <AngledButton
            className={classes.supportButton}
            leftSide={AngleDirection.Right}
            rightSide={AngleDirection.Right}
            onClick={onSupportClick}
          >
            Salad Support
          </AngledButton>
          <AngledButton leftSide={AngleDirection.Right} onClick={onDiscordClick}>
            Discord
          </AngledButton>
        </div>
      </div>
    )
  }
}

export const BottomBar = withStyles(styles)(_BottomBar)
