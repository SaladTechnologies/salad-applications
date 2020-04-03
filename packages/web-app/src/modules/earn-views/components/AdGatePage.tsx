import React from 'react'
import { IFramePage } from './IFramePage'

interface Props {
  userId?: string
}

export const AdGatePage = ({ userId }: Props) => <IFramePage src={`https://wall.adgaterewards.com/nq-Uqw/${userId}`} />
