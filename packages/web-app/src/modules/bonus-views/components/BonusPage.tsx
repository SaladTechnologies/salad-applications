import { BonusCard, Layout, Text } from '@saladtechnologies/garden-components'
import { Observer } from 'mobx-react'
import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import type { IntlShape } from 'react-intl'
import { injectIntl } from 'react-intl'
import withStyles, { WithStyles } from 'react-jss'
import { Head } from '../../../components'
import { withLogin } from '../../auth-views'
import { Bonus } from '../../bonus/models'

const styles = () => ({
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  cardWraper: {
    padding: '20px 8px',
  },
})

interface Props extends WithStyles<typeof styles> {
  unclaimedBonuses?: Bonus[]
  pendingBonuses?: Set<string>
  claimBonus?: (id: string) => void
  intl: IntlShape
}

class _BonusPage extends Component<Props> {
  render() {
    const { unclaimedBonuses, pendingBonuses, claimBonus, intl, classes } = this.props
    const hasBonuses = unclaimedBonuses && unclaimedBonuses.length !== 0

    return (
      <div style={{ flex: 1, backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)' }}>
        <Scrollbars>
          <Layout title="Bonuses">
            <Head title="Bonuses" />
            {!hasBonuses && <Text variant="baseM">No unclaimed bonuses available</Text>}
            {hasBonuses && (
              <div className={classes.cardContainer}>
                {unclaimedBonuses?.map((x) => (
                  <Observer>
                    {() => {
                      let pending = pendingBonuses?.has(x.id)
                      return (
                        <div className={classes.cardWraper} key={x.id}>
                          <BonusCard
                            key={x.id}
                            buttonLabel="Claim"
                            description={`Expires on ${intl.formatDate(x.expiresAt)}`}
                            header={x.reason || ''}
                            image={x.iconImageUrl || ''}
                            imageAlt={x.name || 'bonus image'}
                            onClick={() => claimBonus?.(x.id)}
                            title={x.name || ''}
                            variant="large"
                            isLoading={pending}
                          />
                        </div>
                      )
                    }}
                  </Observer>
                ))}
              </div>
            )}
          </Layout>
        </Scrollbars>
      </div>
    )
  }
}

export const BonusPage = withLogin(withStyles(styles)(injectIntl(_BonusPage)))
