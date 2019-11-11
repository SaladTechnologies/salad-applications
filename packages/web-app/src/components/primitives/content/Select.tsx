import React, { Component } from 'react'

// Styles
import { styles } from './Select.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  list: { text: string; value: string }[]
  selectedValue?: any,
  className?: string,
}

class _Select extends Component<Props> {
  render() {
    const { list, selectedValue, className, classes } = this.props

    return (
      <div className={classnames(className, classes.prettySelect)}>
        <select onChange={selectedValue}>
          {list.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.text}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
}

export const Select = withStyles(styles)(_Select)
