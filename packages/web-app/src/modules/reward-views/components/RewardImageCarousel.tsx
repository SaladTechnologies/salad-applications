import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { Reward } from '../../reward/models'
import Carousel from 'react-multi-carousel'
import Img from 'react-image'
import { Divider } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    paddingTop: 18,
  },
  imageContainer: {
    padding: '0px 10px',
  },
  singleImage: {
    paddingTop: 18,
    height: 'auto',
    width: '25%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  image: {
    height: 'auto',
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.10)',
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
}

const responsive = {
  all: {
    breakpoint: { max: 4000000, min: 1 },
    items: 1,
  },
}

class _RewardImageCarousel extends Component<Props> {
  render() {
    const { reward, classes } = this.props

    if (!reward) {
      return null
    }

    if (!reward.images || reward.images.length === 0) {
      if (reward.heroImage) {
        return <Img className={classes.singleImage} src={reward.heroImage} alt="" />
      } else if (reward.coverImage) {
        return <Img className={classes.singleImage} src={reward.coverImage} alt="" />
      } else if (reward.image) {
        return <Img className={classes.singleImage} src={reward.image} alt="" />
      } else {
        return null
      }
    }

    return (
      <div className={classnames(classes.container)}>
        <Carousel keyBoardControl={false} responsive={responsive} autoPlay arrows centerMode infinite>
          {reward?.images?.map(x => (
            <div className={classes.imageContainer}>
              <Img className={classes.image} src={x} alt="" />
            </div>
          ))}
        </Carousel>
        <Divider />
      </div>
    )
  }
}

export const RewardImageCarousel = withStyles(styles)(_RewardImageCarousel)
