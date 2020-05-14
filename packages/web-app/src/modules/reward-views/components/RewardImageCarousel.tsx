import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Reward } from '../../reward/models'
import Carousel from 'react-multi-carousel'
import Img from 'react-image'
import { Divider } from '../../../components'

const styles = {
  container: {
    paddingTop: 18,
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
  if (reward.images && reward.images.length === 1) {
    return <Img className={classes.image} src={reward.images[0]} alt="" />
  }

  //Collection of images
  return (
    <Carousel keyBoardControl={false} responsive={responsive} arrows showDots>
      {reward?.images?.map((x) => (
        <Img key={x} className={classes.image} src={x} alt="" />
      ))}
    </Carousel>
  )
}

class _RewardImageCarousel extends Component<Props> {
  render() {
    const { reward, classes } = this.props

    if (!reward) {
      return null
    }

    return (
      <div className={classnames(classes.container)}>
        {renderImageComponent(this.props)}
        <Divider />
      </div>
    )
  }
}

export const RewardImageCarousel = withStyles(styles)(_RewardImageCarousel)
