import { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { IconArrowRight } from './assets'
import { RewardSliderButton } from './RewardSliderButton'

const styles = (theme: SaladTheme) => ({
  container: { color: theme.lightGreen, paddingBottom: 64 },
  titleContainer: {
    display: 'flex',
    alignItems: 'baseline',
    fontFamily: theme.fontGroteskBook19,
    fontSize: 20,
    padding: '12px 6px',
    textTransform: 'capitalize',
    cursor: 'pointer',
  },
  titleText: {
    '&:hover': {
      opacity: 0.8,
    },
  },
  viewMoreText: {
    paddingLeft: 10,
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      opacity: 0.8,
    },
  },
  arrow: {
    paddingLeft: 5,
    width: 10,
  },
})

export const rewardItemResponsive = {
  desktop: {
    breakpoint: { max: Number.MAX_SAFE_INTEGER, min: 1300 },
    items: 7,
    slidesToSlide: 7,
    partialVisibilityGutter: 20,
  },
  tablet: {
    breakpoint: { max: 1300, min: 900 },
    items: 5,
    slidesToSlide: 5,
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
  viewAllRoute?: string
  children?: ReactNode
}

interface State {
  isHovering: boolean
  isHoveringRewards: boolean
}

class _RewardSlider extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isHovering: false,
      isHoveringRewards: false,
    }
  }

  handleMouseEnterRewards = () => {
    this.setState({
      isHoveringRewards: true,
    })
  }

  handleMouseLeaveRewards = () => {
    this.setState({
      isHoveringRewards: false,
    })
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
    const { title, viewAllRoute, classes, children } = this.props
    const { isHoveringRewards } = this.state
    return (
      <div className={classes.container} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <SmartLink to={viewAllRoute}>
          <div className={classes.titleContainer}>
            <div className={classes.titleText}>{title}</div>
            <div className={classes.viewMoreText}>
              Explore All
              <div className={classes.arrow}>
                <IconArrowRight />
              </div>
            </div>
          </div>
        </SmartLink>
        <div onMouseEnter={this.handleMouseEnterRewards} onMouseLeave={this.handleMouseLeaveRewards}>
          <Carousel
            arrows={isHoveringRewards}
            customLeftArrow={<RewardSliderButton direction="left" />}
            customRightArrow={<RewardSliderButton direction="right" />}
            infinite
            keyBoardControl={false}
            partialVisible
            responsive={rewardItemResponsive}
          >
            {children}
          </Carousel>
        </div>
      </div>
    )
  }
}

export const RewardSlider = withStyles(styles)(_RewardSlider)
