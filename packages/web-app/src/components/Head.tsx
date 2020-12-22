import { Helmet } from 'react-helmet'

interface Props {
  title?: string
}

const titleSuffix = ' | Salad'
const maxTitleLength = 60 //Recommendation from Moz https://moz.com/learn/seo/title-tag

export const Head = ({ title }: Props) => (
  <Helmet>
    {title && <title>{`${title.substring(0, maxTitleLength - titleSuffix.length)}${titleSuffix}`}</title>}
  </Helmet>
)
