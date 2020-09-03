import classnames from 'classnames'
import { Observer } from 'mobx-react'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import { PluginInfo } from '../../salad-bowl/models/PluginInfo'

const styles = (theme: SaladTheme) => ({
  container: {
    padding: 10,
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  firstColumn: {
    flex: '2 1',
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: '1 1',
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  titleRow: {
    color: theme.mediumGreen,
    fontFamily: theme.fontGroteskBook25,
    fontSize: 10,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  contentRow: {
    color: theme.green,
    fontFamily: theme.fontGroteskLight09,
    fontSize: 48,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
})

interface Props extends WithStyles<typeof styles> {
  currentPlugin?: PluginInfo
}

class _MinerList extends Component<Props> {
  render() {
    const { currentPlugin, classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classnames(classes.row, classes.titleRow)}>
          <div className={classes.firstColumn}>Name</div>
          <div className={classes.column}>Version</div>
          <div className={classes.column}>Algorithm</div>
        </div>

        <Observer>
          {() => (
            <div className={classnames(classes.row, classes.contentRow)}>
              <div className={classes.firstColumn}>{currentPlugin?.name || '-'}</div>
              <div className={classes.column}>{currentPlugin?.version || '-'}</div>
              <div className={classes.column}>{currentPlugin?.algorithm || '-'}</div>
            </div>
          )}
        </Observer>
      </div>
    )
  }
}

export const MinerList = withStyles(styles)(_MinerList)
