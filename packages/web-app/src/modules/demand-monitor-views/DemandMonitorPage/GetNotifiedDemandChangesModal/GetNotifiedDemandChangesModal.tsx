import { Button } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { DropdownLight } from '../../../../components/Dropdown'
import { ModalWithOverlay } from '../../../../components/ModalWithOverlay'
import type { DemandedHardwarePerformance } from '../../DemandMonitorStore'
import saladBackgroundUrl from './assets/background.png'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  modalWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    maxWidth: '700px',
    maxHeight: '430px',
  },
  modalContent: {
    position: 'relative',
    width: '80%',
    display: 'flex',
    backgroundColor: theme.darkBlue,
    padding: '48px 64px 72px 24px',
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  saladImageWrapper: {
    position: 'relative',
    height: '500px',
    width: '35%',
  },
  saladImage: {
    position: 'absolute',
    top: '0px',
    right: '0px',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${saladBackgroundUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
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
})

interface Props extends WithStyles<typeof styles> {
  className?: string
  demandedHardwarePerformanceList?: DemandedHardwarePerformance[]
  onLoginClick: () => void
  onCloseClick: () => void
  onContinuesClick: () => void
}

const _GetNotifiedDemandChangesModal = ({
  classes,
  demandedHardwarePerformanceList,
  onLoginClick,
  onCloseClick,
  onContinuesClick,
}: Props) => {
  const demandHardwareOptions = demandedHardwarePerformanceList?.map((demandHardware) => ({
    label: demandHardware.name,
    value: demandHardware.name,
  }))

  return (
    <ModalWithOverlay onCloseClick={onCloseClick}>
      <div className={classes.modalWrapper}>
        <div className={classes.saladImageWrapper}>
          <div className={classes.saladImage} />
        </div>
        <div className={classes.modalContent}>
          <h1 className={classes.title}>Get Notified Of Demand Changes</h1>
          <p className={classes.description}>
            You can set up alerts to be notified when the demand level of a GPU reaches your sweet spot, even at a
            specific priority tier.
          </p>
          <div>
            <h2 className={classes.subtitle}>Already have an account?</h2>
            <p className={classes.description}>
              Setting up alerts is easier and more powerful while{' '}
              <span onClick={onLoginClick} className={classes.link}>
                logged in
              </span>
            </p>
          </div>
          <h2 className={classes.subtitle}>Not yet a chef? No problem!</h2>
          <p className={classes.description}>
            No need to create an account, simply select the GPU you wish to get alerts for and click continue.
          </p>
          <div className={classes.controlsWrapper}>
            <div className={classes.dropdownWrapper}>
              <div className={classes.dropdown}>
                {demandHardwareOptions && <DropdownLight options={demandHardwareOptions} />}
              </div>
            </div>
            <div className={classes.continueButtonWrapper}>
              <Button variant="secondary" onClick={onContinuesClick} label="Continue" width={100} />
            </div>
          </div>
        </div>
      </div>
    </ModalWithOverlay>
  )
}

export const GetNotifiedDemandChangesModal = withStyles(styles)(_GetNotifiedDemandChangesModal)
