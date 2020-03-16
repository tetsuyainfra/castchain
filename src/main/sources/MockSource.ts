import Electron from 'electron'
import log from 'electron-log'

import iconv from 'iconv-lite'
import { compareAsc, format } from 'date-fns'

import { MOCK_SOURCE_API_ENTRIES } from '../../commons/source'
import { SourcePluginAbstract, MessageType } from './SourceInterface'
import { PluginSettingType } from '../../commons/setting'

type MockSourceMessageType = {
  type: MOCK_SOURCE_API_ENTRIES
  payload?: any
}

export class MockSourcePlugin extends SourcePluginAbstract {
  static plugin_name: string = 'MockSourcePlugin'
  static isValidURL(url: string) {
    return true
  }

  plugin_name_: string = MockSourcePlugin.plugin_name
  name_: string = ''
  url_: string = ''
  constructor(config: any) {
    super()
    this.name_ = config.name
    this.url_ = config.url

    Electron.ipcMain.handle(this.ulid_, this.handleChannel.bind(this))
  }
  cleanup(): void {
    // throw new Error('Method not implemented.')
    Electron.ipcMain.removeHandler(this.ulid_)
  }

  async handleChannel(
    event: Electron.IpcMainInvokeEvent,
    msg: MockSourceMessageType
  ) {
    log.debug('PluginContainer.handleChannel()', msg)
    const { ...API } = MOCK_SOURCE_API_ENTRIES
    switch (msg.type) {
      case API.UPDATE_CONFIG:
        return this.updateConfig(msg.payload)
      default:
        throw new Error('Method not implemented.')
        break
    }
  }

  setConfig(setting: PluginSettingType): boolean {
    if (setting.plugin_uuid !== this.ulid_) {
      return false
    }
    // TODO: 下いらないよなー
    if (setting.plugin_name !== this.plugin_name_) {
      return false
    }

    const { name, url } = setting.config
    this.name_ = name ? name : this.name_
    this.url_ = url ? url : this.url_

    return true
  }
  getConfig(): PluginSettingType {
    return {
      plugin_name: this.plugin_name_,
      plugin_uuid: this.ulid_,
      config: {
        name: this.name_,
        url: this.url_
      }
    }
  }

  isValid(): boolean {
    return true
  }
  getStatus(): Object {
    const { plugin_name, plugin_uuid } = this.getConfig()

    return {
      plugin_name,
      plugin_uuid,
      tab_name: `${this.name_}`,
      config: {
        name: this.name_,
        url: this.url_
      }
    }
  }

  async updateConfig(setting: any) {
    if (this.setConfig(setting)) {
      return { success: true, payload: this.getConfig() }
    } else {
      return { success: false, error: true }
    }
  }

  updateSourceURL(url: string): boolean {
    // throw new Error('Method not implemented.')
    return true
  }
  startPublish(): boolean {
    return true
  }
  stopPublish(): boolean {
    return true
  }
}
