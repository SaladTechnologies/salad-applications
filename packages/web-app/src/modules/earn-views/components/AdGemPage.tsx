import React from 'react'
import { IFramePage } from './IFramePage'

interface Props {
  userId?: string
}

export const AdGemPage = ({ userId }: Props) => (
  <IFramePage pageTitle="Offerwall - AdGem" src={`https://api.adgem.com/v1/wall?appid=1735&playerid=${userId}`} />
)
