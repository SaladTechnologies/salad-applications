
import classnames from 'classnames'
import React, { Component } from 'react'
// Packages
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  btn: {
    border: '1px solid ' + theme.lightGreen,
    color: theme.lightGreen,
    display: 'inline-block',
    padding: '6px 2px',
    position: 'relative',
    textAlign: 'center',
    transition: 'background 600ms ease, color 600ms ease',
    userSelect: 'none',
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.small,
    textTransform: 'uppercase',
    minWidth: 50,
    lineHeight: '20px',
  },
  active: {
    backgroundColor: theme.mediumGreen,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    cursor: 'default',
    transition: 'color 200ms',
  },
  inactive: {
    cursor: 'pointer',
  },
  disabled: {
    boxShadow: 'none',
    opacity: 0.5,
    color: theme.lightGreen,
    cursor: 'not-allowed',
  },
})

interface Props extends WithStyles<typeof styles> {
  options: { name: string, action: () => void }[]
}

interface State {
  [key: string]: boolean
}

class _Segments extends Component<Props, State> {
  state = {}

  componentDidMount() {
    const options = this.props.options
    options.forEach((option, index) => {
      this.setState({
        [option.name]: index === 0
      })
    })
  }

  onSelect = (action: () => void, name: string) => {
    for (const [key] of Object.entries(this.state)) {
      this.setState({
        [key]: key === name
      })
    }
    action();
  }

  render() {
    const { classes, options } = this.props
    return (
      <>
        {options.map((option, index) =>
          <label
            className={classnames(classes.btn, {
              // @ts-ignore
              [classes.active]: this.state[option.name],
              // @ts-ignore
              [classes.inactive]: !this.state[option.name]
            })}
            onClick={() => this.onSelect(option.action, option.name)}
            key={index}
          >
            {option.name}
          </label>
        )}
      </>
    )
  }
}

export const Segments = withStyles(styles)(_Segments)
