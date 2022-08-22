import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { storiesOf } from '@storybook/react'
import { ErrorPageType } from '../../../UIStore'
import { antivirusInfo } from '../../onboarding/utils'
import { AntiVirusFirewallErrorPage } from './AntiVirusFirewallErrorPage'

storiesOf('Modules/Error Pages/Pages', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('Specific Anti-Virus Error - Initial', () => {
    return (
      <AntiVirusFirewallErrorPage
        errorType={ErrorPageType.AntiVirus}
        antivirusName="Kaspersky"
        onCloseClicked={action('On Close Clicked')}
        onViewAVList={linkTo('Modules/Error Pages/Pages', 'Generic Anti-Virus Error - Initial')}
      />
    )
  })
  .add('Specific Anti-Virus Error - Fallthrough', () => {
    return (
      <AntiVirusFirewallErrorPage
        errorType={ErrorPageType.AntiVirus}
        antivirusName="Kaspersky"
        fallthrough={true}
        onCloseClicked={action('On Close Clicked')}
        onViewAVList={linkTo('Modules/Error Pages/Pages', 'Generic Anti-Virus Error - Initial')}
      />
    )
  })
  .add('Generic Anti-Virus Error - Initial', () => {
    return (
      <AntiVirusFirewallErrorPage
        errorType={ErrorPageType.AntiVirus}
        articleList={antivirusInfo}
        onCloseClicked={action('On Close Clicked')}
        onViewArticle={linkTo('Modules/Error Pages/Pages', 'Specific Anti-Virus Error - Initial')}
        onViewAVList={linkTo('Modules/Error Pages/Pages', 'Generic Anti-Virus Error - Initial')}
      />
    )
  })
  .add('Generic Anti-Virus Error - Fallthrough', () => {
    return (
      <AntiVirusFirewallErrorPage
        errorType={ErrorPageType.AntiVirus}
        articleList={antivirusInfo}
        onCloseClicked={action('On Close Clicked')}
        fallthrough={true}
        onViewArticle={linkTo('Modules/Error Pages/Pages', 'Specific Anti-Virus Error - Initial')}
        onViewAVList={linkTo('Modules/Error Pages/Pages', 'Generic Anti-Virus Error - Initial')}
      />
    )
  })
  .add('Firewall Error - Initial', () => {
    return <AntiVirusFirewallErrorPage errorType={ErrorPageType.Firewall} onCloseClicked={action('On Close Clicked')} />
  })
  .add('Firewall Error - Fallthrough', () => {
    return (
      <AntiVirusFirewallErrorPage
        errorType={ErrorPageType.Firewall}
        fallthrough={true}
        onCloseClicked={action('On Close Clicked')}
      />
    )
  })
