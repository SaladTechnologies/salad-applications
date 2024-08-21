import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import moment from 'moment'
import { type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import Referrals from '../../../assets/Referrals.svg'
import { withLogin } from '../../auth-views'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  pageWrapper: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    overflow: 'scroll',
    width: '100%',
  },
  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'left',
    marginTop: '82px',
    marginLeft: '40px',
    boxSizing: 'border-box',
    width: '50%',
    '@media (max-width: 812px)': {
      padding: '16px',
      marginTop: '0px',
      marginLeft: '0px',
      width: '100%',
    },
  },
  header: {
    color: theme.lightGreen,
    marginBottom: '0px !important',
    margin: '0px',
    '@media (max-width: 812px)': {
      lineHeight: '44px',
      fontSize: theme.xLarge,
      margin: '0px',
      paddingBottom: '16px',
    },
  },
  description: {
    maxWidth: '400px',
    marginBottom: '24px',
  },
  image: {
    position: 'relative',
    width: '50%',
    height: '100%',
    backgroundImage: `url(${Referrals})`,
    backgroundRepeat: 'no-repeat',
    '@media (max-width: 812px)': {
      display: 'none',
    },
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
  <Scrollbars>
    <div className={classes.pageWrapper}>
      <div className={classes.pageContent}>
        <Text className={classes.header} as="h1" variant="headline">
          Two-factor Backup Codes
        </Text>
        <Text className={classes.description} variant="baseL">
          Backup codes are single-use codes that will allow you to take actions that would require your passkey when you
          don’t have access to your passkey
        </Text>
        <Text className={classes.description} variant="baseL">
          Keep them saved or stored somewhere secure.
        </Text>
        <Text className={classes.description} variant="baseL">
          Codes Generated on: {moment().format('MMMM DD, YYYY')}
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
          When you generate new codes your previous codes will not work anymore. Be sure to save or store the new codes
          in a secure location.
        </Text>
        <Button variant="primary-basic" label="Back to Profile" onClick={onBackToProfileClick} width={150} />
      </div>
      <div className={classes.image} />
    </div>
  </Scrollbars>
)

export const RecoveryCodesPage = withLogin(withStyles(styles)(_RecoveryCodesPage))
