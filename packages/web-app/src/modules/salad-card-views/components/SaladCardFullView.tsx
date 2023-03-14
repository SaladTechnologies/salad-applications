import { LoadingSpinner, Text } from '@saladtechnologies/garden-components'
import classnames from 'classnames'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  errorMessageContainer: {
    color: theme.red,
  },
  mb12: {
    marginBottom: 12,
  },
  saladCardFullViewContainer: {
    height: 250,
  },
  centerAlign: {
    display: 'flex',
    justifyContent: 'center',
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
    <div>
      <div className={classes.mb12}>
        <div className={classnames(classes.saladCardFullViewContainer, classes.centerAlign)}>
          {isSaladCardEmbededUrlLoading ? (
            <LoadingSpinner variant="dark" size={50} />
          ) : (
            <iframe height={250} width={400} title="SaladCardFullView" src={saladCardEmbededUrl} />
          )}
          {saladCardEmbededUrlErrorMessage && (
            <div className={classes.errorMessageContainer}>
              <Text variant="baseM">{saladCardEmbededUrlErrorMessage}</Text>
            </div>
          )}
        </div>
      </div>
      <div className={classes.centerAlign}>
        <Text variant="baseS">Note: For your safety, this modal will close after 5 minutes</Text>
      </div>
    </div>
  )
}

export const SaladCardFullView = withStyles(styles)(_SaladCardFullView)
