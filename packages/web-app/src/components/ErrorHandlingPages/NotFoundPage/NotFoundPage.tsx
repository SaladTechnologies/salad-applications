import type { FunctionComponent } from 'react'
import { ErrorWrapper } from '../components'

export const NotFoundPage: FunctionComponent = () => (
  <ErrorWrapper title="Oops! It seems you've reached a page that doesn't exist. Please double-check the URL or navigate back to the homepage." />
)
