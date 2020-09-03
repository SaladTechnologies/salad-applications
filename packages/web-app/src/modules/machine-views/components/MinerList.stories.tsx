import React from 'react'
import { MinerList } from './MinerList'

export default {
  title: 'Modules/Machine/Miner List',
  component: MinerList,
}

// const installingPlugin = new PluginHistory('1', 'PhoenixMiner', '5.1c', 'Installing')
// const initializingPlugin = new PluginHistory('2', 'GMiner', '2.21', 'Prepping')
// const runningPlugin = new PluginHistory('2', 'Claymore', '15', 'Chopping')
// const stoppedPlugin = new PluginHistory('3', 'MiniZ', '1.6v3', 'Stopped')
// const errorPlugin = new PluginHistory('4', 'T-Rex', '0.16.1', 'Unable to Download Miner')

export const Empty = () => <MinerList />
// export const All = () => (
//   <MinerList plugins={[installingPlugin, initializingPlugin, runningPlugin, stoppedPlugin, errorPlugin]} />
// )
