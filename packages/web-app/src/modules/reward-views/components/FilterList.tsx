import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { FilterItem } from '../../reward/models/FilterItem'
import { Checkbox } from '../../../components/Checkbox'
import { Observer, observer } from 'mobx-react'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    color: theme.offWhite,
    fontFamily: 'sharpGroteskBook25',
    fontSize: theme.medium,
    paddingBottom: '.25rem',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    color: theme.offWhite,
  },
  filterText: {
    paddingLeft: '.25rem',
    textTransform: 'capitalize',
    cursor: 'pointer',
  },
})

interface Props extends WithStyles<typeof styles> {
  filters?: FilterItem[]
  onToggle?: (filter: string) => void
}

@observer
class _FilterList extends Component<Props> {
  handleToggle = (name: string) => {
    const { onToggle } = this.props
    if (onToggle != null) {
      onToggle(name)
    }
  }
  render() {
    const { filters, classes } = this.props
    return (
      <div className={classnames(classes.container, 'is-unselectable')}>
        <div className={classes.title}>FILTERS:</div>
        {filters &&
          filters.map(x => (
            <Observer key={x.name}>
              {() => (
                <div className={classes.filterItem}>
                  <Checkbox
                    checked={x.checked}
                    onClick={() => {
                      this.handleToggle(x.name)
                    }}
                  />
                  <p
                    className={classes.filterText}
                    onClick={() => {
                      this.handleToggle(x.name)
                    }}
                  >
                    {x.name}
                  </p>
                </div>
              )}
            </Observer>
          ))}
      </div>
    )
  }
}

export const FilterList = withStyles(styles)(_FilterList)
