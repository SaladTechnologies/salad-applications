import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SmartLink } from '../..'
import { getStore } from '../../../Store'

const styles = {
  linkListUnstyled: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  linkListItem: {},
}

interface Props extends WithStyles<typeof styles> {
  list: {
    url: string
    text: string
  }[]
}

class _ExternalLinkListUnstyled extends Component<Props> {
  store = getStore()

  render() {
    const { list, classes } = this.props

    return (
      <ul className={classnames('linkListUnstyled', classes.linkListUnstyled)}>
        {list.map((item, index) => {
          return (
            <li
              key={index}
              className={classnames('linkListItem', classes.linkListItem)}
              style={{ marginBottom: '2px' }}
            >
              <SmartLink to={item.url}>{item.text}</SmartLink>
            </li>
          )
        })}
      </ul>
    )
  }
}

export const ExternalLinkListUnstyled = withStyles(styles)(_ExternalLinkListUnstyled)
