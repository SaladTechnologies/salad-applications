import React from 'react'
import { storiesOf } from '@storybook/react'
import { AngledPanel, AngleDirection } from './AngledPanel'

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
      <AngledPanel style={style} leftSide={AngleDirection.None} />
      <AngledPanel style={style} leftSide={AngleDirection.Left} />
      <AngledPanel style={style} leftSide={AngleDirection.Right} />
      Right Side
      <AngledPanel style={style} rightSide={AngleDirection.None} />
      <AngledPanel style={style} rightSide={AngleDirection.Left} />
      <AngledPanel style={style} rightSide={AngleDirection.Right} />
      Both Sides
      <AngledPanel style={style} leftSide={AngleDirection.None} rightSide={AngleDirection.None} />
      <AngledPanel style={style} leftSide={AngleDirection.Left} rightSide={AngleDirection.Left} />
      <AngledPanel style={style} leftSide={AngleDirection.Right} rightSide={AngleDirection.Right} />
      <AngledPanel style={style} leftSide={AngleDirection.Left} rightSide={AngleDirection.Right} />
      <AngledPanel style={style} leftSide={AngleDirection.Right} rightSide={AngleDirection.Left} />
    </div>
  ))
  .add('with different heights', () => (
    <div>
      <AngledPanel
        style={{ width: 200, height: 20, margin: 10, backgroundColor: 'blue' }}
        leftSide={AngleDirection.Right}
        rightSide={AngleDirection.Right}
      />
      <AngledPanel
        style={{ width: 200, height: 50, margin: 10, backgroundColor: 'blue' }}
        leftSide={AngleDirection.Right}
        rightSide={AngleDirection.Right}
      />
      <AngledPanel
        style={{ width: 200, height: 100, margin: 10, backgroundColor: 'blue' }}
        leftSide={AngleDirection.Right}
        rightSide={AngleDirection.Right}
      />
    </div>
  ))
  .add('with different widths', () => (
    <div>
      <AngledPanel
        style={{ width: 100, height: 20, margin: 10, backgroundColor: 'blue' }}
        leftSide={AngleDirection.Right}
        rightSide={AngleDirection.Right}
      />
      <AngledPanel
        style={{ width: 200, height: 20, margin: 10, backgroundColor: 'blue' }}
        leftSide={AngleDirection.Right}
        rightSide={AngleDirection.Right}
      />
      <AngledPanel
        style={{ width: 300, height: 20, margin: 10, backgroundColor: 'blue' }}
        leftSide={AngleDirection.Right}
        rightSide={AngleDirection.Right}
      />
    </div>
  ))
  .add('with content', () => (
    <AngledPanel style={style} rightSide={AngleDirection.Left}>
      <p>Hello World</p>
    </AngledPanel>
  ))
