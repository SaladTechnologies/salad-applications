import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { NotificationToast } from './NotificationToast'
import { addStories } from '../../../../.storybook/addStories'

const stories = [
  {
    name: 'Title only',
    props: { title: 'This is the title', closeToast: action('close') },
  },
  {
    name: 'Message only',
    props: {
      message: 'This is a message that can sometimes be longer than a single line',
      closeToast: action('close'),
    },
  },
  {
    name: 'Title and message',
    props: {
      title: 'This is the title',
      message: 'This is a message that can sometimes be longer than a single line',
      closeToast: action('close'),
    },
  },
  {
    name: 'Very long title',
    props: {
      title: 'This is the title and sometimes they can be very very long. It can cause issues because it is too long!',
      message: 'This is a message that can sometimes be longer than a single line',
      closeToast: action('close'),
    },
  },
  {
    name: 'No close button',
    props: {
      title: 'This is the title',
      message: 'This is a message that can sometimes be longer than a single line',
    },
  },
  {
    name: 'Success',
    props: {
      title: 'This is the title',
      message: 'This is a message that can sometimes be longer than a single line',
      closeToast: action('close'),
      type: 'success',
    },
  },
  {
    name: 'Error',
    props: {
      title: 'Uh Oh. Something went wrong.',
      message: 'This is a message that can sometimes be longer than a single line',
      closeToast: action('close'),
      error: true,
    },
  },
]

// @ts-ignore
addStories(NotificationToast, stories, storiesOf('Modules/Notifications', module))
// storiesOf('Components/ToggleSwitch', module).addStories(ToggleSwitch,stories)
