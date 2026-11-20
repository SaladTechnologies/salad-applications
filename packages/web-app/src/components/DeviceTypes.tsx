import type { ReactNode } from 'react'
import MediaQueryImport from 'react-responsive'
import { cjsDefault } from '../cjs-default.ts'

const MediaQuery = cjsDefault(MediaQueryImport)

interface Props {
  orientation?: 'portrait' | 'landscape'
  children?: ReactNode
}

export const mobileSize = 812

export const MobileDevice = ({ orientation, children }: Props) => (
  <MediaQuery maxWidth={mobileSize} orientation={orientation}>
    {children}
  </MediaQuery>
)

export const NotMobile = ({ children }: Props) => <MediaQuery minWidth={mobileSize + 1}>{children}</MediaQuery>
