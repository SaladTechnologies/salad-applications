import type { FunctionComponent, ReactNode } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { SmartLink } from '../..'
import { DefaultTheme } from '../../../SaladTheme'
import { ErrorWrapper } from '../components'

interface FallbackErrorBoundaryPageProps extends FallbackProps {}

const FallbackErrorBoundaryPage: FunctionComponent<FallbackErrorBoundaryPageProps> = () => (
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
)

const ErrorBoundaryPage: FunctionComponent<{ children?: ReactNode }> = ({ children }) => (
  <ErrorBoundary FallbackComponent={FallbackErrorBoundaryPage}>{children}</ErrorBoundary>
)

export { ErrorBoundaryPage as ErrorBoundary }
