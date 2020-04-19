import Electron, { BrowserWindow, ipcRenderer, webContents } from 'electron'
import log from 'electron-log'
import AsyncLock from 'async-lock'
import { EventEmitter } from 'events'
import iconv from 'iconv-lite'
import { compareAsc, format } from 'date-fns'

import {
  SourceIpcNotifyEntries,
  SourceIpcCallEntries,
} from '../../commons/source'
import { PluginSettingType } from '../../commons/setting'

import { SourcePluginAbstract } from './SourceInterface'
import {
  MockSourceMessage,
  StatusNotify,
  ConfigType,
} from '../../commons/sources/MockSource'

export class MockSourcePlugin extends SourcePluginAbstract {
  static plugin_name: string = 'MockSourcePlugin'
  static isValidURL(url: string) {
    return true
  }

  plugin_name_: string = MockSourcePlugin.plugin_name
  name_: string
  url_: string
  publish_status_: 'pending' | 'polling'
  publish_handler_: NodeJS.Timeout | null

  constructor(config: any) {
    super()
    this.name_ = config.name || ''
    this.url_ = config.url || ''
    this.publish_status_ = 'pending'
    this.publish_handler_ = null
    this.handlePublish = this.handlePublish.bind(this)
    log.debug(`create IPC handle: ${this.ulid}`)
    Electron.ipcMain.handle(this.ulid, this.handleChannel.bind(this))
  }
  cleanup(): void {
    log.debug(`cleanup IPC handle: ${this.ulid}`)
    Electron.ipcMain.removeHandler(this.ulid)
  }

  async handleChannel(
    event: Electron.IpcMainInvokeEvent,
    msg: MockSourceMessage
  ) {
    log.debug('MockSourcePlugin.handleChannel()', msg)
    const { ...API } = SourceIpcCallEntries
    switch (msg.type) {
      case API.UPDATE_CONFIG:
        return this.updateConfig(msg.payload)
      case API.START_PUBLISH:
        return this.startPublish()
      case API.STOP_PUBLISH:
        return this.stopPublish()
      default:
        throw new Error('Method not implemented.')
        break
    }
  }

  setConfig(setting: PluginSettingType): boolean {
    const { name, url } = setting.config
    this.name_ = name ? name : this.name_
    this.url_ = url ? url : this.url_

    return true
  }
  getConfig(): PluginSettingType {
    return {
      plugin_name: this.plugin_name_,
      plugin_uuid: this.ulid,
      config: {
        name: this.name_,
        url: this.url_,
      },
    }
  }

  isValid(): boolean {
    return true
  }
  getInfo(): StatusNotify['payload'] {
    return {
      plugin_name: this.plugin_name_,
      plugin_uuid: this.ulid,
      config: {
        name: this.name_,
        url: this.url_,
      },
      status: {
        tab_name: `Tab:${this.name_}`,
        publish_status: this.publish_status_,
      },
    }
  }

  async updateConfig(setting: any): Promise<StatusNotify['payload'] | false> {
    if (this.setConfig(setting)) {
      return this.getInfo()
    } else {
      return false
    }
  }

  updateSourceURL(url: string): boolean {
    // throw new Error('Method not implemented.')
    return true
  }

  startPublish(): boolean {
    log.debug('MockSourcePlugin.startPublish()')
    if (this.publish_status_ !== 'polling') {
      this.publish_status_ = 'polling'
      this.publish_handler_ = global.setTimeout(
        this.handlePublish,
        0,
        // args
        0,
        0
      )
      return true
    }
    return false
  }
  stopPublish(): boolean {
    log.debug('MockSourcePlugin.stopPublish()')
    if (this.publish_handler_) {
      this.publish_status_ = 'pending'
      clearTimeout(this.publish_handler_)
      this.publish_handler_ = null
    }
    return true
  }

  async handlePublish(msec: number, count: number): Promise<void> {
    log.debug(`MockSourcePlugin.handlePublish(${msec})`)
    this.publish_handler_ = null
    if (this.publish_status_ !== 'polling') {
      return
    }

    try {
      // fetch from network ...
      // something to do ...
      // then process ...
      this.notify(msec, count)
    } catch {
      //
    } finally {
      if (this.publish_status_ !== 'polling') {
        return
      }
      this.publish_handler_ = global.setTimeout(
        this.handlePublish,
        2000,
        // args
        2000,
        count + 1
      )
    }
  }

  notify(msec: number, count: number): void {
    log.debug(`MockSourcePlugin.notify(${msec}, ${count})`)
    const info = this.getInfo()

    webContents.getAllWebContents().forEach((browser) => {
      try {
        browser.send(this.ulid, {
          type: SourceIpcNotifyEntries.STATUS,
          payload: info,
        })
        browser.send(this.ulid, {
          type: SourceIpcNotifyEntries.DATA,
          payload: {
            plugin_uuid: this.ulid,
            msec,
            count,
          },
        })
      } catch (e) {
        log.debug(`MockSourcePlugin.notfy() -> catch`)
        log.debug(e)
      }
    })
  }
}
