import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { SaladTheme } from '../../../SaladTheme'
import { RewardHeroButtonGroup } from './RewardHeroButtonGroup'

const styles = (theme: SaladTheme) => ({
  container: { color: theme.lightGreen },
  titleText: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 20,
    padding: '12px 18px',
    textTransform: 'capitalize',
  },
})

const responsive = {
  all: {
    breakpoint: { max: Number.MAX_SAFE_INTEGER, min: 1 },
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
            draggable={false}
            keyBoardControl={false}
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
