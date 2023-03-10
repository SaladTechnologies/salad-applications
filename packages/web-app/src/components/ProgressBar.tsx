import classnames from 'classnames'
import type { CSSProperties } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'

const styles = {
  container: {
    position: 'relative',
    backgroundColor: 'lightGrey',
    height: '1rem',
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: (props: Props) => (props.progress ? `${props.progress}%` : '0'),
    backgroundColor: (props: Props) => (props.barColor ? props.barColor : 'grey'),
  },
}

interface Props extends WithStyles<typeof styles> {
  barColor?: string
  progress?: number
  barClassName?: string
  className?: string
  style?: CSSProperties
}

const _ProgressBar = ({ style, className, barClassName, classes }: Props) => (
  <div style={style} className={classnames(classes.container, className)}>
    <div className={classnames(barClassName, classes.bar)} />
  </div>
)

export const ProgressBar = withStyles(styles)(_ProgressBar)
