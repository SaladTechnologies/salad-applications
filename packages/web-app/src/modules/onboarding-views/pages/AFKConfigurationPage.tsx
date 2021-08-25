import { Button, FieldContainer, Switch, Text } from '@saladtechnologies/garden-components'
import { ChevronRight } from '@saladtechnologies/garden-icons'
import classnames from 'classnames'
import { useState } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import MediaQuery from 'react-responsive'
import { Head } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import Carrot from '../assets/onboarding-afk-carrot.png'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'fixed',
    top: (props: Props) => (props.isNative ? '4.1rem' : 0),
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
  button: {
    width: 119,
  },
})

interface Props extends WithStyles<typeof styles> {
  isNative: boolean
  onContinue: (autoStartEnabled: boolean) => void
  onToggleAutoStart: (autoStartEnabled: boolean) => void
}

const _AFKConfigurationPage = ({ classes, onContinue, onToggleAutoStart }: Props) => {
  const [autoStartEnabled, toggleAutoStartEnabled] = useState<boolean>(true)

  const handleToggle = (autoStartEnabled: boolean) => {
    toggleAutoStartEnabled(autoStartEnabled)
    onToggleAutoStart(autoStartEnabled)
  }

  return (
    <div className={classes.container}>
      <div className={classes.page}>
        <div className={classes.contentContainer}>
          <Head title="AFK Configuration" />
          <div className={classes.content}>
            <div className={classnames(classes.header, classes.mb48)}>
              <Text variant="headline">AFK Configuration</Text>
            </div>
            <FieldContainer>
              <div className={classes.mb24}>
                <Text variant="baseXL">Auto-Start</Text>
              </div>
              <div className={classes.mb24}>
                <Text variant="baseL">
                  Salad always tries to fully utilize your PC to get you the highest earnings possible and is designed
                  to be run when you are away from your machine (AFK).
                </Text>
              </div>
            </FieldContainer>
            <div className={classes.mb48}>
              <Switch
                checked={autoStartEnabled}
                onChange={() => handleToggle(!autoStartEnabled)}
                label="Automatically chop when you are away from your PC"
              />
            </div>
            <div className={classes.button}>
              <Button
                label="Continue"
                onClick={() => onContinue(autoStartEnabled)}
                variant="primary-basic"
                trailingIcon={<ChevronRight />}
              />
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

export const AFKConfigurationPage = withStyles(styles)(_AFKConfigurationPage)
