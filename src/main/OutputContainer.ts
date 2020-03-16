import {
  OUTPUT_CONTAINER_API_CHANNEL_NAME,
  OUTPUT_CONTAINER_API_ENTRIES,
  OUTPUT_API_ENTRIES
} from '../commons/output'

type MessageType = {
  type: OUTPUT_CONTAINER_API_ENTRIES
  payload?: any
}

interface OutputPluginInterface {
  plugin_type: 'OutputPlugin'
  plugin_name: string
  plugin_id: string // = ulid
  ulid: string
  cleanup(): void
}

interface OutputPluginKlass {
  name: string
  new (...args: any[]): OutputPluginInterface
  isValid(...args: any[]): boolean
}

export class OutputContainer {
  private static CHANNEL_NAME = OUTPUT_CONTAINER_API_CHANNEL_NAME
  private static OUTPUT_PLUGINS: ReadonlyArray<OutputPluginKlass> = []
  private instances_: Map<string, OutputPluginInterface>

  constructor() {
    this.instances_ = new Map<string, OutputPluginInterface>()
    this.create()
  }

  private create() {
    Electron.ipcMain.handle(
      OutputContainer.CHANNEL_NAME,
      this.handleMessage.bind(this)
    )
    log.debug('OutputContaine.handleMessage() is attached')
  }

  cleanup() {
    Electron.ipcMain.removeHandler(OutputContainer.CHANNEL_NAME)
    this.instances_.forEach((plugin, ulid) => {
      plugin.cleanup()
    })
    log.debug('OutputContainer.handleMessage() is removed')
  }

  async handleMessage(
    event: Electron.IpcMainInvokeEvent,
    msg: MessageType
  ): Promise<any> {
    log.debug('OutputContainer.handleMessage()', msg)
    const { ...API } = OUTPUT_CONTAINER_API_ENTRIES

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
    return OutputContainer.OUTPUT_PLUGINS.map(
      (plugin: OutputPluginKlass) => plugin.name
    )
  }

  async createPlugin(payload: any[]) {
    log.debug(`OutputContainer.createPlugin()`)
    const [plugin_name, ...args] = payload
    let Plugin: OutputPluginKlass | undefined
    if (plugin_name) {
      Plugin = OutputContainer.OUTPUT_PLUGINS.find(p => p.name == plugin_name)
    } else {
      // 全プラグインを全チェック・・・
      Plugin = OutputContainer.OUTPUT_PLUGINS.find(p => p.isValid(args))
    }
    try {
      if (!Plugin) {
        return { type: 'FAILED', payload: 'PLUGIN_NOT_FOUND' }
      }
      let instance = new Plugin(args)
      let plugin_id = instance.plugin_id
      let plugin_type = instance.plugin_type
      let plugin_name = instance.plugin_name
      this.instances_.set(plugin_id, instance)

      return {
        type: 'CREATED_OUTPUT',
        payload: { plugin_type, plugin_name, plugin_id }
      }
    } catch (e) {
      log.error(`fail create Plugin`, e)
      return { type: 'FAILED', payload: e }
    }
  }
}
