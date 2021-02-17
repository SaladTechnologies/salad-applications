import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  scrollThumb: {
    backgroundColor: theme.darkBlue,
    border: `solid 1px ${theme.lightGreen}`,
    borderRadius: 3,
    color: 'red',
    width: `6px !important`,
  },
  container: {
    border: `solid 1px ${theme.lightGreen}`,
  },
  content: {
    padding: '5px 10px',
  },
})

interface Props extends WithStyles<typeof styles> {
  minHeight?: number
  maxHeight?: number
  maxWidth?: number
}

class _ScrollableContent extends Component<Props> {
  render() {
    const { classes, children, minHeight, maxHeight, maxWidth } = this.props
    const renderThumb = (props: any) => <div {...props} className={classes.scrollThumb} />

    return (
      <Scrollbars
        renderThumbVertical={renderThumb}
        className={classes.container}
        autoHeight
        autoHeightMin={minHeight ?? 200}
        autoHeightMax={maxHeight ?? 350}
        style={maxWidth ? { maxWidth: maxWidth } : undefined}
      >
        <div className={classes.content}>{children}</div>
      </Scrollbars>
    )
  }
}

export const ScrollableContent = withStyles(styles)(_ScrollableContent)
