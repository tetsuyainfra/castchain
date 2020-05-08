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
import { PluginSettingType, Setting } from '../../commons/setting'

import { PluginKinds, PluginType } from '../../commons/castchain'
import { SourcePluginAbstract } from './SourceInterface'
import {
  NichanSourceMessage,
  StatusNotify,
} from '../../commons/sources/NichanSource'

export class NichanSourcePlugin extends SourcePluginAbstract {
  static plugin_type: PluginType = PluginKinds.SOURCE
  static plugin_name: string = 'NichanSourcePlugin'
  static isValidURL(url: string) {
    console.log('NichanSource isValidURL')
    return true
  }

  plugin_type_: PluginType = NichanSourcePlugin.plugin_type
  plugin_name_: string = NichanSourcePlugin.plugin_name
  bbs_name_: string
  url_: string
  read_no_: number

  publish_status_: 'pending' | 'polling'
  publish_handler_: NodeJS.Timeout | null

  constructor(config: any) {
    super()
    this.bbs_name_ = config.name || '未読み込み'
    this.url_ = config.url || ''
    this.read_no_ = config.read_no || 0

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
    msg: NichanSourceMessage
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
    const { bbs_name, url } = setting.config
    this.bbs_name_ = bbs_name ? bbs_name : this.bbs_name_
    this.url_ = url ? url : this.url_

    return true
  }
  getConfig(): PluginSettingType {
    return {
      plugin_name: this.plugin_name_,
      plugin_uuid: this.ulid,
      config: {
        bbs_name: this.bbs_name_,
        url: this.url_,
      },
    }
  }

  isValid(): boolean {
    return true
  }
  getInfo(): StatusNotify['payload'] {
    return {
      plugin_type: this.plugin_type_,
      plugin_name: this.plugin_name_,
      plugin_uuid: this.ulid,
      config: {
        bbs_name: this.bbs_name_,
        url: this.url_,
        read_no: this.read_no_,
      },
      status: {
        tab_name: `${this.bbs_name_}`,
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
    log.debug('NichanSourcePlugin.startPublish()')
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
    log.debug('NichanSourcePlugin.stopPublish()')
    if (this.publish_handler_) {
      this.publish_status_ = 'pending'
      clearTimeout(this.publish_handler_)
      this.publish_handler_ = null
    }
    return true
  }

  async handlePublish(msec: number, count: number): Promise<void> {
    log.debug(`NichanSource.handlePublish(${msec})`)
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
    log.debug(`NichanSource.notify(${msec}, ${count})`)
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
        log.debug(`NichanSourcePlugin.notfy() -> catch`)
        log.debug(e)
      }
    })
  }
}

const request = require('request-promise')
// const request = require('request')
// const isEmpty = require('lodash/isEmpty')
// const toInteger = require('lodash/toInteger')

// import iconv from 'iconv-lite'
// import { compareAsc, format } from 'date-fns'

export function urlNormalize(url: string) {
  const _url = new URL(url)
  const api_url = _url.origin
  return {
    api_url: api_url,
    bbs_path: '',
    thread_path: '',
    res_no: '',
    url_state: 'select_bbs' | 'select_thread' | 'select_res',
  }
}

export function getBbsConfig(url: string): Promise<Map<string, string>> {
  const setting_url = url + 'SETTING.TXT'
  return request({
    uri: setting_url,
    encoding: null,
  }).then((body: any) => {
    // EUC-JP -> UTF-8 String
    let setting = new Map<string, string>()
    let text = iconv.decode(body, 'euc_jp').toString()
    text
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line, i) => {
        let [k, v] = line.split('=', 2)
        if (k) {
          setting.set(k, v)
        }
      })
    return setting
  })
}

export function getBbsThreads(url: string): Promise<any[]> {
  return request({
    uri: url,
    encoding: null,
  }).then((body: any) => {
    return []
  })
}

export function getBbsComments(url: string): Promise<any[]> {
  return request({
    uri: url,
    encoding: null,
  }).then((body: any) => {
    return []
  })
}

// function getThreads(url: string): Promise<Array<{url: string, title: string}> {
//   return request({
//     uri: url,
//     encoding: null,
//   }).then((body:any)=>{})
// }

// function getThreadName(thread_url): Promise<string> {
//   return request({
//     uri: this.getSettingURL(),
//     encoding: null,
//   })
//     .then((body: any) => {
//       // EUC-JP -> UTF-8 String
//       let setting = new Map<string, string>()
//       let text = iconv.decode(body, 'euc_jp').toString()
//       text
//         .replace(/\r\n/g, '\n')
//         .split('\n')
//         .map((line, i) => {
//           let [k, v] = line.split('=', 2)
//           if (k) {
//             setting.set(k, v)
//           }
//         })
//       return setting.get('BBS_TITLE')
//     })
//     .catch((err: any) => {
//       log.error(err)
//       return 'error'
//     })
// }
// function fetchNotify(): void {
//   log.debug('fetchNotify()')
//   this.handlePublishing = null
//   console.log(`request: ${this.getThreadURL()}`)

//   // TODO: bodyの中断問題どうする？
//   request({
//     uri: this.getThreadURL(),
//     encoding: null,
//   })
//     //  Convert EUC->UTF8->Object{}
//     .then((body: any) => {
//       // EUC-JP -> UTF-8 String
//       let text = iconv.decode(body, 'euc_jp').toString()
//       // log.debug(text)
//       const comments = text
//         .replace(/\r\n/g, '\n')
//         .split('\n')
//         .map((line, i) => {
//           if (line == '') {
//             return null
//           }

//           // [レス番号]<>[名前]<>[メール]<>[日付]<>[本文]<>[スレッドタイトル]<>[ID]
//           let [num, name, mail, date, body, thread_title, id] = line.split(
//             '<>'
//           )
//           return {
//             num: toInteger(num),
//             name,
//             mail,
//             date,
//             body,
//             thread_title,
//             id,
//           }
//         })
//         .filter((v) => v)
//       return comments
//     })
//     // check max number
//     .then((comments: Array<Comment>) => {
//       log.debug('comments.length: ', comments.length)
//       if (comments.length > 0) {
//         const max_comment = comments.reduce((a, b) => (a.num > b.num ? a : b))
//         log.debug(`set last_read_number: ${max_comment.num}`)
//         this.last_read_number = max_comment.num
//       }
//       return comments
//     })
//     // notify to client
//     .then((comments: Array<Comment>) => {
//       log.debug('notify to sender browser')
//       if (this._sender) {
//         // const t = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
//         // this._sender.send(this.ulid, `from MAIN ${t}`)
//         this._sender.send(this.ulid, {
//           type: 'arrive_comments',
//           payload: comments,
//         })
//       }
//     })
//     // .catch(err => {
//     //   // TODO: エラーハンドリング
//     //   // パースエラー
//     //   // 接続エラー
//     //   //  その他
//     //   //  エラー過多ならストップする→それはFinallyにまかせるか？
//     // })
//     // register next
//     .finally(() => {
//       log.debug('finally()')
//       // register last read comments
//       // TODO:  URLfetch後にstopPublishしていたら止まらないのでここで判定する必要がある
//       this.handlePublishing = setTimeout(this.fetchNotify, 7 * 1000)
//     })
// }
