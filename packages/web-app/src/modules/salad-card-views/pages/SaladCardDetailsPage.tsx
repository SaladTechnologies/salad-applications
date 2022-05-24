import { Button, Layout, Text } from '@saladtechnologies/garden-components'
import { Lock, RefreshCcw } from '@saladtechnologies/garden-icons'
import { useEffect } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { Img } from 'react-image'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'
import { currencyFormatter } from '../../../formatters'
import { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import saladCardPlaceHolderImage from '../assets/SaladCardPlaceHolderImage.png'

const styles = (theme: SaladTheme) => ({
  page: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    color: theme.darkBlue,
    flex: 1,
  },
  parentContainer: {
    width: 688,
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
})

interface SaladCardDetailsPageProps extends WithStyles<typeof styles> {
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
}: SaladCardDetailsPageProps) => {
  useEffect(() => {
    handleLoadSaladCard()
    handleLoadSaladBalance()
    !hasSaladCard && handleRouteToStore()
  }, [handleLoadSaladCard, handleLoadSaladBalance, handleRouteToStore, hasSaladCard])
  return (
    <div className={classes.page}>
      <Scrollbars>
        <Layout title="SaladCard">
          <Head title="SaladCard" />
          <div className={classes.parentContainer}>
            <div>
              <Img src={saladCardPlaceHolderImage} alt="Salad Card Image" />
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
            </div>
          </div>
        </Layout>
      </Scrollbars>
    </div>
  )
}

export const SaladCardDetailsPage = withLogin(withStyles(styles)(_SaladCardDetailsPage))
