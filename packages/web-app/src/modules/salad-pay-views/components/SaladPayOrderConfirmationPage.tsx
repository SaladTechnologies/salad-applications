import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classNames from 'classnames'
import { SaladPayPage } from '.'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    color: '#000000',
  },
  title: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
    lineSpacing: 1.5,
    textTransform: 'uppercase',
  },
  subTitle: {
    paddingTop: 8,
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 16,
  },
  leftText: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  balance: {
    fontFamily: theme.fontGroteskMedium25,
    fontSize: 18,
    color: theme.mediumGreen,
    paddingTop: 10,
  },
  button: {
    fontFamily: theme.fontGroteskBook25,
    fontSize: 12,
    backgroundColor: theme.mediumGreen,
    color: theme.lightGreen,
    textTransform: 'uppercase',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 218,
    height: 70,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.green,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  onClose?: () => void
}

class _SaladPayOrderConfirmationPage extends Component<Props> {
  handleClose = () => {
    const { onClose } = this.props

    if (onClose) {
      onClose()
    }
  }

  render() {
    const { onClose, classes } = this.props

    return (
      <SaladPayPage onClose={onClose}>
        <div className={classes.title}>Order Confirmed</div>
        <div className={classes.subTitle}>Your order is on the way</div>
        <div className={classes.row}>
          <div className={classes.leftText}></div>
          <div className={classNames(classes.button)} onClick={this.handleClose}>
            Close
          </div>
        </div>
      </SaladPayPage>
    )
  }
}

export const SaladPayOrderConfirmationPage = withStyles(styles)(_SaladPayOrderConfirmationPage)
