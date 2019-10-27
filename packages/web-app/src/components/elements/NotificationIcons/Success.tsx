import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Components
import { H5 } from '../../'

// Asset
import icon from '../../assets/success-triangle.png'

// Packages
import withStyles, { WithStyles } from 'react-jss'

const styles = (theme: SaladTheme) => ({
  success: {
    position: 'relative',
    display: 'inline-block',
    width: '30px',
    height: '30px',

    '& img': {
      position: 'absolute',
      top: -23,
      left: -17,
    }
  },

  color: {
    color: `${theme.green} !important`,
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
}

class _Success extends Component<Props> {
  render() {
    const { text, classes } = this.props

    return (
      <>
        <div className={classes.success}>
          <img src={icon} />
        </div>
        {text && <H5 className={classes.color}>{text}</H5>}
      </>
    )
  }
}

export const Success = withStyles(styles)(_Success)
