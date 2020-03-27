import React, { ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Link } from 'react-router-dom'

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
}

const _InternalLink = ({ to, children, classes }: Props) => (
  <Link to={to} className={classes.link}>
    {children}
  </Link>
)

export const InternalLink = withStyles(styles)(_InternalLink)
