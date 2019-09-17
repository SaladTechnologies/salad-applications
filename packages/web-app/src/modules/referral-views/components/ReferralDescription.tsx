import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { AppBody } from '../../../components'

const styles = (theme: SaladTheme) => ({})

interface Props extends WithStyles<typeof styles> {}

class _ReferralDescription extends Component<Props> {
  render() {
    return (
      <div>
        <AppBody>
          <b>What Do I Get When Someone Uses My Code?</b>
        </AppBody>
        <AppBody>
          You will receive a 50% bonus relative to your referee's Salad earnings (up to $1 per referee), paid out as
          they earn. This does not impact their earnings. The more your referees run Salad, the faster you'll see your
          bonuses.
        </AppBody>
        <AppBody>
          <b>What Does The Person Using My Code Get?</b>
        </AppBody>
        <AppBody>
          Using your promo code will grant your referee a 2x earning rate bonus until they've reached $4 earned.
        </AppBody>
      </div>
    )
  }
}

export const ReferralDescription = withStyles(styles)(_ReferralDescription)
