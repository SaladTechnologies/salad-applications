import { LoadingSpinner, Text } from '@saladtechnologies/garden-components'
import { FunctionComponent } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  errorMessageContainer: {
    color: theme.red,
  },
  mb12: {
    marginBottom: 12,
  },
  parentContainer: {
    text: 'center',
  },
  saladCardFullViewContainer: {
    height: 160,
  },
})

interface SaladCardFullViewProps extends WithStyles<typeof styles> {
  isSaladCardEmbededUrlLoading: boolean
  saladCardEmbededUrl?: string
  saladCardEmbededUrlErrorMessage?: string
}

const _SaladCardFullView: FunctionComponent<SaladCardFullViewProps> = ({
  classes,
  isSaladCardEmbededUrlLoading,
  saladCardEmbededUrl,
  saladCardEmbededUrlErrorMessage,
}) => {
  return (
    <div className={classes.parentContainer}>
      <div className={classes.mb12}>
        <div className={classes.saladCardFullViewContainer}>
          {isSaladCardEmbededUrlLoading ? (
            <LoadingSpinner variant="dark" size={50} />
          ) : (
            <iframe title="SaladCardFullView" src={saladCardEmbededUrl} />
          )}
          {saladCardEmbededUrlErrorMessage && (
            <div className={classes.errorMessageContainer}>
              <Text variant="baseM">{saladCardEmbededUrlErrorMessage}</Text>
            </div>
          )}
        </div>
      </div>
      <div>
        <Text variant="baseS">Note: For your safety, this modal will close after 5 minutes</Text>
      </div>
    </div>
  )
}

export const SaladCardFullView = withStyles(styles)(_SaladCardFullView)
