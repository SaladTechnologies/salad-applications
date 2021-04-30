import withStyles, { WithStyles } from 'react-jss'
import { Head, Scrollbar } from '../../../components'
import { NotificationBannerContainer } from '../../home-views/NotificationBannerContainer'
import {
  StorefrontBlockComponent,
  StorefrontCommunityChallengeProps,
  StorefrontContentBlockProps,
  StorefrontHeroBlockProps,
  StorefrontPageProps,
  StorefrontRewardBlockProps
} from '../../storefront/models'
import { StorefrontCommunityChallengeBlock, StorefrontContentBlock, StorefrontHeroBlock, StorefrontRewardBlock } from '../blocks'
import { StorefrontSkeleton } from '../components'

const styles = {
  content: {
    paddingTop: 5,
    display: 'flex',
    flexDirection: 'column',
  },
}

interface Props extends WithStyles<typeof styles> {
  data: StorefrontPageProps
}

const _StorefrontPage = ({ data, classes }: Props) => {
  return (
    <Scrollbar>
      <Head title="Official Store" />
      <div className={classes.content}>
        <NotificationBannerContainer />
        {data?.blocks.length > 0 ? (
          data?.blocks?.map((block, index) =>
          {
            switch(block.__component){
              case StorefrontBlockComponent.Hero:
                return <StorefrontHeroBlock key={index} block={block as StorefrontHeroBlockProps} />
              case StorefrontBlockComponent.Reward:
                return <StorefrontRewardBlock key={index} block={block as StorefrontRewardBlockProps} />
              case StorefrontBlockComponent.Content:
                return <StorefrontContentBlock key={index} block={block as StorefrontContentBlockProps} />
              case StorefrontBlockComponent.CommunityChallenge:
                return <StorefrontCommunityChallengeBlock key={index} block={block as StorefrontCommunityChallengeProps} />
            }
            return null
          })
        ) : (
          <StorefrontSkeleton />
        )}
      </div>
    </Scrollbar>
  )
}

export const StorefrontPage = withStyles(styles)(_StorefrontPage)
