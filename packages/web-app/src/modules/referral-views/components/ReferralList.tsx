import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Referral } from '../../referral/models'
import { ReferralItem } from './ReferralItem'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'inline-block',
    overflow: 'hidden',
  },
  itemContainer: {
    overflowY: 'auto',
    height: '200px',
    marginRight: '-17px',
  },
})

interface Props extends WithStyles<typeof styles> {
  referrals?: Referral[]
  onCreateNew?: () => void
}

class _ReferralList extends Component<Props> {
  render() {
    const { onCreateNew, referrals, classes } = this.props
    return (
      <div className={classes.container}>
        <div className={classes.itemContainer}>
          <ReferralItem key={'new'} username="CREATE NEW REFERRAL" onClick={onCreateNew} />
          {referrals && referrals.map(x => <ReferralItem key={x.id} {...x} />)}
        </div>
      </div>
    )
  }
}

export const ReferralList = withStyles(styles)(_ReferralList)
