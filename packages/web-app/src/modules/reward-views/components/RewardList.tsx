import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models/Reward'
import Scrollbars from 'react-custom-scrollbars'
import { RewardListItem } from './RewardListItem'

const styles = (theme: SaladTheme) => ({
  container: {
    height: '5.5rem',
    display: 'flex',
    position: 'relative',
    cursor: 'pointer',
  },
  item: {
    padding: '.25rem 0',
  },
})

interface Props extends WithStyles<typeof styles> {
  rewards?: Reward[]
}

class _RewardList extends Component<Props> {
  render() {
    const { rewards, classes } = this.props

    return (
      <Scrollbars>
        {rewards &&
          rewards.map((r, _) => (
            <div key={r.id} className={classes.item}>
              <RewardListItem reward={r} />
            </div>
          ))}
      </Scrollbars>
    )
  }
}

export const RewardList = withStyles(styles)(_RewardList)
