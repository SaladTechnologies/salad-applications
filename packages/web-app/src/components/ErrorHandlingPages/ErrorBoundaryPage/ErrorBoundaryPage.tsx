import type { FunctionComponent, ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SmartLink } from '../..'
import { DefaultTheme } from '../../../SaladTheme'
import { ErrorWrapper } from '../components'

const ErrorBoundaryPage: FunctionComponent<{ children?: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    FallbackComponent={() => (
      <ErrorWrapper
        title="Oops! there seems to be an error in the Kitchen and cannot load this page right now."
        description={
          <>
            Please refresh or check the{' '}
            <SmartLink color={DefaultTheme.green} to="https://status.salad.com/">
              Salad System Status dashboard
            </SmartLink>{' '}
            for details.
          </>
        }
      />
    )}
  >
    {children}
  </ErrorBoundary>
)

export { ErrorBoundaryPage as ErrorBoundary }
