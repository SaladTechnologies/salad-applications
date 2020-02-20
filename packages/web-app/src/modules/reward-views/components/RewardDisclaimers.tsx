import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { P } from '../../../components'
import { RewardDetailsContentPanel } from './RewardDetailsContentPanel'

const styles = (theme: SaladTheme) => ({})

interface Props extends WithStyles<typeof styles> {}

class _RewardDisclaimers extends Component<Props> {
  render() {
    return (
      <RewardDetailsContentPanel hideDivider>
        <P>
          [SUPPLIER DISCLAIMER] The merchants represented are not sponsors of the rewards or otherwise affiliated with
          Salad Technologies, Inc. The logos and other identifying marks attached are trademarks of, and owned by, each
          represented company and/or its affiliates. Please visit each company's website for additional terms and
          conditions.
        </P>
      </RewardDetailsContentPanel>
    )
  }
}

export const RewardDisclaimers = withStyles(styles)(_RewardDisclaimers)
