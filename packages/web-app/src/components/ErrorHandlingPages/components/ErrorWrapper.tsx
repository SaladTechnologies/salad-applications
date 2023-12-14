import type { FunctionComponent, ReactElement } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import ErrorBoundaryImage from '../assets/ErrorBoundaryImage.png'

const styles = (theme: SaladTheme) => ({
  modal: {
    display: 'flex',
    flexDirection: 'row-reverse',
    width: '110vmin',
    height: '50vmin',
  },
  page: {
    alignItems: 'center',
    background: 'linear-gradient(124deg, #0A2133 55.6%, #3CC 145.45%)',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0,
  },
  errorBoundaryImage: {
    maxWidth: 560,
    height: 'auto',
    width: '100%',
  },
  textWrapper: {
    position: 'relative',
    right: '16%',
    top: '38%',
    maxHeight: '150px',
    maxWidth: '533px',
  },
  title: {
    fontFamily: 'Mallory',
    fontSize: '32px',
    lineHeight: '34px',
    color: theme.green,
    margin: 0,
    marginBottom: '24px',
  },
  description: {
    fontFamily: 'Mallory',
    fontSize: '16px',
    lineHeight: '24px',
    color: theme.white,
    margin: 0,
  },
})

interface ErrorWrapperProps extends WithStyles<typeof styles> {
  title: ReactElement | string
  description?: ReactElement | string
}

const _ErrorWrapper: FunctionComponent<ErrorWrapperProps> = ({ title, description, classes }) => (
  <div className={classes.page}>
    <div className={classes.modal}>
      <div className={classes.textWrapper}>
        <p className={classes.title}>{title}</p>
        <p className={classes.description}>{description}</p>
      </div>
      <img className={classes.errorBoundaryImage} src={ErrorBoundaryImage} alt="Salad Error Boundary" />
    </div>
  </div>
)

export const ErrorWrapper = withStyles(styles)(_ErrorWrapper)
