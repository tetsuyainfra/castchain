import { ipcMain } from 'electron'
import { ulid, ULID } from 'ulid'

import { PluginType } from '../../commons/castchain'
import { PluginSettingType } from '../../commons/setting'

export interface OutputPluginInterface {
  // Plugin Instance ID
  ulid_: string

  setConfig(config: PluginSettingType): boolean
  getConfig(): PluginSettingType
}

export interface OutputPluginInterfaceStatic {
  // Plugin Type
  plugin_type: PluginType
  // Plugin ID(Pluginの型を識別する)
  plugin_name: string

  // インスタンスのコンストラクター
  new (...args: any[]): OutputPluginInterface

  // インスタンスを作成せずにURLチェックを行う
  isValidURL(url: string): boolean
}

export abstract class OutputPluginAbstract implements OutputPluginInterface {
  ulid_: string

  constructor() {
    this.ulid_ = ulid()
  }
  abstract setConfig(config: PluginSettingType): boolean
  abstract getConfig(): PluginSettingType
}
