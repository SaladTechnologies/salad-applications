import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl'

const cache = createIntlCache()
const intl = createIntl(
  {
    locale: 'en-US',
    messages: {},
  },
  cache,
)

export const RawIntl = ({ children }) => <RawIntlProvider value={intl}>{children}</RawIntlProvider>
