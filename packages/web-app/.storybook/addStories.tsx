import React from 'react'
import { StoryApi } from '@storybook/addons'
import { StoryFnReactReturnType } from '@storybook/react/dist/client/preview/types'

export interface StoryData {
  name: string
  props: any
}

export const addStories = (
  component: React.ReactNode,
  storyList: [StoryData],
  stories: StoryApi<StoryFnReactReturnType>,
  backgroundColor?: string,
): StoryApi<StoryFnReactReturnType> => {
  stories.add('(all)', () => (
    <div style={{ backgroundColor: backgroundColor }}>
      {storyList.map(x => (
        <div key={x.name} style={{ marginLeft: '20px', marginBottom: '40px' }}>
          <div
            style={{
              marginBottom: '10px',
              color: '#DBF1C1',
              fontSize: '16px',
              fontFamily: 'Arial',
            }}
          >
            {x.name}
          </div>
          {React.createElement(component, x.props)}
        </div>
      ))}
    </div>
  ))

  storyList.forEach(x => {
    stories.add(x.name, () => (
      <div style={{ backgroundColor: backgroundColor }}>{React.createElement(component, x.props)}</div>
    ))
  })
  return stories
}
