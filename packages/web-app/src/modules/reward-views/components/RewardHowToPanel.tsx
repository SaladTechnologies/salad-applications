import { Component } from 'react'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink } from '../../../components'
import { HeroPanel } from '../../../components/HeroPanel'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import howItWorks from './assets/how-salad-works-rewards.svg'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexBasis: '50%',
  },
  title: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: 32,
  },
  img: {
    minWidth: 500,
    width: '25%',
    padding: 32,
  },
  icon: { padding: 32 },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  authenticated?: boolean
}

class _RewardHowToPanel extends Component<Props> {
  render() {
    const { reward, authenticated, classes } = this.props

    if (!reward) return null

    if (!authenticated)
      return (
        <HeroPanel color="cyan" className={classes.container}>
          <div className={classes.title}>How Salad Works</div>
          <Img className={classes.img} src={howItWorks} />
          <SmartLink to="https://salad.com">Learn More</SmartLink>
        </HeroPanel>
      )

    return null
  }
}

export const RewardHowToPanel = withStyles(styles)(_RewardHowToPanel)
