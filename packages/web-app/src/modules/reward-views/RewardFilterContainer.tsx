import { connect } from '../../connect'
import { RootStore } from '../../Store'
import queryString from 'query-string'
import { RewardFilterPanel } from './components/RewardFilterPanel'
import { RewardQuery } from '../reward/models'
import { encodeCategory } from '../reward/utils'

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

const toggleArray = (value: string, startingArray?: string[] | string): string[] | undefined => {
  //Ensures that the format for our values is consistent
  value = encodeCategory(value)

  if (!startingArray) {
    return [value]
  }

  let result: string[] | undefined = undefined

  //If there is only a single query string, this is a string. If there are multiple then it is an array
  if (typeof startingArray === 'string' || startingArray instanceof String) {
    //Removing the only value
    if (startingArray === value) {
      return undefined
    } else {
      result = [String(startingArray), value]
    }
  } else {
    if (startingArray.includes(value)) {
      //Remove an existing item
      const index = startingArray.indexOf(value)
      if (index > -1) {
        startingArray.splice(index, 1)
      }
    } else {
      startingArray.push(value)
    }
    result = startingArray
  }

  return result?.sort((a, b) => {
    console.log('Sorting')
    if (a < b) {
      return -1
    }
    if (a > b) {
      return 1
    }
    return 0
  })
}

const getPriceLabel = (value?: number): string => {
  if (value === undefined || value === NoMaxPriceValue) {
    return 'Any Price'
  } else if (value === 0) {
    return 'Free'
  }
  return `Under $${value.toFixed(0)}`
}

const mapStoreToProps = (store: RootStore, props: Props): any => {
  if (!props.location) {
    return {}
  }

  const query: RewardQuery = queryString.parse(props.location?.search, { parseNumbers: true, parseBooleans: true })

  const updateQuery = () => {
    const newQuery = queryString.stringify(query)
    store.routing.replace({ search: newQuery })
  }

  return {
    priceFilter: {
      label: getPriceLabel(query.maxPrice),
      value: query.maxPrice !== undefined ? query.maxPrice : 65,
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
      label: 'Only In Stock',
      active: query.available,
      onToggle: () => {
        query.available = toggleValue(query.available)
        updateQuery()
      },
    },
    redeemableFilter: {
      label: 'Only Redeemable',
      active: query.redeemable,
      onToggle: () => {
        query.redeemable = toggleValue(query.redeemable)
        updateQuery()
      },
    },
    tagFilters: store.rewards.categories.map((x) => {
      let active: boolean | undefined = false

      if (typeof query.category === 'string' || query.category instanceof String) {
        active = String(query.category) === encodeCategory(x)
      } else {
        active = query.category?.includes(encodeCategory(x))
      }
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
