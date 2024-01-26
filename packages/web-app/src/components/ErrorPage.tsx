import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Modal, ModalPage } from '.'
import type { SaladTheme } from '../SaladTheme'

const styles = (theme: SaladTheme) => ({
  contentContainer: {
    color: theme.darkBlue,
    textAlign: 'center',
    padding: '0 3rem',
  },
  title: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: theme.xLarge,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    paddingBottom: '1rem',
    whiteSpace: 'nowrap',
  },
  description: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: theme.small,
  },
  bugButton: {
    display: 'inline-block',
    padding: '.25rem 1rem',
    backgroundColor: theme.darkBlue,
    color: theme.green,
    marginLeft: '1rem',
    fontFamily: theme.fontGroteskLight25,
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
  public override render(): ReactNode {
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
