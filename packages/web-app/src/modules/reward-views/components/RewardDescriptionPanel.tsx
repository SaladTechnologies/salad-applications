import React, { Component, ReactElement } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Reward } from '../../reward/models'
import { P, ExternalLink } from '../../../components'
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
  },
})

interface Props extends WithStyles<typeof styles> {
  reward?: Reward
}

class _RewardDescriptionPanel extends Component<Props> {
  transform = (node: DomElement): ReactElement | void | null => {
    //Transform a tags to external links
    if (node.type === 'tag' && node.name === 'a') {
      return <ExternalLink path={node.attribs.href}>{node.children[0].data}</ExternalLink>
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
        <P className={classes.bodyText}>{ReactHtmlParser(reward?.description, { transform: this.transform })}</P>
      </RewardDetailsContentPanel>
    )
  }
}

export const RewardDescriptionPanel = withStyles(styles)(_RewardDescriptionPanel)
