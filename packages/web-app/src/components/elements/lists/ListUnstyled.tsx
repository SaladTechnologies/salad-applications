import React, { Component } from 'react'

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
  list: string[]
}

class _ListUnstyled extends Component<Props> {
  render() {
    const { list, classes } = this.props

    return (
      <ul className={classnames(classes.listUnstyled)}>
        {list.map((item, index) => {
          return <li key={index}>{item}</li>
        })}
      </ul>
    )
  }
}

export const ListUnstyled = withStyles(styles)(_ListUnstyled)
