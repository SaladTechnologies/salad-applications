import React, { ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

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
}

const _SmartLink = ({ to, children, classes, className }: Props) => {
  const isTextChild = typeof children === 'string'
  const finalClassName = classnames(classes.link, className, { [classes.hideUnderline]: !isTextChild })

  if (to === undefined || to.startsWith('http')) {
    return (
      <a className={finalClassName} href={to} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  } else {
    return (
      <Link to={to} className={finalClassName}>
        {children}
      </Link>
    )
  }
}

export const SmartLink = withStyles(styles)(_SmartLink)
