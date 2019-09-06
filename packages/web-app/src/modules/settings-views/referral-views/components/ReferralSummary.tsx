import React, { Component } from 'react'
import { SaladTheme } from '../../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { StatElement } from '../../../../components'

const styles = (theme: SaladTheme) => ({})

interface Props extends WithStyles<typeof styles> {
  pendingCount?: number
  completedCount?: number
}

class _ReferralSummary extends Component<Props> {
  render() {
    const { pendingCount, completedCount } = this.props
    return (
      <StatElement title={'Referrals'} values={[`${pendingCount || 0} pending`, `${completedCount || 0} Completed`]} />
    )
  }
}

export const ReferralSummary = withStyles(styles)(_ReferralSummary)
