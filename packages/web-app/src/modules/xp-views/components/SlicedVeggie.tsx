import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Level } from '../../xp/models/Level'
import classnames from 'classnames'

const gridSize = 1

const styles = (theme: SaladTheme) => ({
  container: {},
  slice: {
    display: 'inline-block',
    width: `.875rem`,
    position: 'relative',
  },
  sliceImage: {
    position: 'absolute',
    // border: '1px green solid',
  },
})

interface Props extends WithStyles<typeof styles> {
  level?: Level
  percent?: number
}

const getImage = (key: string, slice: number) => require(`../assets/${key}/${slice}.svg`)

class _SlicedVeggie extends Component<Props> {
  getColumnPositions = (percent: number): number[] =>
    new Array(16).fill(0).map((v, i) => {
      return Math.round(50 * (1 - percent) * Math.sin(i))
    })

  render() {
    const { percent, level, classes } = this.props

    if (!level || percent === undefined) return <div />

    const positions = this.getColumnPositions(percent)

    return (
      <div className={classnames(classes.container)}>
        {positions.map((pos, i) => {
          return (
            <div className={classnames(classes.slice)} key={i}>
              <img
                className={classes.sliceImage}
                style={{ top: `${pos * gridSize}rem` }}
                src={getImage(level.key, i + 1)}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

export const SlicedVeggie = withStyles(styles)(_SlicedVeggie)
