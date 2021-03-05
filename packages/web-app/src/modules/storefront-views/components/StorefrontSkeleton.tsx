import { Fragment } from 'react'
import { StorefrontRewardItem } from '../components/StorefrontRewardItem'
import { StorefrontRewardSlider } from '../components/StorefrontRewardSlider'

export const StorefrontSkeleton = () => {
  const skeltonArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  return (
    <>
      {skeltonArray.map((item) => (
        <Fragment key={item}>
          <StorefrontRewardSlider key={item} title={'Games'}>
            {skeltonArray.map((rewardSkeleton) => {
              return (
                <StorefrontRewardItem
                  key={rewardSkeleton}
                  image={''}
                  lowQuantity={false}
                  outOfStock={false}
                  link={''}
                  quantity={-1}
                />
              )
            })}
          </StorefrontRewardSlider>
        </Fragment>
      ))}
    </>
  )
}
