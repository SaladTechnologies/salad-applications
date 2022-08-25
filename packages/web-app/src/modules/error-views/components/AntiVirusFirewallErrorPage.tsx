import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Button, InfoButton, ModalPage, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { ErrorPageType } from '../../../UIStore'
import { antivirusInfo } from '../../onboarding/utils'
import { AntiVirusFirewallScrollbar } from './AntiVirusFirewallScrollbar'

const styles = (theme: SaladTheme) => ({
  closeButton: {
    display: 'inline-block',
    borderRadius: '50px',
    border: `solid 2px ${theme.green}`,
    padding: '0.1rem 0.3rem',
    color: theme.green,
    lineHeight: '100%',
    position: 'absolute',
    right: '2rem',
    top: '1rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
    zIndex: 1,
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '100px 0',
    marginRight: 250,
    maxWidth: 800,
    padding: '0 25px',
    '@media screen and (min-width: 1300px)': {
      marginRight: 0,
    },
  },
  content: {
    '& a': {
      color: 'inherit',

      '&:visited': {
        color: 'inherit',
      },
    },
    '& img': {
      maxWidth: '100%',
    },
    fontSize: theme.small,
  },
  heading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 25,
    textAlign: 'center',
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  list: {
    fontSize: theme.small,
    listStyleType: 'none',
    paddingLeft: 20,
    width: '100%',
  },
  listItem: {
    cursor: 'pointer',
    marginBottom: 10,
    textDecoration: 'underline',
  },
  page: {
    color: theme.lightGreen,
    display: 'flex',
    fontFamily: theme.fontGroteskLight25,
    justifyContent: 'center',
    lineHeight: '150%',
  },
  selectFromList: {
    fontSize: theme.small,
  },
  subtitle: {
    fontSize: theme.medium,
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    lineHeight: '250%',
  },
  tooltip: {
    height: 30,
    width: 30,
  },
})

interface Props extends WithStyles<typeof styles> {
  antivirusName?: string
  errorType: string
  articleList?: typeof antivirusInfo
  fallthrough?: boolean
  loadArticle?: () => void
  onCloseClicked?: () => void
  onViewArticle?: (name: string) => void
  onViewAVList?: () => void
  helpScoutFirewallArticle?: string
  helpScoutUrl?: string
}

class _AntiVirusFirewallErrorPage extends Component<Props> {
  componentDidMount() {
    const { loadArticle } = this.props

    if (loadArticle) {
      loadArticle()
    }
  }

