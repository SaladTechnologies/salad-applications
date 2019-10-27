import React, { Component } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Components
import { H5 } from '../..'

// Asset
import icon from '../../assets/warning-triangle.png'

// Packages
import withStyles, { WithStyles } from 'react-jss'

const styles = (theme: SaladTheme) => ({
  warning: {
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

class _Warning extends Component<Props> {
  render() {
    const { text, classes } = this.props

    return (
      <>
        <div className={classes.warning}>
          <img src={icon} />
        </div>
        {text && <H5 className={classes.color}>{text}</H5>}
      </>
    )
  }
}

export const Warning = withStyles(styles)(_Warning)
