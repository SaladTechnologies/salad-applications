import React from 'react'
import { IFramePage } from './IFramePage'

interface Props {
  userId?: string
}

export const AdGatePage = ({ userId }: Props) => (
  <IFramePage pageTitle="Offerwall - AdGate" src={`https://wall.adgaterewards.com/nq-Uqw/${userId}`} />
)
