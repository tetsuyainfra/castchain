import log from 'electron-log'
// const request = require('request-promise-native') // なぜかうまくうごかないたすけて
const request = require('request-promise')
// const request = require('request')
const isEmpty = require('lodash/isEmpty')
const toInteger = require('lodash/toInteger')

import iconv from 'iconv-lite'
import { compareAsc, format } from 'date-fns'

import { SOURCE_API_ENTRIES } from '../../commons/source'
import { SourcePluginAbstract, MessageType } from './SourceInterface'

type Comment = {
  num: number
  name: string
  mail?: string
  date: string
  body: string
  thread_title?: string
  id?: string
}

export class NichanPlugin extends SourcePluginAbstract {
  static plugin_id: string = 'NichanPlugin'
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

  static isValidURL(url: string): boolean {
    let match
    if ((match = NichanPlugin.MATCH_BOARD.exec(url))) {
      return true
    } else if ((match = NichanPlugin.MATCH_THREAD.exec(url))) {
      return true
    }
    return false
  }

  // Human readable name generated from User request url
  name: string = ''

  // User request url
  url: string = ''

  board_id: string | null = null
  thread_id: string | null = null
  last_read_number: number | null = null

  next_choices: any[] = []

  constructor(url: string) {
    super()
  }

  // -- command
  updateURL(url: string): boolean {
    return false
  }

  startPublish(): boolean {
    return false
  }

  stopPublish(): void {}

  isValid(): boolean {
    return false
  }
}
