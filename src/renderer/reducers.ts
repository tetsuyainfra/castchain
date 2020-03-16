import * as React from 'react'
import log from 'electron-log'

import { Actions } from './actions'
import { red } from '@material-ui/core/colors'

export type StateType = {
  isRoot: boolean
  count: number
  sources: Array<{
    plugin_uuid: string
    plugin_name: string
    tab_name: string
    config?: any
  }>
  outputs: Array<{
    plugin_uuid: string
    plugin_name: string
    tab_name: string
    config?: any
  }>
}
/*
export const initialState: StateType = {
  isRoot: true,
  count: 100,
  sources: [
    {
      name: 'tetsuyainfra',
      url: 'http://jbbs.shitaraba.net/bbs/read.cgi/game/58589/1414143826/',
      plugin_id: 'ShitarabaPlugin',
      ulid: ''
    },
    {
      name: 'yoteichi',
      url: 'https://jbbs.shitaraba.net/game/48538/',
      plugin_id: 'ShitarabaPlugin',
      ulid: ''
    }
  ]
}*/

export const initialState: StateType = {
  isRoot: true,
  count: 100,
  sources: [],
  outputs: []
}

export type ActionType = {
  type: Actions
  payload: any
}

function _create_source(reduced: StateType, payload: any) {
  const { plugin_name, plugin_uuid, tab_name, config } = payload
  const new_source = {
    plugin_name,
    plugin_uuid,
    tab_name,
    config: config ? config : {}
  }

  return {
    ...reduced,
    sources: [...reduced.sources, new_source]
  }
}

function _config_source(reduced: StateType, payload: any) {
  const { plugin_uuid, config } = payload
  // sources: [...reduced.sources, new_source]
  const configured = {
    ...reduced,
    sources: reduced.sources.map(src => {
      if (src.plugin_uuid === plugin_uuid) {
        return { ...src, config: config }
      } else {
        return src
      }
    })
  }
  return configured
}

function _update_meta(reduced: StateType, payload: any) {
  const { ulid, meta_props } = payload
  const merged_meta = {
    ...reduced,
    sources: reduced.sources.map(src => {
      if (src.ulid == ulid) {
        return { ...src, ...meta_props }
      } else {
        return src
      }
    })
  }
  return merged_meta
}

function _data_arrived(reduced: StateType, payload: any) {
  const indexOf = reduced.sources.findIndex(s => {
    return s.ulid == payload.ulid
  })
  if (indexOf < 0) {
    throw new Error(`Not Find ${payload.ulid}`)
  }
  const new_state = {
    ...reduced
  }
  const merged = { ...reduced.sources[indexOf], ...payload }
  new_state.sources.splice(indexOf, 1, merged)
  // console.log(new_state)

  return new_state
}

export const reducer: React.Reducer<StateType, ActionType> = (
  state,
  action
) => {
  const { ...reduced } = state
  // log.debug('reducer()', state, action)

  switch (action.type) {
    case Actions.INIT:
      return { ...reduced }
    case Actions.created_source:
      return _create_source(reduced, action.payload)
    case Actions.config_source:
      return _config_source(reduced, action.payload)
    case Actions.update_meta:
      return _update_meta(reduced, action.payload)
    case Actions.data_arrived:
      return _data_arrived(reduced, action.payload)
    default:
      throw new Error('Not Implemented')
  }
}
