import log from 'electron-log'
// const request = require('request-promise-native') // なぜかうまくうごかないたすけて
const request = require('request-promise')
// const request = require('request')
const isEmpty = require('lodash/isEmpty')
const toInteger = require('lodash/toInteger')

import iconv from 'iconv-lite'
import { compareAsc, format } from 'date-fns'

import { ulid, ULID } from 'ulid'
import { ipcMain } from 'electron'
import { SOURCE_API_ENTRIES } from '../../commons/source'

// It's Observer
interface ObserverFunction {
  (message: MessageType): boolean
}

export interface SourcePluginInterface {
  // Plugin ID(Pluginの型を識別する)
  plugin_id: string
  // Plugin Instance ID
  ulid: string
  // 呼び名？
  name: string
  url: string

  // Plugin Can called this static interface
  // static isValid(url): boolean

  // destructor user defined
  cleanup(): void

  // -- init handler
  registerHandle(): boolean
  unregisterHandle(): void
  handleMessage(
    event: Electron.IpcMainInvokeEvent,
    msg: MessageType
  ): Promise<any>

  // -- observer and notify
  addObserver(func: ObserverFunction): boolean
  deleteObserver(func: ObserverFunction): void

  // -- status
  isValidURL(): boolean
  getSourceName(): Promise<string>

  // -- command will wake from Main process
  startPublish(): boolean
  stopPublish(): void
}
// abstract class SourcePluginAbstract implements SourcePluginInterface {

// It's Subject
abstract class SourcePluginAbstract implements SourcePluginInterface {
  observers: Array<ObserverFunction>

  ulid: string
  registered_handle = false

  abstract plugin_id: string
  abstract name: string
  abstract url: string

  constructor() {
    this.observers = []
    this.ulid = ulid()
  }

  cleanup() {
    this.unregisterHandle()
  }

  registerHandle() {
    log.debug(`Shitaraba.registerHandle(${this.ulid})`)
    if (!this.registered_handle) {
      ipcMain.handle(this.ulid, this.handleMessage.bind(this))
      log.debug('Shitaraba.registerHandle() is success')
      return true
    }
    return false
  }
  unregisterHandle() {
    if (this.registered_handle) {
      ipcMain.removeHandler(this.ulid)
    }
  }
  abstract handleMessage(
    event: Electron.IpcMainInvokeEvent,
    msg: MessageType
  ): Promise<any>

  addObserver(func: ObserverFunction): boolean {
    if (this.observers.includes(func)) {
      return false
    }

    this.observers.push(func)
    return true
  }

  deleteObserver(func: ObserverFunction): void {
    this.observers.splice(this.observers.indexOf(func), 1)
  }

  // -- status
  abstract isValidURL(): boolean
  abstract getSourceName(): Promise<string>

  // -- command will wake from Main process
  abstract updateURL(url: string): boolean
  abstract startPublish(): boolean
  abstract stopPublish(): void
}

type MessageType = {
  type: SOURCE_API_ENTRIES
  payload?: any
}

type Comment = {
  num: number
  name: string
  mail?: string
  date: string
  body: string
  thread_title?: string
  id?: string
}

export class ShitarabaPlugin extends SourcePluginAbstract {
  static MATCH_BOARD = new RegExp(
    /http(s)?:\/\/jbbs.shitaraba.net\/(\w+)\/(\d+)\//,
    'i'
  )
  static MATCH_BOARD_GROUP = {
    isSSL: 1,
    categroy: 2,
    board_id: 3
  }
  static MATCH_THREAD = new RegExp(
    /http(s)?:\/\/jbbs.shitaraba.net\/bbs\/read\.cgi\/(\w+)\/(\d+)\/(\d+)\//,
    'i'
  )
  static MATCH_THREAD_GROUP = {
    isSSL: 1,
    categroy: 2,
    board_id: 3,
    thread_id: 4
  }

  plugin_id: string = 'ShitarabaPlugin'

  // Human readable name generated from User request url
  name: string

  // User request url
  url: string

  categroy: string | null = null
  board_id: string | null = null
  thread_id: string | null = null
  last_read_number: number | null = null

  next_choices: any[] = []

  handlePublishing: NodeJS.Timeout | null
  _sender: Electron.WebContents | null = null

  static isValid(url: string): boolean {
    let match
    if ((match = ShitarabaPlugin.MATCH_BOARD.exec(url))) {
      return true
    } else if ((match = ShitarabaPlugin.MATCH_THREAD.exec(url))) {
      return true
    }
    return false
  }

  constructor(url: string) {
    super()
    this.name = ''
    this.url = url
    this.handlePublishing = null
    this.isValidURL()

    this.fetchNotify = this.fetchNotify.bind(this)
    this.startPublishSender = this.startPublishSender.bind(this)
    this.stopPublish = this.stopPublish.bind(this)
  }

  async handleMessage(event: Electron.IpcMainInvokeEvent, msg: MessageType) {
    log.debug('Shitaraba.handleMessage()', msg)
    switch (msg.type) {
      case SOURCE_API_ENTRIES.GET_NAME:
        let name = await this.getSourceName()
        return { name }
      case SOURCE_API_ENTRIES.START_PUBLISH:
        return { success: this.startPublishSender(event.sender) }
      case SOURCE_API_ENTRIES.STOP_PUBLISH:
        this.stopPublish()
        return { success: true }
      default:
        return { error: true }
    }
  }

