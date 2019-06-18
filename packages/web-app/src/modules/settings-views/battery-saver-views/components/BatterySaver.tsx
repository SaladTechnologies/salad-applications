import React, { Component } from 'react'

// Styles
import { styles } from './BatterySaver.styles'

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

class _BatterySaver extends Component<Props> {
  render() {
    return (
      <>
        <header>
          <VeggieName value="Coming Soon" />
          <CondensedHeader value="Battery Saver" />
        </header>
        <main>
          <Body>
            Salad won’t chop if your laptop isn’t connected to a power source.
          </Body>
        </main>
      </>
    )
  }
}

export const BatterySaver = withStyles(styles)(_BatterySaver)
