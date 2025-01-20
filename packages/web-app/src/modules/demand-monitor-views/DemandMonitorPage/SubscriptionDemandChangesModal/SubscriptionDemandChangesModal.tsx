import type CSS from 'csstype'
import { useEffect } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { ModalWithOverlay } from '../../../../components/ModalWithOverlay'
import saladBackgroundUrl from '../assets/background.png'
import { mailchimpFormDataByHardwareName } from './constants'
import { getMailchimpSubscriptionForm } from './utils'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  modalWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    '@media (min-width: 812px)': {
      width: '736px',
      maxWidth: 'none',
    },
  },
  modalContent: {
    position: 'relative',
    display: 'flex',
    backgroundColor: theme.darkBlue,
    padding: '32px 64px 0px 24px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    '@media (max-width: 812px)': {
      padding: '24px 16px 36px 16px',
      width: '100%',
    },
  },
  title: {
    color: theme.green,
    fontWeight: 700,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '28px',
    '@media (max-width: 812px)': {
      fontSize: '20px',
    },
  },
  subtitle: {
    color: theme.green,
    fontWeight: 700,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',
    margin: '0px',
    marginTop: '24px',
  },
  description: {
    color: 'white',
    fontWeight: 400,
    fontSize: '14px',
    margin: '0px',
    width: '100%',
  },
  link: {
    color: theme.green,
    fontWeight: 400,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  saladImageWrapper: {
    position: 'relative',
    height: '480px',
    width: '220px',
    '@media (max-width: 812px)': {
      display: 'none',
    },
  },
  saladImage: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${saladBackgroundUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  closeIcon: {
    position: 'absolute',
    right: '16px',
    top: '16px',
    color: theme.lightGreen,
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  controlsWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '500px',
    marginTop: '24px',
  },
  dropdownWrapper: {
    position: 'absolute',
    top: '0px',
    left: '0px',
  },
  dropdown: {
    position: 'fixed',
  },
  continueButtonWrapper: {
    marginLeft: '260px',
  },
  subscriptionFormWrapper: {
    color: theme.darkBlue,
    backgroundColor: theme.white,
    width: '500px',
    '@media (max-width: 812px)': {
      width: '100%',
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  demandHardwareName: string
  onCloseClick: () => void
}

const _SubscriptionDemandChangesModal = ({ classes, demandHardwareName, onCloseClick }: Props) => {
  useEffect(() => {
    const subscriptionForm = document.getElementById('mc-embedded-subscribe-form') as HTMLFormElement
    subscriptionForm.onsubmit = () => {
      const inputs = subscriptionForm.querySelectorAll('input')
      const checkboxes = Array.from(inputs).filter((input) => input.type === 'checkbox')
      const withAtLeastOneCheckboxSelected = checkboxes.some((checkbox) => checkbox.checked)
      if (withAtLeastOneCheckboxSelected) {
        subscriptionForm.submit()
      } else {
        checkboxes.forEach((checkboxes) => {
          checkboxes.checked = true
        })

        subscriptionForm.submit()
      }
      onCloseClick()
    }
  }, [onCloseClick])

  const formHtml = mailchimpFormDataByHardwareName[demandHardwareName]
    ? getMailchimpSubscriptionForm(mailchimpFormDataByHardwareName[demandHardwareName])
    : null

  return (
    <ModalWithOverlay onCloseClick={onCloseClick}>
      <div className={classes.modalWrapper}>
        <div className={classes.saladImageWrapper}>
          <div className={classes.saladImage} />
        </div>
        <div className={classes.modalContent}>
          <h1 className={classes.title}>Get Notified Of Demand Changes</h1>
          {formHtml && (
            <div className={classes.subscriptionFormWrapper} dangerouslySetInnerHTML={{ __html: formHtml }} />
          )}
        </div>
      </div>
    </ModalWithOverlay>
  )
}

export const SubscriptionDemandChangesModal = withStyles(styles)(_SubscriptionDemandChangesModal)
