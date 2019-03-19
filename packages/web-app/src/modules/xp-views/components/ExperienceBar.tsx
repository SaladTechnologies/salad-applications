import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { VerticalProgress } from '../../../components'
import { Level } from '../../xp/models/Level'

const styles = (theme: SaladTheme) => ({
  container: {
    flex: 1, //Makes the bar grow to fit it's parent
    padding: '.5rem',
    display: 'flex',
    width: '8rem',
    marginRight: '-5rem',
    zIndex: 1000,
    userSelect: 'none',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  levelContainer: {
    position: 'relative',
  },
  bar: {
    width: '.4rem',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
  },
  levelLabel: {
    float: 'left',
    marginLeft: '.4rem',
    marginTop: '-.5rem',
    display: 'flex',
    flexDirection: 'row',
  },
  levelText: {
    padding: '.2rem 0',
    textTransform: 'uppercase',
    fontFamily: 'sharpGroteskLight25',
    letterSpacing: '1px',
  },
  levelTitle: {
    fontSize: theme.xSmall,
  },
  levelSubtitle: {
    color: theme.offWhite,
    fontSize: theme.xxSmall,
    paddingTop: '.1rem',
  },
  levelArrow: {
    margin: ' 0rem .25rem',
    padding: 0,
    marginLeft: '.25rem',
  },
  currentProgress: {
    fontFamily: 'SharpGroteskLight05',
    fontSize: '5rem',
    left: '1rem',
    top: '1rem',
    position: 'absolute',
  },
})

interface Props extends WithStyles<typeof styles> {
  levels?: Level[]
  currentXp?: number
}

class _ExperienceBar extends Component<Props> {
  render() {
    const { currentXp, levels, classes } = this.props

    if (currentXp === undefined || levels == undefined) return <div />

    let currentLevels: Level[] = levels.filter(x => currentXp >= x.minXp)
    currentLevels = currentLevels.slice(0, Math.min(3, currentLevels.length))

    return (
      <div className={classnames(classes.container)}>
        <div className={classes.innerContainer}>
          {currentLevels &&
            currentLevels.map((level, i) => {
              let progress = 0
              let heightFlex = i === 0 ? 3 : 1
              if (currentXp) {
                if (currentXp < level.minXp) {
                  progress = 0
                } else if (currentXp >= level.maxXp) {
                  progress = 100
                } else {
                  let totalRange = level.maxXp - level.minXp
                  let delta = currentXp - level.minXp
                  progress = (delta / totalRange) * 100
                }
              }
              console.log(progress)
              return (
                <div
                  key={level.key}
                  className={classes.levelContainer}
                  style={{ color: level.color, flexGrow: heightFlex }}
                >
                  {i === 0 && <div className={classes.currentProgress}>{`${progress.toFixed(0)}%`}</div>}
                  <div className={classnames(classes.levelLabel)}>
                    <FontAwesomeIcon className={classnames(classes.levelArrow)} icon={faCaretLeft} />
                    <div className={classnames(classes.levelText)}>
                      {i !== 0 && <div className={classes.levelTitle}>{level.title}</div>}
                      <div className={classes.levelSubtitle}>{`${level.maxXp} xp`}</div>
                    </div>
                  </div>
                  <VerticalProgress
                    style={{ border: `1px solid ${level.color}` }}
                    className={classes.bar}
                    progress={progress}
                    barColor={level.color}
                  />
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}

export const ExperienceBar = withStyles(styles)(_ExperienceBar)
