import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Checkbox } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.lightGreen,
    padding: 10,
  },
  sortContainer: {
    padding: 5,
  },
  sortLabel: {
    paddingBottom: 5,
  },
  sectionContainer: {
    padding: 10,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  countLabel: {
    marginLeft: 'auto',
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
  selected?: boolean
  count?: number
  onClick?: (newState: boolean) => void
}

class _RewardFilterRow extends Component<Props> {
  render() {
    const { text, selected, count, onClick, classes } = this.props

    return (
      <div className={classes.row}>
        <Checkbox text={text} checked={selected} onClick={onClick} />
        <div className={classes.countLabel}>{count}</div>
      </div>
    )
  }
}

export const RewardFilterRow = withStyles(styles)(_RewardFilterRow)
