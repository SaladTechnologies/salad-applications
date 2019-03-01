import React from 'react'
import { storiesOf } from '@storybook/react'
import { MachineSummaryView } from './components/MachineSummaryView'
import { Machine } from '../machine/Machine'

const getMachines = (num: number): Machine[] => {
  let array: Machine[] = new Array()

  for (var i = 0; i < num; i++) {
    let m = new Machine()
    m.name = `${i}-fjadoifoi-fdajfoibs-fda-dfafa-fdaffff-adfa`
    array[i] = m
  }

  return array
}

storiesOf('Modules/Machine', module).add('Summary View', () => (
  <div
    style={{
      backgroundColor: '#092234',
    }}
  >
    <MachineSummaryView machines={getMachines(3)} />
  </div>
))
