import React, { Component, ReactElement } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { SmartLink } from '../../../components'
import { RewardDetailsContentPanel } from './RewardDetailsContentPanel'
import ReactHtmlParser from 'react-html-parser'
import { DomElement } from 'htmlparser2'

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
}

class _RewardDescriptionPanel extends Component<Props> {
  transform = (node: DomElement): ReactElement | void | null => {
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
  render() {
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
