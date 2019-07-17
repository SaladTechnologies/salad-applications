import React, { Component } from 'react'

// Styles
import { styles } from './ComingSoon.styles'

// UI
import {
  VeggieName,
  CondensedHeader,
  AppBody,
} from '../../../../components'

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
          <VeggieName>Coming Soon</VeggieName>
          <CondensedHeader>Coming Soon</CondensedHeader>
        </header>
        <main>
          <AppBody>
            
          </AppBody>
        </main>
      </>
    )
  }
}

export const ComingSoon = withStyles(styles)(_ComingSoon)
