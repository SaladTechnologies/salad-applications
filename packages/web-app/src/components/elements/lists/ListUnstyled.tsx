import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'

const styles = {
  listUnstyled: {
    paddingLeft: 0,
    listStyle: 'none',
  },
}

interface Props extends WithStyles<typeof styles> {
  list: string[]
}

class _ListUnstyled extends Component<Props> {
  public override render(): ReactNode {
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