  render() {
    const {
      antivirusName,
      errorType,
      fallthrough,
      onCloseClicked,
      onViewAVList,
      helpScoutFirewallArticle,
      onViewArticle,
      articleList,
      helpScoutUrl,
      classes,
    } = this.props

    switch (errorType) {
      case ErrorPageType.AntiVirus:
        return (
          <ModalPage>
            <div className={classes.closeButton} onClick={onCloseClicked}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </div>
            <AntiVirusFirewallScrollbar>
              <div className={classes.page}>
                <div className={classes.container}>
                  <>
                    <div className={classes.heading}>
                      <div className={classes.title}>
                        {fallthrough ? (
                          <h1>
                            {antivirusName
                              ? `Whitelist Salad in ${antivirusName}`
                              : 'Whitelist Salad in your anti-virus'}
                          </h1>
                        ) : (
                          <h1>
                            {antivirusName ? `${antivirusName} is Blocking Salad` : 'Anti-Virus is Blocking Salad'}
                          </h1>
                        )}
                        <InfoButton
                          className={classes.tooltip}
                          text={
                            "Don't worry! Most anti-virus programs block cryptominers. This is to protect you from having other people install miners on your computer without you knowing - a process called 'cryptojacking'. As long as you are allowed to use this machine, you're fine! Check out the Salad blog to learn more."
                          }
                        />
                      </div>
                      <div className={classes.subtitle}>
                        {fallthrough ? (
                          <>
                            {antivirusName ? (
                              <>
                                <p>
                                  Your anti-virus software is still blocking Salad, and none of our miners will work
                                  until you whitelist Salad with {antivirusName}. Reach out to{' '}
                                  <SmartLink to="https://support.salad.com/">support</SmartLink> for help!
                                </p>
                                <p className={classes.selectFromList}>
                                  {' '}
                                  Use a different anti-virus provider?{' '}
                                  <span className={classes.link} onClick={onViewAVList}>
                                    Select it from this list
                                  </span>
                                  .
                                </p>
                              </>
                            ) : (
                              <p>
                                Your anti-virus has blocked all of our miners. so you'll need to whitelist Salad with
                                your anti-virus in order to get chopping. Reach out to{' '}
                                <SmartLink to="https://support.salad.com/">support</SmartLink> for help!
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            {antivirusName ? (
                              <>
                                <p>
                                  Your anti-virus software is blocking Salad, but there's an easy fix: whitelist Salad
                                  with {antivirusName}.
                                </p>
                                <p className={classes.selectFromList}>
                                  Use a different anti-virus provider?{' '}
                                  <span className={classes.link} onClick={onViewAVList}>
                                    Select it from this list
                                  </span>
                                  .
                                </p>
                              </>
                            ) : (
                              <p>
                                It looks likes your anti-virus is blocking you from chopping. Select one of the guides
                                below to fix this issue for your specific anti-virus program.
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {antivirusName ? (
                      <iframe height={700} width={700} src={helpScoutUrl} title={antivirusName} />
                    ) : (
                      <ul className={classes.list}>
                        {articleList?.map((article) => (
                          <li
                            key={article.label}
                            className={classes.listItem}
                            onClick={() => onViewArticle && onViewArticle(article.name)}
                          >
                            How to Whitelist Salad in {article.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button onClick={onCloseClicked}>Close</Button>
                  </>
                </div>
              </div>
            </AntiVirusFirewallScrollbar>
          </ModalPage>
        )
      case ErrorPageType.Firewall:
        return (
          <ModalPage>
            <div className={classes.closeButton} onClick={onCloseClicked}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </div>
            <AntiVirusFirewallScrollbar>
              <div className={classes.page}>
                <div className={classes.container}>
                  <>
                    <div className={classes.heading}>
                      <div className={classes.title}>
                        {fallthrough ? (
                          <h1>Add Exception for Salad to your Firewall</h1>
                        ) : (
                          <h1>Firewall is blocking Salad</h1>
                        )}
                        <InfoButton
                          className={classes.tooltip}
                          text={
                            "Don't worry! Most Firewalls block cryptominers. This is to protect you from having other people install miners on your computer without you knowing - a process called 'cryptojacking'. As long as you are allowed to use this machine, you're fine! Check out the Salad blog to learn more."
                          }
                        />
                      </div>
                      <div className={classes.subtitle}>
                        {fallthrough ? (
                          <p>
                            Your Firewall is still blocking Salad, and none of our miners will work until this issue is
                            resolved. Can't add an exception? Reach out to{' '}
                            <SmartLink to="https://support.salad.com/">support</SmartLink> for help!
                          </p>
                        ) : (
                          <p>
                            Your Firewall is blocking you from chopping. We'll keep testing other miners, but your
                            earning rates could be lower until this issue is resolved.
                          </p>
                        )}
                      </div>
                    </div>
                    <iframe height={700} width={700} src={helpScoutFirewallArticle} title="firewall article" />
                    <Button onClick={onCloseClicked}>Close</Button>
                  </>
                </div>
              </div>
            </AntiVirusFirewallScrollbar>
          </ModalPage>
        )
      default:
        return null
    }
  }
}

export const AntiVirusFirewallErrorPage = withStyles(styles)(_AntiVirusFirewallErrorPage)
