import { Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { FunctionComponent, ReactElement } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import ErrorBoundaryImage from '../assets/ErrorBoundaryImage.png'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  page: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(124deg, #0A2133 55.6%, #3CC 145.45%)',
  },
  pageContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBoundaryImage: {
    maxWidth: '56%',
  },
  textWrapper: {
    position: 'relative',
    right: '18%',
    maxWidth: '533px',
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
  },
  title: {
    color: theme.green,
  },
  description: {
    color: theme.white,
    marginTop: '24px',
  },
})

interface ErrorWrapperProps extends WithStyles<typeof styles> {
  title: ReactElement | string
  description?: ReactElement | string
}

const _ErrorWrapper: FunctionComponent<ErrorWrapperProps> = ({ title, description, classes }) => (
  <div className={classes.page}>
    <div className={classes.pageContent}>
      <img className={classes.errorBoundaryImage} src={ErrorBoundaryImage} alt="Salad Error Boundary" />
      <div className={classes.textWrapper}>
        <Text className={classes.title} variant="baseXXL">
          {title}
        </Text>
        <Text className={classes.description} variant="baseM">
          {description}
        </Text>
      </div>
    </div>
  </div>
)

export const ErrorWrapper = withStyles(styles)(_ErrorWrapper)
