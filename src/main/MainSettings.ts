import log from 'electron-log'
import { SettingType, Setting, PluginSettingType } from '../commons/setting'

export type MainSettingType = Pick<SettingType, 'sources' | 'outputs'>

export function save(config: MainSettingType) {
  log.debug('MainSettings.save()', config)
  Setting.set('sources', config.sources)
  Setting.set('outputs', config.outputs)
}

export function load(): MainSettingType {
  const sources = Setting.get('sources')
  const outputs = Setting.get('outputs')
  return { sources, outputs }
}

export const MainSetting = {
  save,
  load
}

/*

const config = MainSetting.load()
...
const result = MainSetting.save(config)

*/
