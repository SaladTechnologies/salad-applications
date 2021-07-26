import { Component, ReactNode } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Modal, ModalPage } from '.'
import { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  contentContainer: {
    color: theme.darkBlue,
    textAlign: 'center',
    padding: '0 3rem',
  },
  title: {
    fontFamily: 'SharpGroteskLight09',
    fontSize: theme.xLarge,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    paddingBottom: '1rem',
    whiteSpace: 'nowrap',
  },
  description: {
    fontFamily: 'sharpGroteskBook19',
    fontSize: theme.small,
  },
  bugButton: {
    display: 'inline-block',
    padding: '.25rem 1rem',
    backgroundColor: theme.darkBlue,
    color: theme.green,
    marginLeft: '1rem',
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  title?: string
  children?: ReactNode
  modalWidth?: number
  onCloseClicked?: () => void
}

class _ErrorPage extends Component<Props> {
  render() {
    const { title, modalWidth, onCloseClicked, children, classes } = this.props

    return (
      <ModalPage onCloseClicked={onCloseClicked}>
        <Modal onCloseClicked={onCloseClicked} width={modalWidth}>
          <div className={classes.contentContainer}>
            <div className={classes.title}>{title}</div>
            <div className={classes.description}>{children}</div>
          </div>
        </Modal>
      </ModalPage>
    )
  }
}

export const ErrorPage = withStyles(styles)(_ErrorPage)
