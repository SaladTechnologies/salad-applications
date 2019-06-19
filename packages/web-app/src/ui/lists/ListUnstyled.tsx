import React, { Component } from 'react'

// Styles
import { styles } from './ListUnstyled.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  value?: string,
  list: string[]
}

class _ListUnstyled extends Component<Props> {
  render() {
    const { list, classes } = this.props

    return (
      <ul className={classnames(classes.listUnstyled)}>
        {list.map((item, index) => {
          <li key={index}>
            {item}
          </li>
        })}
      </ul>
    )
  }
}

export const ListUnstyled = withStyles(styles)(_ListUnstyled)
