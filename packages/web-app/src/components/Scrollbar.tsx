import type { ReactNode } from 'react'
import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'

const styles = {
  scrollThumb: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    cursor: 'pointer',
    borderRadius: 3,
    zIndex: 3001,
    position: 'fixed !important',
    right: 5,
    width: `6px !important`,
  },
}

interface Props extends WithStyles<typeof styles> {
  children?: ReactNode
}

class _Scrollbar extends Component<Props> {
  public override render(): ReactNode {
    const { classes, children } = this.props
    const renderThumb = (props: any) => <div {...props} className={classes.scrollThumb} />

    return <Scrollbars renderThumbVertical={renderThumb}>{children}</Scrollbars>
  }
}

export const Scrollbar = withStyles(styles)(_Scrollbar)
