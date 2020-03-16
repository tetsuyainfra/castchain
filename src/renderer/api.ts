import { ipcRenderer } from 'electron'
import log from 'electron-log'

import {
  SOURCE_API_ENTRIES,
  CONTAINER_API_ENTRIES,
  CONTAINER_API_CHANNEL_NAME
} from '../commons/source'

import {
  CASTCHAIN_API_CHANNEL_NAME,
  CASTCHAIN_API_ENTRIES
} from '../commons/castchain'

export class StubAPI {
  async getName(): Promise<string | null> {
    return 'stub api name'
  }
  startPublish(callback: (c: any) => void) {}
  stopPublish() {}
}

export type CommentObject = {
  num: number
  name: string
  mail?: string
  date: string
  body: string
  thread_title?: string
  id?: string
}

export class SourceAPI extends StubAPI {
  ulid: string
  isListen: boolean

  constructor(ulid: string) {
    super()
    this.ulid = ulid
    this.isListen = false
  }
  async getName(): Promise<string | null> {
    console.log(`getName(${this.ulid})`)
    return ipcRenderer
      .invoke(this.ulid, { type: SOURCE_API_ENTRIES.GET_NAME })
      .then((r: { name: string }) => {
        return r.name
      })
      .catch(err => {
        console.log('err', err)
        return null
      })
  }
  startPublish(callback: (comments: Array<CommentObject>) => void) {
    log.info('startPublish')
    if (!this.isListen) {
      this.isListen = true
      log.info('register channel', this.ulid)
      ipcRenderer.on(this.ulid, (event, action) => {
        log.info(`message arrived: ${action.type}`)
        if (action.type == 'arrive_comments') {
          callback(action.payload)
        }
      })
      ipcRenderer.invoke(this.ulid, { type: SOURCE_API_ENTRIES.START_PUBLISH })
    }
  }
  stopPublish() {
    log.info('stopPublish')
    // if (this.isListen) {
    ipcRenderer
      .invoke(this.ulid, { type: SOURCE_API_ENTRIES.STOP_PUBLISH })
      .then(() => {
        ipcRenderer.removeAllListeners(this.ulid)
        log.info('unregister channel', this.ulid)
        this.isListen = false
      })
    // }
  }
}

// MEMO
// Render: URL                               -> uuid -> stateに入っていればあとはどうとでもなる？
// Main  :     -> new Plugin and Valid Check .....
// 初期化を考えると・・・・
// APIインスタンスをStateにぶちこむのはきたない
//

export class FactorySourceAPI {
  static async createPlugin(plugin_id: string, url: string) {
    return ipcRenderer.invoke(CONTAINER_API_CHANNEL_NAME, {
      type: CONTAINER_API_ENTRIES.CREATE_PLUGIN,
      payload: [plugin_id, url]
    })
  }

  static getApi(ulid: string): StubAPI {
    if (ulid) {
      return new SourceAPI(ulid)
    } else {
      return new StubAPI()
    }
  }
}

export class CastChainAPI {
  static initCheck() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.INIT_CHECK
    })
  }

  // Source
  static listSourcePlugins() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.LIST_SOURCE_PLUGINS
    })
  }
  static listSourceInstances() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.LIST_SOURCE_INSTANCES,
      payload: 'can you hear me ?'
    })
  }
  static getSourceInstance(
    plugin_uuid: string,
    plugin_name: string
  ): SourceApiInstance {
    return new SourceApiInstance(plugin_uuid, plugin_name)
  }

  // Output
  static listOutputPlugins() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.LIST_OUTPUT_PLUGINS
    })
  }
  static listOutputInstances() {
    return ipcRenderer.invoke(CASTCHAIN_API_CHANNEL_NAME, {
      type: CASTCHAIN_API_ENTRIES.LIST_OUTPUT_INSTANCES
    })
  }
}

import { MOCK_SOURCE_API_ENTRIES } from '../commons/source'
class SourceApiInstance {
  plugin_uuid_: string
  plugin_name_: string
  constructor(plugin_uuid: string, plugin_name: string) {
    this.plugin_uuid_ = plugin_uuid
    this.plugin_name_ = plugin_name
  }
  async updateConfig(config: any) {
    return ipcRenderer.invoke(this.plugin_uuid_, {
      type: MOCK_SOURCE_API_ENTRIES.UPDATE_CONFIG,
      payload: {
        plugin_uuid: this.plugin_uuid_,
        plugin_name: this.plugin_name_,
        config: config
      }
    })
  }
}
