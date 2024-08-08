import { Button } from '@saladtechnologies/garden-components'
import { Copy, X } from '@saladtechnologies/garden-icons'
import type CSS from 'csstype'
import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../../SaladTheme'
import { Tooltips } from '../../../../../Tooltips'
import { useDetectClickOutsideElement } from '../../../../../hooks/useDetectClickOutsideElement'
import type { Reward } from '../../../../reward/models'
import saladBackgroundUrl from './assets/salad-background.svg'
import starsUrl from './assets/stars.svg'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  modalOverlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 1000000000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000070',
    fontFamily: 'Mallory',
  },
  modalContainer: {
    position: 'relative',
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    height: '470px',
    backgroundColor: theme.darkBlue,
    padding: '48px 28px',
    overflow: 'hidden',
    maxWidth: '870px',
  },
  leftContainer: {
    position: 'relative',
    flex: 1,
  },
  rightContainer: {
    position: 'relative',
    flex: 2,
    marginLeft: '35%',
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
  className?: string
  reward: Reward
  onCloseClick: () => void
  onVaultLinkClick: () => void
}

const _ReviewAfterRedemption = ({ classes, reward, onCloseClick, onVaultLinkClick }: Props) => {
  const [isCopied, setIsCopied] = useState(false)
  const modalContainerRef = useRef(null)
  const [referralText, setReferralText] = useState(
    `I just got ${reward?.name} through Salad! Sign up to earn money with your gaming PC!  salad.com/download`,
  )

  useDetectClickOutsideElement(modalContainerRef, onCloseClick)

  const handleReferralTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReferralText(event.target.value)
  }

  const handleCopyClick = () => {
    // eslint-disable-next-line compat/compat
    window.navigator.clipboard.writeText(referralText)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div className={classes.modalOverlay}>
      <div className={classes.modalContainer} ref={modalContainerRef}>
        <Tooltips />
        <X className={classes.closeIcon} onClick={onCloseClick} />
        <Img className={classes.saladImage} src={saladBackgroundUrl} alt="salad-background" />
        <Img className={classes.starsImage} src={starsUrl} alt="stars" />
        <div className={classes.rightContainer}>
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
          <div>
            <h3 className={classes.subtitle}>Let the World Know</h3>
            <div className={classes.textareaContainer}>
              <textarea
                value={referralText}
                onChange={handleReferralTextChange}
                className={classes.textarea}
                cols={30}
                rows={10}
              />
              <Button
                onClick={handleCopyClick}
                label={isCopied ? 'Copied!' : 'Copy'}
                variant="secondary"
                leadingIcon={isCopied ? null : <Copy />}
                width={90}
                data-rh={'Keep chopping to discover this veggie'}
              />
            </div>
          </div>
          <h3 className={classes.subtitle}>Review us on TrustPilot</h3>
          <p className={classes.description}>
            Having fun with Salad? Review us on{' '}
            <a href="https://www.trustpilot.com/review/salad.com" className={classes.link}>
              Trustpilot
            </a>{' '}
            to help our Kitchen grow.
          </p>
        </div>
      </div>
    </div>
  )
}

export const ReviewAfterRedemption = withStyles(styles)(_ReviewAfterRedemption)
