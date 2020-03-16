import Electron from 'electron'
import log from 'electron-log'

import {
  CASTCHAIN_API_CHANNEL_NAME,
  CASTCHAIN_API_ENTRIES
} from '../commons/castchain'

//--------------------------------------------------------------------------------
//  Source Plugin
//--------------------------------------------------------------------------------
import {
  SourcePluginInterface,
  SourcePluginInterfaceStatic
} from './sources/SourceInterface'

import { MockSourcePlugin } from './sources/MockSource'

//--------------------------------------------------------------------------------
//  Output Plugin
//--------------------------------------------------------------------------------
import {
  OutputPluginInterface,
  OutputPluginInterfaceStatic
} from './outputs/OutputInterface'

import { MockOutputPlugin } from './outputs/MockOutput'
import { MainSetting, MainSettingType } from './MainSettings'
import { PluginSettingType } from '../commons/setting'

//--------------------------------------------------------------------------------
// CODE
//--------------------------------------------------------------------------------
type CastchainApiMessageType = {
  type: CASTCHAIN_API_ENTRIES
  payload?: any
}

type PluginInfo = {
  plugin_type: 'source' | 'output' | 'filter'
  plugin_name: string
}

export class PluginContainer {
  private static CHANNEL_NAME = CASTCHAIN_API_CHANNEL_NAME
  private static SOURCE_PLUGINS: ReadonlyArray<SourcePluginInterfaceStatic> = [
    MockSourcePlugin
  ]
  private static OUTPUT_PLUGINS: ReadonlyArray<OutputPluginInterfaceStatic> = [
    MockOutputPlugin
    // NichanPlugin
  ]

  //-----------------------------------------------------------------------------------------
  //  instance variables
  //-----------------------------------------------------------------------------------------
  sources_: Array<InstanceType<SourcePluginInterfaceStatic>>
  outputs_: Array<InstanceType<OutputPluginInterfaceStatic>>
  setting_: MainSettingType

  constructor() {
    log.debug('PluginContainer.constructor()')
    this.sources_ = []
    this.outputs_ = []
    this.setting_ = MainSetting.load()
    this.create()
  }
  create() {
    this._restorePlugins()
    Electron.ipcMain.handle(
      CASTCHAIN_API_CHANNEL_NAME,
      this.handleChannel.bind(this)
    )
    log.debug('handleMessage() is attached')
  }
  cleanup() {
    log.debug('PluginContainer.cleanup()')
    MainSetting.save(this.setting_)
    Electron.ipcMain.removeHandler(CASTCHAIN_API_CHANNEL_NAME)
  }

  private _restorePlugins() {
    this.sources_ = this.setting_.sources
      .map(setting => {
        log.debug('restorePlugin->', setting)
        return this.createSourceFromSetting(setting)
      })
      .filter((instance): instance is SourcePluginInterface => {
        return instance !== null
      })
    log.debug('restored sources_[]:', this.sources_)

    this.outputs_ = this.setting_.outputs
      .map(setting => {
        log.debug('restorePlugin->', setting)
        return this.createOutputFromSetting(setting)
      })
      .filter(
        (instance): instance is OutputPluginInterface => instance !== null
      )
    log.debug('restored outputs_[]:', this.outputs_)
  }
  private _storePlugins() {
    this.sources_.map(p => {
      log.debug(p.getConfig())
    })
    this.outputs_.map(p => {
      log.debug(p.getConfig())
    })
  }

  async handleChannel(
    event: Electron.IpcMainInvokeEvent,
    msg: CastchainApiMessageType
  ) {
    log.debug('PluginContainer.handleChannel()', msg)
    const { ...API } = CASTCHAIN_API_ENTRIES
    switch (msg.type) {
      case API.INIT_CHECK:
        return { INIT_CHECK: true }

      //  Source Plugin Methods
      case API.LIST_SOURCE_PLUGINS:
        return this.listSourcePlugins()
      case API.CREATE_SOURCE:
        return this.createSource(msg.payload)
      case API.DESTROY_SOURCE:
        return this.destroySource(msg.payload)
      case API.LIST_SOURCE_INSTANCES:
        return this.listSourceInstances()

      //  Output Plugin Methods
      case API.LIST_OUTPUT_PLUGINS:
        return this.listOutputPlugins()
      case API.CREATE_OUTPUT:
        return this.createSource(msg.payload)
      case API.DESTROY_OUTPUT:
        return this.destroySource(msg.payload)
      case API.LIST_OUTPUT_INSTANCES:
        throw new Error('Method not implemented.')

      //  Others... may be error occuried
      default:
        throw new Error('Method not implemented.')
        break
    }
  }

  //--------------------------------------------------------------------------------
  //  Source Plugin Methods
  //--------------------------------------------------------------------------------
  listSourcePlugins(): PluginInfo[] {
    return PluginContainer.SOURCE_PLUGINS.map(p => ({
      plugin_type: 'source',
      plugin_name: p.plugin_name
    }))
  }
  createSource(payload: any): SourcePluginInterface {
    throw new Error('Method not implemented.')
  }
  createSourceFromSetting(
    setting: PluginSettingType
  ): SourcePluginInterface | null {
    let Plugin = PluginContainer.SOURCE_PLUGINS.find(
      p => p.plugin_name === setting.plugin_name
    )
    if (!Plugin) {
      log.debug("Can't found correct Plugin", setting)
      return null
    } else {
      log.info('may be create plugin')
      return new Plugin(setting.config)
    }
  }
  destroySource(payload: any): void {}
  listSourceInstances() {
    return this.sources_.map(plugin => plugin.getStatus())
  }

  //--------------------------------------------------------------------------------
  //  Output Plugin Methods
  //--------------------------------------------------------------------------------
  listOutputPlugins(): PluginInfo[] {
    return PluginContainer.OUTPUT_PLUGINS.map(p => ({
      plugin_type: 'output',
      plugin_name: p.plugin_name
    }))
  }
  createOutput(payload: any): OutputPluginInterface {
    throw new Error('Method not implemented.')
  }
  createOutputFromSetting(
    setting: PluginSettingType
  ): OutputPluginInterface | null {
    let Plugin = PluginContainer.OUTPUT_PLUGINS.find(
      p => p.plugin_name === setting.plugin_name
    )
    if (!Plugin) {
      return null
    } else {
      return new Plugin(setting.config)
    }
  }
  destroyOutput(payload: any): void {
    throw new Error('Method not implemented.')
  }

  // async createFilter(payload: any) {}
  // async destroyFilter(payload: any) {}
}
