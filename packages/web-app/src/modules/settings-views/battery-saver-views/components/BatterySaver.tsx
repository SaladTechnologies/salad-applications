import React, { Component } from 'react'

// Styles
import { styles } from './BatterySaver.styles'

// UI
import { VeggieName, CondensedHeader, AppBody } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
// import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {}

class _BatterySaver extends Component<Props> {
  render() {
    return (
      <>
        <div className="header">
          <VeggieName>Coming Soon</VeggieName>
          <CondensedHeader>Battery Saver</CondensedHeader>
        </div>
        <div className="main">
          <AppBody>Salad won’t chop if your laptop isn’t connected to a power source.</AppBody>
        </div>
      </>
    )
  }
}

export const BatterySaver = withStyles(styles)(_BatterySaver)
