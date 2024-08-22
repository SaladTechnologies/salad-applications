import { Button, LoadingSpinner, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import moment from 'moment'
import { useEffect, type FC } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import Referrals from '../../../assets/Referrals.svg'
import { withLogin } from '../../auth-views'
import type { BackupCodes } from '../BackupCodesStore'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  pageWrapper: {
    backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
  },
  pageContent: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  leftSideWrapper: {
    position: 'relative',
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
  backupCodesWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '300px',
    height: '175px',
  },
  backupCodesContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  generateBackupCodesButtonWrapper: {
    marginTop: '24px',
    marginBottom: '24px',
  },
  backupCodeText: {
    marginRight: '0px',
  },
})

interface Props extends WithStyles<typeof styles> {
  backupCodes: BackupCodes
  onBackToProfileClick: () => void
  onGenerateNewBackupCodesClick: () => void
  getBackupCodes: () => void
}

const _BackupCodesPage: FC<Props> = ({
  classes,
  backupCodes,
  onBackToProfileClick,
  onGenerateNewBackupCodesClick,
  getBackupCodes,
}) => {
  useEffect(() => {
    getBackupCodes()
  }, [getBackupCodes])

  return (
    <Scrollbars>
      <div className={classes.pageWrapper}>
        <div className={classes.pageContent}>
          <Text className={classes.header} as="h1" variant="headline">
            Two-factor Backup Codes
          </Text>
          <Text className={classes.description} variant="baseL">
            Backup codes are single-use codes that will allow you to take actions that would require your passkey when
            you don’t have access to your passkey
          </Text>
          <Text className={classes.description} variant="baseL">
            Keep them saved or stored somewhere secure.
          </Text>
          <Text className={classes.description} variant="baseL">
            Codes Generated on: {moment(backupCodes?.createdAt).format('MMMM DD, YYYY')}
          </Text>
          <div className={classes.backupCodesWrapper}>
            {backupCodes?.codes ? (
              <div className={classes.backupCodesContent}>
                {backupCodes?.codes?.map((backupCode) => (
                  <Text className={classes.backupCodeText} variant="baseM">
                    {backupCode}
                  </Text>
                ))}
              </div>
            ) : (
              <div className={classes.loaderWrapper}>
                <LoadingSpinner variant="light" size={80} />
              </div>
            )}
          </div>
          <div className={classes.generateBackupCodesButtonWrapper}>
            <Button
              variant="primary-basic"
              size="small"
              label="Generate New Backup Codes"
              onClick={onGenerateNewBackupCodesClick}
            />
          </div>
          <Text className={classes.description} variant="baseL">
            When you generate new codes your previous codes will not work anymore. Be sure to save or store the new
            codes in a secure location.
          </Text>
          <Button variant="primary-basic" label="Back to Profile" onClick={onBackToProfileClick} width={150} />
        </div>
        <div className={classes.image} />
      </div>
    </Scrollbars>
  )
}

export const BackupCodesPage = withLogin(withStyles(styles)(_BackupCodesPage))
