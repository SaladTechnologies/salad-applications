import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { storiesOf } from '@storybook/react'
import { ErrorPageType } from '../../../UIStore'
import { getSanitizedHTML } from '../../../utils'
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
        article={specificAntiVirusArticle}
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
        article={specificAntiVirusArticle}
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
        articleList={articleList}
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
        articleList={articleList}
        onCloseClicked={action('On Close Clicked')}
        fallthrough={true}
        onViewArticle={linkTo('Modules/Error Pages/Pages', 'Specific Anti-Virus Error - Initial')}
        onViewAVList={linkTo('Modules/Error Pages/Pages', 'Generic Anti-Virus Error - Initial')}
      />
    )
  })
  .add('Firewall Error - Initial', () => {
    return (
      <AntiVirusFirewallErrorPage
        errorType={ErrorPageType.Firewall}
        article={firewallArticle}
        onCloseClicked={action('On Close Clicked')}
      />
    )
  })
  .add('Firewall Error - Fallthrough', () => {
    return (
      <AntiVirusFirewallErrorPage
        errorType={ErrorPageType.Firewall}
        fallthrough={true}
        article={firewallArticle}
        onCloseClicked={action('On Close Clicked')}
      />
    )
  })

const kasperskyBody =
  '<h3> 1. Uninstall Salad</h3>\n<p><strong><span style="font-weight: 400;">Uninstall Salad, and all of its associated files and folders</span></strong></p>\n<h3>2. Restart your computer</h3>\n<p><strong><span style="font-weight: 400;">This will finalize the uninstallation of Salad, as it does with most programs that require drivers to run.</span></strong></p>\n<h3>3. Reinstall Salad</h3>\n<p><strong><span style="font-weight: 400;">Navigate in your internet browser to </span><a href="http://salad.com"><span style="font-weight: 400;">salad.com</span></a><span style="font-weight: 400;"> and re-download the installation .exe, and when the installation finishes, be sure to uncheck the “Run Salad” checkbox.</span></strong></p>\n<h3><span style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Helvetica, Arial, sans-serif;">4. Open <span class="wysiwyg-font-size-large">Kaspersky</span></span></h3>\n<p><span style="font-weight: 400;">This will be the main screen you are presented within Kaspersky, and is your base of virus-fighting operations.</span></p>\n<p><img src="https://support.salad.com/hc/article_attachments/360054487791/unnamed__4_.png" alt="unnamed__4_.png"></p>\n<h3>5. Navigate to Settings</h3>\n<p><span style="font-weight: 400;">Click the gear icon on the bottom left corner to access your settings.</span></p>\n<p><img src="https://support.salad.com/hc/article_attachments/360054348672/unnamed__3_.png" alt="unnamed__3_.png"></p>\n<h3>6. Click on Additional</h3>\n<p><span style="font-weight: 400;">After clicking ‘Threats and Exclusions’ settings you will be greeted with a new popup. From that popup, select ‘Manage Exclusions’</span></p>\n<p><img src="https://support.salad.com/hc/article_attachments/360054348692/unnamed__2_.png" alt="unnamed__2_.png"></p>\n<h3>7. Click on \'Threats and Exclusions\'</h3>\n<p><span style="font-weight: 400;">After clicking ‘Threats and Exclusions’ settings you will be greeted with a new popup. From that popup, select ‘Manage Exclusions’</span></p>\n<p><img src="https://support.salad.com/hc/article_attachments/360054348712/unnamed__1_.png" alt="unnamed__1_.png"></p>\n<h3>8. Click on ‘Add’</h3>\n<p><span style="font-weight: 400;">After clicking ‘Manage Exclusions’ you will be greeted with another box. Click ‘Add’ on that box as pictured below</span></p>\n<p> <img src="https://support.salad.com/hc/article_attachments/360054348732/unnamed.png" alt="unnamed.png"></p>\n<p> </p>\n<h3>9. Adding Salad as Whitelist</h3>\n<p><span style="font-weight: 400;">After clicking ‘Add’ you will be greeted with another dialogue box. Under the ‘File and Folder’ option,  you’ll want to navigate to the Salad installation folder and select it, the default installation path is “C:\\Users\\YourUserHere\\AppData\\Roaming\\Salad” (without the quotations) and click on ‘Add’.</span></p>\n<p><img src="https://support.salad.com/hc/article_attachments/360054487811/unnamed__7_.png" alt="unnamed__7_.png"></p>\n<p> </p>\n<p> </p>\n<h3>10. Click \'Add\'</h3>\n<p><span style="font-weight: 400;">Once you’ve found your Salad installation folder and clicked it, hit Add, and it will bring you back to the main Kaspersky Exclusions whitelist page with your newly added exclusion.</span></p>\n<p> </p>\n<h3>11. Run Salad</h3>\n<p><span style="font-weight: 400;">Let Salad run for at least 30 minutes after setting up the whitelist. Contact support if this issue persists.</span></p>'
