import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SectionHeader } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { RewardFilterRow } from './RewardFilterRow'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.lightGreen,
    padding: 10,
  },
  sectionContainer: {
    padding: 10,
  },
  checkbox: {
    padding: '5px 0',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    paddingTop: 8,
  },
  clearText: {
    cursor: 'pointer',
    padding: '10px 0',
    '& div': {
      paddingLeft: 5,
    },
    '&:hover': {
      opacity: 0.8,
    },
  },
  textbox: {
    width: '50%',
  },
})

interface FilterOption {
  value: RangeValue
  count: number
  selected: boolean
}

type RangeValue = { name?: string; to?: number; from?: number }

interface State {
  from?: number
  to?: number
}

interface Props extends WithStyles<typeof styles> {
  label?: string
  options?: FilterOption[]
  onSelect?: (value: RangeValue) => void
  onRemove?: (value: RangeValue) => void
}

class _RewardPriceFilter extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      from: undefined,
      to: undefined,
    }
  }

  clearFilters = () => {
    const { options, onRemove } = this.props

    options?.filter((x) => x.selected).forEach((x) => onRemove?.(x.value))
  }

  handleClick = (checked: boolean, option: FilterOption) => {
    const { onSelect, onRemove } = this.props
    if (!option) return
    if (checked) {
      onSelect?.(option.value)
    } else {
      onRemove?.(option.value)
    }
  }

  // handleText = (e: any) => {
  //   const { onSelect } = this.props

  //   console.log()
  //   console.log(e.target.value)

  //   const name: 'from' | 'to' = e.target.name
  //   const value = parseFloat(e.target.value)

  //   this.setState({ [name]: value })

  //   let req: RangeValue = {}

  //   if (this.state.from) {
  //     req.from = this.state.from
  //   }
  //   if (this.state.to) {
  //     req.to = this.state.to
  //   }

  //   if (value) {
  //     req[name] = value
  //   }

  //   onSelect?.(req)
  // }

  render() {
    const { label, options, classes } = this.props

    if (!options) return null

    const selected = options.find((x) => x.selected)

    return (
      <div className={classes.container}>
        <SectionHeader>{label}</SectionHeader>
        {!selected &&
          options.map((x) => (
            <RewardFilterRow
              key={x.value.name}
              text={x.value.name}
              selected={x.selected}
              count={x.count}
              onClick={(checked) => this.handleClick(checked, x)}
            />
          ))}
        {selected && (
          <div>
            <div className={classes.selectedText}>{selected.value.name}</div>
            <div className={classnames(classes.row, classes.clearText)} onClick={this.clearFilters}>
              <FontAwesomeIcon icon={faTimes} />
              <div>Clear Filter</div>
            </div>
          </div>
        )}
        {/* <div className={classes.row}>
          <TextField name="from" placeholder="Min" className={classes.textbox} onChange={this.handleText} />
          <TextField name="to" placeholder="Max" className={classes.textbox} onChange={this.handleText} />
        </div> */}
      </div>
    )
  }
}

export const RewardPriceFilter = withStyles(styles)(_RewardPriceFilter)
