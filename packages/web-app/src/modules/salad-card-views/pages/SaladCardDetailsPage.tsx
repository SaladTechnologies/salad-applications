import { Button, Layout, Modal, Text } from '@saladtechnologies/garden-components'
import { Lock, RefreshCcw, Search } from '@saladtechnologies/garden-icons'
import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { clearInterval, setInterval } from 'timers'
import { Head } from '../../../components'
import { currencyFormatter } from '../../../formatters'
import type { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import { SaladCardFullView } from '../components/SaladCardFullView'
import { SaladCardProtectedView } from '../components/SaladCardProtectedView'

const styles = (theme: SaladTheme) => ({
  page: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    color: theme.darkBlue,
    flex: 1,
  },
  parentContainer: {
    maxWidth: 688,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  mb48: {
    marginBottom: 48,
  },
  mb12: {
    marginBottom: 12,
  },
  ml24: {
    marginLeft: 24,
  },
  link: {
    color: theme.darkBlue,
    cursor: 'pointer',
  },
  fullSaladCardContainer: {
    text: 'center',
  },
  saladCardFullViewContainer: {
    height: 160,
  },
  errorMessageContainer: {
    color: theme.red,
  },
})

export interface SaladCardDetailsPageProps extends WithStyles<typeof styles> {
  hasSaladCard: boolean
  handleLockSaladCard: () => void
  lockSaladCardErrorMessage?: string
  isLockSaladCardLoading: boolean
  handleReplaceSaladCard: () => void
  replaceSaladCardErrorMessage?: string
  isReplaceSaladCardLoading: boolean
  saladCardBalance?: number
  handleLoadSaladBalance: () => void
  handleLoadSaladCard: () => void
  handleRouteToStore: () => void
  lastFourSaladCardDigits?: string
  saladCardEmbededUrl?: string
  isSaladCardEmbededUrlLoading: boolean
  saladCardEmbededUrlErrorMessage?: string
  handleLoadSaladCardEmbededUrl: () => void
}

const _SaladCardDetailsPage = ({
  classes,
  saladCardBalance,
  handleLoadSaladCard,
  hasSaladCard,
  handleRouteToStore,
  handleLockSaladCard,
  lockSaladCardErrorMessage,
  isLockSaladCardLoading,
  handleReplaceSaladCard,
  replaceSaladCardErrorMessage,
  isReplaceSaladCardLoading,
  handleLoadSaladBalance,
  lastFourSaladCardDigits,
  handleLoadSaladCardEmbededUrl,
  saladCardEmbededUrl,
  isSaladCardEmbededUrlLoading,
  saladCardEmbededUrlErrorMessage,
}: SaladCardDetailsPageProps) => {
  useEffect(() => {
    handleLoadSaladCard()
    handleLoadSaladBalance()
    !hasSaladCard && handleRouteToStore()
  }, [handleLoadSaladCard, handleLoadSaladBalance, handleRouteToStore, hasSaladCard, handleLoadSaladCardEmbededUrl])

  const [viewFullSaladCardModal, setViewFullSaladCardModal] = useState<boolean>(false)
  let intervalId: NodeJS.Timer

  const handleCloseSaladCardModalAfterFiveMinutes = () => {
    clearInterval(intervalId)
    intervalId = setInterval(() => setViewFullSaladCardModal(false), 300000)
  }

  const handleOpenFullViewSaladCardModal = () => {
    setViewFullSaladCardModal(true)
    handleLoadSaladCardEmbededUrl()
    handleCloseSaladCardModalAfterFiveMinutes()
  }

  const handleCloseFullViewSaladCardModal = () => {
    setViewFullSaladCardModal(false)
    clearInterval(intervalId)
  }

  return (
    <div className={classes.page}>
      <Scrollbars>
        <Layout title="SaladCard">
          <Head title="SaladCard" />
          <div className={classes.parentContainer}>
            <div>
              <SaladCardProtectedView lastFourSaladCardDigits={lastFourSaladCardDigits} />
            </div>
            <div className={classes.ml24}>
              <div>
                <Text variant="baseXL">Current Balance</Text>
              </div>
              <div className={classes.mb12}>
                <Text variant="headline">{currencyFormatter.format(saladCardBalance ?? 0)} </Text>
              </div>
              <div className={classes.mb12}>
                <Button
                  leadingIcon={<Lock />}
                  label="Lock SaladCard"
                  onClick={handleLockSaladCard}
                  isLoading={isLockSaladCardLoading}
                  errorMessage={lockSaladCardErrorMessage}
                />
              </div>
              <div className={classes.mb12}>
                <Button
                  leadingIcon={<RefreshCcw />}
                  label="Replace SaladCard"
                  onClick={handleReplaceSaladCard}
                  isLoading={isReplaceSaladCardLoading}
                  errorMessage={replaceSaladCardErrorMessage}
                />
              </div>
              <div className={classes.mb12}>
                <Button
                  leadingIcon={<Search />}
                  label="View Full SaladCard"
                  onClick={() => handleOpenFullViewSaladCardModal()}
                />
              </div>
            </div>
          </div>
        </Layout>
      </Scrollbars>
      {viewFullSaladCardModal && (
        <Modal onClose={() => handleCloseFullViewSaladCardModal()} title={'SaladCard'}>
          <SaladCardFullView
            isSaladCardEmbededUrlLoading={isSaladCardEmbededUrlLoading}
            saladCardEmbededUrl={saladCardEmbededUrl}
            saladCardEmbededUrlErrorMessage={saladCardEmbededUrlErrorMessage}
          />
        </Modal>
      )}
    </div>
  )
}

export const SaladCardDetailsPage = withLogin(withStyles(styles)(_SaladCardDetailsPage))
