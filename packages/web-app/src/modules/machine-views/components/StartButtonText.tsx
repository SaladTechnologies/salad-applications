import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    textAlign: 'right',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    whiteSpace: 'noWrap',
    color: theme.lightGreen,
    letterSpacing: '1.5px',
  },
  title: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: 11,
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  valueText: {
    fontFamily: theme.fontGroteskLight09,
    color: theme.green,
    fontSize: theme.xLarge,
    marginTop: -6,
    marginBottom: -2,
  },
})

export interface StartButtonTextOption {
  title: string
  value: string
}

interface Props extends WithStyles<typeof styles> {
  textOptions?: StartButtonTextOption[]
}

interface State {
  currentIndex: number
}

class _StartButtonText extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentIndex: 0,
    }
  }

  changeIndex = () => {
    let index = this.state.currentIndex + 1
    const { textOptions } = this.props

    if (textOptions === undefined || index >= textOptions.length) {
      index = 0
    }

    this.setState({
      currentIndex: index,
    })
  }

  render() {
    const { textOptions, classes } = this.props
    const { currentIndex } = this.state

    if (textOptions === undefined) return null

    let currentOption = textOptions[currentIndex]
    return (
      <div className={classes.container}>
        <div className={classes.title} onClick={this.changeIndex}>
          {currentOption.title}
        </div>
        <div className={classes.valueText}>{currentOption.value}</div>
      </div>
    )
  }
}

export const StartButtonText = withStyles(styles)(_StartButtonText)
