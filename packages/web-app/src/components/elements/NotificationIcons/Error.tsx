import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Components
import { H5 } from '../..'

// Asset
import icon from '../../assets/error-triangle.png'

// Packages
import withStyles, { WithStyles } from 'react-jss'

const styles = (theme: SaladTheme) => ({
  error: {
    position: 'relative',
    display: 'inline-block',
    width: '30px',
    height: '30px',

    '& img': {
      position: 'absolute',
      top: -23,
      left: -17,
    },
  },

  exclamation: {
    color: '#fcfcfc',
    fontFamily: theme.fontGroteskBook25,
    fontSize: theme.small,
    position: 'absolute',
    top: 3,
    left: 11,
  },

  color: {
    color: `${theme.red} !important`,
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
}

class _Error extends Component<Props> {
  render() {
    const { text, classes } = this.props

    return (
      <>
        <div className={classes.error}>
          <img src={icon} />
          <div className={classes.exclamation}>!!</div>
        </div>
        {text && <H5 className={classes.color}>{text}</H5>}
      </>
    )
  }
}

export const Error = withStyles(styles)(_Error)
