import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { Component } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import withStyles, { WithStyles } from 'react-jss'
import { Divider, Head, InfoButton, P, SmartLink, Username } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { RewardVaultItem, RewardVaultStatus } from '../../vault/models'
import { VaultListHeaderItem } from './VaultListHeaderItem'

const styles = (theme: SaladTheme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
  },
  getHelpLink: {
    fontSize: theme.small,
    textDecorationStyle: 'dotted',
  },
  grid: {
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: '25% 25% 25% 25%',
    gridTemplateRows: 'auto',
    '@media screen and (min-width: 1025px)': {
      gridTemplateColumns: '45% 30% 12.5% 12.5%',
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
    textDecoration: 'underline dotted',
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
  activeFilter: 'name' | 'price' | 'status' | 'redeemDate'
}

class _NewVaultList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      redemptions: props.redemptions?.slice(),
      activeFilter: 'redeemDate',
    }
  }

  updateActiveFilter = (newActiveFilter: 'name' | 'price' | 'status' | 'redeemDate') => {
    const { activeFilter } = this.state

    if (activeFilter === newActiveFilter) {
      return
    } else {
      this.setState({
        activeFilter: newActiveFilter,
      })
    }
  }

  sortRedemptionsByName = () => {
    const { redemptions } = this.state
    if (redemptions && redemptions?.length > 0) {
      const sortedRedemptions: RewardVaultItem[] = redemptions.sort((a, b) =>
        a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1,
      )
      this.setState({
        redemptions: sortedRedemptions,
      })
      this.updateActiveFilter('name')
    }
  }

  sortRedemptionsByPrice = () => {
    const { redemptions } = this.state
    if (redemptions && redemptions?.length > 0) {
      const sortedRedemptions: RewardVaultItem[] = redemptions.sort((a, b) => (a.price > b.price ? -1 : 1))
      this.setState({
        redemptions: sortedRedemptions,
      })
      this.updateActiveFilter('price')
    }
  }

  sortRedemptionsByRedeemedDate = () => {
    const { redemptions } = this.state
    if (redemptions && redemptions?.length > 0) {
      const sortedRedemptions: RewardVaultItem[] = redemptions.sort((a, b) =>
        new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1,
      )
      this.setState({
        redemptions: sortedRedemptions,
      })
      this.updateActiveFilter('redeemDate')
    }
  }

  sortRedemptionsByStatus = () => {
    const { redemptions } = this.state
    if (redemptions && redemptions?.length > 0) {
      const sortedRedemptions: RewardVaultItem[] = redemptions.sort((a, b) => {
        const aStatus = a.status === RewardVaultStatus.COMPLETED ? 1 : a.status === RewardVaultStatus.PENDING ? 0 : -1
        const bStatus = b.status === RewardVaultStatus.COMPLETED ? 1 : b.status === RewardVaultStatus.PENDING ? 0 : -1

        return aStatus < bStatus ? 1 : -1
      })
      this.setState({
        redemptions: sortedRedemptions,
      })
      this.updateActiveFilter('status')
    }
  }

  componentDidMount = () => {
    const { startRefresh } = this.props
    this.sortRedemptionsByRedeemedDate()

    startRefresh?.()
  }

  componentWillUnmount = () => {
    const { stopRefresh } = this.props

    stopRefresh?.()
  }

  render() {
    const { classes } = this.props
    const { activeFilter, redemptions } = this.state
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
                      active={activeFilter === 'name'}
                      header="Item Name and Code"
                      onClick={this.sortRedemptionsByName}
                    />
                    <VaultListHeaderItem
                      active={activeFilter === 'status'}
                      header="Order Status"
                      onClick={this.sortRedemptionsByStatus}
                    />
                    <VaultListHeaderItem
                      active={activeFilter === 'price'}
                      header="Price"
                      onClick={this.sortRedemptionsByPrice}
                    />
                    <VaultListHeaderItem
                      active={activeFilter === 'redeemDate'}
                      header="Redeemed On"
                      onClick={this.sortRedemptionsByRedeemedDate}
                    />
                  </div>
                  <Divider className={classes.tableHeaderDivider} />
                </div>

                {redemptions.map((reward) => {
                  const { id, name, price, timestamp, code, status } = reward
                  const incompleteItem = status === RewardVaultStatus.CANCELED || status === RewardVaultStatus.PENDING
                  const isPending = status === RewardVaultStatus.PENDING
                  const isCancelled = status === RewardVaultStatus.CANCELED

                  return (
                    <div className={classes.gridContainer}>
                      <div key={id} className={classnames(classes.grid)}>
                        <div className={incompleteItem ? classes.incompleteItem : ''}>
                          <Username>{name}</Username>
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
                            <P>Order Cancelled. Don't worry though, we've refunded your Salad balance!.</P>
                          )}
                        </div>
                        <div className={classes.statusContainer}>
                          <label
                            className={classnames(classes.status, {
                              [classes.statusPending]: isPending,
                              [classes.statusCancelled]: isCancelled,
                            })}
                          >
                            {status?.toUpperCase()}
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
                          <Username>${price?.toFixed(2)}</Username>
                        </div>
                        <div className={incompleteItem ? classes.incompleteItem : ''}>
                          <Username>{timestamp?.toLocaleDateString()}</Username>
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

export const NewVaultList = withStyles(styles)(_NewVaultList)
