import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { addStories } from '../../../../.storybook/addStories'
import { ToggleSwitch } from './ToggleSwitch'

const stories = [
  {
    name: 'Default button with toggle action',
    props: { toggleClick: action('toggle') },
  },
  {
    name: 'Custom toggle text',
    props: {
      toggleLeft: 'Left',
      toggleRight: 'Right',
    },
  },
  {
    name: 'Disabled',
    props: {
      disabled: true,
    },
  },
  {
    name: 'Toggled on',
    props: {
      toggleOn: true,
    },
  },
  {
    name: 'Toggled off',
    props: {
      toggleOn: false,
    },
  },
]

// @ts-ignore
addStories(ToggleSwitch, stories, storiesOf('Components/ToggleSwitch', module), '#B2D530')
// storiesOf('Components/ToggleSwitch', module).addStories(ToggleSwitch,stories)
