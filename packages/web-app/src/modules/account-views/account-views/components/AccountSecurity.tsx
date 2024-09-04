import { faEye, faKey, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Text, TextField } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
import type CSS from 'csstype'
import moment from 'moment'
import { useEffect, useState, type FC } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { useMediaQuery } from 'react-responsive'
import { ErrorText, mobileSize } from '../../../../components'
import { SuccessText } from '../../../../components/primitives/content/SuccessText'
import type { EditPasskeyNameStatus, Passkey, RegisterPasskeyStatus } from '../../../passkey-setup'
import type { FormValues } from './Account'

const styles: () => Record<string, CSS.Properties> = () => ({
  accountSecurityWrapper: {
    flex: 1,
    marginTop: '32px',
    maxWidth: '400px',
  },
  accountSecurityContent: {
    paddingTop: '32px',
  },
  passkeysDescription: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  passkeysSectionWrapper: {
    width: '100%',
  },
  backupCodesSectionWrapper: {
    paddingTop: '32px',
    width: '100%',
  },
  buttonIcon: {
    position: 'relative',
    top: '-3px',
  },
  sectionHeader: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '14px',
  },
  sectionTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '150px',
  },
  passkeysList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  passkeysListItem: {
    marginTop: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  passkeyIcon: {
    cursor: 'pointer',
    marginRight: '5px',
  },
  passkeyNameWrapper: {
    width: '200px',
    height: '30px',
    overflow: 'hidden',
  },
  passkeyName: {
    display: 'block',
    width: '100%',
    height: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    alignItems: 'center',
    paddingTop: '6px',
    boxSizing: 'border-box',
  },
  messageWrapper: {
    position: 'relative',
    width: '100%',
    opacity: 0,
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'column',
    transition: '1s ease',
  },
  messageWrapperVisible: {
    position: 'relative',
    width: '100%',
    opacity: 1,
  },
  passkeyButtonWrap: {
    position: 'relative',
  },
})

const passkeysAmountLimit = 30

interface Props extends WithStyles<typeof styles> {
  editPasskeyNameStatus: EditPasskeyNameStatus
  passkeys: Passkey[]
  registerPasskeyStatus: RegisterPasskeyStatus
  withBackupCodes: boolean
  editPasskeyName: (passkeyId: string, passkeyName: string) => void
  onAddPasskeyClick: () => void
  onDeletePasskeyClick: (passkeyId: string) => void
  onViewBackupCodesClick: () => void
  fetchPasskeys: () => void
  setRegisterPasskeyStatus: (registerPasskeyStatus: RegisterPasskeyStatus) => void
}

