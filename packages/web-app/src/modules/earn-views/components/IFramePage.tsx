import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  fullHeight: {
    height: '100%',
  },
  descriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  offerwallWrapper: {
    flexGrow: 1,
  },
}

interface Props extends WithStyles<typeof styles> {
  pageTitle?: string
  src?: string
}

class _IFramePage extends Component<Props> {
  render() {
    const { src, pageTitle, classes } = this.props

    return (
      <div className={classes.container}>
        <Head title={pageTitle} />
        <iframe
          src={src}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            zIndex: 999999,
          }}
          title={`offerwall`}
          sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
        >
          Your browser doesn't support iframes
        </iframe>
      </div>
    )
  }
}

export const IFramePage = withStyles(styles)(_IFramePage)
