import type { ReactElement, ReactNode } from 'react'
import { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { SmartLink } from '../../../components'
import type { SaladTheme } from '../../../SaladTheme'
import type { Reward } from '../../reward/models'
import { RewardDetailsContentPanel } from './RewardDetailsContentPanel'

const styles = (theme: SaladTheme) => ({
  titleText: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 20,
    textTransform: 'capitalize',
  },
  bodyText: {
    whiteSpace: 'pre-line',
    fontFamily: theme.fontGroteskBook19,
    fontSize: theme.small,
    lineHeight: theme.medium,
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
  children?: ReactNode
}

class _RewardDescriptionPanel extends Component<Props> {
  transform = (node: any): ReactElement | void | null => {
    //Transform a tags to external links
    if (node.type === 'tag' && node.name === 'a') {
      return (
        <SmartLink key={node.children[0].data} to={node.attribs.href}>
          {node.children[0].data}
        </SmartLink>
      )
    } else {
      //Return the default
      return undefined
    }
  }
  public override render(): ReactNode {
    const { reward, classes } = this.props

    if (!reward || !reward.description) return null

    return (
      <RewardDetailsContentPanel>
        <div className={classes.titleText}>Description</div>
        <div className={classes.bodyText}>{ReactHtmlParser(reward?.description, { transform: this.transform })}</div>
      </RewardDetailsContentPanel>
    )
  }
}

export const RewardDescriptionPanel = withStyles(styles)(_RewardDescriptionPanel)
