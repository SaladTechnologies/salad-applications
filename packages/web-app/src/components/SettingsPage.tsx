import React, { Component } from 'react'

// Styles
import { styles } from './SettingsPage.styles'

// UI
import { LinkListUnstyled, MenuTitle, Button, Divider, Head } from '.'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Route } from 'react-router'
import { DesktopRoute } from '../DesktopRoute'
import { IconArrowLeft } from '../modules/reward-views/components/assets'

export interface MenuItem {
  url: string
  text: string
  component: React.ComponentType<any>
  /** Should a divider be drawn before this item */
  divider?: boolean
  /** Is the item clickable */
  enabled?: boolean
  inset?: boolean
  desktopOnly?: boolean
}

export interface MenuButton {
  text: string
  onClick: () => void
}

interface Props extends WithStyles<typeof styles> {
  pageTitle?: string
  onClose?: () => void
  onSendBug?: () => void
  menuItems?: MenuItem[]
  menuButtons?: MenuButton[]
  appVersion?: string
  appBuild?: string
  onSendLog?: () => void
  latestDesktop?: boolean
  onDownloadLatestDesktop?: () => void
}

class _Settings extends Component<Props> {
  state = {
    buttonToggle: false,
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleCloseKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleCloseKeyPress)
  }

  handleBugClicked = () => {
    const { onSendBug } = this.props

    if (onSendBug) onSendBug()
  }

  handleLogClicked = () => {
    const { onSendLog } = this.props

    this.setState({
      buttonToggle: !this.state.buttonToggle,
    })

    if (onSendLog) onSendLog()
  }

  handleCloseClicked = () => {
    const { onClose } = this.props

    onClose?.()
  }

  handleCloseKeyPress = (e: any) => {
    if (e.key === 'Escape') {
      const { onClose } = this.props
      onClose?.()
    }
  }

  handleDownloadLatest = () => {
    const { onDownloadLatestDesktop } = this.props

    if (onDownloadLatestDesktop) onDownloadLatestDesktop()
  }

  render() {
    const {
      appVersion,
      appBuild,
      classes,
      menuItems,
      menuButtons,
      latestDesktop,
      onSendBug,
      onSendLog,
      onDownloadLatestDesktop,
      onClose,
      pageTitle,
    } = this.props

    return (
      <div className={classes.container}>
        <Head title={pageTitle} />
        <div className={classnames(classes.menu, classes.menuItems)}>
          {onClose && (
            <>
              <div className={classes.menuItem} onClick={this.handleCloseClicked}>
                <div className={classes.backButton}>
                  <IconArrowLeft />
                </div>
                Back
              </div>
              <Divider />
            </>
          )}
          {menuItems && <LinkListUnstyled list={menuItems} />}

          <div className={classes.buttonContainer}>
            {onSendBug && <Button onClick={this.handleBugClicked}>Submit Bug</Button>}
            {onSendLog && (
              <Button onClick={this.handleLogClicked}>{this.state.buttonToggle ? 'Logs sent' : 'Send logs'}</Button>
            )}
            {menuButtons && menuButtons.map((x) => <Button onClick={x.onClick}>{x.text}</Button>)}
          </div>
          <div className={classes.versionContainer}>
            {appVersion !== undefined && (
              <MenuTitle className={classnames({ [classes.outOfDateLabel]: !latestDesktop })}>
                Version: {appVersion ? appVersion : '-'}
              </MenuTitle>
            )}
            {appBuild !== undefined && <MenuTitle>Build: {appBuild ? appBuild.slice(0, 7) : '-'}</MenuTitle>}
          </div>
          {!latestDesktop && onDownloadLatestDesktop && (
            <div className={classes.updateSalad}>
              <Divider />
              <Button onClick={this.handleDownloadLatest}>Download Latest Version</Button>
            </div>
          )}
        </div>
        <div className={classnames(classes.settings)}>
          {/* Adds each path */}
          {menuItems?.map((x) =>
            x.desktopOnly ? (
              <DesktopRoute key={x.url} exact path={x.url} component={x.component} />
            ) : (
              <Route key={x.url} exact path={x.url} component={x.component} />
            ),
          )}
        </div>
      </div>
    )
  }
}

export const SettingsPage = withStyles(styles)(_Settings)
