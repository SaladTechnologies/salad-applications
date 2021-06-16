import { StoryApi } from '@storybook/addons'
import React from 'react'

export interface StoryData {
  name: string
  props: any
}

export const addStories = (
  component: React.FunctionComponent | React.ComponentClass,
  storyList: [StoryData],
  stories: StoryApi<unknown>,
  backgroundColor?: string,
): StoryApi<unknown> => {
  stories.add('(all)', () => (
    <div
      style={{
        backgroundColor: backgroundColor,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        overflow: 'scroll',
        padding: 20,
      }}
    >
      {storyList.map((x) => (
        <div key={x.name} style={{ marginBottom: '60px' }}>
          <div
            style={{
              marginBottom: '10px',
              color: '#DBF1C1',
              fontSize: '16px',
              fontFamily: 'Arial',
              userSelect: 'none',
            }}
          >
            {x.name}
          </div>
          {React.createElement(component, x.props)}
        </div>
      ))}
    </div>
  ))

  storyList.forEach((x) => {
    stories.add(x.name, () => (
      <div style={{ backgroundColor: backgroundColor }}>{React.createElement(component, x.props)}</div>
    ))
  })
  return stories
}
