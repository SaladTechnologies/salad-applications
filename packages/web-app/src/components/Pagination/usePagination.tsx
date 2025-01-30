import { useState } from 'react'

interface UsePaginationParams {
  itemsPerPageAmount?: number
  initialCurrentPageNumber?: number
}

const defaultItemsPerPageAmount = 10
const defaultInitialCurrentPageNumber = 1

const defaultParams = {
  itemsPerPageAmount: defaultItemsPerPageAmount,
  initialCurrentPageNumber: defaultInitialCurrentPageNumber,
}

export const usePagination = ({
  itemsPerPageAmount = defaultParams.itemsPerPageAmount,
  initialCurrentPageNumber = defaultParams.initialCurrentPageNumber,
}: UsePaginationParams = defaultParams) => {
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(initialCurrentPageNumber)

  const highestItemNumberOnPage = itemsPerPageAmount * currentPageNumber
  const lowestItemNumberOnPage = highestItemNumberOnPage - itemsPerPageAmount + 1

  return {
    setCurrentPageNumber,
    lowestItemNumberOnPage,
    highestItemNumberOnPage,
    currentPageNumber,
    itemsPerPageAmount,
  }
}
