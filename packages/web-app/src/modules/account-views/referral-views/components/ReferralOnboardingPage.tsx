import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button, ModalPage, P, SectionHeader } from '../../../../components'
import logo from '../../../../components/assets/SaladLockup-BlueBg.svg'
import { SaladTheme } from '../../../../SaladTheme'
import { ReferralCodeEntryComponent } from './ReferralCodeEntryComponent'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.lightGreen,
  },
  spacing: {
    paddingTop: 40,
  },
  logo: {},
  title: {
    alignItems: 'center',
    display: 'flex',
    lineHeight: '250%',
    fontFamily: theme.fontGroteskLight25,
  },
})

interface Props extends WithStyles<typeof styles> {
  onSubmitCode?: (code: string) => Promise<void>
  onEnterDefault?: () => void
}

class _ReferralOnboardingPage extends Component<Props> {
  handleDefaultCode = () => {
    const { onEnterDefault } = this.props
    onEnterDefault?.()
  }

  render() {
    const { onSubmitCode, classes } = this.props

    return (
      <ModalPage>
        <div className={classes.container}>
          <img className={classes.logo} src={logo} alt="" />
          <div className={classes.spacing} />
          <div className={classes.title}>
            <h1>Welcome to the Kitchen!</h1>
          </div>
          <div className={classes.spacing} />
          <SectionHeader>Referral Code</SectionHeader>
          <P>Did you receive a referral code? Enter it below so you can earn your bonus!</P>
          <ReferralCodeEntryComponent onSubmitCode={onSubmitCode} />
          <div className={classes.spacing} />
          <SectionHeader>Didn't get a code?</SectionHeader>
          <P>Don't worry, we will enter one automatically so you can still get a bonus!</P>
          <Button onClick={this.handleDefaultCode}>Give me a bonus!</Button>
        </div>
      </ModalPage>
    )
  }
}

export const ReferralOnboardingPage = withStyles(styles)(_ReferralOnboardingPage)
