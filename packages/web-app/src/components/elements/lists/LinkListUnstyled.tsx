import React, { Component } from 'react'

// Store
import { getStore } from '../../../Store'

// UI
import { MenuTitle } from '../../'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = ({
  linkListUnstyled: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  linkListItem: {},
})

interface Props extends WithStyles<typeof styles> {
  list: {
    url: string,
    text: string,
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
