import React, { Component } from 'react'

// Styles
import { styles } from './Template.styles'

// UI
import {
  VeggieName,
  CondensedHeader,
  P,
  Divider
} from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {

}

class _Template extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <>
        <div className="header">
          <VeggieName>Above normal title if needed</VeggieName>
          <CondensedHeader>Main title</CondensedHeader>
        </div>
        <Divider />
        <div className={classnames(classes.main)}>
          <P>Content</P>
        </div>
      </>
    )
  }
}

export const Template = withStyles(styles)(_Template)
