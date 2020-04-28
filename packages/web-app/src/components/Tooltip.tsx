import React from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
    padding: '1rem',
    overflow: 'hidden',
    zIndex: 9999,
    pointerEvents: 'none',
    boxShadow: '8px 14px 22px rgba(0, 0, 0, 0.45)',
    border: `1px solid ${theme.darkBlue}`,
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
    textTransform: 'capitalize',
    whiteSpace: 'pre-wrap',
  },
})

interface Props extends WithStyles<typeof styles> {
  title?: string
  text?: string
  children?: React.ReactNode
}

const _Tooltip: React.StatelessComponent<Props> = ({ text, title, classes, children }) => (
  <div className={classes.container}>
    {title && <div className={classes.title}>{title}</div>}
    <div className={classes.text}>
      {text}
      <div>{children}</div>
    </div>
  </div>
)

export const Tooltip = withStyles(styles)(_Tooltip)
