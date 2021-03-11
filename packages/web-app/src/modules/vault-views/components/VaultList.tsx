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
    fontSize: theme.small,
  },
  grid: {
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: '25% 25% 25% 25%',
    gridTemplateRows: 'auto',
    '@media screen and (min-width: 1200px)': {
      gridTemplateColumns: '40% 30% 15% 15%',
    },
  },
  gridContainer: {
    userSelect: 'none',
    color: theme.lightGreen,
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
    '@media screen and (min-width: 900px)': {
      fontSize: theme.medium,
      lineHeight: theme.medium,
    },
  },
  labelNameContainer: {
    maxWidth: 400,
    wordWrap: 'break-word',
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
  redemptions?: RewardVaultItem[]
  startRefresh?: () => void
  stopRefresh?: () => void
}

interface State {
  redemptions?: RewardVaultItem[]
  dropdown: {
    name: {
      active: boolean
      reverse: boolean
      hasBeenClicked: boolean
    }
    price: {
      active: boolean
      reverse: boolean
      hasBeenClicked: boolean
    }
    status: {
      active: boolean
      reverse: boolean
      hasBeenClicked: boolean
    }
    redeemDate: {
      active: boolean
      reverse: boolean
      hasBeenClicked: boolean
    }
  }
}

class _VaultList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      redemptions: props.redemptions?.slice(),
      dropdown: {
        name: {
          active: false,
          reverse: false,
          hasBeenClicked: false,
        },
        price: {
          active: false,
          reverse: false,
          hasBeenClicked: false,
        },
        status: {
          active: false,
          reverse: false,
          hasBeenClicked: false,
        },
        redeemDate: {
          active: true,
          reverse: false,
          hasBeenClicked: false,
        },
      },
    }
  }

  updateActiveDropdown = (activeDropdown: keyof State['dropdown'], initialLoad?: boolean) => {
    const { dropdown } = this.state

    const updatedDropdown = Object.keys(dropdown).reduce((newDropdown, filter) => {
      switch (filter) {
        case activeDropdown:
          newDropdown[filter] = {
            active: true,
            reverse:
              dropdown[filter].hasBeenClicked && typeof initialLoad !== 'boolean' ? !dropdown[filter].reverse : false,
            hasBeenClicked: typeof initialLoad !== 'boolean' ? true : false,
          }
          break
        case 'name':
        case 'price':
        case 'status':
        case 'redeemDate':
          newDropdown[filter] = {
            active: false,
            reverse: false,
            hasBeenClicked: dropdown[filter].hasBeenClicked,
          }
          break
      }

      return newDropdown
    }, {} as State['dropdown'])

    return updatedDropdown
  }

  sortRedemptionsByName = () => {
    const { redemptions } = this.state
    const updatedDropdown = this.updateActiveDropdown('name')
    const reversed = updatedDropdown.name.reverse
    if (redemptions && redemptions?.length > 0) {
      const sortedRedemptions: RewardVaultItem[] = redemptions
        .slice()
        .sort((a, b) =>
          reversed
            ? a.name.toUpperCase() > b.name.toUpperCase()
              ? -1
              : 1
            : a.name.toUpperCase() > b.name.toUpperCase()
            ? 1
            : -1,
        )

      this.setState({
        dropdown: updatedDropdown,
        redemptions: sortedRedemptions,
      })
    }
  }

  sortRedemptionsByPrice = () => {
    const { redemptions } = this.state
    const updateDropdown = this.updateActiveDropdown('price')
    const reversed = updateDropdown.price.reverse
    if (redemptions && redemptions?.length > 0) {
      const sortedRedemptions: RewardVaultItem[] = redemptions
        .slice()
        .sort((a, b) => (reversed ? (a.price > b.price ? 1 : -1) : a.price > b.price ? -1 : 1))
      this.setState({
        dropdown: updateDropdown,
        redemptions: sortedRedemptions,
      })
    }
  }

  sortRedemptionsByRedeemedDate = (initialLoad?: boolean) => {
    const { redemptions } = this.state
    const updatedDropdown = this.updateActiveDropdown('redeemDate', initialLoad)
    const reversed = updatedDropdown.redeemDate.reverse
    if (redemptions && redemptions?.length > 0) {
      const sortedRedemptions: RewardVaultItem[] = redemptions
        .slice()
        .sort((a, b) =>
          reversed
            ? new Date(a.timestamp) > new Date(b.timestamp)
              ? 1
              : -1
            : new Date(a.timestamp) > new Date(b.timestamp)
            ? -1
            : 1,
        )
      this.setState({
        dropdown: updatedDropdown,
        redemptions: sortedRedemptions,
      })
    }
  }

  sortRedemptionsByStatus = () => {
    const { redemptions } = this.state
    const updatedDropdown = this.updateActiveDropdown('status')
    const reversed = updatedDropdown.status.reverse
    if (redemptions && redemptions?.length > 0) {
      const sortedRedemptions: RewardVaultItem[] = redemptions.slice().sort((a, b) => {
        const aStatus = a.status === RewardVaultStatus.COMPLETED ? 1 : a.status === RewardVaultStatus.CREATED ? 0 : -1
        const bStatus = b.status === RewardVaultStatus.COMPLETED ? 1 : b.status === RewardVaultStatus.CREATED ? 0 : -1

        return reversed ? (aStatus < bStatus ? -1 : 1) : aStatus < bStatus ? 1 : -1
      })
      this.setState({
        dropdown: updatedDropdown,
        redemptions: sortedRedemptions,
      })
    }
  }

  componentDidMount = () => {
    const { startRefresh } = this.props

    this.sortRedemptionsByRedeemedDate(true)

    this.setState({
      redemptions: this.props.redemptions,
    })

    startRefresh?.()
  }

  componentWillUnmount = () => {
    const { stopRefresh } = this.props

    stopRefresh?.()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.redemptions !== prevProps.redemptions) {
      this.setState({ redemptions: this.props.redemptions })
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
                <div className={classes.gridContainer}>
                  <div className={classes.grid}>
                    <VaultListHeaderItem
                      active={dropdown['name'].active}
                      header="Item Name and Code"
                      onClick={this.sortRedemptionsByName}
                      reverse={dropdown['name'].reverse}
                    />
                    <VaultListHeaderItem
                      active={dropdown['status'].active}
                      header="Order Status"
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
                      header="Redeemed On"
                      onClick={this.sortRedemptionsByRedeemedDate}
                      reverse={dropdown['redeemDate'].reverse}
                    />
                  </div>
                  <Divider className={classes.tableHeaderDivider} />
                </div>

                {redemptions.map((reward) => {
                  const { id, name, price, timestamp, code, status } = reward
                  const incompleteItem = status === RewardVaultStatus.FAILED || status === RewardVaultStatus.CREATED
                  const isPending = status === RewardVaultStatus.CREATED
                  const isCancelled = status === RewardVaultStatus.FAILED

                  return (
                    <div key={id} className={classes.gridContainer}>
                      <div className={classnames(classes.grid)}>
                        <div className={incompleteItem ? classes.incompleteItem : ''}>
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
                              <SmartLink to={code}>Click here to claim</SmartLink>
                            </P>
                          )}
                          {isPending && <P>Awaiting Code</P>}
                          {isCancelled && (
                            <P>Order Canceled. Don't worry though, we've refunded your Salad balance!.</P>
                          )}
                        </div>
                        <div className={classes.statusContainer}>
                          <label
                            className={classnames(classes.status, {
                              [classes.statusPending]: isPending,
                              [classes.statusCancelled]: isCancelled,
                            })}
                          >
                            {convertStatus(status).toUpperCase()}
                          </label>
                          {isPending && (
                            <InfoButton
                              text={
                                "Your Order Has Been Received And Is Being Processed. This Usually Takes A Few Seconds, But In Rare Cases Can Take Up To 48 Hours. When We Receive Your Code, It Will Appear Here, And In An Email That We'll Send To You."
                              }
                            />
                          )}
                          {isCancelled && (
                            <SmartLink
                              className={classes.getHelpLink}
                              to="https://support.salad.io/hc/en-us/articles/360028479532-I-redeemed-an-item-and-haven-t-gotten-it-yet-What-s-going-on-"
                            >
                              Get help
                            </SmartLink>
                          )}
                        </div>
                        <div className={incompleteItem ? classes.incompleteItem : ''}>
                          <label className={classes.label}>${price?.toFixed(2)}</label>
                        </div>
                        <div className={incompleteItem ? classes.incompleteItem : ''}>
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
