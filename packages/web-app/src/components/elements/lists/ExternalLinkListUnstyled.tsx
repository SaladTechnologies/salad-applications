import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { SmartLink } from '../..'
import type { LinkTrackingInfo } from '../../../modules/analytics/models'
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
    trackingInfo?: LinkTrackingInfo
  }[]
}

class _ExternalLinkListUnstyled extends Component<Props> {
  store = getStore()

  public override render(): ReactNode {
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
              <SmartLink to={item.url} trackingInfo={item.trackingInfo}>
                {item.text}
              </SmartLink>
            </li>
          )
        })}
      </ul>
    )
  }
}

export const ExternalLinkListUnstyled = withStyles(styles)(_ExternalLinkListUnstyled)
