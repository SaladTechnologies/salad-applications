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
}

interface Props extends WithStyles<typeof styles> {
  to: string
  children?: ReactNode
  className?: string
}

const _SmartLink = ({ to, children, classes, className }: Props) => {
  if (to.startsWith('http')) {
    return (
      <a className={classnames(classes.link, className)} href={to} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  } else {
    return (
      <Link to={to} className={classnames(classes.link, className)}>
        {children}
      </Link>
    )
  }
}

export const SmartLink = withStyles(styles)(_SmartLink)
