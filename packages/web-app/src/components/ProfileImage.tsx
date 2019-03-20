import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import classNames from 'classnames'

const height = 107
const width = 84
const dy = width * Math.tan(30 * (Math.PI / 180))

const styles = (theme: SaladTheme) => ({
  container: {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: theme.green,
    clipPath: `polygon(0 0, 100% 0, 100% ${100 * (dy / height)}%, 0% 100%)`,
    userSelect: 'none',
  },
  img: {
    height: '100%',
    objectFit: 'cover',
  },
  fallbackText: {
    padding: '.75rem 1rem',
    textTransform: 'uppercase',
    color: theme.darkBlue,
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  src?: string
  dataRh?: string
}

class _ProfileImage extends Component<Props> {
  render() {
    const { src, classes } = this.props
    return (
      <div data-rh={'profile-image'} className={classNames(classes.container)}>
        {src ? <img className={classes.img} src={src} /> : <div className={classes.fallbackText}>Alpha Release</div>}
      </div>
    )
  }
}

export const ProfileImage = withStyles(styles)(_ProfileImage)
