export type SourcePluginInfo = {
  plugin_uuid: string
  plugin_name: string
  config: any
  status: any
}

//------------------------------------------------------------------------------
// Rendere -> Main 呼び出し時の固定値,メッセージ型
//------------------------------------------------------------------------------
export const SourceIpcCallEntries = {
  UPDATE_CONFIG: 'source/call/update_config',
  START_PUBLISH: 'source/call/start_publish',
  STOP_PUBLISH: 'source/call/stop_publish',
} as const
export type SourceIpcCallTypes = typeof SourceIpcCallEntries[keyof typeof SourceIpcCallEntries]

//------------------------------------------------------------------------------
// Main -> Rendererへのデータ配布時の固定値,メッセージ型
//------------------------------------------------------------------------------
export const SourceIpcNotifyEntries = {
  STATUS: 'source/notify/status',
  DATA: 'source/notify/data',
} as const
export type SourceIpcNotifyTypes = typeof SourceIpcNotifyEntries[keyof typeof SourceIpcNotifyEntries]

//------------------------------------------------------------------------------
// 一般掲示板コメントタイプ
//------------------------------------------------------------------------------
export type BbsComment = {
  num: number
  name: string
  mail?: string
  date: string
  body: string
  meta?: {
    thread_title?: string
    id?: string
  }
}

// export enum SOURCE_API_ENTRIES {
//   GET_NAME,
//   START_PUBLISH,
//   STOP_PUBLISH
//   // DATA_ARRIVE, -> START_PUBLISHでハンドル返す？
//   // ERROR_OCCURS ->
// }
