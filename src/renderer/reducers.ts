import * as React from 'react'
import log from 'electron-log'

import { Actions } from './actions'
import { red } from '@material-ui/core/colors'
import { SourcePluginInfoType } from '../commons/source'

export type StateType = {
  isRoot: boolean
  count: number
  sources: Array<SourcePluginInfoType>
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
      plugin_id: 'ShitarabaPlugin'ources: [...reduced.sources, new_source]
  },
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
  outputs: [],
}

export type ActionType = {
  type: Actions
  payload: any
}

function _create_source(reduced: StateType, payload: any) {
  const { plugin_name, plugin_uuid, status, config } = payload
  const new_source = {
    plugin_name,
    plugin_uuid,
    status: status ? status : {},
    config: config ? config : {},
  }

  return {
    ...reduced,
    sources: [...reduced.sources, new_source],
  }
}

function _config_source(reduced: StateType, payload: any) {
  const { plugin_uuid, config } = payload
  // sources: [...reduced.sources, new_source]
  const configured = {
    ...reduced,
    sources: reduced.sources.map((src) => {
      if (src.plugin_uuid === plugin_uuid) {
        return { ...src, config: config }
      } else {
        return src
      }
    }),
  }
  return configured
}

function _update_status(
  reduced: StateType,
  update_status: SourcePluginInfoType
) {
  const { plugin_uuid, config, status } = update_status
  const configured = {
    ...reduced,
    sources: reduced.sources.map((src) => {
      if (src.plugin_uuid === plugin_uuid) {
        return { ...src, status, config }
      } else {
        return src
      }
    }),
  }
  // console.log('update_status', configured)
  return configured
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
    case Actions.update_status:
      return _update_status(reduced, action.payload.update_status)

    default:
      throw new Error('Not Implemented')
  }
}
