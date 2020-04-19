import { SourcePluginInfoType } from './source'

// tsdを使ってTypeチェックするのはわかってるけどーどうしよう

describe('commons/source', () => {
  it('InfoType must include tab_name', () => {
    // TODO: errorになってほしいがやりかたわからねぇ
    const info: SourcePluginInfoType = {
      plugin_name: '',
      plugin_uuid: '',
      status: {
        include_another_props: 'addtest',
      },
      config: {},
    }
  })

  it('InfoType can hold other vairables but must include tab_name', () => {
    // include_other_props を許容する
    const info: SourcePluginInfoType = {
      plugin_name: '',
      plugin_uuid: '',
      status: {
        tab_name: 'tabname',
        include_other_props: 'addtest',
      },
      config: {},
    }
    expect(info.status.tab_name).toBe('tabname')
    expect(info.status.include_other_props).toBe('addtest')
  })
})
