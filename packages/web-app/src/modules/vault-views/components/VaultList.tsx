import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Head, InfoButton, P, SmartLink } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { withLogin } from '../../auth-views'
import { RewardVaultItem, RewardVaultStatus } from '../../vault/models'
import { VaultListHeaderItem } from './VaultListHeaderItem'

const convertStatus = (status: RewardVaultStatus) => {
  if (status === RewardVaultStatus.CREATED) {
    return 'pending'
  } else if (status === RewardVaultStatus.FAILED) {
    return 'canceled'
  } else {
    return status
  }
}

const styles = (theme: SaladTheme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  getHelpLink: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.small,
    marginTop: 5,
  },
  grid: {
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: '25% 25% 25% 25%',
    '@media screen and (min-width: 600px)': {
      gridTemplateColumns: 'auto 22% 19% 17%',
    },
    '@media screen and (min-width: 1025px)': {
      gridTemplateColumns: 'auto 15% 12% 10%',
    },
    '& > div': {
      alignItems: 'center',
      display: 'flex',
      height: 50,
    },
  },
  gridContainer: {
    userSelect: 'none',
    color: theme.lightGreen,
  },
  gridContainerSticky: {
    background: theme.darkBlue,
    position: 'sticky',
    top: 0,
    zIndex: 10000,
  },
  gridColumnContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  iconButton: {
    cursor: 'pointer',
    marginLeft: '1rem',
    '&:active': {
      opacity: 0.75,
    },
  },
  incompleteItem: {
    opacity: 0.5,
  },
  innerListContainer: {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    paddingRight: '20px',
  },
  label: {
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.small,
    lineHeight: theme.small,
    '@media screen and (min-width: 1025px)': {
      fontSize: theme.medium,
      lineHeight: theme.medium,
    },
  },
  labelNameContainer: {
    maxWidth: 100,
    '@media screen and (min-width: 600px)': {
      maxWidth: 200,
    },
    '@media screen and (min-width: 1025px)': {
      maxWidth: 450,
    },
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  listContainer: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  status: {
    color: theme.green,
    fontFamily: theme.fontGroteskLight25,
    fontSize: theme.medium,
    fontWeight: 'bold',
    lineHeight: theme.medium,
    marginRight: 10,
  },
  statusContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  statusCancelled: {
    color: theme.red,
    display: 'flex',
    flexDirection: 'column',
  },
  statusPending: {
    color: theme.orange,
  },
  tableHeader: {
    cursor: 'pointer',
    display: 'flex',
  },
  tableHeaderDivider: {
    marginTop: 5,
  },
})

interface Props extends WithStyles<typeof styles> {
  redemptions: RewardVaultItem[]
  startRefresh?: () => void
  stopRefresh?: () => void
}

interface State {
  redemptions: RewardVaultItem[]
  dropdown: {
    name: {
      active: boolean
      reverse: boolean
    }
    price: {
      active: boolean
      reverse: boolean
    }
    status: {
      active: boolean
      reverse: boolean
    }
    redeemDate: {
      active: boolean
      reverse: boolean
    }
  }
}

