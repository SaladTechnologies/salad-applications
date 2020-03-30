import React, { ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'

const styles = {
  link: {
    color: 'inherit',
  },
}

interface Props extends WithStyles<typeof styles> {
  path?: string
  children?: ReactNode
}

const _ExternalLink = ({ path, children, classes }: Props) => (
  <a className={classes.link} href={path} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

export const ExternalLink = withStyles(styles)(_ExternalLink)
