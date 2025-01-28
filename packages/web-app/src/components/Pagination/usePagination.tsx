import { useState } from 'react'

interface UsePaginationParams {
  itemsPerPageAmount?: number
  initialCurrentPageNumber?: number
}

const defaultItemsPerPageAmount = 10
const defaultInitialCurrentPageNumber = 1

export const usePagination = (params?: UsePaginationParams) => {
  const { itemsPerPageAmount = defaultItemsPerPageAmount, initialCurrentPageNumber = defaultInitialCurrentPageNumber } =
    params
      ? params
      : {
          itemsPerPageAmount: defaultItemsPerPageAmount,
          initialCurrentPageNumber: defaultInitialCurrentPageNumber,
        }

  const [currentPageNumber, setCurrentPageNumber] = useState<number>(initialCurrentPageNumber)

  const higherItemNumberOnPage = itemsPerPageAmount * currentPageNumber
  const lowerItemNumberOnPage = higherItemNumberOnPage - itemsPerPageAmount + 1

  return {
    setCurrentPageNumber,
    lowerItemNumberOnPage,
    higherItemNumberOnPage,
    currentPageNumber,
    itemsPerPageAmount,
  }
}