class _VaultList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      redemptions: props.redemptions.slice().sort(sortByDate),
      dropdown: {
        name: {
          active: false,
          reverse: false,
        },
        price: {
          active: false,
          reverse: false,
        },
        status: {
          active: false,
          reverse: false,
        },
        redeemDate: {
          active: true,
          reverse: false,
        },
      },
    }
  }

  updateActiveDropdown = (activeDropdown: keyof State['dropdown']): void => {
    this.setState((state, props) => {
      const currentDropdown = state.dropdown
      const nextDropdown = Object.keys(currentDropdown).reduce((nextDropdown, filter) => {
        switch (filter) {
          case activeDropdown:
            nextDropdown[filter] = {
              active: true,
              reverse: currentDropdown[filter].active ? !currentDropdown[filter].reverse : false,
            }
            break
          case 'name':
          case 'price':
          case 'status':
          case 'redeemDate':
            nextDropdown[filter] = {
              active: false,
              reverse: false,
            }
            break
        }

        return nextDropdown
      }, {} as State['dropdown'])
      return {
        dropdown: nextDropdown,
        redemptions: sort(nextDropdown, props.redemptions),
      }
    })
  }

  sortRedemptionsByName = () => {
    this.updateActiveDropdown('name')
  }

  sortRedemptionsByPrice = () => {
    this.updateActiveDropdown('price')
  }

  sortRedemptionsByRedeemedDate = () => {
    this.updateActiveDropdown('redeemDate')
  }

  sortRedemptionsByStatus = () => {
    this.updateActiveDropdown('status')
  }

  componentDidMount = () => {
    const { startRefresh } = this.props
    startRefresh?.()
  }

  componentWillUnmount = () => {
    const { stopRefresh } = this.props
    stopRefresh?.()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.redemptions !== prevProps.redemptions) {
      this.setState({
        redemptions: sort(this.state.dropdown, this.props.redemptions),
      })
    }
  }

  render() {
    const { classes } = this.props
    const { dropdown, redemptions } = this.state
    return (
      <div className={classes.container}>
        <Head title="Reward Vault" />
        <div className={classes.listContainer}>
          <div className={classes.innerListContainer}>
            {redemptions && redemptions.length > 0 && (
              <>
                <div className={classnames(classes.gridContainer, classes.gridContainerSticky)}>
                  <div className={classes.grid}>
                    <VaultListHeaderItem
                      active={dropdown['name'].active}
                      header="Reward"
                      onClick={this.sortRedemptionsByName}
                      reverse={dropdown['name'].reverse}
                    />
                    <VaultListHeaderItem
                      active={dropdown['status'].active}
                      header="Status"
                      onClick={this.sortRedemptionsByStatus}
                      reverse={dropdown['status'].reverse}
                    />
                    <VaultListHeaderItem
                      active={dropdown['price'].active}
                      header="Price"
                      onClick={this.sortRedemptionsByPrice}
                      reverse={dropdown['price'].reverse}
                    />
                    <VaultListHeaderItem
                      active={dropdown['redeemDate'].active}
                      header="Date"
                      onClick={this.sortRedemptionsByRedeemedDate}
                      reverse={dropdown['redeemDate'].reverse}
                    />
                  </div>
                  <Divider className={classes.tableHeaderDivider} />
                </div>

                {redemptions.map((reward) => {
                  const { id, name, price, timestamp, code, status } = reward
                  const incompleteItem = status === RewardVaultStatus.FAILED
                  const isPending = status === RewardVaultStatus.CREATED
                  const isCancelled = status === RewardVaultStatus.FAILED

                  return (
                    <div key={id} className={classes.gridContainer}>
                      <div className={classnames(classes.grid)}>
                        <div className={incompleteItem ? classes.incompleteItem : ''}>
                          <div className={classes.gridColumnContent}>
                            <div className={classes.labelNameContainer}>
                              <label className={classes.label}>{name}</label>
                            </div>
                            {code && !code.startsWith('https') && (
                              <P>
                                {code}
                                <CopyToClipboard text={code}>
                                  <FontAwesomeIcon className={classes.iconButton} icon={faClipboard} size={'lg'} />
                                </CopyToClipboard>
                              </P>
                            )}
                            {code && code.startsWith('https') && (
                              <P>
                                <SmartLink to={code}>Redeem Reward</SmartLink>
                              </P>
                            )}
                            {isCancelled && (
                              <P>Order Canceled. Don't worry though, we've refunded your Salad balance!</P>
                            )}
                          </div>
                        </div>
                        <div className={classes.statusContainer}>
                          <div>
                            <label
                              className={classnames(classes.status, {
                                [classes.statusPending]: isPending,
                                [classes.statusCancelled]: isCancelled,
                              })}
                            >
                              {convertStatus(status).toUpperCase()}
                            </label>
                            {isCancelled && (
                              <SmartLink
                                className={classes.getHelpLink}
                                to="https://support.salad.com/hc/en-us/articles/360028479532-I-redeemed-an-item-and-haven-t-gotten-it-yet-What-s-going-on-"
                              >
                                Get help
                              </SmartLink>
                            )}
                          </div>
                          {isPending && (
                            <InfoButton
                              text={
                                "Your Order Has Been Received And Is Being Processed. This Usually Takes A Few Seconds, But It May Take Up To 40+ Hours. When We Receive Your Code, It Will Appear Here, And In An Email That We'll Send To You."
                              }
                            />
                          )}
                        </div>
                        <div className={classnames({ [classes.incompleteItem]: incompleteItem })}>
                          <label className={classes.label}>${price?.toFixed(2)}</label>
                        </div>
                        <div className={classnames({ [classes.incompleteItem]: incompleteItem })}>
                          <label className={classes.label}>{timestamp?.toLocaleDateString()}</label>
                        </div>
                      </div>
                      <Divider />
                    </div>
                  )
                })}
              </>
            )}
            {(!redemptions || redemptions.length === 0) && <P>Nothing here yet, go redeem something!</P>}
          </div>
        </div>
      </div>
    )
  }
}

export const VaultList = withLogin(withStyles(styles)(_VaultList))

function sort(dropdown: State['dropdown'], redemptions: RewardVaultItem[]): RewardVaultItem[] {
  let sortBy: (a: RewardVaultItem, b: RewardVaultItem) => number
  let reverse: boolean
  if (dropdown.name.active) {
    sortBy = sortByName
    reverse = dropdown.name.reverse
  } else if (dropdown.price.active) {
    sortBy = sortByPrice
    reverse = dropdown.price.reverse
  } else if (dropdown.status.active) {
    sortBy = sortByStatus
    reverse = dropdown.status.reverse
  } else {
    sortBy = sortByDate
    reverse = dropdown.redeemDate.reverse
  }

  let sortedRedemptions = redemptions.slice().sort(sortBy)
  if (reverse) {
    sortedRedemptions = sortedRedemptions.reverse()
  }

  return sortedRedemptions
}

function sortByDate(a: RewardVaultItem, b: RewardVaultItem): number {
  return new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1
}

function sortByName(a: RewardVaultItem, b: RewardVaultItem): number {
  const compare = a.name.localeCompare(b.name)
  return compare === 0 ? sortByDate(a, b) : compare
}

function sortByPrice(a: RewardVaultItem, b: RewardVaultItem): number {
  if (a.price > b.price) {
    return -1
  } else if (a.price < b.price) {
    return 1
  }

  return sortByDate(a, b)
}

function sortByStatus(a: RewardVaultItem, b: RewardVaultItem): number {
  const aStatus = a.status === RewardVaultStatus.COMPLETE ? 1 : a.status === RewardVaultStatus.CREATED ? 0 : -1
  const bStatus = b.status === RewardVaultStatus.COMPLETE ? 1 : b.status === RewardVaultStatus.CREATED ? 0 : -1
  if (aStatus > bStatus) {
    return -1
  } else if (aStatus < bStatus) {
    return 1
  }

  return sortByDate(a, b)
}
