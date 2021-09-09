import { Button, Checkbox, FieldContainer, Text } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import withStyles, { WithStyles } from 'react-jss'
import MediaQuery from 'react-responsive'
import { Head } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import Carrot from '../assets/onboarding-afk-carrot.png'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'fixed',
    top: (props: AutoStartConfigurationPageProps) => (props.isNative ? '4.1rem' : 0),
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
    width: 163,
    marginLeft: 24,
  },
  leaveButton: {
    width: 240,
  },
  buttonsContainer: {
    display: 'flex',
  },
})

export interface AutoStartConfigurationPageProps extends WithStyles<typeof styles> {
  isNative: boolean
  enableAutoStartPending: boolean
  enableAutoStartErrorMessage?: string
  onEnableAutoStart: () => void
  onSkipAutoStart: () => void
  haveSeenAutoStartPage: boolean
  isDoNotShowAutoStartAgainChecked: boolean
  onToggleDoNotShowAutoStartAgain: (checked: boolean) => void
}

const _AutoStartConfigurationPage = ({
  classes,
  onSkipAutoStart,
  onEnableAutoStart,
  onToggleDoNotShowAutoStartAgain,
  enableAutoStartPending,
  isDoNotShowAutoStartAgainChecked,
  haveSeenAutoStartPage,
  enableAutoStartErrorMessage,
}: AutoStartConfigurationPageProps) => {
  return (
    <div className={classes.container}>
      <div className={classes.page}>
        <div className={classes.contentContainer}>
          <Head title="Auto-Start Configuration" />
          <div className={classes.content}>
            <div className={classnames(classes.header, classes.mb48)}>
              <Text variant="headline">Auto-Start Configuration</Text>
            </div>
            <FieldContainer>
              <div className={classes.mb24}>
                <Text variant="baseXL">Enable Auto-Start</Text>
              </div>
              <div className={classes.mb24}>
                <Text variant="baseL">
                  Salad always tries to fully utilize your PC to get you the highest earnings possible and is designed
                  to be run when you are away from your machine (AFK).
                </Text>
              </div>
            </FieldContainer>
            <div className={classes.mb48}>
              <Text variant="baseS">Automatically chop when you are away from your PC</Text>
            </div>
            <div className={classnames(classes.buttonsContainer, classes.mb24)}>
              <span className={classes.leaveButton}>
                <Button size="medium" label="Leave Auto-Start Disabled" onClick={onSkipAutoStart} variant="outlined" />
              </span>
              <span className={classes.enableButton}>
                <Button
                  isLoading={enableAutoStartPending}
                  size="medium"
                  label="Enable Auto-Start"
                  errorMessage={enableAutoStartErrorMessage}
                  onClick={onEnableAutoStart}
                  variant="primary-basic"
                />
              </span>
            </div>
            {haveSeenAutoStartPage && (
              <div>
                <Checkbox onChange={onToggleDoNotShowAutoStartAgain} checked={isDoNotShowAutoStartAgainChecked}>
                  <Text variant="baseS"> Do Not Show Again</Text>
                </Checkbox>
              </div>
            )}
          </div>
          <MediaQuery minWidth={767}>
            <img className={classes.image} src={Carrot} alt="Salad Reward Items" />
          </MediaQuery>
        </div>
      </div>
    </div>
  )
}

export const AutoStartConfigurationPage = withStyles(styles)(_AutoStartConfigurationPage)
