import type { ReactNode } from 'react'
import MediaQuery from 'react-responsive'

interface Props {
  orientation?: 'portrait' | 'landscape'
  children?: ReactNode
}

const mobileSize = 812

export const MobileDevice = ({ orientation, children }: Props) => (
  <MediaQuery maxWidth={mobileSize} orientation={orientation}>
    {children}
  </MediaQuery>
)

export const NotMobile = ({ children }: Props) => <MediaQuery minWidth={mobileSize + 1}>{children}</MediaQuery>
