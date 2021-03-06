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
  LIST_OUTPUT_INSTANCES
}
