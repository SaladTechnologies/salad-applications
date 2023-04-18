import { Button, FieldContainer, Text, TextField } from '@saladtechnologies/garden-components'
import type { FormValues } from '@saladtechnologies/garden-components/lib/components/TextField/TextField'
import classnames from 'classnames'
import type { FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import MediaQuery from 'react-responsive'
import type { SaladTheme } from '../../../../SaladTheme'
import ReferralsImageStatic from '../../../auth-views/assets/referrals-image-static.png'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  mb26: {
    marginBottom: 26,
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
  isSubmittingReferralCode: boolean
  isReferralCodeSubmitSuccess: boolean
  serverSideErrorMessage?: string
  onSubmitCode?: (code: string) => Promise<void>
  onEnterDefault?: () => void
  referralCode?: string
}

const _ReferralOnboardingPage: FC<Props> = ({
  classes,
  onSubmitCode,
  onEnterDefault,
  isSubmittingReferralCode,
  serverSideErrorMessage,
  isReferralCodeSubmitSuccess,
  referralCode,
}) => {
  const handleSubmitCode = (data: FormValues) => {
    if (data.input) {
      onSubmitCode?.(data.input)
    }
  }

  const handleDefaultCode = () => {
    onEnterDefault?.()
  }
  return (
    <div className={classes.container}>
      <div className={classes.page}>
        <div className={classes.contentContainer}>
          <>
            <div className={classes.content}>
              <div className={classnames(classes.header, classes.mb48)}>
                <Text variant="headline">Enter your Referral Code</Text>
              </div>
              <FieldContainer>
                <div className={classes.mb26}>
                  <Text variant="baseL">
                    If you received a promo code, enter it below. This boosts your earning rate and lets us give credit
                    to your referrer, too.
                  </Text>
                </div>
                <div className={classes.mb48}>
                  <TextField
                    label="Promo Code"
                    validationRegex={/^.{1,10}/}
                    validationRegexErrorMessage={'Invalid Code. Codes are less than 10 characters with no spaces.'}
                    onSubmit={handleSubmitCode}
                    defaultValue={referralCode}
                    useDefaultValueAsPreset={false}
                    isSubmitting={isSubmittingReferralCode}
                    isSubmitSuccess={isReferralCodeSubmitSuccess}
                    serverSideErrorMessage={serverSideErrorMessage}
                  />
                </div>
                <div className={classes.mb48}>
                  <Text variant="baseL">
                    Didn’t receive a promo code? No problem! We’ll enter one automatically so you can still get a bonus.
                  </Text>
                </div>
              </FieldContainer>
              <div>
                <Button onClick={handleDefaultCode} variant="outlined" label="Give me a bonus!" />
              </div>
            </div>
            <MediaQuery minWidth={767}>
              <img className={classes.rightSideImage} src={ReferralsImageStatic} alt="Salad Reward Items" />
            </MediaQuery>
          </>
        </div>
      </div>
    </div>
  )
}

export const ReferralOnboardingPage = withStyles(styles)(_ReferralOnboardingPage)
