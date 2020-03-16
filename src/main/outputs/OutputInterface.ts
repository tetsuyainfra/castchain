import { ipcMain } from 'electron'
import { SOURCE_API_ENTRIES } from '../../commons/source'
import { ulid, ULID } from 'ulid'
import { PluginSettingType } from '../../commons/setting'

export interface OutputPluginInterface {
  // Plugin Instance ID
  ulid_: string

  setConfig(config: PluginSettingType): boolean
  getConfig(): PluginSettingType
}

export interface OutputPluginInterfaceStatic {
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
