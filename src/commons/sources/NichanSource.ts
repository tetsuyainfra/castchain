import { PluginType } from '../castchain'
import { SourceIpcCallEntries, SourceIpcNotifyEntries } from '../source'
import { BbsComment } from '../source'

export type NichanSourceConfig = {
  bbs_name: string
  url: string
  read_no: number
}

export type NichanSourceStatus = {
  tab_name: string
  publish_status: 'unknown' | 'pending' | 'polling'
}

export type NichanSourceInfo = {
  plugin_type: PluginType
  plugin_uuid: string
  plugin_name: string
  config: NichanSourceConfig
  status: NichanSourceStatus
}

//-------------------------------------------------------------------------
// MainのAPI呼び出し時固定値,メッセージ型
//-------------------------------------------------------------------------
export type UpdateConfigMessage = {
  type: typeof SourceIpcCallEntries.UPDATE_CONFIG
  payload: Partial<NichanSourceConfig>
}
export type StartMessage = {
  type: typeof SourceIpcCallEntries.START_PUBLISH
  payload?: any
}
export type StopMessage = {
  type: typeof SourceIpcCallEntries.STOP_PUBLISH
  payload?: any
}

export type NichanSourceMessage =
  | StartMessage
  | StopMessage
  | UpdateConfigMessage

//-------------------------------------------------------------------------
// Rendererへのデータ配布時の固定値,メッセージ型
//-------------------------------------------------------------------------
export type StatusNotify = {
  type: typeof SourceIpcNotifyEntries.STATUS
  payload: NichanSourceInfo
}

export type DataNotify = {
  type: typeof SourceIpcNotifyEntries.DATA
  payload: {
    comments: Array<BbsComment>
  }
}

export type NichanSourceNotify = StatusNotify | DataNotify
