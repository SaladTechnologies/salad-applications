import React from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.lightGreen,
    color: theme.blueFont,
    width: (props: Props) => (props.width ? props.width : '20rem'),
    padding: '1rem',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 9999,
    pointerEvents: 'none',
  },
  title: {
    fontFamily: 'sharpGroteskLight09',
    fontSize: theme.xLarge,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  text: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
})

interface Props extends WithStyles<typeof styles> {
  title?: string
  text?: string
  width?: string
}

const _ToolTip = ({ text, title, classes }: Props) => (
  <div className={classes.container}>
    {title && <div className={classes.title}>{title}</div>}
    <div className={classes.text}>{text}</div>
  </div>
)

export const ToolTip = withStyles(styles)(_ToolTip)
