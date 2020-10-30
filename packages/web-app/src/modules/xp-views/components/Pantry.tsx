import classnames from 'classnames'
import React, { Component } from 'react'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Level } from '../../xp/models/Level'

const styles = (theme: SaladTheme) => ({
  content: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  veggie: {
    padding: 10,
    height: 75,
    width: 75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxHeight: '100%',
    width: 'auto',
  },
  unknownText: {
    color: theme.green,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {
  levels?: Level[]
  currentXp?: number
}

const getImage = (key: string) => require(`../assets/${key}/complete.png`)

class _Pantry extends Component<Props> {
  getColumnPositions = (percent: number): number[] =>
    new Array(16).fill(0).map((_v, i) => {
      return Math.round(50 * (1 - percent) * Math.sin(i))
    })

  render() {
    const { currentXp, levels, classes } = this.props

    return (
      <div className={classnames(classes.content)}>
        {levels &&
          levels.map((x) => {
            const levelComplete = (currentXp || 0) >= x.maxXp
            return (
              <div className={classnames(classes.veggie)} key={x.key}>
                {levelComplete && (
                  <Img
                    data-rh={`${x.key.replace('-', ' ')}\n(${x.maxXp} XP)`}
                    className={classes.image}
                    src={getImage(x.key)}
                    draggable={false}
                    alt=""
                  />
                )}
                {!levelComplete && (
                  <div
                    data-rh={'Keep chopping to discover this veggie'}
                    className={classnames(classes.image, classes.unknownText)}
                  >
                    ?
                  </div>
                )}
              </div>
            )
          })}
      </div>
    )
  }
}

export const Pantry = withStyles(styles)(_Pantry)
