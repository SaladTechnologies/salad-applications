import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../SaladTheme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { ChangeEvent } from 'react'

const styles = (theme: SaladTheme) => ({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 100,
    display: 'inline-flex',
    padding: '10px 10px 10px 5px',
    flexWrap: 'nowrap',
    alignItems: 'baseline',
    color: theme.lightGreen,
    backgroundColor: `${theme.darkBlue}CC`,
  },
  icon: {
    margin: 5,
    height: 10,
  },
  textInput: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: 12,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    letterSpacing: 1,
    color: theme.lightGreen,
    paddingBottom: 5,
    borderBottom: `1px solid ${theme.lightGreen}`,
    opacity: 1,
    width: 200, //This is used to drive the width of the entire search bar
    '&::placeholder': {
      opacity: 0.5,
      color: theme.lightGreen,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  text?: string
  onTextEntered?: (txt: string) => void
}

class _SearchBar extends Component<Props> {
  handleTextEntry = (event: ChangeEvent<HTMLInputElement>) => {
    const { onTextEntered } = this.props
    if (onTextEntered != null) {
      onTextEntered(event.target.value)
    }
  }
  render() {
    const { text, classes } = this.props

    return (
      <div className={classnames(classes.container)}>
        <FontAwesomeIcon className={classes.icon} icon={faSearch} />
        <input
          className={classes.textInput}
          type="text"
          value={text}
          placeholder="SEARCH"
          onChange={this.handleTextEntry}
        />
      </div>
    )
  }
}

export const SearchBar = withStyles(styles)(_SearchBar)
