import React, { ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({})

interface Props extends WithStyles<typeof styles> {
  path?: string
  children?: ReactNode
}

const _ExternalLink = ({ path, children }: Props) => (
  <a href={path} target="_blank">
    {children}
  </a>
)

export const ExternalLink = withStyles(styles)(_ExternalLink)
