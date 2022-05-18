import { Button, Checkbox, Layout, Text } from '@saladtechnologies/garden-components'
import { useEffect } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'

const styles = (theme: SaladTheme) => ({
  page: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    color: theme.darkBlue,
    flex: 1,
  },
  parentContainer: {
    width: 688,
  },
  mb48: {
    marginBottom: 48,
  },
  link: {
    color: theme.darkBlue,
    cursor: 'pointer',
  },
})

interface SaladCardEnrollmentPageProps extends WithStyles<typeof styles> {
  handleCreateSaladCard: () => void
  hasAcceptedTerms: boolean
  onToggleAccept: (accepted: boolean) => void
  isSubmitting: boolean
  hasSaladCard: boolean
  handleRouteToStore: () => void
  handleLoadSaladCard: () => void
}

const _SaladCardEnrollmentPage = ({
  classes,
  handleCreateSaladCard,
  hasAcceptedTerms,
  onToggleAccept,
  isSubmitting,
  hasSaladCard,
  handleRouteToStore,
  handleLoadSaladCard,
}: SaladCardEnrollmentPageProps) => {
  useEffect(() => {
    handleLoadSaladCard()
    hasSaladCard && handleRouteToStore()
  }, [handleLoadSaladCard, handleRouteToStore, hasSaladCard])
  return (
    <div className={classes.page}>
      <Scrollbars>
        <Layout title="SaladCard">
          <Head title="SaladCard" />
          <div className={classes.parentContainer}>
            <div className={classes.mb48}>
              <Text variant="baseL">SaladCard is the easiest way to spend your balance on your favorite sites</Text>
            </div>
            <div className={classes.mb48}>
              <Text variant="baseXL">What is SaladCard?</Text>
            </div>
            <div className={classes.mb48}>
              <Text variant="baseL">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.{' '}
              </Text>
            </div>
            <div className={classes.mb48}>
              <Text variant="baseXL">How does it work? </Text>
            </div>
            <div className={classes.mb48}>
              <Text variant="baseL">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.{' '}
              </Text>
            </div>
            <div className={classes.mb48}>
              <Checkbox onChange={onToggleAccept} checked={hasAcceptedTerms}>
                <Text variant="baseM">
                  I agree to the SaladCard{' '}
                  <a
                    className={classes.link}
                    href="https://salad.com/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service,
                  </a>{' '}
                  <a
                    className={classes.link}
                    href="https://salad.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cardholder Policy,
                  </a>
                  {' and '}
                  <a
                    className={classes.link}
                    href="https://salad.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </Text>
              </Checkbox>
            </div>
            <div className={classes.mb48}>
              <Button
                onClick={handleCreateSaladCard}
                disabled={!hasAcceptedTerms}
                isLoading={isSubmitting}
                label="Get SaladCard"
              />
            </div>
          </div>
        </Layout>
      </Scrollbars>
    </div>
  )
}

export const SaladCardEnrollmentPage = withLogin(withStyles(styles)(_SaladCardEnrollmentPage))
