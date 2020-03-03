import React, { Component } from 'react'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = ({
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
