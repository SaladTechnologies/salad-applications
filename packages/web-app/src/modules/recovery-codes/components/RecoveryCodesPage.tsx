import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import { type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import Referrals from '../../passkey-setup/components/assets/Referrals.svg'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  recoveryCodesPageWrapper: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  },
  recoveryCodesPageContent: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  },
  recoveryCodesPageLeftSide: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
    marginTop: '82px',
    paddingBottom: '160px',
    marginLeft: '40px',
    minWidth: '500px',
  },
  header: {
    color: theme.lightGreen,
    marginBottom: '0px',
  },
  description: {
    maxWidth: '400px',
    marginBottom: '24px',
  },
  image: {
    height: '100vh',
  },
  recoveryCodesWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    maxWidth: '300px',
    flexWrap: 'wrap',
  },
  generateRecoveryCodesButtonWrapper: {
    marginTop: '24px',
    marginBottom: '24px',
  },
  recoveryCodeText: {
    marginRight: '40px',
  },
})

interface Props extends WithStyles<typeof styles> {
  recoveryCodes: string[]
  onBackToProfileClick: () => void
  onGenerateNewRecoveryCodesClick: () => void
}

const _RecoveryCodesPage: FC<Props> = ({
  classes,
  recoveryCodes,
  onBackToProfileClick,
  onGenerateNewRecoveryCodesClick,
}) => (
  <div className={classes.recoveryCodesPageWrapper}>
    <Scrollbars>
      <div className={classes.recoveryCodesPageContent}>
        <div className={classes.recoveryCodesPageLeftSide}>
          <Text className={classes.header} as="h1" variant="headline">
            Two-factor Recovery Codes
          </Text>
          <Text className={classes.description} variant="baseL">
            Recovery codes are single-use codes that will allow you to login when you don’t have access to your
            passkeys. Keep them saved or stored somewhere secure.
          </Text>
          <Text className={classes.description} variant="baseL">
            These codes are the last resort authentication method for your account, if you lose them, you will not be
            able to access your account with 2FA.
          </Text>
          <div className={classes.recoveryCodesWrapper}>
            {recoveryCodes.map((recoveryCode) => (
              <Text className={classes.recoveryCodeText} variant="baseM">
                {recoveryCode}
              </Text>
            ))}
          </div>
          <div className={classes.generateRecoveryCodesButtonWrapper}>
            <Button
              variant="primary-basic"
              size="small"
              label="Generate New Recovery Codes"
              onClick={onGenerateNewRecoveryCodesClick}
            />
          </div>
          <Text className={classes.description} variant="baseL">
            When you generate new codes your previous codes will not work anymore. Be sure to save or store the new
            codes in a secure location.
          </Text>
          <Button variant="primary-basic" label="Back to Profile" onClick={onBackToProfileClick} />
        </div>
        <img className={classes.image} src={Referrals} alt="Referrals Background" />
      </div>
    </Scrollbars>
  </div>
)

export const RecoveryCodesPage = withLogin(withStyles(styles)(_RecoveryCodesPage))
