import classnames from 'classnames'
import { useCallback, useEffect, type ComponentType } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Route } from 'react-router'
import { Button, Divider, LinkListUnstyled, MenuTitle } from '.'
import { FeatureFlags, useFeatureManager } from '../FeatureManager'
import { AccountContainer } from '../modules/account-views/account-views'
import { ReferralSettingsContainer } from '../modules/account-views/referral-views'
import { AchievementPageContainer } from '../modules/achievements-views'
import { BonusPageContainer } from '../modules/bonus-views'
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
  onClose?: () => void
}

const _Settings = ({ appBuild, classes, menuButtons, onClose }: Props) => {
  const featureManager = useFeatureManager()
  const isAchievementsFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.Achievements)

  const handleCloseClicked = () => {
    onClose?.()
  }

  const handleCloseKeyPress = useCallback(
    (e: any) => {
      if (e.key === 'Escape') {
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
    { url: '/account/summary', text: 'Account', component: AccountContainer },
    { url: '/account/referrals', text: 'Referrals', component: ReferralSettingsContainer },
    { url: '/account/bonuses', text: 'Bonuses', component: BonusPageContainer },
    isAchievementsFeatureFlagEnabled && {
      url: '/account/achievements',
      text: 'Achievements',
      component: AchievementPageContainer,
    },
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
        {menuItems?.map((x) => (
          <Route key={x.url} exact path={x.url} component={x.component} />
        ))}
      </div>
    </div>
  )
}

export const SettingsPage = withStyles(styles)(_Settings)
