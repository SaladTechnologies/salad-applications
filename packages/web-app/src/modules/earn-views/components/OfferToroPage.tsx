import { IFramePage } from './IFramePage'

interface Props {
  userId?: string
}

export const OfferToroPage = ({ userId }: Props) => (
  <IFramePage pageTitle="Offerwalls - OfferToro" src={`https://www.offertoro.com/ifr/show/23252/${userId}/9598`} />
)
