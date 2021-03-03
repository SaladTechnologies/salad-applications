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
        {data.blocks.map((block) =>
          block.__component === StorefrontBlockComponent.Hero ? (
            <StorefrontHeroBlock block={block as StorefrontHeroBlockProps} />
          ) : block.__component === StorefrontBlockComponent.Reward ? (
            <StorefrontRewardBlock block={block as StorefrontRewardBlockProps} />
          ) : block.__component === StorefrontBlockComponent.Content ? (
            <StorefrontContentBlock block={block as StorefrontContentBlockProps} />
          ) : null,
        )}
      </div>
    </Scrollbar>
  )
}

export const StorefrontPage = withStyles(styles)(_StorefrontPage)
