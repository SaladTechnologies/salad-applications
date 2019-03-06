import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const styles = (theme: SaladTheme) => ({
  container: {
    width: '1rem',
    height: '1rem',
    borderWidth: '1px',
    borderColor: theme.offWhite,
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  checkmark: {
    color: theme.offWhite,
    position: 'absolute',
  },
})

interface Props extends WithStyles<typeof styles> {
  checked?: boolean
  onClick?: () => void
}

class _Checkbox extends Component<Props> {
  handleClick = () => {
    const { onClick } = this.props
    if (onClick != null) {
      onClick()
    }
  }
  render() {
    const { checked, classes } = this.props
    return (
      <div className={classes.container} onClick={this.handleClick}>
        {checked && <FontAwesomeIcon size="xs" className={classes.checkmark} icon={faCheck} />}
      </div>
    )
  }
}

export const Checkbox = withStyles(styles)(_Checkbox)
