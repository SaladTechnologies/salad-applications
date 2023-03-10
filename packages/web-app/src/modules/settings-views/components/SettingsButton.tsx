import type { ReactNode } from 'react'
import { Component } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { SmartLink } from '../../../components'
import GearIcon from '../assets/GearIcon.svg'

const styles = () => ({
  container: {
    position: 'relative',
  },
  settingsButton: {
    display: 'flex',
    alignItems: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {}

class _SettingsButton extends Component<Props> {
  public override render(): ReactNode {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <SmartLink className={classes.settingsButton} to={'/account/summary'}>
          <Img height={16} src={GearIcon} />
        </SmartLink>
      </div>
    )
  }
}

export const SettingsButton = withStyles(styles)(_SettingsButton)
