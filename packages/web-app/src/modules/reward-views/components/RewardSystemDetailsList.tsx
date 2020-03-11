import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { RewardSystemDetails } from '../../reward/models'
import { InfoItem } from '.'

const styles = (theme: SaladTheme) => ({
  container: {
    flex: 1,
  },
  titleText: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 20,
    textTransform: 'capitalize',
    padding: '10px 20px',
  },
  tabList: {
    display: 'flex',
    paddingInlineStart: 0, //Removes the default left padding for a <ul/>
    marginBottom: 0,
  },
})

interface Props extends WithStyles<typeof styles> {
  title?: string
  systemDetails?: RewardSystemDetails
}

class _RewardSystemDetailsList extends Component<Props> {
  render() {
    const { title, systemDetails, classes } = this.props

    //Skip if there are no details
    if (!systemDetails) {
      return null
    }

    return (
      <div className={classnames(classes.container)}>
        <div className={classes.titleText}>{title}</div>
        <InfoItem title={'OS'} value={systemDetails.os} />
        <InfoItem title={'Processor'} value={systemDetails.processor} />
        <InfoItem title={'RAM'} value={systemDetails.memory} />
        <InfoItem title={'Graphics Card'} value={systemDetails.graphics} />
        <InfoItem title={'Disk Space'} value={systemDetails.diskSpace} />
        <InfoItem title={'Other'} value={systemDetails.other} />
      </div>
    )
  }
}

export const RewardSystemDetailsList = withStyles(styles)(_RewardSystemDetailsList)
