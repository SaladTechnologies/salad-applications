import { useState } from 'react'

interface UsePaginationParams {
  itemsPerPageAmount?: number
  initialCurrentPageNumber?: number
}

const defaultItemsPerPageAmount = 10
const defaultInitialCurrentPageNumber = 10

export const usePagination = (params?: UsePaginationParams) => {
  const { itemsPerPageAmount = defaultItemsPerPageAmount, initialCurrentPageNumber = defaultInitialCurrentPageNumber } =
    params
      ? params
      : {
          itemsPerPageAmount: defaultItemsPerPageAmount,
          initialCurrentPageNumber: defaultInitialCurrentPageNumber,
        }

  const [currentPageNumber, setCurrentPageNumber] = useState<number>(initialCurrentPageNumber)

  const minItemNumberOnPage = itemsPerPageAmount * currentPageNumber
  const maxItemNumberOnPage = minItemNumberOnPage + itemsPerPageAmount

  return {
    setCurrentPageNumber,
    currentPageNumber,
    minItemNumberOnPage,
    maxItemNumberOnPage,
    itemsPerPageAmount,
  }
}
