import { ipcMain } from 'electron'
import { SOURCE_API_ENTRIES } from '../../commons/source'
import { ulid, ULID } from 'ulid'
import { PluginSettingType } from '../../commons/setting'

export type MessageType = {
  type: SOURCE_API_ENTRIES
  payload?: any
}

// It's Observer
export interface ObserverFunction {
  (message: MessageType): boolean
}

export interface SourcePluginInterface {
  // Plugin Instance ID
  ulid_: string

  // destructor user defined
  cleanup(): void

  setConfig(config: PluginSettingType): boolean
  getConfig(): PluginSettingType

  // -- observer and notify
  // addObserver(func: ObserverFunction): boolean
  // deleteObserver(func: ObserverFunction): void

  // -- status
  isValid(): boolean
  // getSourceName(): Promise<string>
  getStatus(): Object

  // -- command will wake from Main process
  updateSourceURL(url: string): boolean
  startPublish(): boolean
  stopPublish(): boolean
}

export interface SourcePluginInterfaceStatic {
  // Plugin ID(Pluginの型を識別する)
  plugin_name: string

  // インスタンスのコンストラクター
  new (...args: any[]): SourcePluginInterface

  // インスタンスを作成せずにURLチェックを行う
  isValidURL(url: string): boolean
}

export abstract class SourcePluginAbstract implements SourcePluginInterface {
  ulid_: string

  constructor() {
    this.ulid_ = ulid()
  }
  abstract cleanup(): void

  abstract setConfig(config: PluginSettingType): boolean
  abstract getConfig(): PluginSettingType

  // -- status
  abstract isValid(): boolean
  abstract getStatus(): Object
  // abstract getSourceName(): Promise<string>

  // -- command will wake from Main process
  abstract updateSourceURL(url: string): boolean
  abstract startPublish(): boolean
  abstract stopPublish(): boolean
}
