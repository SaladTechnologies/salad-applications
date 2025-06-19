import { Button } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../../SaladTheme'
import { ModalWithOverlay } from '../../../../../components/ModalWithOverlay'
import type { Reward } from '../../../../reward/models'
import saladBackgroundUrl from './assets/salad-background.svg'
import starsUrl from './assets/stars.svg'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  modalContent: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    backgroundColor: theme.darkBlue,
    padding: '48px 80px 72px 300px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '1000px',
    boxSizing: 'border-box',
  },
  title: {
    color: theme.green,
    fontWeight: 700,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '28px',
  },
  subtitle: {
    color: theme.green,
    fontWeight: 700,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',
    margin: '0px',
    marginTop: '48px',
  },
  textareaContainer: {
    marginTop: '16px',
    display: 'flex',
    gap: '16px',
    height: '105px',
    flexGrow: 1,
    justifyContent: 'space-between',
    minWidth: '550px',
    '& button': {
      height: '100%',
      width: '100%',
    },
  },
  textarea: {
    padding: '8px 12px',
    flex: 1,
    border: `2px solid ${theme.green}`,
    backgroundColor: theme.darkBlue,
    borderRadius: '4px',
    width: '70%',
    color: theme.green,
    fontFamily: 'Mallory',
    resize: 'none',
    fontSize: '16px',
    backgroundImage:
      'linear-gradient(270deg, rgba(252, 252, 252, 0.06) 0%, rgba(252, 252, 252, 0.01) 49.72%, rgba(252, 252, 252, 0.06) 67.11%, rgba(252, 252, 252, 0.12) 100%)',
  },
  description: {
    color: 'white',
    fontWeight: 400,
    fontSize: '14px',
    margin: '0px',
  },
  link: {
    color: theme.green,
    fontWeight: 400,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  starsImage: {
    position: 'absolute',
    bottom: '190px',
    left: '0px',
  },
  saladImage: {
    position: 'absolute',
    bottom: '0px',
    left: '0px',
  },
  closeIcon: {
    position: 'absolute',
    right: '16px',
    top: '16px',
    color: '#DBF1C1',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
})

interface Props extends WithStyles<typeof styles> {
  reward: Reward
  onCloseClick: () => void
  onVaultLinkClick: () => void
}

const _ReviewAfterRedemption = ({ classes, onCloseClick, onVaultLinkClick }: Props) => {
  const goToTrustPilot = () => {
    window.open('https://www.trustpilot.com/evaluate/salad.com', '_blank', 'noopener, noreferrer')
  }

  return (
    <ModalWithOverlay onCloseClick={onCloseClick}>
      <div className={classes.modalContent}>
        <h1 className={classes.title}>
          <span>Congratulations on your reward!</span>
          <span>Your item is on its way.</span>
        </h1>
        <p className={classes.description}>
          Check your{' '}
          <span onClick={onVaultLinkClick} className={classes.link}>
            rewards vault
          </span>{' '}
          or email for more details.
        </p>
        <h3 className={classes.subtitle}>Review us on TrustPilot</h3>
        <p className={classes.description}>
          Having fun with Salad? Review us on{' '}
          <a href="https://www.trustpilot.com/review/salad.com" className={classes.link}>
            Trustpilot
          </a>{' '}
          to help our Kitchen grow.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '24px', width: '100%' }}>
          <Button onClick={goToTrustPilot} label="Submit Your Review" variant="secondary" width={180} />
        </div>
        <Img className={classes.saladImage} src={saladBackgroundUrl} alt="salad-background" />
        <Img className={classes.starsImage} src={starsUrl} alt="stars" />
      </div>
    </ModalWithOverlay>
  )
}

export const ReviewAfterRedemption = withStyles(styles)(_ReviewAfterRedemption)
