import ElectronStore from 'electron-store'
import log from 'electron-log'
import yaml, { DEFAULT_SAFE_SCHEMA } from 'js-yaml'
import { differenceInCalendarWeeks } from 'date-fns'
// import { defaultState } from '../renderer/reducers'

// electron-store with typescript
// https://github.com/sindresorhus/electron-store/blob/17a8b7ab27606c9a52689a4ef6ae39893a4156d4/index.test-d.ts#L38-L59

export type PluginSettingType = {
  plugin_name: string
  plugin_uuid: string | null
  config: any
}

export type SettingType = {
  isRoot: boolean
  sources: Array<PluginSettingType>
  outputs: Array<PluginSettingType>
}

const defaultSetting: SettingType = {
  isRoot: true,
  sources: [
    {
      plugin_name: 'MockSourcePlugin',
      plugin_uuid: null,
      config: {
        name: 'Mock1',
        url: ''
      }
    },
    {
      plugin_name: 'MockSourcePlugin',
      plugin_uuid: null,
      config: {
        name: 'Mock2',
        url: ''
      }
    }
    // {
    //   name: 'tetsuyainfra',
    //   // url: 'http://jbbs.shitaraba.net/bbs/read.cgi/game/58589/1414143826/',
    //   url: 'https://bbs.jpnkn.com/test/read.cgi/tetsuyainfra/1582375424/l50',
    //   plugin_name: 'ShitarabaPlugin',
    //   ulid: null
    // }
  ],
  outputs: []
}
let cwd = undefined

if (typeof IS_DEVELOPMENT !== 'undefined') {
  cwd = IS_DEVELOPMENT ? process.cwd() : undefined
}

export const Setting = new ElectronStore<SettingType>({
  name: 'config', // filename
  defaults: defaultSetting,

  // cwd: app.getPath('userData'), // default
  cwd: cwd,

  fileExtension: 'yaml',
  serialize: yaml.safeDump,
  deserialize: yaml.safeLoad
})

Setting.onDidAnyChange(newVal => {
  log.info('Setting.onDidAnyChange:', newVal)
})

export function initializeSetting() {
  log.debug('initializeSetting()')
  Setting.reset()
  Setting.store = defaultSetting
  log.debug('initialized Setting', Setting.store)
}
