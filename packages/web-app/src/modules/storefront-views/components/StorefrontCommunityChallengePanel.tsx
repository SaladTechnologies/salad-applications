import classnames from 'classnames'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Remark } from 'react-remark'
import { HeroTitle, ProgressBar, SmartLink } from '../../../components'
import { HeroPanel } from '../../../components/HeroPanel'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
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
  progressBackground: {
    borderRadius: 0,
    backgroundColor: theme.darkGreen,
    height: 10,
  },
  progressBar: {
    backgroundColor: theme.lightGreen,
    boxShadow: `0px 0px 10px 0px ${theme.lightGreen}`,
  },
})

interface Props extends WithStyles<typeof styles> {
  body?: string
  title?: string
  progress?: number
}

export const _StorefrontCommunityChallengePanel = ({ body, title, progress, classes }: Props) => {
  progress = Math.min(1, Math.max(0, progress || 0))

  return (
    <HeroPanel color={'green'} className={classnames(classes.container)}>
      <div className={classnames(classes.column)}>
        <HeroTitle>{title}</HeroTitle>
        {body && (
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
        )}
        <ProgressBar
          className={classes.progressBackground}
          barClassName={classes.progressBar}
          progress={progress * 100}
        />
      </div>
    </HeroPanel>
  )
}

export const StorefrontCommunityChallengePanel = withStyles(styles)(_StorefrontCommunityChallengePanel)
