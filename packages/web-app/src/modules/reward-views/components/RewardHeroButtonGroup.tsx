import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { IconTriangleRight, IconTriangleLeft } from './assets'
import { ButtonGroupProps } from 'react-multi-carousel/lib/types'

const styles = ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
  },
  button: {
    outline: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0 30px',
    display: 'flex',
    '&:hover': {
      opacity: 0.7,
    },
  },
})

interface Props extends ButtonGroupProps, WithStyles<typeof styles> {}

class _RewardHeroButtonGroup extends Component<Props> {
  render() {
    const { next, previous, classes } = this.props

    return (
      <div className={classes.container}>
        <button className={classes.button} onClick={previous}>
          <IconTriangleLeft />
        </button>
        <button className={classes.button} onClick={next}>
          <IconTriangleRight />
        </button>
      </div>
    )
  }
}

export const RewardHeroButtonGroup = withStyles(styles)(_RewardHeroButtonGroup)
