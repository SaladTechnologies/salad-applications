import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactChild } from 'react'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import { Button, InfoButton, ModalPage, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { ErrorPageType } from '../../../UIStore'
import { AntiVirusScrollbar } from './AntiVirusScrollbar'

const styles = (theme: SaladTheme) => ({
  bottomMessage: {
    fontSize: theme.medium,
    margin: '25px 0',
    textAlign: 'center',
  },
  checkBox: {
    display: 'flex',
    justifyContent: 'center',
  },
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
  supportReminder: {
    animation: '$fadeIn 1s ease-in',
    color: theme.lightGreen,
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.small,
    lineHeight: '150%',
    position: 'absolute',
    right: '1.5rem',
    bottom: '5rem',
    width: 175,
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

interface HelpCenterArticle {
  name: string
  id: number
}

interface Props extends WithStyles<typeof styles> {
  antivirusName?: string
  errorType: string
  article?: string
  articleList?: HelpCenterArticle[]
  bottomMessage?: ReactChild
  fallthrough?: boolean
  loading?: boolean
  loadArticle?: () => void
  onCloseClicked?: () => void
  onViewArticle?: (id: number) => void
  onViewAVList?: () => void
}

interface State {
  webWidgetShowing: boolean
}

class _AntiVirusFirewallErrorPage extends Component<Props, State> {
  webWidgetTimerID?: number

  constructor(props: Props) {
    super(props)
    this.state = {
      webWidgetShowing: false,
    }
  }

  componentDidMount() {
    const { loadArticle } = this.props

    if (loadArticle) {
      loadArticle()
    }

    const webWidgetDisplay: any = window && window.zE && window.zE('webWidget:get', 'display')
    if (webWidgetDisplay === 'launcher') {
      this.setState({
        webWidgetShowing: true,
      })
    } else {
      this.webWidgetTimerID = window.setTimeout(() => {
        const webWidgetDisplay: any = window && window.zE && window.zE('webWidget:get', 'display')
        if (webWidgetDisplay === 'launcher') {
          this.setState({
            webWidgetShowing: true,
          })
          clearTimeout(this.webWidgetTimerID)
        }
      }, 3000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.webWidgetTimerID)
  }

  render() {
    const {
      antivirusName,
      errorType,
      article,
      articleList,
      fallthrough,
      loading,
      onCloseClicked,
      onViewArticle,
      onViewAVList,
      classes,
    } = this.props

    const { webWidgetShowing } = this.state

    switch (errorType) {
      case ErrorPageType.AntiVirus:
        return (
          <ModalPage>
            <div className={classes.closeButton} onClick={onCloseClicked}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </div>
            <AntiVirusScrollbar>
              <div className={classes.page}>
                <div className={classes.container}>
                  {loading ? (
                    <Skeleton height={'100%'} />
                  ) : (
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
                                    until you whitelist Salad with {antivirusName}. Can't whitelist? Earn anyway using{' '}
                                    <SmartLink to="/earn/offerwall">Offerwalls</SmartLink>, or reach out to the{' '}
                                    <SmartLink to="https://forum.salad.io/">support forum</SmartLink> for help!
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
                                  your anti-virus in order to get chopping. Can't whitelist? Earn anyway using{' '}
                                  <SmartLink to="/earn/offerwall">Offerwalls</SmartLink>, or reach out to the{' '}
                                  <SmartLink to="https://forum.salad.io/">support forum</SmartLink> for help!
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
                      {article ? (
                        <div className={classes.content} dangerouslySetInnerHTML={{ __html: article }} />
                      ) : articleList && onViewArticle ? (
                        <ul className={classes.list}>
                          {articleList.map((article) => (
                            <li key={article.id} className={classes.listItem} onClick={() => onViewArticle(article.id)}>
                              {article.name}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <Button onClick={onCloseClicked}>Close</Button>
                    </>
                  )}
                </div>
              </div>
            </AntiVirusScrollbar>
            {webWidgetShowing && (
              <div className={classes.supportReminder}>
                This information can also be found by clicking the support button and searching for 'anti-virus'.
              </div>
            )}
          </ModalPage>
        )
      case ErrorPageType.Firewall:
        return (
          <ModalPage>
            <div className={classes.closeButton} onClick={onCloseClicked}>
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </div>
            <AntiVirusScrollbar>
              <div className={classes.page}>
                <div className={classes.container}>
                  {loading ? (
                    <Skeleton height={'100%'} />
                  ) : (
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
                              Your Firewall is still blocking Salad, and none of our miners will work until this issue
                              is resolved. Can't add an exception? Earn anyway using{' '}
                              <SmartLink to="/earn/offerwall">Offerwalls</SmartLink>, or reach out to the{' '}
                              <SmartLink to="https://forum.salad.io/">Support Forum</SmartLink>{' '}
                              for help!
                            </p>
                          ) : (
                            <p>
                              Your Anti-Virus is blocking you from chopping. We'll keep testing other miners, but your
                              earning rates could be lower until this issue is resolved.
                            </p>
                          )}
                        </div>
                      </div>
                      {article ? (
                        <div className={classes.content} dangerouslySetInnerHTML={{ __html: article }} />
                      ) : null}
                      <Button onClick={onCloseClicked}>Close</Button>
                    </>
                  )}
                </div>
              </div>
            </AntiVirusScrollbar>
            {webWidgetShowing && (
              <div className={classes.supportReminder}>
                This information can also be found by clicking the support button and searching for 'Firewall'.
              </div>
            )}
            )
          </ModalPage>
        )
      default:
        return null
    }
  }
}

export const AntiVirusFirewallErrorPage = withStyles(styles)(_AntiVirusFirewallErrorPage)
