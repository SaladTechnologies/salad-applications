import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Route, Switch } from 'react-router'
import { TabControl, TabItem } from '../../../components/TabControl'
import { AdGemContainer } from '../../earn-views/AdGemContainer'
import { OfferToroContainer } from '../../earn-views/OfferToroContainer'
import { OfferwallContainer } from '../../earn-views/OfferwallContainer'

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  fullPage: { flex: 1 },
}

interface Props extends WithStyles<typeof styles> {}

class _MobileOfferwallPage extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        <TabControl
          tabs={[
            new TabItem('AdGem', '/earn/offerwall/adgem'),
            new TabItem('Offer Toro', '/earn/offerwall/offertoro'),
          ]}
        />
        <div className={classes.fullPage}>
          <Switch>
            <Route exact path="/earn/offerwall" component={OfferwallContainer} />
            <Route exact path="/earn/offerwall/adgem" component={AdGemContainer} />
            <Route exact path="/earn/offerwall/offertoro" component={OfferToroContainer} />
          </Switch>
        </div>
      </div>
    )
  }
}

export const MobileOfferwallPage = withStyles(styles)(_MobileOfferwallPage)
