import classnames from 'classnames'
import { useCallback, useEffect } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Outlet } from '@tanstack/react-router'
import { Button, Divider, LinkListUnstyled, MenuTitle } from '.'
import { IconArrowLeft } from '../modules/reward-views/components/assets'
import { styles } from './SettingsPage.styles'

interface MenuItem {
  url: string
  text: string
  /** Should a divider be drawn before this item */
  divider?: boolean
  /** Is the item clickable */
  enabled?: boolean
  inset?: boolean
  externalLink?: boolean
}

interface MenuButton {
  text: string
  onClick: () => void
}

interface Props extends WithStyles<typeof styles> {
  isUserReferralsEnabled: boolean
  appBuild?: string
  menuButtons?: MenuButton[]
  onClose?: () => void
}

const _Settings = ({ appBuild, classes, menuButtons, isUserReferralsEnabled, onClose }: Props) => {
  const handleCloseClicked = () => {
    onClose?.()
  }

  const handleCloseKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keyup', handleCloseKeyPress)
    return () => {
      document.removeEventListener('keyup', handleCloseKeyPress)
    }
  }, [handleCloseKeyPress])

  const menuItems: MenuItem[] = [
    { url: '/account/summary', text: 'Account' },
    isUserReferralsEnabled && { url: '/account/referrals', text: 'Referrals' },
    { url: '/account/bonuses', text: 'Bonuses' },
    { url: '/account/achievements', text: 'Achievements' },
    { url: '/account/alerts', text: 'Demand Alerts' },
  ].filter((menuItem) => menuItem) as MenuItem[]

  return (
    <div className={classes.container}>
      <div className={classnames(classes.menu, classes.menuItems)}>
        {onClose && (
          <>
            <div className={classes.menuItem} onClick={handleCloseClicked}>
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
        {/* The page: the route tree (src/Routes.tsx) has a route for each menu item, and "not found" for any other */}
        <Outlet />
      </div>
    </div>
  )
}

export const SettingsPage = withStyles(styles)(_Settings)
