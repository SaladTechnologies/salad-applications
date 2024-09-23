import classnames from 'classnames'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import Skeleton from 'react-loading-skeleton'
import { Remark } from 'react-remark'
import { HeroTitle, SmartLink } from '../../../components'
import { HeroPanel } from '../../../components/HeroPanel'
import { RewardMissingImage } from '../../reward-views/components/RewardMissingImage'

const styles = {
  container: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 30,
  },
  containerRowReverse: {
    flexDirection: 'row-reverse',
  },
  containerImageTop: {
    flexDirection: 'column-reverse',
  },
  containerImageBottom: {
    flexDirection: 'column',
  },
  column: {
    flex: 1,
  },
  columnSideBySide: {
    margin: 10,
  },
  image: {
    maxHeight: '100%',
    minWidth: '100%',
    objectFit: 'cover',
    verticalAlign: 'bottom',
  },
  imageColumnBottom: {
    marginTop: 50,
  },
  imageColumnTop: {
    marginBottom: 50,
  },
  hideImage: {
    display: 'none',
  },
}

interface Props extends WithStyles<typeof styles> {
  body: string
  color: 'red' | 'purple' | 'green' | 'cyan'
  image?: string
  imagePosition?: string
  title: string
}

const _StorefrontContentPanel = ({ body, color, image, imagePosition, title, classes }: Props) => {
  return (
    <HeroPanel
      color={color}
      className={classnames(classes.container, {
        [classes.containerRowReverse]: imagePosition === 'left',
        [classes.containerImageTop]: imagePosition === 'top',
        [classes.containerImageBottom]: imagePosition === 'bottom',
      })}
    >
      <div
        className={classnames(classes.column, {
          [classes.columnSideBySide]: imagePosition === 'left' || imagePosition === 'right',
        })}
      >
        <HeroTitle>{title}</HeroTitle>
        <Remark
          rehypeReactOptions={{
            components: {
              a: (props: any) => {
                return <SmartLink to={props.href}>{props.children[0]}</SmartLink>
              },
            },
          }}
        >
          {body}
        </Remark>
      </div>
      <div
        className={classnames(classes.column, {
          [classes.columnSideBySide]: imagePosition === 'left' || imagePosition === 'right',
          [classes.imageColumnBottom]: imagePosition === 'bottom',
          [classes.imageColumnTop]: imagePosition === 'top',
        })}
      >
        <div className={!image ? classes.hideImage : ''}>
          {image ? (
            <Img
              className={classes.image}
              src={image}
              draggable={false}
              alt={''}
              loader={<Skeleton height={'100%'} />}
              unloader={<RewardMissingImage text={''} />}
            />
          ) : (
            <Skeleton height={'100%'} />
          )}
        </div>
      </div>
    </HeroPanel>
  )
}

export const StorefrontContentPanel = withStyles(styles)(_StorefrontContentPanel)
