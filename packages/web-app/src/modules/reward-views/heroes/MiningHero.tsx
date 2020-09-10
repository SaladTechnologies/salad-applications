import classnames from 'classnames'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { HeroTitle, SmartLink } from '../../../components'
import { HeroPanel } from '../../../components/HeroPanel'
import { StartButtonContainer } from '../../machine-views'

const styles = {
  column: {
    flex: 1,
  },
  startColumn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

interface Props extends WithStyles<typeof styles> {}

class _MiningHero extends Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <HeroPanel color="purple">
        <div className={classes.column}>
          <HeroTitle>Time to Chop</HeroTitle>
          Looks like your machine has the Chops to Chop. Simply press the Start button or head over to the{' '}
          <SmartLink to="/earn/mine">Mining page</SmartLink> to learn more and earn some sweet Salad balance!
          <br />
          <br />
          <SmartLink to="/earn/mine">Learn More</SmartLink>
        </div>
        <div className={classnames(classes.column, classes.startColumn)}>
          <StartButtonContainer />
        </div>
      </HeroPanel>
    )
  }
}

export const MiningHero = withStyles(styles)(_MiningHero)
