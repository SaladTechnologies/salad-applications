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

const _InternalLink = ({ to, children, classes, className }: Props) => (
  <Link to={to} className={classnames(classes.link, className)}>
    {children}
  </Link>
)

export const InternalLink = withStyles(styles)(_InternalLink)
