import { Button, FieldContainer, Text, TextField } from '@saladtechnologies/garden-components'
import { FormValues } from '@saladtechnologies/garden-components/lib/components/TextField/TextField'
import { ChevronRight } from '@saladtechnologies/garden-icons'
import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import MediaQuery from 'react-responsive'
import { ModalPage } from '../../../../components'
import { SaladTheme } from '../../../../SaladTheme'
import LoginPageRewards from '../../../auth-views/assets/login-screen-rewards.png'
import ReferralsImageStatic from '../../../auth-views/assets/referrals-image-static.png'
import { ReferralStep } from '../../../referral'

const styles = (theme: SaladTheme) => ({
  page: {
    flex: 1,
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    display: 'flex',
    height: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  contentContainer: {
    maxWidth: 1280,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  content: {
    color: theme.darkBlue,
    marginTop: 96,
    maxWidth: 560,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    textAlign: 'left',
    padding: '0 15px',
  },
  header: {
    color: theme.lightGreen,
  },
  mb48: {
    marginBottom: 48,
  },
  rightSideImage: {
    display: 'flex',
    flex: 1,
    maxWidth: 560,
    height: 'auto',
    width: '100%',
  },
})

interface Props extends WithStyles<typeof styles> {
  currentStep: ReferralStep
  username?: string
  isSubmittingReferralCode: boolean
  isReferralCodeSubmitSuccess: boolean
  serverSideErrorMessage?: string
  onSubmitCode?: (code: string) => Promise<void>
  onEnterDefault?: () => void
  onNextPage?: () => void
}

class _ReferralOnboardingPage extends Component<Props> {
  handleSubmitCode = (data: FormValues) => {
    const { onSubmitCode } = this.props

    onSubmitCode?.(data.input)
  }

  handleDefaultCode = () => {
    const { onEnterDefault } = this.props
    onEnterDefault?.()
  }

  render() {
    const {
      classes,
      currentStep,
      onNextPage,
      username,
      isSubmittingReferralCode,
      serverSideErrorMessage,
      isReferralCodeSubmitSuccess,
    } = this.props

    return (
      <ModalPage>
        <div className={classes.page}>
          <div className={classes.contentContainer}>
            {currentStep === ReferralStep.Initial && (
              <>
                {console.log(username)}
                <div className={classes.content}>
                  <div className={classnames(classes.header, classes.mb48)}>
                    <Text variant="headline">Welcome to the Kitchen, {username} !</Text>
                  </div>
                  <FieldContainer>
                    <div className={classes.mb48}>
                      <Text variant="baseL">
                        You’ve joined a community of over 500,000 Chefs who use Salad to earn games, gift cards, and
                        other rewards.
                      </Text>
                    </div>
                    <div className={classes.mb48}>
                      <Text variant="baseL">
                        Now, let’s get your machine set up with a quick process to maximize your earning rates.
                      </Text>
                    </div>
                  </FieldContainer>
                  <div>
                    <Button onClick={onNextPage} trailingIcon={<ChevronRight />} label="let's go"></Button>
                  </div>
                </div>
                <MediaQuery minWidth={767}>
                  <img className={classes.rightSideImage} src={LoginPageRewards} alt="Salad Reward Items" />
                </MediaQuery>
              </>
            )}
            {currentStep === ReferralStep.Code && (
              <>
                <div className={classes.content}>
                  <div className={classnames(classes.header, classes.mb48)}>
                    <Text variant="headline">Enter your Referral Code</Text>
                  </div>
                  <FieldContainer>
                    <div className={classes.mb48}>
                      <Text variant="baseL">
                        If you received a promo code, enter it below. This boosts your earning rate and lets us give
                        credit to your referrer, too.
                      </Text>
                    </div>
                    <div className={classes.mb48}>
                      <TextField
                        label="Promo Code"
                        validationRegex={/^.{1,10}/}
                        validationRegexErrorMessage={'Invalid Code. Codes are less than 10 characters with no spaces.'}
                        onSubmit={this.handleSubmitCode}
                        isSubmitting={isSubmittingReferralCode}
                        isSubmitSuccess={isReferralCodeSubmitSuccess}
                        serverSideErrorMessage={serverSideErrorMessage}
                      />
                    </div>
                    <div className={classes.mb48}>
                      <Text variant="baseL">
                        Didn’t receive a promo code? No problem! We’ll enter one automatically so you can still get a
                        bonus.
                      </Text>
                    </div>
                  </FieldContainer>
                  <div>
                    <Button onClick={this.handleDefaultCode} variant="outlined" label="Give me a bonus!" />
                  </div>
                </div>
                <MediaQuery minWidth={767}>
                  <img className={classes.rightSideImage} src={ReferralsImageStatic} alt="Salad Reward Items" />
                </MediaQuery>
              </>
            )}
          </div>
        </div>
      </ModalPage>
    )
  }
}

export const ReferralOnboardingPage = withStyles(styles)(_ReferralOnboardingPage)
