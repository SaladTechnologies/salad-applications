import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { RewardFilterPanel } from './components/RewardFilterPanel'
import { RewardQuery } from '../reward/models'
import { parseRewardQuery, stringifyRewardQuery } from '../reward/utils'

interface Props {
  location?: Location
}

//The value for the slider when we are at the maximum setting (no price filter)
const NoMaxPriceValue = 65

const toggleValue = (startingValue?: boolean): any => {
  if (startingValue) {
    return undefined
  } else {
    return true
  }
}

const toggleArray = (value: string, startingArray?: string[]): string[] | undefined => {
  //Ensures that the format for our values is consistent
  // value = encodeCategory(value)

  if (!startingArray) {
    return [value]
  }

  //If there is only a single query string, this is a string. If there are multiple then it is an array
  if (startingArray.includes(value)) {
    //Remove an existing item
    const index = startingArray.indexOf(value)
    if (index > -1) {
      startingArray.splice(index, 1)
    }
  } else {
    startingArray.push(value)
  }
  return startingArray
}

const getPriceLabel = (value?: number): string => {
  if (value === undefined || value === NoMaxPriceValue) {
    return 'Any Price'
  } else if (value === 0) {
    return 'Free'
  }
  return `$${value.toFixed(0)} & Under`
}

const mapStoreToProps = (store: RootStore, props: Props): any => {
  if (!props.location) {
    return {}
  }

  const query: RewardQuery = parseRewardQuery(props.location?.search)

  const updateQuery = () => {
    const newQuery = stringifyRewardQuery(query)
    store.routing.replace({ search: newQuery })
  }

  return {
    priceFilter: {
      label: getPriceLabel(query.maxPrice),
      value: query.maxPrice !== undefined ? query.maxPrice : NoMaxPriceValue,
      onChance: (value: number) => {
        if (value === NoMaxPriceValue) {
          query.maxPrice = undefined
        } else {
          query.maxPrice = value
        }
        updateQuery()
      },
    },
    stockFilter: {
      label: 'In Stock',
      active: query.available,
      onToggle: () => {
        query.available = toggleValue(query.available)
        updateQuery()
      },
    },
    redeemableFilter: {
      label: 'Redeemable',
      active: query.redeemable,
      onToggle: () => {
        query.redeemable = toggleValue(query.redeemable)
        updateQuery()
      },
    },
    tagFilters: store.rewards.categories.sort().map((x) => {
      let active: boolean | undefined = false

      active = query.category?.includes(x)

      return {
        label: x,
        active: active,
        onToggle: () => {
          query.category = toggleArray(x, query.category)
          updateQuery()
        },
      }
    }),
  }
}

export const RewardFilterContainer = connect(mapStoreToProps, RewardFilterPanel)
