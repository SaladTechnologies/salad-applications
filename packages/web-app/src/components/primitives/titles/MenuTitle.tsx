import classNames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { NavLink } from 'react-router-dom'
import { SaladTheme } from '../../../SaladTheme'
import { getStore } from '../../../Store'
import { SmartLink } from '../../SmartLink'

const styles = (theme: SaladTheme) => ({
  menuTitle: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: theme.small,
    lineHeight: theme.small,
    letterSpacing: '0.01rem',
    fontWeight: 'normal',
    color: theme.green,

    '& a': {
      color: 'inherit',
      textDecoration: 'none',

      '&:hover, &:active, &.active': {
        color: `${theme.lightGreen}`,
      },
    },
  },
  disabledItem: {
    '& a, & p': {
      paddingBottom: 12,
      opacity: '0.5 !important',
      cursor: 'not-allowed !important',
      '&:hover, &:active, &.active': {
        // color: 'blue !important',
        opacity: '0.2 !important',
      },
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  path?: string
  className?: string
  enabled?: boolean
  externalLink?: boolean
  trackingInfo?: {
    type?: 'header' | 'sidebar'
    label?: string
  }
}

const handleClickTracking = (to?: string, trackingInfo?: any) => {
  if (to) {
    const store = getStore()
    const currentPath = window && window.location.pathname
    store.analytics.trackSmartLink(currentPath, to, trackingInfo.label, trackingInfo.type)
  }
}

class _MenuTitle extends Component<Props> {
  state = {
    toggle: false,
  }

  toggleActive = () => {
    this.setState({
      toggle: !this.state.toggle,
    })
  }

  render() {
    const { path, children, className, classes, enabled, externalLink, trackingInfo } = this.props

    const elements = path ? (
      <label
        className={classNames(`menuTitle ${classes.menuTitle}`, className, {
          [classes.disabledItem]: enabled === false,
        })}
      >
        {externalLink ? (
          <SmartLink to={path} trackingInfo={trackingInfo}>
            {children}
          </SmartLink>
        ) : enabled !== false ? (
          <NavLink
            to={path}
            activeClassName="active"
            onClick={trackingInfo ? () => handleClickTracking(path, trackingInfo) : undefined}
          >
            {children}
          </NavLink>
        ) : (
          <p>{children}</p>
        )}
      </label>
    ) : (
      <label className={classNames(`menuTitle ${classes.menuTitle}`, className)}>{children}</label>
    )

    return <>{elements}</>
  }
}

export const MenuTitle = withStyles(styles)(_MenuTitle)
