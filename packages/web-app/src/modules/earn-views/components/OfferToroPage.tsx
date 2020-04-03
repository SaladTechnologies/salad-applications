import React from 'react'
import { IFramePage } from './IFramePage'

interface Props {
  userId?: string
}

export const OfferToroPage = ({ userId }: Props) => (
  <IFramePage src={`https://www.offertoro.com/ifr/show/23252/${userId}/9598`} />
)
