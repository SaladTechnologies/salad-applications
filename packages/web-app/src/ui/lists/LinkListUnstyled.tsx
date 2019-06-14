import React, { Component } from 'react'

// Store
import { getStore } from '../../Store'

// Styles
import { styles } from './ListUnstyled.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  value?: string,
  list: {
    url: string,
    text: string
  }[],
  onListItemClick?: () => void
}

class CondensedHeader extends Component<Props> {
  store = getStore()

  handleListItemClick = (url: string) => {
    const { onListItemClick } = this.props

    if (onListItemClick) this.store.routing.push(url)
  }

  render() {
    const { list, classes } = this.props

    return (
      <ul className={classnames(classes.listUnstyled)}>
        {list.map((item, index) => {
          <li key={index}>
            <span onClick={() => this.handleListItemClick(item.url)}>
              {item.text}
            </span>
          </li>
        })}
      </ul>
    )
  }
}

export default withStyles(styles)(CondensedHeader)
