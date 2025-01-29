import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  btn: {
    border: '1px solid ' + theme.green,
    color: theme.green,
    display: 'inline-block',
    padding: '6px 12px',
    position: 'relative',
    textAlign: 'center',
    transition: 'background 600ms ease, color 600ms ease',
    userSelect: 'none',
    fontFamily: 'Mallory',
    fontSize: 16,
    minWidth: 50,
    lineHeight: '20px',
  },
  active: {
    backgroundColor: theme.green,
    color: theme.darkBlue,
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
  options: { name: string; action: () => void }[]
}

interface State {
  [key: string]: boolean
}

class _OldSegments extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public override componentDidMount() {
    const options = this.props.options
    options.forEach((option, index) => {
      this.setState({
        [option.name]: index === 0,
      })
    })
  }

  onSelect = (action: () => void, name: string) => {
    for (const [key] of Object.entries(this.state)) {
      this.setState({
        [key]: key === name,
      })
    }
    action()
  }

  public override render(): ReactNode {
    const { classes, options } = this.props
    return (
      <>
        {options.map((option, index) => (
          <label
            className={classnames(classes.btn, {
              [classes.active]: this.state[option.name],
              [classes.inactive]: !this.state[option.name],
            })}
            onClick={() => this.onSelect(option.action, option.name)}
            key={index}
          >
            {option.name}
          </label>
        ))}
      </>
    )
  }
}

export const OldSegments = withStyles(styles)(_OldSegments)
