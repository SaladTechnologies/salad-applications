import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Route } from 'react-router'
import { Button, Divider, Head, LinkListUnstyled, MenuTitle } from '.'
import { DesktopRoute } from '../DesktopRoute'
import { IconArrowLeft } from '../modules/reward-views/components/assets'
import { styles } from './SettingsPage.styles'

export interface MenuItem {
  url: string
  text: string
  component?: React.ComponentType<any>
  /** Should a divider be drawn before this item */
  divider?: boolean
  /** Is the item clickable */
  enabled?: boolean
  inset?: boolean
  desktopOnly?: boolean
  externalLink?: boolean
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
              <Button onClick={this.handleDownloadLatest}>Get Latest Version</Button>
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
