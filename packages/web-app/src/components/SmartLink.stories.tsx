import { Meta } from '@storybook/react'
import { SmartLink } from '.'

export default {
  title: 'Components/Smart Link',
  component: SmartLink,
} as Meta

export const TextExternalLink = () => <SmartLink to="https://www.google.com/">Google</SmartLink>
export const TextInternalLink = () => <SmartLink to="/help">Help</SmartLink>
export const ComponentExternalLink = () => (
  <SmartLink to="https://www.google.com/">
    <div>Nested text</div>
  </SmartLink>
)
export const ComponentInternalLink = () => (
  <SmartLink to="/help">
    <div>Nested text</div>
  </SmartLink>
)
