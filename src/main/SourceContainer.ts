import Electron from 'electron'
import log from 'electron-log'
import { SourcePluginInterface, ShitarabaPlugin } from './sources/Shitaraba'

import {
  CONTAINER_API_ENTRIES,
  CONTAINER_API_CHANNEL_NAME
} from '../commons/source'

type MessageType = {
  type: CONTAINER_API_ENTRIES
  payload?: any
}

interface SourcePluginKlass {
  name: string
  new (...args: any[]): SourcePluginInterface
  isValid(url: string): boolean
}

export class SourceContainer {
  private static CHANNEL_NAME = CONTAINER_API_CHANNEL_NAME
  private static SOURCE_PLUGINS: ReadonlyArray<SourcePluginKlass> = [
    ShitarabaPlugin
  ]
  private instances: Array<SourcePluginInterface> = []
  constructor() {
    this.create()
  }

  private create() {
    Electron.ipcMain.handle(
      SourceContainer.CHANNEL_NAME,
      this.handleMessage.bind(this)
    )
    log.debug('handleMessage() is attached')
  }
  cleanup() {
    Electron.ipcMain.removeHandler(SourceContainer.CHANNEL_NAME)
    this.instances.map(plugin => {
      plugin.cleanup()
    })
    log.debug('handleMessage() is removed')
  }

  async handleMessage(event: Electron.IpcMainInvokeEvent, msg: MessageType) {
    log.debug('handleMessage()', msg)
    const { ...API } = CONTAINER_API_ENTRIES

    switch (msg.type) {
      case API.INIT_CHECK:
        return { INIT_CHECK: true }
      case API.LIST_PLUGIN:
        return this.listPlugin()
      case API.CREATE_PLUGIN:
        return this.createPlugin(msg.payload)
      // case API.DESTROY_PLUGIN:
      //   return this.createPlugin(msg.payload)
      default:
        throw new Error('Method not implemented.')
        break
    }
  }

  listPlugin() {
    return SourceContainer.SOURCE_PLUGINS.map(
      (plugin: SourcePluginKlass) => plugin.name
    )
  }

  private createPluginInstanceHandle(plugin: SourcePluginInterface) {}

  async createPlugin(payload: [string, string]) {
    log.debug(`createPlugin()`)
    const [plugin_name, url] = payload
    let Plugin: SourcePluginKlass | undefined
    if (plugin_name) {
      Plugin = SourceContainer.SOURCE_PLUGINS.find(p => p.name == plugin_name)
    } else {
      // 全プラグインを全チェック・・・
      Plugin = SourceContainer.SOURCE_PLUGINS.find(p => new p(url).isValidURL())
    }
    try {
      if (!Plugin) {
        return { type: 'FAILED', payload: 'PLUGIN_NOT_FOUND' }
      }
      let instance = new Plugin(url)
      let ulid = instance.ulid
      let plugin_id = instance.plugin_id
      let exact_url = instance.url
      let name = instance.getSourceName()
      instance.registerHandle()
      this.instances.push(instance)

      return new Promise((resovle, reject) => {
        resovle({
          type: 'CREATED_SOURCE',
          payload: { ulid, plugin_id, url: exact_url, name: exact_url }
        })
      })
    } catch (e) {
      log.error(`fail create Plugin`, e)
      return { type: 'FAILED', payload: e }
    }
  }

  async playPlugin(args: any) {
    log.debug('playPlugin')
    return 'played'
  }
}
