import log from 'electron-log'

import iconv from 'iconv-lite'
import { compareAsc, format } from 'date-fns'

import { OutputPluginAbstract } from './OutputInterface'
import { PluginSettingType } from '../../commons/setting'
import { PluginKinds, PluginType } from '../../commons/castchain'

export class MockOutputPlugin extends OutputPluginAbstract {
  static plugin_type: PluginType = PluginKinds.OUTPUT
  static plugin_name: string = 'MockOutputPlugin'
  static isValidURL(url: string) {
    return true
  }

  plugin_type: PluginType = MockOutputPlugin.plugin_type
  plugin_name_: string = MockOutputPlugin.plugin_name
  name_: string = ''
  url_: string = ''
  constructor() {
    super()
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
      config: {},
    }
  }

  isValid(): boolean {
    return true
  }

  updateOutputURL(url: string): boolean {
    return true
  }
  startPublish(): boolean {
    return true
  }
  stopPublish(): boolean {
    return true
  }
}
