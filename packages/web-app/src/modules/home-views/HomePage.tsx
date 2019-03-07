import React, { Component } from 'react'
import { SaladTheme } from '../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { ExperienceBarContainer, SlicedVeggieContainer } from '../xp-views'
import { RewardListContainer, RewardFilterContainer, SelectedRewardContainer } from '../reward-views'
import { RefreshService } from '../data-refresh'
import { getStore } from '../../Store'
import { BottomBarContainer } from './BottomBarContainer'
import { RewardModal } from '../reward-views'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.appBackgroundColor,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    overflow: 'hidden',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flex: 'none',
  },
  main: {
    flex: 'auto',
    display: 'flex',
  },
  mainColumn: {
    display: 'flex',
    overflow: 'hidden',
  },
  footer: {
    flex: 'none',
  },
})

class _HomePage extends Component<WithStyles<typeof styles>> {
  refreshService: RefreshService

  constructor(props: any) {
    super(props)
    let store = getStore()
    this.refreshService = new RefreshService(store)
  }

  componentDidMount() {
    this.refreshService.start()
  }

  componentWillUnmount() {
    this.refreshService.stop()
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <RewardModal />
        <div className={classes.header}>
          <div style={{ height: '50px' }} />
        </div>

        <div className={classes.main}>
          <div style={{ flexGrow: 1 }} className={'columns is-mobile'}>
            <div className={'column columns is-mobile'}>
              <div className={classnames(classes.mainColumn, 'column is-narrow')}>
                <ExperienceBarContainer />
              </div>
              <div className={classnames(classes.mainColumn, 'column')}>
                <SlicedVeggieContainer />
              </div>
            </div>

            <div className={classnames(classes.mainColumn, 'column')}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <SelectedRewardContainer />
                <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                  <RewardFilterContainer />
                  <RewardListContainer />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.footer}>
          <BottomBarContainer />
        </div>
      </div>
    )
  }
}

export const HomePage = withStyles(styles)(_HomePage)
