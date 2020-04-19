import { SourceIpcCallEntries, SourceIpcNotifyEntries } from '../source'
import { Config } from 'electron'

export type MockSourceConfig = {
  name: string
  url: string
}

export type MockSourceStatus = {
  tab_name: string
  publish_status: 'unknown' | 'pending' | 'polling'
}

export type MockSourceInfo = {
  plugin_uuid: string
  plugin_name: string
  config: MockSourceConfig
  status: MockSourceStatus
}

//-------------------------------------------------------------------------
// MainのAPI呼び出し時固定値,メッセージ型
//-------------------------------------------------------------------------
export type UpdateConfigMessage = {
  type: typeof SourceIpcCallEntries.UPDATE_CONFIG
  payload: Partial<MockSourceConfig>
}
export type StartMessage = {
  type: typeof SourceIpcCallEntries.START_PUBLISH
  payload?: any
}
export type StopMessage = {
  type: typeof SourceIpcCallEntries.STOP_PUBLISH
  payload?: any
}

export type MockSourceMessage = StartMessage | StopMessage | UpdateConfigMessage

//-------------------------------------------------------------------------
// Rendererへのデータ配布時の固定値,メッセージ型
//-------------------------------------------------------------------------
export type StatusNotify = {
  type: typeof SourceIpcNotifyEntries.STATUS
  payload: MockSourceInfo
}

export type DataNotify = {
  type: typeof SourceIpcNotifyEntries.DATA
  payload: any
}

export type MockSourceNotify = StatusNotify | DataNotify
