import React, { Component, ReactNode } from 'react'

// Theme
import { SaladTheme } from '../../../SaladTheme'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({
  listUnstyled: {
    paddingLeft: 0,
    listStyle: 'none',
  },
})

interface Props extends WithStyles<typeof styles> {
  list?: string[],
  componentList?: ReactNode[]
}

class _ListUnstyled extends Component<Props> {
  render() {
    const { list, componentList, classes } = this.props

    return (
      <ul className={classnames(classes.listUnstyled)}>
        {list &&
          list.map((item, index) => {
            return <li key={index}>{item}</li>
          })}

        {componentList && componentList.map((item, index) => {
          return <li key={index}>{item}</li>
        })}
      </ul>
    )
  }
}

export const ListUnstyled = withStyles(styles)(_ListUnstyled)
