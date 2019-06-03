import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'

const styles = (theme: SaladTheme) => ({
    test: {
        color: 'red'
    }
})

class _SmartStart extends Component<WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props
        return (
            <>
                <h1 className={classes.test}>Smart Start</h1>
            </>
        )
    }
}

export const SmartStart = withStyles(styles)(_SmartStart)
