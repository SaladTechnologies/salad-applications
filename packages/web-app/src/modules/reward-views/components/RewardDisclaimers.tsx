import type { ReactNode } from 'react'
import { Component } from 'react'
import { P } from '../../../components'
import { RewardDetailsContentPanel } from './RewardDetailsContentPanel'

interface Props {}

export class RewardDisclaimers extends Component<Props> {
  public override render(): ReactNode {
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
