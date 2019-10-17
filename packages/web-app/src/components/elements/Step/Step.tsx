import React, { Component } from 'react'

// Components
import { Cylon } from '../../animations'
import { AngledPanel } from '../../'

// Styles
import { styles } from './Step.styles'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  active: boolean
  complete: boolean
  label: string
}

class _Step extends Component<Props> {
  render() {
    const { active, complete, label, classes, children } = this.props

    const Child = <>{label ? <label className={classes.label}>{label}</label> : children}</>

    const disabled = (
      <div className={classnames(classes.step, classes.disabled)}>
        {Child}
      </div>
    )

    const enabled = (
      <div className={classnames(classes.step)}>
        {Child}
        <Cylon />
      </div>
    )

    const completed = (
      <div className={classnames(classes.step)}>
        <AngledPanel className={classnames(classes.completed)} leftSide="right" rightSide="right">
          {Child}
        </AngledPanel>
      </div>
    )

    let Element = null

    if (complete) {
      Element = completed
    } else if (active) {
      Element = enabled
    } else {
      Element = disabled
    }

    return Element
  }
}

export const Step = withStyles(styles)(_Step)
