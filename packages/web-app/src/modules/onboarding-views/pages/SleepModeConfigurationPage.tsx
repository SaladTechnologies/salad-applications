import { Button, FieldContainer, Text } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import withStyles, { WithStyles } from 'react-jss'
import MediaQuery from 'react-responsive'
import { Head } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import Carrot from '../assets/onboarding-afk-carrot.png'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'fixed',
    top: (props: SleepModeConfigurationPageProps) => (props.isNative ? '4.1rem' : 0),
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
  mb24: {
    marginBottom: 24,
  },
  mb14: {
    marginBottom: 14,
  },
  image: {
    display: 'flex',
    flex: 1,
    maxWidth: 560,
    height: 'auto',
    width: '100%',
  },
  enableButton: {
    marginLeft: 24,
  },
  buttonsContainer: {
    display: 'flex',
  },
})

export interface SleepModeConfigurationPageProps extends WithStyles<typeof styles> {
  isNative: boolean
  disableSleepModePending: boolean
  onDisableSleepMode: () => void
  onSkipSleepMode: () => void
  sleepModeErrorMessage?: string
}

const _SleepModeConfigurationPage = ({
  classes,
  onDisableSleepMode,
  onSkipSleepMode,
  sleepModeErrorMessage,
  disableSleepModePending,
}: SleepModeConfigurationPageProps) => {
  return (
    <div className={classes.container}>
      <div className={classes.page}>
        <div className={classes.contentContainer}>
          <Head title="Sleep Configuration" />
          <div className={classes.content}>
            <div className={classnames(classes.header, classes.mb48)}>
              <Text variant="headline">Sleep Configuration</Text>
            </div>
            <FieldContainer>
              <div className={classes.mb24}>
                <Text variant="baseXL">Disable Sleep Mode</Text>
              </div>
              <div className={classes.mb24}>
                <Text variant="baseL">
                  When your PC goes to sleep, Salad stops chopping and you’ll miss out on earnings. We recommend
                  disabling sleep mode on your PC.
                </Text>
              </div>
            </FieldContainer>
            <div className={classes.mb48}>
              <Text variant="baseS">You can always adjust sleep mode later in Windows settings.</Text>
            </div>
            <div className={classes.buttonsContainer}>
              <Button size="medium" label="Skip For Now" onClick={onSkipSleepMode} variant="outlined" />
              <span className={classes.enableButton}>
                <Button
                  errorMessage={sleepModeErrorMessage}
                  size="medium"
                  label="Disable Sleep Mode"
                  isLoading={disableSleepModePending}
                  onClick={onDisableSleepMode}
                  variant="primary-basic"
                />
              </span>
            </div>
          </div>
          <MediaQuery minWidth={767}>
            <img className={classes.image} src={Carrot} alt="Salad Reward Items" />
          </MediaQuery>
        </div>
      </div>
    </div>
  )
}

export const SleepModeConfigurationPage = withStyles(styles)(_SleepModeConfigurationPage)
