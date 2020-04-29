import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { HeroPanel } from '../../../components/HeroPanel'

const styles = () => ({})

interface Props extends WithStyles<typeof styles> {}

class _EarningHero extends Component<Props> {
  render() {
    return <HeroPanel color="purple"></HeroPanel>
  }
}

export const EarningHero = withStyles(styles)(_EarningHero)
