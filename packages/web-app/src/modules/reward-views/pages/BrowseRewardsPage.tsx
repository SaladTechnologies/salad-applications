import { Paging, Result } from '@elastic/react-search-ui'
import { Component } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import withStyles, { WithStyles } from 'react-jss'
import { P, Scrollbar } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { SearchResult } from '../../reward/models'
import { RewardDisclaimers } from '../components'
import { IconArrowLeft } from '../components/assets'
import LeftArrow from '../components/assets/pagination/left-arrow.svg'
import RightArrow from '../components/assets/pagination/right-arrow.svg'
import { RewardItem } from '../components/RewardItem'
import { rewardItemResponsive } from '../components/RewardSlider'
import { RewardFilterContainer } from '../RewardFilterContainer'

const styles = (theme: SaladTheme) => {
  let style = {
    container: {
      position: 'absolute',
      color: theme.lightGreen,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    columnContainer: {
      display: 'flex',
      flex: 1,
    },
    contentContainer: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    filterContainer: {
      flex: 1,
      padding: 20,
    },
    titleBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px 0px',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.5,
      },
    },
    backIcon: {
      width: 15,
      padding: 10,
    },
    titleText: {
      fontFamily: theme.fontGroteskBook19,
      fontSize: 24,
      textTransform: 'capitalize',
    },
    placeholderText: {
      paddingLeft: 20,
    },
    rewardContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    rewardRow: {
      backgroundColor: 'blue',
    },
    rewardItem: {
      flex: '0 0 25%',
      paddingBottom: 30,
      width: 0, //This is magic and somehow makes the flex work
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    pagination: {
      alignItems: 'center',
      display: 'flex',
      listStyle: 'none',
      paddingLeft: 0,
      fontFamily: theme.fontGroteskBook19,

      '& li': {
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: 10,
        opacity: 0.5,
        textAlign: 'center',
        outline: 'none',
      },

      '& .rc-pagination-prev': {
        display: 'flex',
        opacity: 1,

        '&:after': {
          background: `url(${LeftArrow})`,
          content: '""',
          width: 25,
          height: 25,
        },
      },

      '& .rc-pagination-next': {
        display: 'flex',
        opacity: 1,

        '&:after': {
          background: `url(${RightArrow})`,
          content: '""',
          width: 25,
          height: 25,
        },
      },

      '& .rc-pagination-item-active': {
        opacity: 1,
      },

      '& .rc-pagination-jump-prev, & .rc-pagination-jump-next': {
        '&:after': {
          content: '"..."',
          opacity: 0.5,
        },
      },

      '& .rc-pagination-disabled': {
        display: 'none',
      },
    },
  }

  let a = style as any

  for (let value of Object.values(rewardItemResponsive)) {
    a[`@media screen and (max-width:${value.breakpoint.max}px)`] = {
      rewardItem: { flex: `0 0 ${(1 / value.items) * 100}%` },
    }
  }

  return style
}

interface Props extends WithStyles<typeof styles> {
  title?: string
  error?: string
  results?: SearchResult[]
  onBack?: () => void
  onClickReward: (to: string, action?: Function) => void
}

class _BrowseRewardsPage extends Component<Props> {
  componentDidMount() {
    const paginationListItems = document.querySelectorAll('.rc-pagination > li')
    if (paginationListItems) {
      paginationListItems.forEach((listItem) => listItem.removeAttribute('title'))
    }
  }

  handleBack = () => {
    this.props.onBack?.()
  }

  render() {
    const { results, error, title, onClickReward, classes } = this.props
    const hasRewards = results && results.length > 0

    return (
      <div className={classes.container}>
        <div className={classes.titleBar}>
          <div className={classes.backButton} onClick={this.handleBack}>
            <div className={classes.backIcon}>
              <IconArrowLeft />
            </div>
            <div className={classes.titleText}>{title || 'Back'}</div>
          </div>
        </div>
        <div className={classes.columnContainer}>
          <div style={{ flex: 1 }}>
            <Scrollbar>
              <div className={classes.contentContainer}>
                {!hasRewards && error && <P className={classes.placeholderText}>Error Finding Rewards</P>}
                {!hasRewards && !error && <P className={classes.placeholderText}>No Rewards Found</P>}
                {hasRewards && (
                  <div>
                    <div className={classes.rewardContainer}>
                      {results?.map((x) => {
                        return (
                          <Result
                            key={x.id}
                            // This component assumes you pass the full 'raw' result in, we are
                            // faking this right now by populating the id
                            result={{
                              id: {
                                raw: x.id,
                              },
                            }}
                            shouldTrackClickThrough={true}
                            view={({ onClickLink, ...props }) => {
                              return (
                                <div className={classes.rewardItem}>
                                  <RewardItem {...props} reward={x} onClick={() => onClickReward(x.url, onClickLink)} />
                                </div>
                              )
                            }}
                          />
                        )
                      })}
                    </div>
                    <div className={classes.paginationContainer}>
                      <Paging className={classes.pagination} />
                    </div>
                    <RewardDisclaimers />
                  </div>
                )}
              </div>
            </Scrollbar>
          </div>
          <div style={{ flex: '0 0 250px' }}>
            <Scrollbars>
              <div className={classes.filterContainer}>
                <RewardFilterContainer />
              </div>
            </Scrollbars>
          </div>
        </div>
      </div>
    )
  }
}

export const BrowseRewardsPage = withStyles(styles)(_BrowseRewardsPage)
