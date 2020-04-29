import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { HeroPanel } from '../../../components/HeroPanel'
import { HeroTitle, SmartLink } from '../../../components'
import classnames from 'classnames'

const styles = () => ({
  column: {
    flex: 1,
  },
  startColumn: {
    display: 'flex',
    justifyContent: 'center',
  },
})

interface Props extends WithStyles<typeof styles> {}

class _OfferwallHero extends Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <HeroPanel color="cyan">
        <div className={classes.column}>
          <HeroTitle>Offerwalls</HeroTitle>
          Earn Salad Balance by completing tasks such as downloading and playing mobile games. Whether you just want to
          top off your balance, boost your regular earnings, or can’t mine with Salad, offerwalls allow you to make more
          money.
          <br />
          <br />
          <SmartLink to="/earn/offerwall">Take Me There</SmartLink>
        </div>
        <div className={classnames(classes.column, classes.startColumn)}></div>
      </HeroPanel>
    )
  }
}

export const OfferwallHero = withStyles(styles)(_OfferwallHero)
