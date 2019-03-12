import React, { CSSProperties, Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { Machine } from '../../machine/models'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { InfoButton } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    userSelect: 'none',
  },
  title: {
    fontFamily: 'SharpGroteskLight25',
    fontSize: theme.small,
    letterSpacing: '1.9px',
    color: theme.offWhite,
  },
  caretButton: {
    color: theme.offWhite,
    padding: '.5rem .5rem .5rem 1rem',
    display: 'inline-block',
    width: '.5rem',
    cursor: 'pointer',
  },
  machine: {
    padding: '0.25em',
    height: '100%',
    color: theme.lightGreen,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  machineList: {
    width: '12rem',
    padding: '0 .5rem .5rem',
  },
  machineName: {
    fontFamily: 'SharpGroteskLight25',
    fontSize: theme.small,
    fontWeight: 700,
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

interface Props extends WithStyles<typeof styles> {
  machines?: Machine[]
  style?: CSSProperties
}

interface State {
  open: boolean
}

class _MachineSummary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  toggleOpen = () => {
    this.setState({
      open: !this.state.open,
    })
  }

  render() {
    const { machines, style, classes } = this.props
    const { open } = this.state
    return (
      <div className={classes.container} style={style}>
        <span className={classes.caretButton} onClick={this.toggleOpen}>
          {open && <FontAwesomeIcon icon={faCaretDown} />}
          {!open && <FontAwesomeIcon icon={faCaretRight} />}
        </span>
        <span className={classes.title}>MY MACHINES</span>
        <InfoButton
          text={'When machines are viewed, some balance discrepancies may be visible until the two machines sync.'}
        />
        {open && (
          <div className={classes.machineList}>
            {machines &&
              machines.map(m => (
                <div key={m.name} className={classes.machine}>
                  <span className={classes.machineName}>{m.name}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    )
  }
}

export const MachineSummaryView = withStyles(styles)(_MachineSummary)
