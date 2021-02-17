import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactChild } from 'react'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { InfoButton, ModalPage, ScrollableContent, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

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
    position: 'absolute',
    right: '2rem',
    top: '1rem',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  },
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 50,
    maxWidth: 800,
    padding: '0 25px',
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
    paddingLeft: 5,
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
  subtitle: {
    fontSize: theme.medium,
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  supportReminder: {
    animation: '$fadeIn 1s ease-in',
    fontSize: theme.small,
    position: 'absolute',
    right: '1.5rem',
    bottom: '5rem',
    width: 175,
  },
  title: {
    alignItems: 'center',
    display: 'flex',
  },
})

interface HelpCenterArticle {
  name: string
  id: number
}

interface Props extends WithStyles<typeof styles> {
  antivirus?: string
  article?: string
  articleList?: HelpCenterArticle[]
  bottomMessage?: ReactChild
  fallthrough?: boolean
  onCloseClicked?: () => void
  onViewArticle?: (id: number) => void
  onViewAVList: () => void
}

interface State {
  webWidgetShowing: boolean
}

class _AntiVirusErrorPage extends Component<Props, State> {
  webWidgetTimerID?: number

  constructor(props: Props) {
    super(props)
    this.state = {
      webWidgetShowing: false,
    }
  }

  componentDidMount() {
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

  componentWillUnmount() {
    clearTimeout(this.webWidgetTimerID)
  }

  render() {
    const {
      antivirus,
      article,
      articleList,
      fallthrough,
      onCloseClicked,
      onViewArticle,
      onViewAVList,
      classes,
    } = this.props

    const { webWidgetShowing } = this.state

    return (
      <ModalPage>
        <div className={classes.page}>
          <div className={classes.closeButton} onClick={onCloseClicked}>
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </div>
          <div className={classes.container}>
            <div className={classes.heading}>
              <div className={classes.title}>
                {fallthrough ? (
                  <h1>{antivirus ? `Whitelist Salad in ${antivirus}` : 'Whitelist Salad in your anti-virus'}</h1>
                ) : (
                  <h1>{antivirus ? `${antivirus} is Blocking Salad` : 'anti-virus is Blocking Salad'}</h1>
                )}
                <InfoButton
                  text={
                    "Don't worry! Most anti-virus programs block cryptominers. This is to protect you from having other people install miners on your computer without you knowing - a process called 'cryptojacking'. As long as you are allowed to use this machine, you're fine! Check out the Salad blog to learn more."
                  }
                />
              </div>
              <div className={classes.subtitle}>
                {fallthrough ? (
                  <>
                    {antivirus ? (
                      <p>
                        Your anti-virus software is still blocking Salad, and none of our miners will work until you
                        whitelist Salad with {antivirus}. Can't whitelist? Earn anyway using{' '}
                        <SmartLink to="/earn/offerwall">Offerwalls</SmartLink>, or reach out to the{' '}
                        <SmartLink to="https://forum.salad.io/">support forum</SmartLink> for help!
                      </p>
                    ) : (
                      <p>
                        Your anti-virus has blocked all of our miners. so you'll need to whitelist Salad with your
                        Anti-Virus in order to get chopping. Can't whitelist? Earn anyway using{' '}
                        <SmartLink to="/earn/offerwall">Offerwalls</SmartLink>, or reach out to the{' '}
                        <SmartLink to="https://forum.salad.io/">support forum</SmartLink> for help!
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {antivirus ? (
                      <p>
                        Your anti-virus software is blocking Salad, but there's an easy fix: whitelist Salad with
                        Kaspersky. We'll keep testing other miners to try and keep you chopping, but your earning rates
                        could be lower.
                      </p>
                    ) : (
                      <p>
                        It looks likes your anti-virus is blocking you from chopping. We'll keep testing other miners,
                        but your earning rates could be lower until this issue is resolved.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            {article ? (
              <ScrollableContent maxWidth={650}>
                <div className={classes.content} dangerouslySetInnerHTML={{ __html: article }} />
              </ScrollableContent>
            ) : articleList && onViewArticle ? (
              <ScrollableContent maxWidth={650}>
                <ul className={classes.list}>
                  {articleList.map((article) => (
                    <li key={article.id} className={classes.listItem} onClick={() => onViewArticle(article.id)}>
                      {article.name}
                    </li>
                  ))}
                </ul>
              </ScrollableContent>
            ) : null}
            {antivirus && (
              <div className={classes.bottomMessage}>
                Use a different anti-virus provider?{' '}
                <span className={classes.link} onClick={onViewAVList}>
                  Select it from this list
                </span>
                .
              </div>
            )}
          </div>
          {webWidgetShowing && (
            <div className={classes.supportReminder}>
              Psst! This information can also be found by clicking the support button and searching for 'anti-virus'.
            </div>
          )}
        </div>
      </ModalPage>
    )
  }
}

export const AntiVirusErrorPage = withStyles(styles)(_AntiVirusErrorPage)
