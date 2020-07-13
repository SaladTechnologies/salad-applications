import React, { ReactNode } from 'react'
import MediaQuery from 'react-responsive'

interface Props {
  children?: ReactNode
}

export const DesktopDevice = ({ children }: Props) => <MediaQuery minWidth={992}>{children}</MediaQuery>

export const MobileOrTableDevice = ({ children }: Props) => <MediaQuery maxWidth={991}>{children}</MediaQuery>

export const TabletDevice = ({ children }: Props) => (
  <MediaQuery minWidth={768} maxWidth={991}>
    {children}
  </MediaQuery>
)

export const MobileDevice = ({ children }: Props) => <MediaQuery maxWidth={767}>{children}</MediaQuery>

export const NotMobile = ({ children }: Props) => <MediaQuery minWidth={767}>{children}</MediaQuery>
