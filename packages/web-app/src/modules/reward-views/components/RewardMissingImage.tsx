import type { ReactNode } from 'react'
import { Component } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import logo from './assets/default-image.png'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'relative',
    backgroundColor: theme.green,
    zIndex: -1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 'auto',
    width: '100%',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
  },
  missingImageText: {
    position: 'absolute',
    color: theme.darkBlue,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 48,
    textAlign: 'center',
    padding: 10,
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
}

class _RewardMissingImage extends Component<Props> {
  public override render(): ReactNode {
    const { text, classes } = this.props
    return (
      <div className={classes.container}>
        <Img className={classes.image} src={logo} alt="" />
        {text && <div className={classes.missingImageText}>{text}</div>}
      </div>
    )
  }
}

export const RewardMissingImage = withStyles(styles)(_RewardMissingImage)
