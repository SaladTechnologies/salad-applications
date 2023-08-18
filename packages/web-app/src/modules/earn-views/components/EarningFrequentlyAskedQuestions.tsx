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

interface Props extends WithStyles<typeof styles> {}

const _EarningFrequentlyAskedQuestions: FunctionComponent<Props> = ({ classes }) => {
  const navigateToSaladSupportPage = () => {
    window.open('https://support.salad.com/', '_blank')
  }

  return (
    <div className={classes.container}>
      <EarnSectionHeader>Have questions? Check out our FAQS</EarnSectionHeader>
      <div className={classes.questionsContainer}>
        <a
          className={classes.questionLink}
          href="https://support.salad.com/article/59-faq-on-salad-swag"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Img className={classes.questionIcon} src={faqIcon} />
          Common FAQs on Salad Swag
        </a>
        <a
          className={classes.questionLink}
          href="https://support.salad.com/article/52-i-live-outside-the-us-can-i-still-redeem-rewards-with-salad"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Img className={classes.questionIcon} src={faqIcon} />I live outside the U.S. - can I still redeem rewards
          with Salad?
        </a>
        <a
          className={classes.questionLink}
          href="https://support.salad.com/category/40-rewards"
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
