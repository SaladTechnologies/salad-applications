import type { ReactNode } from 'react'
import { Component } from 'react'
import { Img } from 'react-image'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ModalPage } from '../../../components'
import saladPayLogo from '../assets/saladpay.png'

const styles = {
  container: {
    width: 516,
    minHeight: 100,
    maxHeight: 462,
    background: '#FFFFFF',
    border: '1px solid #0A2133',
    borderRadius: 5,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    borderBottom: '1px solid #53A626',
    paddingBottom: 20,
    marginBottom: 30,
  },
  logo: {
    height: 26,
    width: 'auto',
  },
  content: {
    overflow: 'hidden',
  },
}

interface Props extends WithStyles<typeof styles> {
  onClose?: () => void
  children?: ReactNode
}

class _SaladPayPage extends Component<Props> {
  public override render(): ReactNode {
    const { onClose, classes, children } = this.props

    return (
      <ModalPage onCloseClicked={onClose}>
        <div className={classes.container}>
          <div className={classes.header}>
            <Img className={classes.logo} src={saladPayLogo} alt="" />
          </div>
          <div className={classes.content}>{children}</div>
        </div>
      </ModalPage>
    )
  }
}

export const SaladPayPage = withStyles(styles)(_SaladPayPage)
