import { Button, Text } from '@saladtechnologies/garden-components'
import classNames from 'classnames'
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
  pagesNavigationWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '6px',
    width: '250px',
  },
  centralPagesWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '6px',
  },
  edgePagesWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '6px',
    width: '60px',
  },
  currentPageText: {
    color: theme.darkBlue,
  },
  button: {
    minWidth: '32px',
    padding: '0px 6px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    color: 'inherit',
    border: `1px solid ${theme.lightGreen}`,
    font: 'inherit',
    cursor: 'pointer',
    outline: 'inherit',
    fontFamily: theme.fontMallory,
  },
  currentPageButton: {
    backgroundColor: theme.lightGreen,
    color: theme.darkBlue,
    fontWeight: 500,
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
      <div className={classes.pagesNavigationWrapper}>
        <div className={classes.edgePagesWrapper}>
          {withPreviousPage && !isPreviousPageFirst && (
            <button onClick={() => onPageChange(firstPageNumber)} className={classes.button}>
              {firstPageNumber}
            </button>
          )}
          {withPreviousDots && withPreviousPage && (
            <div className={classes.dotsWrapper}>
              <Text variant="baseM">...</Text>
            </div>
          )}
        </div>
        <div className={classes.centralPagesWrapper}>
          {withPreviousPage && (
            <button onClick={() => onPageChange(previousPageNumber)} className={classes.button}>
              {previousPageNumber}
            </button>
          )}
          <button className={classNames(classes.button, classes.currentPageButton)}>
            <Text className={classes.currentPageText} variant="baseL">
              {currentPageNumber}
            </Text>
          </button>
          {withNextPage && (
            <button onClick={() => onPageChange(nextPageNumber)} className={classes.button}>
              {nextPageNumber}
            </button>
          )}
        </div>
        <div className={classes.edgePagesWrapper}>
          {withNextDots && withNextPage && (
            <div className={classes.dotsWrapper}>
              <Text variant="baseM">...</Text>
            </div>
          )}
          {!isNextPageLast && withNextPage && (
            <button onClick={() => onPageChange(lastPageNumber)} className={classes.button}>
              {lastPageNumber}
            </button>
          )}
        </div>
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
