import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import { Button, InfoButton, ModalPage } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { AntiVirusFirewallScrollbar } from '../../error-views/components/AntiVirusFirewallScrollbar'

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

export interface AntivirusGuideProps extends WithStyles<typeof styles> {
  antivirusName?: string
  article?: string
  loading?: boolean
  loadArticle?: () => void
  onCloseClicked?: () => void
  onViewAVList?: () => void
  antiVirusGuideVideoId?: number
}

interface State {
  webWidgetShowing: boolean
}

class _AntivirusGuide extends Component<AntivirusGuideProps, State> {
  webWidgetTimerID?: number

  constructor(props: AntivirusGuideProps) {
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
    const { antivirusName, article, loading, onCloseClicked, onViewAVList, antiVirusGuideVideoId, classes } = this.props

    const { webWidgetShowing } = this.state

    return (
      <ModalPage>
        <div className={classes.closeButton} onClick={onCloseClicked}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </div>
        <AntiVirusFirewallScrollbar>
          <div className={classes.page}>
            <div className={classes.container}>
              {loading ? (
                <Skeleton height={'100%'} />
              ) : (
                <>
                  <div className={classes.heading}>
                    <div className={classes.title}>
                      <h1>{antivirusName ? `${antivirusName} is Blocking Salad` : 'Anti-Virus is Blocking Salad'}</h1>

                      <InfoButton
                        className={classes.tooltip}
                        text={
                          "Don't worry! Most anti-virus programs block cryptominers. This is to protect you from having other people install miners on your computer without you knowing - a process called 'cryptojacking'. As long as you are allowed to use this machine, you're fine! Check out the Salad blog to learn more."
                        }
                      />
                    </div>
                    <div className={classes.subtitle}>
                      <>
                        <p>
                          Your anti-virus software is blocking Salad, but there's an easy fix: whitelist Salad with{' '}
                          {antivirusName}.
                        </p>
                        <p className={classes.selectFromList}>
                          Use a different anti-virus provider?{' '}
                          <span className={classes.link} onClick={onViewAVList}>
                            Select it from this list
                          </span>
                          .
                        </p>
                      </>
                    </div>
                  </div>
                  {article ? (
                    <>
                      {antiVirusGuideVideoId && (
                        <>
                          <iframe
                            title={antivirusName}
                            src={`//player.vimeo.com/video/${antiVirusGuideVideoId}`}
                            width="640"
                            height="360"
                            frameBorder="0"
                            allowFullScreen
                          ></iframe>
                        </>
                      )}
                      <div className={classes.content} dangerouslySetInnerHTML={{ __html: article }} />{' '}
                    </>
                  ) : null}
                  <Button onClick={onCloseClicked}>Close</Button>
                </>
              )}
            </div>
          </div>
        </AntiVirusFirewallScrollbar>
        {webWidgetShowing && (
          <div className={classes.supportReminder}>
            This information can also be found by clicking the support button and searching for 'anti-virus'.
          </div>
        )}
      </ModalPage>
    )
  }
}

export const AntivirusGuide = withStyles(styles)(_AntivirusGuide)
