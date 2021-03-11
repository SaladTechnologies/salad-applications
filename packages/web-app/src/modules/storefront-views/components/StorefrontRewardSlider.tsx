import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { IconArrowRight } from '../../reward-views/components/assets'
import { RewardSliderButton } from '../../reward-views/components/RewardSliderButton'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.lightGreen,
    paddingBottom: 64,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'baseline',
    fontFamily: theme.fontGroteskBook19,
    fontSize: 20,
    padding: '12px 6px',
    textTransform: 'capitalize',
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
  viewAllTitle?: string
}

interface State {
  isHovering: boolean
  isHoveringRewards: boolean
}

class _StorefrontRewardSlider extends Component<Props, State> {
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
    const { title, viewAllRoute, viewAllTitle, classes, children } = this.props
    const { isHoveringRewards } = this.state
    return (
      <div className={classes.container} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        {(viewAllRoute || viewAllTitle || title) && (
          <div className={classes.titleContainer}>
            {title && <div>{title}</div>}
            {viewAllRoute && viewAllTitle && (
              <SmartLink to={viewAllRoute}>
                <div className={classes.viewMoreText}>
                  {viewAllTitle}
                  <div className={classes.arrow}>
                    <IconArrowRight />
                  </div>
                </div>
              </SmartLink>
            )}
          </div>
        )}
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

export const StorefrontRewardSlider = withStyles(styles)(_StorefrontRewardSlider)
