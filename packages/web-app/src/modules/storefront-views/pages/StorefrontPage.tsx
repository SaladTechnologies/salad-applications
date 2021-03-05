import withStyles, { WithStyles } from 'react-jss'
import { Head, Scrollbar } from '../../../components'
import {
  StorefrontBlockComponent,
  StorefrontContentBlockProps,
  StorefrontHeroBlockProps,
  StorefrontPageProps,
  StorefrontRewardBlockProps,
} from '../../storefront/models'
import { StorefrontContentBlock, StorefrontHeroBlock, StorefrontRewardBlock } from '../blocks'
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
  isLoading: boolean
}

const _StorefrontPage = ({ data, isLoading, classes }: Props) => {
  return (
    <Scrollbar>
      <Head title="Official Store" />
      <div className={classes.content}>
        {!isLoading && data?.blocks.length > 0 ? (
          data?.blocks?.map((block, index) =>
            block.__component === StorefrontBlockComponent.Hero ? (
              <StorefrontHeroBlock key={index} block={block as StorefrontHeroBlockProps} />
            ) : block.__component === StorefrontBlockComponent.Reward ? (
              <StorefrontRewardBlock key={index} block={block as StorefrontRewardBlockProps} />
            ) : block.__component === StorefrontBlockComponent.Content ? (
              <StorefrontContentBlock key={index} block={block as StorefrontContentBlockProps} />
            ) : null,
          )
        ) : (
          <StorefrontSkeleton />
        )}
      </div>
    </Scrollbar>
  )
}

export const StorefrontPage = withStyles(styles)(_StorefrontPage)
