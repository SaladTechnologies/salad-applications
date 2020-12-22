import classnames from 'classnames'
import { Component, Fragment } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, MenuTitle } from '../../'
import { getStore } from '../../../Store'

const styles = {
  linkListUnstyled: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  linkListItem: {},
  divider: {
    marginTop: '10px !important',
    marginBottom: '10px !important',
  },
  inset: {
    paddingLeft: 15,
  },
}

interface Props extends WithStyles<typeof styles> {
  list: {
    url: string
    text: string
    /**Should a divider be drawn before this item */
    divider?: boolean
    /** Is the item clickable */
    enabled?: boolean
    inset?: boolean
    externalLink?: boolean
  }[]
}

class _LinkListUnstyled extends Component<Props> {
  store = getStore()

  render() {
    const { list, classes } = this.props

    return (
      <ul className={classnames('linkListUnstyled', classes.linkListUnstyled)}>
        {list.map((item) => {
          return (
            <Fragment key={item.url}>
              {item.divider && <Divider className={classes.divider} />}
              <li className={classnames('linkListItem', classes.linkListItem, { [classes.inset]: item.inset })}>
                <MenuTitle path={item.url} enabled={item.enabled} externalLink={item.externalLink}>
                  {item.text}
                </MenuTitle>
              </li>
            </Fragment>
          )
        })}
      </ul>
    )
  }
}

export const LinkListUnstyled = withStyles(styles)(_LinkListUnstyled)
