import React, { Component } from 'react'
import { SaladTheme } from '../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

const styles = (theme: SaladTheme) => ({

})

class _SmartStart extends Component<WithStyles<typeof styles>> {

}

export const SmartStart = withStyles(styles)(_SmartStart)
