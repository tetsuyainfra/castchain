export const CASTCHAIN_API_CHANNEL_NAME = 'CASTCHAIN_API_CHANNEL'

export enum CASTCHAIN_API_ENTRIES {
  INIT_CHECK,
  // SOURCE
  LIST_SOURCE_PLUGINS,
  CREATE_SOURCE,
  DESTROY_SOURCE,
  LIST_SOURCE_INSTANCES,
  // OUTPUT
  LIST_OUTPUT_PLUGINS,
  CREATE_OUTPUT,
  DESTROY_OUTPUT,
  LIST_OUTPUT_INSTANCES,
}

// const pluginTypes = ['SOURCE', 'OUTPUT', 'FILTER', 'OTHER'] as const
// export type PluginTypes = typeof pluginTypes[number]

export const PluginKinds = {
  SOURCE: 'SOURCE',
  OUTPUT: 'OUTPUT',
  FILTER: 'FILTER',
  OTHER: 'OTHER',
} as const
export type PluginTypes = typeof PluginKinds[keyof typeof PluginKinds]
