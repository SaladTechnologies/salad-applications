import { Button } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import faqIcon from '../assets/faq-icon.svg'
import { EarnSectionHeader } from './EarnSectionHeader'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '23px',
  },
  questionIcon: {
    height: 18,
    width: 11,
    marginRight: 24,
  },
  questionLink: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Mallory',
    color: theme.mediumGreen,
  },
  buttonDescription: {
    fontFamily: 'Mallory',
    color: theme.lightGreen,
    margin: '0px 0px 8px',
  },
})

interface Props extends WithStyles<typeof styles> {
  trackFAQLinkClicked: (faqLink: string) => void
}

const _EarningFrequentlyAskedQuestions: FunctionComponent<Props> = ({ classes, trackFAQLinkClicked }) => {
  const navigateToSaladSupportPage = () => {
    window.open('https://support.salad.com/faq/jobs/why-do-i-earn-less-more-with-salad-than-whattomine', '_blank', 'noopener, noreferrer')
  }

  return (
    <div className={classes.container}>
      <EarnSectionHeader>Have questions? Check out our FAQS</EarnSectionHeader>
      <div className={classes.questionsContainer}>
        <a
          className={classes.questionLink}
          href="https://support.salad.com/rewards/rewards-faq/i-live-outside-the-us-can-i-still-redeem-rewards-with-salad"
          onClick={() =>
            trackFAQLinkClicked(
              'https://support.salad.com/rewards/rewards-faq/i-live-outside-the-us-can-i-still-redeem-rewards-with-salad',
            )
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <Img className={classes.questionIcon} src={faqIcon} />I live outside the U.S. - can I still redeem rewards
          with Salad?
        </a>
        <a
          className={classes.questionLink}
          href="https://support.salad.com/category/40-rewards"
          onClick={() => trackFAQLinkClicked('https://support.salad.com/guides/using-salad/how-to-make-a-purchase')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Img className={classes.questionIcon} src={faqIcon} />
          How do I redeem a reward?
        </a>
      </div>
      <div>
        <p className={classes.buttonDescription}>Have more questions? </p>
        <Button outlineColor="#DBF1C1" variant="outlined" label="View all FAQs" onClick={navigateToSaladSupportPage} />
      </div>
    </div>
  )
}

export const EarningFrequentlyAskedQuestions = withStyles(styles)(_EarningFrequentlyAskedQuestions)
