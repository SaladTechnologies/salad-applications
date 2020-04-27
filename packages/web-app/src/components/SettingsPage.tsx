import React, { Component } from 'react'

// Styles
import { styles } from './SettingsPage.styles'

// UI
import { LinkListUnstyled, MenuTitle, Button, Divider } from '.'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Route } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

// Components
import { Overlay } from '.'

export interface MenuItem {
  url: string
  text: string
  component: React.ComponentType<any>
  /** Should a divider be drawn before this item */
  divider?: boolean
  /** Is the item clickable */
  enabled?: boolean
  inset?: boolean
}

interface Props extends WithStyles<typeof styles> {
  onCloseClicked?: () => void
  onCloseKeyPress?: () => void
  onSendBug?: () => void
  menuItems?: MenuItem[]
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
    const { onCloseClicked } = this.props

    if (onCloseClicked) onCloseClicked()
  }

  handleCloseKeyPress = (e: any) => {
    if (e.key === 'Escape') {
      const { onCloseKeyPress } = this.props
      if (onCloseKeyPress) onCloseKeyPress()
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
      latestDesktop,
      onSendBug,
      onSendLog,
      onDownloadLatestDesktop,
      onCloseClicked,
    } = this.props

    return (
      <Overlay>
        <div className={classnames(classes.menu, classes.menuItems)}>
          {menuItems && <LinkListUnstyled list={menuItems} />}

          <div className={classes.buttonContainer}>
            {onSendBug && <Button onClick={this.handleBugClicked}>Submit Bug</Button>}
            {onSendLog && (
              <Button onClick={this.handleLogClicked}>{this.state.buttonToggle ? 'Logs sent' : 'Send logs'}</Button>
            )}
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
          {menuItems?.map((x) => (
            <Route path={x.url} component={x.component} />
          ))}

          {onCloseClicked && (
            <div onClick={this.handleCloseClicked}>
              <FontAwesomeIcon className={classes.closeButton} icon={faTimes} />
            </div>
          )}
        </div>
      </Overlay>
    )
  }
}

export const SettingsPage = withStyles(styles)(_Settings)
