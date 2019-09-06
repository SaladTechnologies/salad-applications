import React, { Component } from 'react'
import { SaladTheme } from '../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { EditUsernameContainer } from '../settings-views/account-views/EditUsernameContainer';

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: '2rem',
  },
  column: {
    flexGrow: 1,
    flexBasis: 0,
    marginRight: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
})

interface Props extends WithStyles<typeof styles> {
  
}

class _ProfileSettingsPage extends Component<Props> {
  render() {
    // const { classes } = this.props

    return (
      <div >
        <EditUsernameContainer/>
      </div>
    )
  }
}

export const ProfileSettingsPage = withStyles(styles)(_ProfileSettingsPage)
