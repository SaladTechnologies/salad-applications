import { BonusCard, Layout, Text } from '@saladtechnologies/garden-components'
import { Component } from 'react'
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
    justifyContent: 'space-between',
  },
  cardWraper: {
    padding: '20px 10px',
  },
})

interface Props extends WithStyles<typeof styles> {
  unclaimedBonuses: Bonus[]
  claimBonus: (id: string) => void
  intl: IntlShape
}

class _BonusPage extends Component<Props> {
  render() {
    const { unclaimedBonuses, claimBonus, intl, classes } = this.props
    const hasBonuses = unclaimedBonuses && unclaimedBonuses.length !== 0

    return (
      <div style={{ flex: 1, backgroundImage: 'linear-gradient(to right, #56A431 , #AACF40)' }}>
        <Layout title="Bonuses">
          <Head title="Bonuses" />
          {!hasBonuses && <Text variant="baseM">No unclaimed bonuses available</Text>}
          {hasBonuses && (
            <div className={classes.cardContainer}>
              {unclaimedBonuses.map((x) => (
                <div className={classes.cardWraper} key={x.id}>
                  <BonusCard
                    key={x.id}
                    buttonLabel="Claim"
                    description={`Expires on ${intl.formatDate(x.expiresAt)}`}
                    header={x.reason || ''}
                    image={x.iconImageUrl || ''}
                    imageAlt={x.name || 'bonus image'}
                    onClick={() => claimBonus(x.id)}
                    title={x.name || ''}
                    variant="large"
                  />
                </div>
              ))}
            </div>
          )}
        </Layout>
      </div>
    )
  }
}

export const BonusPage = withLogin(withStyles(styles)(injectIntl(_BonusPage)))
