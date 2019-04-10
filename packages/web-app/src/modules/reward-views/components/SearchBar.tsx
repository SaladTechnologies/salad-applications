import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { ChangeEvent } from 'react'

const styles = (theme: SaladTheme) => ({
  container: {
    userSelect: 'none',
  },
  innerContainer: {
    display: 'inline-flex',
    borderBottom: `2px solid ${theme.lightGreen}`,
    paddingBottom: '.25rem',
    flexWrap: 'nowrap',
    alignItems: 'baseline',
  },
  icon: {
    marginRight: '.5rem',
    color: theme.lightGreen,
    height: '9px',
  },
  textInput: {
    fontFamily: 'sharpGroteskLight25',
    fontSize: theme.small,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    letterSpacing: '1px',
    userSelect: 'none',
    width: '136px', //This is used to drive the width of the entire search bar
    color: theme.lightGreen,
    '&::placeholder': {
      opacity: 0.5,
      color: theme.lightGreen,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
  onTextEntered?: (txt: string) => void
  className?: string
}

class _SearchBar extends Component<Props> {
  handleTextEntry = (event: ChangeEvent<HTMLInputElement>) => {
    const { onTextEntered } = this.props
    if (onTextEntered != null) {
      onTextEntered(event.target.value)
    }
  }
  render() {
    const { text, className, classes } = this.props

    return (
      <div className={classnames(classes.container, className)}>
        <div className={classnames(classes.innerContainer)}>
          <FontAwesomeIcon className={classes.icon} icon={faSearch} />
          <input
            className={classes.textInput}
            type="text"
            value={text}
            placeholder="SEARCH"
            onChange={this.handleTextEntry}
          />
        </div>
      </div>
    )
  }
}

export const SearchBar = withStyles(styles)(_SearchBar)
