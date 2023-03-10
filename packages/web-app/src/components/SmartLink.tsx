import classnames from 'classnames'
import type { ReactNode } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Link } from 'react-router-dom'
import type { LinkTrackingInfo } from '../modules/analytics/models'
import type { RootStore } from '../Store'
import { getStore } from '../Store'

const styles = {
  link: {
    color: 'inherit',

    '&:visited': {
      color: 'inherit',
    },
  },
  hideUnderline: {
    textDecoration: 'none',
  },
}

interface Props extends WithStyles<typeof styles> {
  to?: string
  children?: ReactNode
  className?: string
  trackingInfo?: LinkTrackingInfo
}

const handleClickTracking = (to?: string, trackingInfo?: any) => {
  if (to) {
    const store: RootStore = getStore()
    store.analytics.trackSmartLink(to, trackingInfo.label, trackingInfo.type)
  }
}

const _SmartLink = ({ to, children, classes, className, trackingInfo }: Props) => {
  const isTextChild = typeof children === 'string'
  const finalClassName = classnames(classes.link, className, { [classes.hideUnderline]: !isTextChild })
  if (to === undefined || to.startsWith('http')) {
    return (
      <a
        className={finalClassName}
        href={to}
        rel="noopener noreferrer"
        onClick={trackingInfo ? () => handleClickTracking(to, trackingInfo) : undefined}
      >
        {children}
      </a>
    )
  } else {
    return (
      <Link
        to={to}
        className={finalClassName}
        onClick={trackingInfo ? () => handleClickTracking(to, trackingInfo) : undefined}
      >
        {children}
      </Link>
    )
  }
}

export const SmartLink = withStyles(styles)(_SmartLink)