const _AccountSecurity: FC<Props> = ({
  classes,
  editPasskeyNameStatus,
  passkeys,
  registerPasskeyStatus,
  withBackupCodes,
  editPasskeyName,
  onAddPasskeyClick,
  onDeletePasskeyClick,
  onViewBackupCodesClick,
  fetchPasskeys,
  setRegisterPasskeyStatus,
}) => {
  const [editPasskeyId, setEditPasskeyId] = useState<string | null>(null)

  const isEditPasskeyNameSuccess = editPasskeyNameStatus === 'success'
  const isEditPasskeyNameInactive = editPasskeyNameStatus === 'inactive'
  const isEditPasskeyNameSubmitting = editPasskeyNameStatus === 'submitting'

  const passkeysAmount = passkeys.length
  const isAddPasskeyAvailable = passkeysAmount < passkeysAmountLimit
  const isTabletOrMobile = useMediaQuery({ query: `(max-width: ${mobileSize}px)` })

  const withPasskeyAddSuccess = registerPasskeyStatus === 'success'
  const withPasskeyAddFailure = registerPasskeyStatus === 'failure'
  const withPasskeyMassage = withPasskeyAddSuccess || withPasskeyAddFailure

  const handleEditPasskeyIconClick = (passkeyId: string) => {
    if (passkeyId === editPasskeyId) {
      setEditPasskeyId(null)
    } else {
      setEditPasskeyId(passkeyId)
    }
  }

  const handleEditPasskeySubmit = (passkeyId: string, passkeyName?: string) => {
    if (passkeyName) {
      editPasskeyName(passkeyId, passkeyName?.trim())
    }
  }

  useEffect(() => {
    if (isEditPasskeyNameSuccess || isEditPasskeyNameInactive) {
      setEditPasskeyId(null)
    }
  }, [isEditPasskeyNameSuccess, isEditPasskeyNameInactive])

  useEffect(() => {
    fetchPasskeys()
    return () => setRegisterPasskeyStatus('unknown')
  }, [fetchPasskeys, setRegisterPasskeyStatus])

  return (
    <div className={classes.accountSecurityWrapper}>
      <Text variant="baseXL">Account Security</Text>
      <div className={classes.accountSecurityContent}>
        <Text variant="baseL">Passkeys</Text>
        <div className={classes.passkeysDescription}>
          <Text variant="baseS">
            Passkeys are a convenient and secure way to access your online accounts. They replace passwords and
            two-factor authentication codes and are quickly becoming the standard way to secure online accounts.
          </Text>
        </div>
        <div className={classNames(classes.messageWrapper, withPasskeyMassage && classes.messageWrapperVisible)}>
          {withPasskeyAddSuccess && <SuccessText>Success! Passkey Added</SuccessText>}
          {withPasskeyAddFailure && <ErrorText>There was an error setting up your passkey. Try again.</ErrorText>}
        </div>
        <div className={classes.passkeysSectionWrapper}>
          <div className={classes.sectionHeader}>
            <div className={classes.sectionTitle}>
              <Text variant="baseM">Your Passkeys</Text>
              <Text variant="baseXS">
                ({passkeysAmount}/{passkeysAmountLimit})
              </Text>
            </div>
            <div className={classes.passkeyButtonWrap}>
              {isAddPasskeyAvailable && (
                <Button
                  onClick={onAddPasskeyClick}
                  variant={isTabletOrMobile ? 'secondary' : 'primary'}
                  size="small"
                  label="Add a Passkey"
                  leadingIcon={<FontAwesomeIcon icon={faKey} className={classes.buttonIcon} />}
                />
              )}
            </div>
          </div>
          <div className={classes.passkeysList}></div>
          {passkeys.map((passkey) => {
            return (
              <div className={classes.passkeysListItem} key={passkey.id}>
                <div className={classes.passkeyNameWrapper}>
                  {passkey.id === editPasskeyId ? (
                    <TextField
                      isSubmitting={isEditPasskeyNameSubmitting}
                      isSubmitSuccess={isEditPasskeyNameSuccess}
                      validationRegexErrorMessage="Passkey Nickname must be between 2 - 120 characters!"
                      onSubmit={(data: FormValues) => handleEditPasskeySubmit(passkey.id, data.input)}
                      validationRegex={/^.{2,120}$/}
                      defaultValue={passkey.displayName}
                      height={30}
                    />
                  ) : (
                    <div title={passkey.displayName}>
                      <Text variant="baseS" className={classes.passkeyName}>
                        {passkey.displayName}
                      </Text>
                    </div>
                  )}
                </div>
                <Text variant="baseS">{moment(passkey.createdAt).format('MMMM DD, YYYY')}</Text>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className={classes.passkeyIcon}
                  onClick={() => handleEditPasskeyIconClick(passkey.id)}
                />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className={classes.passkeyIcon}
                  onClick={() => onDeletePasskeyClick(passkey.id)}
                />
              </div>
            )
          })}
        </div>
        {withBackupCodes && (
          <div className={classes.backupCodesSectionWrapper}>
            <div className={classes.sectionHeader}>
              <div className={classes.sectionTitle}>
                <Text variant="baseM">Backup Codes</Text>
              </div>
            </div>
            <Button
              onClick={onViewBackupCodesClick}
              variant={isTabletOrMobile ? 'secondary' : 'primary'}
              size="small"
              width={210}
              label="View Backup Codes"
              leadingIcon={<FontAwesomeIcon icon={faEye} className={classes.buttonIcon} />}
            />
            <div className={classes.passkeysDescription}>
              <Text variant="baseS">
                Backup codes are single-use codes that will allow you to take actions that would require your passkey
                when you don’t have access to your passkeys.
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const AccountSecurity = withStyles(styles)(_AccountSecurity)
