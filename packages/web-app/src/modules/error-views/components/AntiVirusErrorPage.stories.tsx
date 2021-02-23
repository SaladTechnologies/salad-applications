import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { storiesOf } from '@storybook/react'
import { getSanitizedHTML } from '../../../utils'
import { AntiVirusErrorPage } from './AntiVirusErrorPage'

storiesOf('Modules/Error Pages/Pages', module)
  .addDecorator((storyFn) => (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{storyFn()}</div>
  ))
  .add('Specific Anti-Virus Error - Initial', () => {
    return (
      <AntiVirusErrorPage
        antivirus="Kaspersky"
        article={specificArticle}
        onCloseClicked={action('On Close Clicked')}
        onViewAVList={linkTo('Modules/Error Pages/Pages', 'Generic Anti-Virus Error - Initial')}
      />
    )
  })
  .add('Specific Anti-Virus Error - Fallthrough', () => {
    return (
      <AntiVirusErrorPage
        antivirus="Kaspersky"
        article={specificArticle}
        fallthrough={true}
        onCloseClicked={action('On Close Clicked')}
        onViewAVList={linkTo('Modules/Error Pages/Pages', 'Generic Anti-Virus Error - Initial')}
      />
    )
  })
  .add('Generic Anti-Virus Error - Initial', () => {
    return (
      <AntiVirusErrorPage
        articleList={articleList}
        onCloseClicked={action('On Close Clicked')}
        onViewArticle={linkTo('Modules/Error Pages/Pages', 'Specific Anti-Virus Error - Initial')}
        onViewAVList={linkTo('Modules/Error Pages/Pages', 'Generic Anti-Virus Error - Initial')}
      />
    )
  })
  .add('Generic Anti-Virus Error - Fallthrough', () => {
    return (
      <AntiVirusErrorPage
        articleList={articleList}
        onCloseClicked={action('On Close Clicked')}
        fallthrough={true}
        onViewArticle={linkTo('Modules/Error Pages/Pages', 'Specific Anti-Virus Error - Initial')}
        onViewAVList={linkTo('Modules/Error Pages/Pages', 'Generic Anti-Virus Error - Initial')}
      />
    )
  })

const kasperskyBody =
  '<h3> 1. Uninstall Salad</h3>\n<p><strong><span style="font-weight: 400;">Uninstall Salad, and all of its associated files and folders</span></strong></p>\n<h3>2. Restart your computer</h3>\n<p><strong><span style="font-weight: 400;">This will finalize the uninstallation of Salad, as it does with most programs that require drivers to run.</span></strong></p>\n<h3>3. Reinstall Salad</h3>\n<p><strong><span style="font-weight: 400;">Navigate in your internet browser to </span><a href="http://www.salad.io/"><span style="font-weight: 400;">www.salad.io</span></a><span style="font-weight: 400;"> and re-download the installation .exe, and when the installation finishes, be sure to uncheck the “Run Salad” checkbox.</span></strong></p>\n<h3><span style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Helvetica, Arial, sans-serif;">4. Open <span class="wysiwyg-font-size-large">Kaspersky</span></span></h3>\n<p><span style="font-weight: 400;">This will be the main screen you are presented within Kaspersky, and is your base of virus-fighting operations.</span></p>\n<p><img src="https://support.salad.io/hc/article_attachments/360054487791/unnamed__4_.png" alt="unnamed__4_.png"></p>\n<h3>5. Navigate to Settings</h3>\n<p><span style="font-weight: 400;">Click the gear icon on the bottom left corner to access your settings.</span></p>\n<p><img src="https://support.salad.io/hc/article_attachments/360054348672/unnamed__3_.png" alt="unnamed__3_.png"></p>\n<h3>6. Click on Additional</h3>\n<p><span style="font-weight: 400;">After clicking ‘Threats and Exclusions’ settings you will be greeted with a new popup. From that popup, select ‘Manage Exclusions’</span></p>\n<p><img src="https://support.salad.io/hc/article_attachments/360054348692/unnamed__2_.png" alt="unnamed__2_.png"></p>\n<h3>7. Click on \'Threats and Exclusions\'</h3>\n<p><span style="font-weight: 400;">After clicking ‘Threats and Exclusions’ settings you will be greeted with a new popup. From that popup, select ‘Manage Exclusions’</span></p>\n<p><img src="https://support.salad.io/hc/article_attachments/360054348712/unnamed__1_.png" alt="unnamed__1_.png"></p>\n<h3>8. Click on ‘Add’</h3>\n<p><span style="font-weight: 400;">After clicking ‘Manage Exclusions’ you will be greeted with another box. Click ‘Add’ on that box as pictured below</span></p>\n<p> <img src="https://support.salad.io/hc/article_attachments/360054348732/unnamed.png" alt="unnamed.png"></p>\n<p> </p>\n<h3>9. Adding Salad as Whitelist</h3>\n<p><span style="font-weight: 400;">After clicking ‘Add’ you will be greeted with another dialogue box. Under the ‘File and Folder’ option,  you’ll want to navigate to the Salad installation folder and select it, the default installation path is “C:\\Users\\YourUserHere\\AppData\\Roaming\\Salad” (without the quotations) and click on ‘Add’.</span></p>\n<p><img src="https://support.salad.io/hc/article_attachments/360054487811/unnamed__7_.png" alt="unnamed__7_.png"></p>\n<p> </p>\n<p> </p>\n<h3>10. Click \'Add\'</h3>\n<p><span style="font-weight: 400;">Once you’ve found your Salad installation folder and clicked it, hit Add, and it will bring you back to the main Kaspersky Exclusions whitelist page with your newly added exclusion.</span></p>\n<p> </p>\n<h3>11. Run Salad</h3>\n<p><span style="font-weight: 400;">Let Salad run for at least 30 minutes after setting up the whitelist. Contact support if this issue persists.</span></p>'
const specificArticle = getSanitizedHTML(kasperskyBody)

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
