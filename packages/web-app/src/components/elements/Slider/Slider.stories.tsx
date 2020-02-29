import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Slider } from './Slider'
import { addStories } from '../../../../.storybook/addStories'

const stories = [
  {
    name: 'Step: 1, Min: 0, Max: 10, Value: 0',
    props: { stepSize: 1, minimum: 0, maximum: 10, value: 0, onValueChange: action('Value changed') },
  },
  {
    name: 'Step: 1, Min: 0, Max: 10, Value: 5',
    props: { stepSize: 1, minimum: 0, maximum: 10, value: 5, onValueChange: action('Value changed') },
  },
  {
    name: 'Step: 1, Min: 0, Max: 10, Value: 10',
    props: { stepSize: 1, minimum: 0, maximum: 10, value: 10, onValueChange: action('Value changed') },
  },
]

// @ts-ignore
addStories(Slider, stories, storiesOf('Components/Slider', module), '#B2D530')
// storiesOf('Components/ToggleSwitch', module).addStories(ToggleSwitch,stories)
