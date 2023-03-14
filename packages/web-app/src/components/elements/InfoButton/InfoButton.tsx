import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'
import i from './assets/i.svg'

const styles = (theme: SaladTheme) => ({
  infoButton: {
    color: theme.lightGreen,
    cursor: 'help',
    height: 18,
    width: 18,
    position: 'relative',
  },
})

interface Props extends WithStyles<typeof styles> {
  className?: string
  text?: string
}

class _InfoButton extends Component<Props> {
  public override render(): ReactNode {
    const { text, className, classes } = this.props
    return (
      <>
        <div className={classnames(classes.infoButton, className)} data-rh={text}>
          <img height={'auto'} width={'100%'} src={i} alt="" />
        </div>
      </>
    )
  }
}

export const InfoButton = withStyles(styles)(_InfoButton)
