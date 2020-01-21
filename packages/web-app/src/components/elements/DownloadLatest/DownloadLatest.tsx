import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  downloadButton: {
    border: `solid 2px ${theme.lightGreen}`,
    color: theme.lightGreen,
    display: 'inline-block',
    padding: '5px 8px',
    fontSize: '.625rem',
    fontFamily: 'sharpGroteskLight25',
    textTransform: 'uppercase',
    textDecoration: 'none',
  }
})

interface Props extends WithStyles<typeof styles> {
  path: string
}

class _DownloadLatest extends Component<Props> {
  render() {
    const { path, classes, children } = this.props

    return (
      <>
        <a href={path} target="_blank" className={classes.downloadButton} rel="noopener noreferrer">
          {children}
        </a>
      </>
    )
  }
}

export const DownloadLatest = withStyles(styles)(_DownloadLatest)
