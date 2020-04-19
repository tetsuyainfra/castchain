import { ipcMain } from 'electron'
import { ulid, ULID } from 'ulid'
import { PluginSettingType } from '../../commons/setting'
import { SourcePluginInfo } from '../../commons/source'

//--------------------------------------------------------------------------------
// Plugin Interface
//--------------------------------------------------------------------------------
export interface SourcePluginInterface {
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
  getInfo(): SourcePluginInfo

  // -- command will wake from Main process
  updateSourceURL(url: string): boolean
  // startPublish(event: Electron.WebContents, payload: any): boolean
  startPublish(): boolean
  stopPublish(): boolean
}

//--------------------------------------------------------------------------------
// Plugin Interface for new and URL validater
//--------------------------------------------------------------------------------
export interface SourcePluginInterfaceStatic {
  // Plugin ID(Pluginの型を識別する)
  plugin_name: string

  // インスタンスのコンストラクター
  new (...args: any[]): SourcePluginInterface

  // インスタンスを作成せずにURLチェックを行う
  isValidURL(url: string): boolean
}

//--------------------------------------------------------------------------------
// Plugin Abstract Class
// こいつを継承して実装してくれー
//--------------------------------------------------------------------------------
export abstract class SourcePluginAbstract implements SourcePluginInterface {
  private ulid_: string

  constructor() {
    this.ulid_ = ulid()
  }
  get ulid(): string {
    return this.ulid_
  }

  abstract cleanup(): void

  abstract setConfig(config: PluginSettingType): boolean
  abstract getConfig(): PluginSettingType

  // -- status
  abstract isValid(): boolean
  abstract getInfo(): SourcePluginInfo

  // -- command will wake from Main process
  abstract updateSourceURL(url: string): boolean
  // abstract startPublish(event: Electron.WebContents, payload: any): boolean
  abstract startPublish(): boolean
  abstract stopPublish(): boolean
}

/*
export type MessageType = {
  type: SOURCE_API_ENTRIES
  payload?: any
}

// It's Observer
export interface ObserverFunction {
  (message: MessageType): boolean
}
*/
