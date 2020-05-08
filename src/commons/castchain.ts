import { CastChainAPI } from '../renderer/api'

export const CASTCHAIN_API_CHANNEL_NAME = 'CASTCHAIN_API_CHANNEL'

// export enum CASTCHAIN_API_ENTRIES {
//   INIT_CHECK,
//   // SOURCE
//   LIST_SOURCE_PLUGINS,
//   CREATE_SOURCE,
//   DESTROY_SOURCE,
//   LIST_SOURCE_INSTANCES,
//   // OUTPUT
//   LIST_OUTPUT_PLUGINS,
//   CREATE_OUTPUT,
//   DESTROY_OUTPUT,
//   LIST_OUTPUT_INSTANCES,
// }

export const CastChainApiEntries = {
  INIT_CHECK: 'castchain/init_check',
  // SOURCE
  LIST_SOURCE_PLUGINS: 'castchain/source/list_plugins',
  CREATE_SOURCE: 'castchain/source/create',
  DESTROY_SOURCE: 'castchain/source/destroy',
  LIST_SOURCE_INSTANCES: 'castchain/source/list_instances',
  // OUTPUT
  LIST_OUTPUT_PLUGINS: 'castchain/output/list_plugins',
  CREATE_OUTPUT: 'castchain/output/create',
  DESTROY_OUTPUT: 'castchain/output/destroy',
  LIST_OUTPUT_INSTANCES: 'castchain/output/list_instances',
} as const
export type CastChainApiType = typeof CastChainApiEntries[keyof typeof CastChainApiEntries]

// const pluginTypes = ['SOURCE', 'OUTPUT', 'FILTER', 'OTHER'] as const
// export type PluginTypes = typeof pluginTypes[number]

export const PluginKinds = {
  SOURCE: 'SOURCE',
  OUTPUT: 'OUTPUT',
  FILTER: 'FILTER',
  OTHER: 'OTHER',
} as const
export type PluginType = typeof PluginKinds[keyof typeof PluginKinds]
