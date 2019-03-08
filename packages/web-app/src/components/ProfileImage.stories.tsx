import React from 'react'
import { storiesOf } from '@storybook/react'
import { ProfileImage } from './ProfileImage'
import img from '../../.storybook/assets/profile-image.png'

storiesOf('Components/Profile Image', module)
  .add('with image', () => {
    return <ProfileImage src={img} />
  })
  .add('with fallback', () => {
    return <ProfileImage src={undefined} />
  })
