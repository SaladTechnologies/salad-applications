import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../../SaladTheme'
import image from '../../assets/Home - How it Works.svg'
import { OnboardingPage } from '../../../../components'
// import { Form, Field } from 'react-final-form'
// import { Checkbox, Scrollbar } from '../../../components'
// import { Scrollbar } from '../../../components'
// import ReactMarkdown from 'react-markdown'
// import { terms } from '../assets/terms'

const styles = (theme: SaladTheme) => ({
  textContainer: {
    color: theme.lightGreen,
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    padding: '0 5rem',
  },
})

interface Props extends WithStyles<typeof styles> {

}

class _MachineTest extends Component<Props> {
  render() {
    const { } = this.props
    return (
      <OnboardingPage
        title={`Let's Get Started`}
        subtitle={`Salad is checking out your machine and deciding how to optimize your earnings and experience.`}
        image={image}
        // nextSubmitting={submitting}
        rightContent={<>-----> Foo!</>}
        rightColumnWidth={'60%'}
        leftColumnPadding={'4rem 1rem 4rem 2rem'}
        rightColumnPadding={'4rem 1rem 4rem 2rem'}
        // nextText={'Agree'}
        // onNext={() => this.submit()}
      >
        -> Bar!
      </OnboardingPage>
    )
  }
}

export const MachineTest = withStyles(styles)(_MachineTest)
