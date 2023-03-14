import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { Level } from '../../xp/models/Level'

const styles = {
  container: {
    position: 'absolute',
    right: 0,
    top: '50%',
    whiteSpace: 'nowrap',
    height: 0,
  },
  slice: {
    display: 'inline-block',
    width: `.875rem`,
    position: 'relative',
  },
  sliceImage: {
    position: 'absolute',
  },
}

interface Props extends WithStyles<typeof styles> {
  level?: Level
  percent?: number
}

const getImage = (key: string, slice: number) => require(`../assets/${key}/${slice}.svg`).default

class _SlicedVeggie extends Component<Props> {
  getColumnPositions = (percent: number): number[] =>
    new Array(16).fill(0).map((_v, i) => {
      return Math.round(50 * (1 - percent) * Math.sin(i))
    })

  public override render(): ReactNode {
    const { percent, level, classes } = this.props

    if (!level || percent === undefined) return null

    const positions = this.getColumnPositions(percent)

    return (
      <div className={classnames(classes.container)}>
        {positions.map((pos, i) => {
          return (
            <div className={classnames(classes.slice)} key={i}>
              <img
                className={classes.sliceImage}
                style={{ top: `${pos * 16 - 568 / 2.0}px` }}
                src={getImage(level.key, i + 1)}
                draggable={false}
                alt=""
              />
            </div>
          )
        })}
      </div>
    )
  }
}

export const SlicedVeggie = withStyles(styles)(_SlicedVeggie)
