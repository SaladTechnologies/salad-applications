import type { FunctionComponent } from 'react'
import { Button, SvgIcon, Text } from '@saladtechnologies/garden-components'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import { ChevronRight, Download } from '@saladtechnologies/garden-icons'
import { WindowBar } from '../modules/home-views/components/WindowBar'

const minimize = 'minimize-window'
const maximize = 'maximize-window'
const close = 'close-window'

const styles = (theme: SaladTheme) => ({
  upgradePageWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    height: '100vh',
    zIndex: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  windowBarContainerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  upgradePageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '26px',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 650,
    '& h1': { margin: 0, color: theme.lightGreen, paddingBottom: 0 },
  },
  styledTextContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
    color: theme.darkBlue,
    '& a': { color: theme.darkBlue },
    '& span': { textAlign: 'start' },
  },
  player: {
    border: 0,
    width: '100%',
  },
})

export const _UpgradePage: FunctionComponent<WithStyles<typeof styles>> = ({ classes }) => {
  const handleDownloadSaladClick = () => {
    window.open('https://salad.com/download', '_blank')
  }

  const sendToNative = (type: string) => {
    const isNative =
      window.salad &&
      (window.salad.platform === 'electron' ||
        window.salad.platform === 'darwin' ||
        window.salad.platform === 'linux' ||
        window.salad.platform === 'win32')

    if (isNative) {
      window.salad.dispatch(type, null)
    }
  }

  return (
    <div className={classes.upgradePageWrapper}>
      <div className={classes.windowBarContainerWrapper}>
        <WindowBar
          onClose={() => sendToNative(close)}
          onMaximize={() => sendToNative(maximize)}
          onMinimize={() => sendToNative(minimize)}
        />
      </div>
      <div className={classes.upgradePageContainer}>
        <Text as="h1" variant="headline">
          It's time to upgrade
        </Text>
        <iframe
          allowFullScreen
          className={classes.player}
          src="https://player.vimeo.com/video/771258052"
          title="video"
          width="720"
          height="360"
          allow="autoplay; encrypted-media"
        />
        <Button
          onClick={handleDownloadSaladClick}
          label="Download Salad"
          size="medium"
          contentAlignment="space-between"
          leadingIcon={
            <SvgIcon size="large" stroke="light">
              <Download />
            </SvgIcon>
          }
          trailingIcon={
            <SvgIcon size="large" stroke="light">
              <ChevronRight />
            </SvgIcon>
          }
        />
        <div className={classes.styledTextContainer}>
          <Text variant="baseXL">This version of the Salad app is no longer supported</Text>
          <Text variant="baseM">
            This legacy version of the Salad app has reached end of life and is no longer supported. Make sure to update
            to the latest version of the Salad desktop app to continue earning.
          </Text>
          <Text variant="baseM">
            Salad 1.0{' '}
            <a className="link" href="https://salad.com/blog/salad-1-0/" target="_blank" rel="noreferrer">
              performs better
            </a>{' '}
            than our legacy app and supports new features like the{' '}
            <a href="https://salad.com/blog/container-workloads/" target="_blank" rel="noreferrer">
              Salad Container Environment
            </a>{' '}
            and{' '}
            <a href="https://salad.com/blog/high-bandwidth-jobs/" target="_blank" rel="noreferrer">
              Bandwidth Sharing
            </a>
            . Salad is always getting better,{' '}
            <a href="https://salad.com/download" target="_blank" rel="noreferrer">
              update now
            </a>
            !
          </Text>
        </div>
      </div>
    </div>
  )
}

export const UpgradePage = withStyles(styles)(_UpgradePage)
