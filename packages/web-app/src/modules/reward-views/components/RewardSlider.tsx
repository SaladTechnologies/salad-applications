import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { RewardSliderButton } from './RewardSliderButton'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const styles = (theme: SaladTheme) => ({
  container: { color: theme.lightGreen, paddingBottom: 64 },
  titleText: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 20,
    padding: '12px 18px',
    textTransform: 'capitalize',
  },
})

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 7,
    slidesToSlide: 7,
    partialVisibilityGutter: 20,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1300 },
    items: 5,
    slidesToSlide: 5,
    partialVisibilityGutter: 20,
  },
  tablet: {
    breakpoint: { max: 1300, min: 900 },
    items: 4,
    slidesToSlide: 4,
    partialVisibilityGutter: 20,
  },
  tabletSmall: {
    breakpoint: { max: 900, min: 500 },
    items: 3,
    slidesToSlide: 3,
    partialVisibilityGutter: 20,
  },
  mobile: {
    breakpoint: { max: 500, min: 0 },
    items: 2,
    slidesToSlide: 2,
    partialVisibilityGutter: 20,
  },
}

interface Props extends WithStyles<typeof styles> {
  title?: string
}

interface State {
  isHovering: boolean
}

class _RewardSlider extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isHovering: false,
    }
  }

  handleMouseEnter = () => {
    this.setState({
      isHovering: true,
    })
  }

  handleMouseLeave = () => {
    this.setState({
      isHovering: false,
    })
  }

  render() {
    const { title, classes, children } = this.props
    const { isHovering } = this.state
    return (
      <div className={classnames(classes.container)}>
        <div className={classes.titleText}>{title}</div>
        <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
          <Carousel
            keyBoardControl={false}
            responsive={responsive}
            customRightArrow={isHovering ? <RewardSliderButton direction="right" /> : <div />}
            customLeftArrow={isHovering ? <RewardSliderButton direction="left" /> : <div />}
            arrows
            partialVisible
            infinite
          >
            {children}
          </Carousel>
        </div>
      </div>
    )
  }
}

export const RewardSlider = withStyles(styles)(_RewardSlider)
