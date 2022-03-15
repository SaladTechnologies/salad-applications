import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, Text } from '@saladtechnologies/garden-components'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { ModalPage } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { AntiVirusSoftware } from '../../zendesk/models'
import { AntivirusModalContent, OnboardingAntiVirusScrollbar } from '../components'

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
    border: `solid 2px ${theme.darkBlue}`,
    padding: '0.1rem 0.3rem',
    color: theme.darkBlue,
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
  },
  heading: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 25,
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
    color: theme.darkBlue,
    background: 'linear-gradient(to right, #56A431 , #AACF40)',
    display: 'flex',
    fontFamily: theme.fontGroteskLight25,
    justifyContent: 'center',
    lineHeight: '150%',
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: theme.medium,
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  supportReminder: {
    animation: '$fadeIn 1s ease-in',
    color: theme.darkBlue,
    fontSize: theme.small,
    lineHeight: '150%',
    position: 'absolute',
    right: '1.5rem',
    bottom: '5rem',
    width: 175,
  },
  title: {
    display: 'flex',
    lineHeight: '250%',
    color: theme.lightGreen,
    paddingBottom: 24,
  },
  video: {
    textAlign: 'center',
  },
  closeButtonContainer: {
    textAlign: 'center',
  },
})

export interface AntivirusGuideProps extends WithStyles<typeof styles> {
  isNative: boolean
  antivirusName?: string
  article?: string
  loading?: boolean
  loadArticle?: () => void
  onCloseClicked?: () => void
  antiVirusGuideVideoId?: number
  navigateToAVGuide: (antivirusSoftwareName: AntiVirusSoftware, label: string) => void
  onNoAVClick: () => void
  articleId?: number
  helpScoutUrl?: string
}

interface State {
  webWidgetShowing: boolean
  showAVSelectionModal: boolean
}

class _AntivirusGuide extends Component<AntivirusGuideProps, State> {
  webWidgetTimerID?: number

  constructor(props: AntivirusGuideProps) {
    super(props)
    this.state = {
      webWidgetShowing: false,
      showAVSelectionModal: false,
    }
  }

  handleCloseAVSelectionModal = () => {
    this.setState({
      showAVSelectionModal: false,
    })
  }

  handleOpenAVSelectionModal = () => {
    this.setState({
      showAVSelectionModal: true,
    })
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

  componentDidUpdate(prevProps: AntivirusGuideProps) {
    if (prevProps.articleId !== this.props.articleId) {
      if (this.props.loadArticle) {
        this.handleCloseAVSelectionModal()
        this.props.loadArticle()
      }
    }
  }

  render() {
    const { antivirusName, onCloseClicked, isNative, navigateToAVGuide, onNoAVClick, classes, helpScoutUrl } =
      this.props

    const { webWidgetShowing, showAVSelectionModal } = this.state

    return (
      <ModalPage showWindowBarContainer={true} isNative={isNative}>
        <div className={classes.closeButton} onClick={onCloseClicked}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </div>
        <OnboardingAntiVirusScrollbar>
          <div className={classes.page}>
            <div className={classes.container}>
              {console.log(helpScoutUrl)}
              <div className={classes.heading}>
                <div className={classes.title}>
                  <Text variant="headline">{antivirusName}</Text>
                </div>
              </div>

              <iframe width={700} height={700} title={antivirusName} src={helpScoutUrl} />
              <div className={classes.subtitle}>
                <Text variant="baseS">
                  Use a different anti-virus provider?{' '}
                  <span className={classes.link} onClick={this.handleOpenAVSelectionModal}>
                    Select it from this list
                  </span>
                  .
                </Text>
              </div>
              <span className={classes.closeButtonContainer}>
                <Button size="medium" label="Close" onClick={onCloseClicked} />
              </span>
            </div>
          </div>
        </OnboardingAntiVirusScrollbar>
        {webWidgetShowing && (
          <div className={classes.supportReminder}>
            <Text variant="baseS">
              This information can also be found by clicking the support button and searching for 'anti-virus'.
            </Text>
          </div>
        )}
        {showAVSelectionModal && (
          <Modal onClose={() => this.handleCloseAVSelectionModal()} title="Select your Antivirus provider">
            <AntivirusModalContent navigateToAVGuide={navigateToAVGuide} onNoAVClick={onNoAVClick} />
          </Modal>
        )}
      </ModalPage>
    )
  }
}

export const AntivirusGuide = withStyles(styles)(_AntivirusGuide)
