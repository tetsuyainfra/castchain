import { ipcRenderer, IpcRenderer } from 'electron'
import log from 'electron-log'
const removeFromArray = require('lodash/remove')
const findIndex = require('lodash/findIndex')

import {
  CASTCHAIN_API_CHANNEL_NAME,
  CASTCHAIN_API_ENTRIES,
} from '../commons/castchain'

// MEMO
// Render: URL                               -> uuid -> stateに入っていればあとはどうとでもなる？
// Main  :     -> new Plugin and Valid Check .....
// 初期化を考えると・・・・
// APIインスタンスをStateにぶちこむのはきたない

export class CastChainAPI {
  static SOURCE_INSTANCE_CACHE: { [key: string]: SourceApi } = {}

  static initCheck() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.INIT_CHECK,
    })
  }

  // Source
  static listSourcePlugins() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.LIST_SOURCE_PLUGINS,
    })
  }
  static listSourceInstances() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.LIST_SOURCE_INSTANCES,
      // payload: 'can you hear me ?'
    })
  }
  static getSourceInstance(
    plugin_uuid: string,
    plugin_name: string
  ): SourceApi {
    const cache = CastChainAPI.SOURCE_INSTANCE_CACHE
    if (typeof cache[plugin_uuid] === 'undefined') {
      console.log('new SouceApiInstance')
      cache[plugin_uuid] = new SourceApi(plugin_uuid, plugin_name)
    }
    return cache[plugin_uuid]
  }

  // Output
  static listOutputPlugins() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.LIST_OUTPUT_PLUGINS,
    })
  }
  static listOutputInstances() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.LIST_OUTPUT_INSTANCES,
    })
  }
}

import { SourceIpcCallEntries } from '../commons/source'

class SourceApi {
  plugin_uuid_: string
  plugin_name_: string
  listener_: null | IpcRenderer
  callbacks_: Array<Function>

  constructor(plugin_uuid: string, plugin_name: string) {
    this.plugin_uuid_ = plugin_uuid
    this.plugin_name_ = plugin_name
    this.handleMessage = this.handleMessage.bind(this)
    this.callbacks_ = []
    this.listener_ = ipcRenderer.addListener(
      this.plugin_uuid_,
      this.handleMessage
    )
  }
  cleanup(handle: (message: any) => void) {
    console.log('SourceApi.cleanup()')
    if (this.listener_) {
      this.listener_ = null
      ipcRenderer.removeListener(this.plugin_uuid_, this.handleMessage)
    }
  }

  // TODO: callbacksの処理どうかとおもう
  // 複数push、removeされたらどうなるのかなぁ
  listen(handle: (message: any) => void) {
    console.log('SourceApi.listen()')
    if (findIndex(this.callbacks_, (fn: Function) => fn === handle) < 0) {
      // console.log('append callbacks')
      this.callbacks_.push(handle)
    }
  }
  unlisten(handle: (message: any) => void) {
    console.log('SourceApi.unlisten()')
    removeFromArray(this.callbacks_, (fn: Function) => fn === handle)
  }

  // handleMessage(event: Electron.IpcRendererEvent, ...args: any[]) {
  handleMessage(event: Electron.IpcRendererEvent, message: any) {
    // console.log('SourceApiInstance --', event, message)
    this.callbacks_.forEach((fn) => {
      fn(message)
    })
  }

  async updateConfig(config: any) {
    return ipcRenderer.invoke(this.plugin_uuid_, {
      type: SourceIpcCallEntries.UPDATE_CONFIG,
      payload: {
        plugin_uuid: this.plugin_uuid_,
        plugin_name: this.plugin_name_,
        config: config,
      },
    })
  }

  async startPublish(): Promise<boolean> {
    return ipcRenderer.invoke(this.plugin_uuid_, {
      type: SourceIpcCallEntries.START_PUBLISH,
    })
  }
  async stopPublish(): Promise<boolean> {
    return ipcRenderer.invoke(this.plugin_uuid_, {
      type: SourceIpcCallEntries.STOP_PUBLISH,
    })
  }
}
