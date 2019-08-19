import React, { Component, ReactNode } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Modal, ModalPage } from '../../../components'

const styles = (theme: SaladTheme) => ({
  contentContainer: {
    color: theme.darkBlue,
    textAlign: 'center',
    padding: '0 4rem',
  },
  title: {
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  title?: string
  children?: ReactNode
  onCloseClicked?: () => void
}

class _ErrorPage extends Component<Props> {
  render() {
    const { title, onCloseClicked, children, classes } = this.props
    return (
      <ModalPage onCloseClicked={onCloseClicked}>
        <Modal onCloseClicked={onCloseClicked}>
          <div className={classes.contentContainer}>
            <div className={classes.title}>{title}</div>
            <div className={classes.description}>{children}</div>
          </div>
        </Modal>
      </ModalPage>
    )
  }
}

interface PageProps {
  onCloseClicked?: () => void
}

export const ErrorPage = withStyles(styles)(_ErrorPage)

export const AntiVirusErrorPage = (props: PageProps) => (
  <ErrorPage title="Antivirus is Blocking Salad" onCloseClicked={props.onCloseClicked}>
    <div>
      Uh oh looks like your anti-virus is blocking our miner from running. If you have Norton or Malwarebytes follow the
      links below to whitelist Salad. More anti-virus guides coming soon!
    </div>
    <div style={{ paddingTop: '1rem' }}>
      <a
        href="https://salad.zendesk.com/hc/en-us/articles/360032211151-How-to-Whitelist-Salad-in-Norton-Antivirus"
        target="_blank"
      >
        Norton Antivirus
      </a>
    </div>
    <div>
      <a
        href="https://salad.zendesk.com/hc/en-us/articles/360031870772-How-to-Whitelist-Salad-in-Malwarebytes"
        target="_blank"
      >
        Malwarebytes
      </a>
    </div>
  </ErrorPage>
)

export const CudaErrorPage = (props: PageProps) => (
  <ErrorPage title="Insufficient CUDA Driver" onCloseClicked={props.onCloseClicked}>
    <div>
      Just a quick warning that we’re detecting an insufficient <a href="https://en.wikipedia.org/wiki/CUDA">CUDA </a>
      version for your graphics card. This can cause major instability with Salad. We highly recommend{' '}
      <a href="https://www.windowscentral.com/how-properly-update-device-drivers-windows-10">
        downloading the latest GPU drivers{' '}
      </a>
      to make sure it’s performing at tip-top shape. No dull knives in the Salad Kitchen!
    </div>
    <div style={{ paddingTop: '1rem' }}>
      If this issue persists, something else may be causing the problem. If so, please contact Salad Support, you can
      either chat with us on <a href="https://salad.zendesk.com/hc/en-us">Zendesk </a>, or join the
      <a href="https://discord.gg/XzyRcd8"> Discord </a> for live help.
    </div>
  </ErrorPage>
)

export const UnknownErrorPage = (props: PageProps) => (
  <ErrorPage title="ERGH. UNKNOWN ISSUE." onCloseClicked={props.onCloseClicked}>
    <div>
      Wow this is annoying, we apologize! It seems that your system has rejected Salad and we're not exactly sure why.
      Not making excuses. But there are so many different hardware drivers, OS versions, and antivirus software that we
      try to maintain compatibility with - seems we've been had!
    </div>
    <div style={{ paddingTop: '1rem' }}>
      With your help we can improve this, please send us the report so we can squash this bug! Also, a Salad Chef may
      reach out to ask for more info on the error. We appreciate your feedback. If you want to send a heated complaint,
      we're ready to hear it. Create a <a href="https://salad.zendesk.com/hc/en-us">ticket here</a>.
    </div>
    <div style={{ paddingTop: '1rem' }}>
      We're also ready to listen on our <a href="https://discord.gg/XzyRcd8"> Discord </a> server, there's a chance a
      fellow Salad chopper has seen this same issue and/or a Salad Chef may be online ready to hear your case. Thanks
      for your help and support in resolving this issue.
    </div>
  </ErrorPage>
)
