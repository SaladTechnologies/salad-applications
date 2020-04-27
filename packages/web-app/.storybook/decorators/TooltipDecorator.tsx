import React from 'react'
import { Tooltips } from '../../src/Tooltips'

export const TooltipDecorator = ({ children }) => (
  <>
    <Tooltips />
    {children}
  </>
)
