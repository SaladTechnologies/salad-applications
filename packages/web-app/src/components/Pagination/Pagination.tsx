import { Button, Text } from '@saladtechnologies/garden-components'
import type CSS from 'csstype'
import type { FunctionComponent } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { DefaultTheme, type SaladTheme } from '../../SaladTheme'

const styles: (theme: SaladTheme) => Record<string, CSS.Properties> = (theme: SaladTheme) => ({
  paginationWrapper: {
    width: '100%',
    color: theme.lightGreen,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '16px',
    padding: '16px',
  },
  navigationButtonWrapper: {
    width: '100px',
  },
  centralPagesWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '6px',
    width: '300px',
  },
  currentPageWrapper: {
    backgroundColor: theme.lightGreen,
    width: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  currentPageText: {
    color: theme.darkBlue,
  },
  dotsWrapper: {
    width: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
})

interface Props extends WithStyles<typeof styles> {
  itemsTotalAmount: number
  itemsPerPageAmount: number
  currentPageNumber?: number
  onPageChange: (pageNumber: number) => void
}

const _Pagination: FunctionComponent<Props> = ({
  classes,
  itemsTotalAmount,
  itemsPerPageAmount = 10,
  currentPageNumber = 1,
  onPageChange,
}) => {
  const totalPagesAmount = Math.ceil(itemsTotalAmount / itemsPerPageAmount)
  const withPreviousPage = currentPageNumber !== 1
  const withNextPage = totalPagesAmount - currentPageNumber > 0
  const firstPageNumber = 1
  const lastPageNumber = totalPagesAmount
  const nextPageNumber = currentPageNumber + 1
  const previousPageNumber = currentPageNumber - 1
  const withNextDots = nextPageNumber !== lastPageNumber
  const withPreviousDots = previousPageNumber !== firstPageNumber
  const isNextPageLast = nextPageNumber === totalPagesAmount
  const isPreviousPageFirst = previousPageNumber === firstPageNumber

  return (
    <div className={classes.paginationWrapper}>
      <div className={classes.navigationButtonWrapper}>
        {withPreviousPage && (
          <Button
            width={100}
            outlineColor={DefaultTheme.lightGreen}
            variant="outlined"
            label="Previous"
            size="small"
            onClick={() => onPageChange(previousPageNumber)}
          />
        )}
      </div>
      <div className={classes.centralPagesWrapper}>
        {withPreviousPage && !isPreviousPageFirst && (
          <Button
            width={32}
            outlineColor={DefaultTheme.lightGreen}
            variant="outlined"
            label={firstPageNumber.toString()}
            size="small"
            onClick={() => onPageChange(firstPageNumber)}
          />
        )}
        {withPreviousDots && withPreviousPage && (
          <div className={classes.dotsWrapper}>
            <Text variant="baseM">...</Text>
          </div>
        )}
        {withPreviousPage && (
          <Button
            width={32}
            outlineColor={DefaultTheme.lightGreen}
            variant="outlined"
            label={previousPageNumber.toString()}
            size="small"
            onClick={() => onPageChange(previousPageNumber)}
          />
        )}
        <div className={classes.currentPageWrapper}>
          <Text className={classes.currentPageText} variant="baseL">
            {currentPageNumber}
          </Text>
        </div>
        {withNextPage && withNextPage && (
          <Button
            width={32}
            outlineColor={DefaultTheme.lightGreen}
            variant="outlined"
            label={nextPageNumber.toString()}
            size="small"
            onClick={() => onPageChange(nextPageNumber)}
          />
        )}
        {withNextDots && withNextPage && (
          <div className={classes.dotsWrapper}>
            <Text variant="baseM">...</Text>
          </div>
        )}
        {!isNextPageLast && withNextPage && (
          <Button
            width={32}
            outlineColor={DefaultTheme.lightGreen}
            variant="outlined"
            label={totalPagesAmount.toString()}
            size="small"
            onClick={() => onPageChange(lastPageNumber)}
          />
        )}
      </div>
      <div className={classes.navigationButtonWrapper}>
        {withNextPage && (
          <Button
            width={100}
            outlineColor={DefaultTheme.lightGreen}
            variant="outlined"
            label="Next"
            size="small"
            onClick={() => onPageChange(nextPageNumber)}
          />
        )}
      </div>
    </div>
  )
}

export const Pagination = withStyles(styles)(_Pagination)
