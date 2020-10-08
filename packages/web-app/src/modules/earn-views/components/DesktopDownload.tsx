import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, P, SectionHeader } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    maxWidth: 600,
    padding: 20,
    color: theme.lightGreen,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexBasis: '50%',
    padding: 10,
  },
  downloadButton: {
    color: theme.lightGreen,
    minWidth: 80,
    textAlign: 'center',
    background:
      'linear-gradient(303.31deg, rgba(83, 166, 38, 0.3) -2.7%, rgba(178, 213, 48, 0.24) 48.55%, rgba(83, 166, 38, 0.3) 95.11%)',
    boxShadow: 'inset 3px 3px 4px rgba(0, 0, 0, 0.25)',
    fontFamily: theme.fontGroteskLight25,
    letterSpacing: '1.3px',
    fontSize: 12,
    padding: '10px 30px',
    border: `1px solid ${theme.lightGreen}`,
    cursor: 'pointer',
    textTransform: 'uppercase',
    marginLeft: 10,
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  isNative?: boolean
  onDownload?: () => void
}

class _DesktopDownload extends Component<Props> {
  handleDownload = () => {
    const { onDownload } = this.props

    onDownload?.()
  }
  render() {
    const { isNative, classes } = this.props

    if (isNative) {
      return null
    }

    return (
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.row}>
            <div className={classes.column}>
              <SectionHeader>Download Required</SectionHeader>
              <P>Mining requires the Salad desktop app and qualifying hardware</P>
            </div>
            <div className={classes.column}>
              <div className={classes.downloadButton} onClick={this.handleDownload}>
                Download Now
              </div>
            </div>
          </div>
        </div>
        <Divider />
      </div>
    )
  }
}

export const DesktopDownload = withStyles(styles)(_DesktopDownload)
