import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Checkbox } from '../../../components'

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  countLabel: {
    marginLeft: 'auto',
  },
}

interface Props extends WithStyles<typeof styles> {
  text?: string
  selected?: boolean
  count?: number
  hideCheckbox?: boolean
  onClick?: (newState: boolean) => void
}

class _RewardFilterRow extends Component<Props> {
  render() {
    const { text, selected, count, hideCheckbox, onClick, classes } = this.props

    return (
      <div className={classes.row}>
        <Checkbox text={text} checked={selected} onClick={onClick} hideCheckbox={hideCheckbox} />
        <div className={classes.countLabel}>{count}</div>
      </div>
    )
  }
}

export const RewardFilterRow = withStyles(styles)(_RewardFilterRow)
