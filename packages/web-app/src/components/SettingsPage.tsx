import classnames from 'classnames'
import type { ComponentType, ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Route } from 'react-router'
import { Button, Divider, LinkListUnstyled, MenuTitle } from '.'
import { IconArrowLeft } from '../modules/reward-views/components/assets'
import { styles } from './SettingsPage.styles'

export interface MenuItem {
  url: string
  text: string
  component?: ComponentType<any>
  /** Should a divider be drawn before this item */
  divider?: boolean
  /** Is the item clickable */
  enabled?: boolean
  inset?: boolean
  externalLink?: boolean
}

export interface MenuButton {
  text: string
  onClick: () => void
}

interface Props extends WithStyles<typeof styles> {
  appBuild?: string
  menuButtons?: MenuButton[]
  menuItems?: MenuItem[]
  onClose?: () => void
}

class _Settings extends Component<Props> {
  public override componentDidMount() {
    document.addEventListener('keyup', this.handleCloseKeyPress)
  }

  public override componentWillUnmount() {
    document.removeEventListener('keyup', this.handleCloseKeyPress)
  }

  private handleCloseClicked = () => {
    const { onClose } = this.props
    onClose?.()
  }

  private handleCloseKeyPress = (e: any) => {
    if (e.key === 'Escape') {
      const { onClose } = this.props
      onClose?.()
    }
  }

  public override render(): ReactNode {
    const { appBuild, classes, menuButtons, menuItems, onClose } = this.props
    return (
      <div className={classes.container}>
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
          {menuItems && <LinkListUnstyled list={menuItems} trackingType="sidebar" />}

          <div className={classes.buttonContainer}>
            {menuButtons && menuButtons.map((x) => <Button onClick={x.onClick}>{x.text}</Button>)}
          </div>
          <div className={classes.versionContainer}>
            {appBuild !== undefined && <MenuTitle>Build: {appBuild ? appBuild.slice(0, 7) : '-'}</MenuTitle>}
          </div>
        </div>
        <div className={classnames(classes.settings)}>
          {menuItems?.map((x) => (
            <Route key={x.url} exact path={x.url} component={x.component} />
          ))}
        </div>
      </div>
    )
  }
}

export const SettingsPage = withStyles(styles)(_Settings)
