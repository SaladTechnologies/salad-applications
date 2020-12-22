import classnames from 'classnames'
import { Component } from 'react'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import Carousel from 'react-multi-carousel'
import { Divider } from '../../../components'
import { Reward } from '../../reward/models'
import { RewardImageDot } from './RewardImageDot'

const styles = {
  container: {
    paddingTop: 18,
  },
  carouselContainer: {
    position: 'relative',
    paddingBottom: 30,
  },
  image: {
    display: 'block',
    height: '100%',
    margin: 'auto',
    width: 'auto',
    maxHeight: '50vh',
    border: '1px solid rgba(255, 255, 255, 0.10)',
  },
}

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
}

const responsive = {
  all: {
    breakpoint: { max: 4000000, min: 1 },
    items: 1,
  },
}

const renderImageComponent = (props: Props) => {
  const { reward, classes } = props

  if (!reward) {
    return null
  }

  //Other images as a default
  if (!reward.images || reward.images.length === 0) {
    if (reward.heroImage) {
      return <Img className={classes.image} src={reward.heroImage} alt="" />
    } else if (reward.coverImage) {
      return <Img className={classes.image} src={reward.coverImage} alt="" />
    } else if (reward.image) {
      return <Img className={classes.image} src={reward.image} alt="" />
    } else {
      return null
    }
  }

  //Single reward image
  if (reward.images && reward.images.length === 1 && reward.images[0]) {
    return <Img className={classes.image} src={reward.images[0]} alt="" />
  }

  //Collection of images
  return (
    <div className={classes.carouselContainer}>
      <Carousel
        keyBoardControl={false}
        responsive={responsive}
        arrows
        showDots
        customDot={<RewardImageDot />}
        renderDotsOutside
      >
        {reward?.images?.map((x) => (x ? <Img key={x} className={classes.image} src={x} alt="" /> : null))}
      </Carousel>
    </div>
  )
}

class _RewardImageCarousel extends Component<Props> {
  render() {
    const { reward, classes } = this.props

    const image = renderImageComponent(this.props)

    if (!reward || !image) {
      return null
    }

    return (
      <div className={classnames(classes.container)}>
        {image}
        {image && <Divider />}
      </div>
    )
  }
}

export const RewardImageCarousel = withStyles(styles)(_RewardImageCarousel)
