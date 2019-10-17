import React, { Component, ReactNode } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  listInline: {
    paddingLeft: 0,
    listStyle: 'none',
  },

  listInlineItem: {
    display: 'inline-block',
  },
})

interface Props extends WithStyles<typeof styles> {
  list?: string[]
  componentList?: ReactNode[],
  splitEvenly?: boolean
}

class _ListInline extends Component<Props> {
  render() {
    const { list, componentList, splitEvenly, classes } = this.props
    let splitWidth: string = 'auto'

    if(componentList) {
      splitWidth = splitEvenly ? `${100/componentList.length}%` : 'auto'
    } else if (list) {
      splitWidth = splitEvenly ? `${100/list.length}%` : 'auto'
    }

    return (
      <ul className={classnames(classes.listInline)}>
        {list &&
          list.map((item, index) => {
            return (
              <li key={index} className={classnames(classes.listInlineItem)}>
                {item}
              </li>
            )
          })}

        {componentList &&
          componentList.map((item, index) => {
            return (
              <li
                key={index}
                className={classnames(classes.listInlineItem)}
                style={{ width: splitWidth }}
              >
                {item}
              </li>
            )
          })}
      </ul>
    )
  }
}

export const ListInline = withStyles(styles)(_ListInline)
