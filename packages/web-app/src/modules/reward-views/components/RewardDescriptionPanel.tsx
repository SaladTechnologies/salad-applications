import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { P } from '../../../components'
import { RewardDetailsContentPanel } from './RewardDetailsContentPanel'

const styles = (theme: SaladTheme) => ({
  titleText: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 20,
    textTransform: 'capitalize',
  },
  bodyText: {
    whiteSpace: 'pre-line',
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
}

class _RewardDescriptionPanel extends Component<Props> {
  render() {
    const { reward, classes } = this.props

    if (!reward || !reward.description) return null

    return (
      <RewardDetailsContentPanel>
        <div className={classes.titleText}>Description</div>
        <P className={classes.bodyText}>{reward?.description}</P>
      </RewardDetailsContentPanel>
    )
  }
}

export const RewardDescriptionPanel = withStyles(styles)(_RewardDescriptionPanel)
