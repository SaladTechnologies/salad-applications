import React, { ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({})

interface Props extends WithStyles<typeof styles> {
  path?: string
  children?: ReactNode
  className?: string
}

const _ExternalLink = ({ path, className, children }: Props) => (
  <a href={path} target="_blank" className={className} rel="noopener noreferrer">
    {children}
  </a>
)

export const ExternalLink = withStyles(styles)(_ExternalLink)
