import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { RewardHeroButtonGroup } from './RewardHeroButtonGroup'

const styles = (theme: SaladTheme) => ({
  container: { color: theme.lightGreen },
  titleText: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 18,
    padding: '6px 12px',
  },
})

const responsive = {
  all: {
    breakpoint: { max: 400000, min: 1 },
    items: 1,
  },
}

interface Props extends WithStyles<typeof styles> {
  title?: string
}

class _RewardHero extends Component<Props> {
  render() {
    const { title, classes, children } = this.props
    return (
      <div className={classnames(classes.container)}>
        <div className={classes.titleText}>{title}</div>
        <div>
          <Carousel
            autoPlay
            autoPlaySpeed={5000}
            customButtonGroup={<RewardHeroButtonGroup />}
            renderButtonGroupOutside
            responsive={responsive}
            arrows={false}
            infinite
            showDots={false}
          >
            {children}
          </Carousel>
        </div>
      </div>
    )
  }
}

export const RewardHero = withStyles(styles)(_RewardHero)
