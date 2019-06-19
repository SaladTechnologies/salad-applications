import React, { Component } from 'react'

// Store
import { getStore } from '../../Store'

// Styles
import { styles } from './LinkListUnstyled.styles'

// UI
import { MenuTitle } from '../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  list: {
    url: string,
    text: string
  }[],
  onListItemClick: (url: string) => any,
}

class _LinkListUnstyled extends Component<Props> {
  store = getStore()

  render() {
    const { 
      list, 
      onListItemClick, 
      classes,
    } = this.props

    return (
      <ul className={classnames('linkListUnstyled', classes.linkListUnstyled)}>
        {list.map((item, index) => {
          return (
            <li 
              key={index} 
              className={classnames('linkListItem', classes.linkListItem)} 
              onClick={() => onListItemClick(item.url)}
            >
              <MenuTitle path={item.url}>
                {item.text}
              </MenuTitle>
            </li>
          )
        })}
      </ul>
    )
  }
}

export const LinkListUnstyled = withStyles(styles)(_LinkListUnstyled)
