import React from 'react'
import { storiesOf } from '@storybook/react'
import { AngledPanel } from './AngledPanel'

const style = {
  width: 200,
  height: 50,
  margin: 5,
  backgroundColor: 'blue',
}

storiesOf('Components/Angled Panel', module)
  .add('with angled sides', () => (
    <div>
      Left Side
      <AngledPanel style={style} leftSide={'none'} />
      <AngledPanel style={style} leftSide={'left'} />
      <AngledPanel style={style} leftSide={'right'} />
      Right Side
      <AngledPanel style={style} rightSide={'none'} />
      <AngledPanel style={style} rightSide={'left'} />
      <AngledPanel style={style} rightSide={'right'} />
      Both Sides
      <AngledPanel style={style} leftSide={'none'} rightSide={'none'} />
      <AngledPanel style={style} leftSide={'left'} rightSide={'left'} />
      <AngledPanel style={style} leftSide={'right'} rightSide={'right'} />
      <AngledPanel style={style} leftSide={'left'} rightSide={'right'} />
      <AngledPanel style={style} leftSide={'right'} rightSide={'left'} />
    </div>
  ))
  .add('with different heights', () => (
    <div>
      <AngledPanel
        style={{ width: 200, height: 20, margin: 10, backgroundColor: 'blue' }}
        leftSide={'right'}
        rightSide={'right'}
      />
      <AngledPanel
        style={{ width: 200, height: 50, margin: 10, backgroundColor: 'blue' }}
        leftSide={'right'}
        rightSide={'right'}
      />
      <AngledPanel
        style={{ width: 200, height: 100, margin: 10, backgroundColor: 'blue' }}
        leftSide={'right'}
        rightSide={'right'}
      />
    </div>
  ))
  .add('with different widths', () => (
    <div>
      <AngledPanel
        style={{ width: 100, height: 20, margin: 10, backgroundColor: 'blue' }}
        leftSide={'right'}
        rightSide={'right'}
      />
      <AngledPanel
        style={{ width: 200, height: 20, margin: 10, backgroundColor: 'blue' }}
        leftSide={'right'}
        rightSide={'right'}
      />
      <AngledPanel
        style={{ width: 300, height: 20, margin: 10, backgroundColor: 'blue' }}
        leftSide={'right'}
        rightSide={'right'}
      />
    </div>
  ))
  .add('with content', () => (
    <AngledPanel style={style} rightSide={'left'}>
      <p>Hello World</p>
    </AngledPanel>
  ))
