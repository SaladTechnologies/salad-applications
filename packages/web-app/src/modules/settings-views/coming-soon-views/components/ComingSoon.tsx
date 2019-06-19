import React, { Component } from 'react'

// Styles
import { styles } from './ComingSoon.styles'

// UI
import {
  VeggieName,
  CondensedHeader,
  Body,
} from '../../../../ui'

// Packages
import withStyles, { WithStyles } from 'react-jss'
// import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {

}

class _ComingSoon extends Component<Props> {
  render() {
    return (
      <>
        <header>
          <VeggieName value="Besides, you look good in a dress. (http://www.rikeripsum.com/#!/)" />
          <CondensedHeader value="Coming Soon" />
        </header>
        <main>
          <Body>
            Maybe if we felt any human loss as keenly as we feel one of those close to us, 
            human history would be far less bloody. And blowing into maximum warp speed, 
            you appeared for an instant to be in two places at once.
          </Body>
        </main>
      </>
    )
  }
}

export const ComingSoon = withStyles(styles)(_ComingSoon)
