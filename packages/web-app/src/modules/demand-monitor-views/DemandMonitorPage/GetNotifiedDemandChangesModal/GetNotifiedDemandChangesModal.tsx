import { Button } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { ModalWithOverlay } from '../../../../components/ModalWithOverlay'
import saladBackgroundUrl from './assets/background.png'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  modalContent: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    backgroundColor: theme.darkBlue,
    padding: '48px 48px 72px 180px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '800px',
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
  saladImage: {
    position: 'absolute',
    top: '0px',
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
  continueButtonWrapper: {
    marginTop: '24px',
  },
})

interface Props extends WithStyles<typeof styles> {
  className?: string
  onCloseClick: () => void
  onContinuesClick: () => void
}

const _GetNotifiedDemandChangesModal = ({ classes, onCloseClick }: Props) => {
  function onContinuesClick(): void {
    throw new Error('Function not implemented.')
  }

  return (
    <ModalWithOverlay onCloseClick={onCloseClick}>
      <div className={classes.modalContent}>
        <h1 className={classes.title}>Get Notified Of Demand Changes</h1>
        <p className={classes.description}>
          You can set up alerts to be notified when the demand level of a GPU reaches your sweet spot, even at a
          specific priority tier.
        </p>
        <div>
          <h3 className={classes.subtitle}>Already have an account?</h3>
          <p className={classes.description}>
            Setting up alerts is easier and more powerful while{' '}
            <span onClick={() => {}} className={classes.link}>
              logged in
            </span>
          </p>
        </div>
        <h3 className={classes.subtitle}>Not yet a chef? No problem!</h3>
        <p className={classes.description}>
          No need to create an account, simply select the GPU you wish to get alerts for and click continue.
        </p>
        <div className={classes.continueButtonWrapper}>
          <Button variant="secondary" onClick={onContinuesClick} label="Continue" />
        </div>
        <Img className={classes.saladImage} src={saladBackgroundUrl} alt="salad-background" />
      </div>
    </ModalWithOverlay>
  )
}

export const GetNotifiedDemandChangesModal = withStyles(styles)(_GetNotifiedDemandChangesModal)
