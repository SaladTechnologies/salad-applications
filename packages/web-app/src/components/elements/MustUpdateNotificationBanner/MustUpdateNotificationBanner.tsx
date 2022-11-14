import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    fontSize: theme.mediumLarge,
    padding: '24px 24px 0px',
    backgroundColor: theme.red,
    color: '#FFFFFF',
    fontFamily: 'Mallory',
  },
  header: {
    fontSize: theme.large,
    marginTop: 0,
  },
  link: {
    color: '#FFFFFF',
    textDecoration: 'underline',
  },
})

class _MustUpdateNotificationBanner extends Component<WithStyles<typeof styles>> {
  render() {
    const { classes } = this.props

    const userAgent = navigator.userAgent.toLowerCase()

    return (
      <>
        {userAgent.indexOf(' electron/') > -1 && (
          <div className={classes.container}>
            <p className={classes.header}>
              You must{' '}
              <a target="_blank" rel="noreferrer" className={classes.link} href="https://salad.com/download">
                update to the latest version of Salad
              </a>
              .
            </p>
            <p>
              The legacy version of the Salad app you are using will stop working soon. Make sure to update to the
              latest version of the Salad desktop app to continue earning. Salad 1.0{' '}
              <a target="_blank" rel="noreferrer" className={classes.link} href="https://salad.com/blog/salad-1-0/">
                performs better
              </a>{' '}
              than our legacy app and supports new features like the{' '}
              <a
                target="_blank"
                rel="noreferrer"
                className={classes.link}
                href="https://salad.com/blog/container-workloads/"
              >
                Salad Container Environment
              </a>{' '}
              and{' '}
              <a
                target="_blank"
                rel="noreferrer"
                className={classes.link}
                href="https://salad.com/blog/high-bandwidth-jobs/"
              >
                Bandwidth Sharing
              </a>
              . Salad is always getting better,{' '}
              <a target="_blank" rel="noreferrer" className={classes.link} href="https://salad.com/download">
                update now
              </a>
              !
            </p>
          </div>
        )}
      </>
    )
  }
}

export const MustUpdateNotificationBanner = withStyles(styles)(_MustUpdateNotificationBanner)
