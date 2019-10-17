import React, { Component, ReactNode } from 'react'

// styles
import { styles } from './MachineTest.styles'

// Assets
import image from '../../assets/Home - How it Works.svg'

// Components
import { OnboardingPage } from '../../../../components'
import { Step, ListInline, Divider } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'

// import { Form, Field } from 'react-final-form'
// import { Checkbox, Scrollbar } from '../../../components'
// import { Scrollbar } from '../../../components'
// import ReactMarkdown from 'react-markdown'
// import { terms } from '../assets/terms'

interface Props extends WithStyles<typeof styles> {}

class _MachineTest extends Component<Props> {
  render() {
    const { classes } = this.props

    const componentList: ReactNode[] = [
      <Step active={false} complete={true} label={'1. Testing'} />,
      <Step active={true} complete={false} label={'2. Running'} />,
      <Step active={false} complete={false} label={'3. Reward'} />,
    ]

    const Elements = (
      <>
        <div className={classes.breadcrumb}>
          <ListInline componentList={componentList} splitEvenly />
        </div>
        <Divider />
        <div className={'earnings'}>
          Average earnings per day
          <br />
          <br />
          Rewards available in the first 24 hours
        </div>
        <Divider />
        <div className={'testing'}></div>
      </>
    )

    return (
      <OnboardingPage
        title={`Let's Get Started`}
        subtitle={`Salad is checking out your machine and deciding how to optimize your earnings and experience.`}
        image={image}
        // nextSubmitting={submitting}
        rightContent={Elements}
        rightColumnWidth={'60%'}
        leftColumnPadding={'4rem 1rem 4rem 2rem'}
        rightColumnPadding={'4rem 2rem 4rem 1rem'}
        alignItems={'start'}
        display={'block'}
        // nextText={'Agree'}
        // onNext={() => this.submit()}
      ></OnboardingPage>
    )
  }
}

export const MachineTest = withStyles(styles)(_MachineTest)