const specificAntiVirusArticle = getSanitizedHTML(kasperskyBody)

const firewallBody =
  '<ol><li> Open Windows Security.<img src="https://support.salad.com/hc/article_attachments/360089893631/mceclip0.png" alt="mceclip0.png"></li><li>Navigate to Firewall &amp; network protection.<img src="https://support.salad.com/hc/article_attachments/360090201211/FIREWALL_GUIDE_IMAGE_2.png" alt="FIREWALL_GUIDE_IMAGE_2.png"></li><li>Scroll down to Allow an app through firewall.<img src="https://support.salad.com/hc/article_attachments/360090201191/FIREWALLGUIDE_IMAGE_3.png" alt="FIREWALLGUIDE_IMAGE_3.png"></li><li>Scroll down until you find the affected miner.<img src="https://support.salad.com/hc/article_attachments/360090201271/FIREWALL_GUIDE_IMAGE_4.png" alt="FIREWALL_GUIDE_IMAGE_4.png"></li><li>Click Change settings at the top right, and click all the tick boxes on the right side, as well as left side, of the affected miner. Do the same for any further firewall blocked affected miners, if you see the same item listed multiple times, make sure to allow all of them through. Then click OK.</li></ol><p> </p><p>If you are using another Firewall service, please consult their website or support for details on how to allow applications or services through your Firewall.</p>'
const firewallArticle = getSanitizedHTML(firewallBody)

const articleList = [
  {
    id: 1,
    name: 'How to Whitelist Salad in Windows Defender',
  },
  {
    id: 2,
    name: 'How to whitelist Salad in McAfee',
  },
  {
    id: 3,
    name: 'How to Whitelist Salad in Avast Antivirus',
  },
  {
    id: 4,
    name: 'How to Whitelist Salad in Norton Antivirus',
  },
  {
    id: 5,
    name: 'How to Whitelist Salad in Malwarebytes',
  },
  {
    id: 6,
    name: 'How to Whitelist Salad in AVG',
  },
  {
    id: 7,
    name: 'How to Whitelist Salad in Kaspersky',
  },
  {
    id: 8,
    name: 'How to Whitelist Salad in Zillya',
  },
  {
    id: 9,
    name: 'How to Whitelist Salad in Webroot',
  },
  {
    id: 10,
    name: 'How to Whitelist Salad in VIPRE',
  },
  {
    id: 11,
    name: 'How to Whitelist Salad in Twister',
  },
  {
    id: 12,
    name: 'How to Whitelist Salad in TrendMicro',
  },
  {
    id: 13,
    name: 'How to Whitelist Salad in TotalAV',
  },
  {
    id: 14,
    name: 'How to Whitelist Salad in Sophos',
  },
  {
    id: 15,
    name: 'How to Whitelist Salad in SecureAge APEX',
  },
  {
    id: 16,
    name: 'How to Whitelist Salad in Qihoo-360',
  },
  {
    id: 17,
    name: 'How to Whitelist Salad in PCMatic',
  },
  {
    id: 18,
    name: 'How to Whitelist Salad in K7',
  },
  {
    id: 19,
    name: 'How to Whitelist Salad in GData',
  },
  {
    id: 20,
    name: 'How to Whitelist Salad in F-Secure',
  },
]