  isValidURL(): boolean {
    let match
    if ((match = ShitarabaPlugin.MATCH_BOARD.exec(this.url))) {
      // As Board url,
      // User shold select reading which one thread.
      const group = ShitarabaPlugin.MATCH_BOARD_GROUP
      let isSSL = match[group.isSSL] ? true : false
      this.categroy = match[group.categroy]
      this.board_id = match[group.board_id]
      return true
    } else if ((match = ShitarabaPlugin.MATCH_THREAD.exec(this.url))) {
      // As Thread url
      // if thread is not finished, valid url.
      const group = ShitarabaPlugin.MATCH_THREAD_GROUP
      let isSSL = match[group.isSSL] ? true : false
      this.categroy = match[group.categroy]
      this.board_id = match[group.board_id]
      this.thread_id = match[group.thread_id]
      return true
    }
    return false
  }

  getSourceName(): Promise<string> {
    return request({
      uri: this.getSettingURL(),
      encoding: null
    })
      .then((body: any) => {
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
        return setting.get('BBS_TITLE')
      })
      .catch((err: any) => {
        log.error(err)
        return 'error'
      })
  }

  // -- command
  updateURL(url: string): boolean {
    return this.isValidURL()
  }

  startPublishSender(sender: Electron.WebContents): boolean {
    this._sender = sender
    return this.startPublish()
  }

  startPublish(): boolean {
    if (this.handlePublishing) {
      return false
    } else {
      log.debug('startPublish()')
      this.fetchNotify()
      // this.handlePublishing = setTimeout(this.fetchNotify, 3 * 1000)
      return true
    }
  }

  stopPublish(): void {
    if (this.handlePublishing) {
      this._sender = null
      clearInterval(this.handlePublishing)
    }
  }

  // PRIVATE
  private fetchNotify(): void {
    log.debug('fetchNotify()')
    this.handlePublishing = null
    console.log(`request: ${this.getThreadURL()}`)

    // TODO: bodyの中断問題どうする？
    request({
      uri: this.getThreadURL(),
      encoding: null
    })
      //  Convert EUC->UTF8->Object{}
      .then((body: any) => {
        // EUC-JP -> UTF-8 String
        let text = iconv.decode(body, 'euc_jp').toString()
        // log.debug(text)
        const comments = text
          .replace(/\r\n/g, '\n')
          .split('\n')
          .map((line, i) => {
            if (line == '') {
              return null
            }

            // [レス番号]<>[名前]<>[メール]<>[日付]<>[本文]<>[スレッドタイトル]<>[ID]
            let [num, name, mail, date, body, thread_title, id] = line.split(
              '<>'
            )
            return {
              num: toInteger(num),
              name,
              mail,
              date,
              body,
              thread_title,
              id
            }
          })
          .filter(v => v)
        return comments
      })
      // check max number
      .then((comments: Array<Comment>) => {
        log.debug('comments.length: ', comments.length)
        if (comments.length > 0) {
          const max_comment = comments.reduce((a, b) => (a.num > b.num ? a : b))
          log.debug(`set last_read_number: ${max_comment.num}`)
          this.last_read_number = max_comment.num
        }
        return comments
      })
      // notify to client
      .then((comments: Array<Comment>) => {
        log.debug('notify to sender browser')
        if (this._sender) {
          // const t = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          // this._sender.send(this.ulid, `from MAIN ${t}`)
          this._sender.send(this.ulid, {
            type: 'arrive_comments',
            payload: comments
          })
        }
      })
      // .catch(err => {
      //   // TODO: エラーハンドリング
      //   // パースエラー
      //   // 接続エラー
      //   //  その他
      //   //  エラー過多ならストップする→それはFinallyにまかせるか？
      // })
      // register next
      .finally(() => {
        log.debug('finally()')
        // register last read comments
        // TODO:  URLfetch後にstopPublishしていたら止まらないのでここで判定する必要がある
        this.handlePublishing = setTimeout(this.fetchNotify, 7 * 1000)
      })
  }

  private getSettingURL(): string {
    return `http://jbbs.livedoor.jp/bbs/api/setting.cgi/${this.categroy}/${this.board_id}/`
  }

  private getThreadURL(): string {
    const start_option = this.last_read_number
      ? `${this.last_read_number + 1}-`
      : ''
    return `http://jbbs.livedoor.jp/bbs/rawmode.cgi/${this.categroy}/${this.board_id}/${this.thread_id}/${start_option}`
  }
}

// https://info.5ch.net/index.php/Monazilla/develop/shitaraba

// http://jbbs.livedoor.jp/bbs/api/setting.cgi/[カテゴリ]/[番地]/
// TOP=掲示板のURL
// DIR=カテゴリ
// BBS=番地
// CATEGORYカテゴリ名(日本語名)
// BBS_THREAD_STOP=１スレッドに書き込めるレスの上限数
// BBS_NONAME_NAME=名無しさんの名前
// BBS_DELETE_NAME=削除されたレスに付く名前(あぼーん名)
// BBS_TITLE=掲示板タイトル
// BBS_COMMENT=掲示板の説明文

// TODO: HTTP通信のcache機構が必要そう
