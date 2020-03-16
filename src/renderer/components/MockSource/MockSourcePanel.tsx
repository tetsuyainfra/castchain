import React from 'react'

import { GlobalDispatchContext, GlobalStateContext } from '../../stores'
import { SourceAction } from '../../actions'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { ControlBar } from '../ControlBar'

import { MockSourceSettingDialog } from './MockSourceSettingDialog'
import { CastChainAPI } from '../../api'
import { ipcRenderer } from 'electron'

type MockSourcePanelProp = {
  plugin_name: string
  plugin_uuid: string
  config: {
    name?: string
    url?: string
  }
}

type MockSourcePanelState = {}

export const MockSourcePanel: React.FC<MockSourcePanelProp> = props => {
  console.log('render MockSourcePanel')
  const { plugin_name, plugin_uuid, config } = props
  const [open, setOpen] = React.useState(false)

  // const state = React.useContext(GlobalStateContext)
  const dispatch = React.useContext(GlobalDispatchContext)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleSubmit = (config: MockSourcePanelProp['config']) => {
    console.log('handleSubmit', config)
    setOpen(false)
    // dispatch(SourceAction.config(plugin_uuid, config))
    const api = CastChainAPI.getSourceInstance(plugin_uuid, plugin_name)
    api.updateConfig(config).then(retValue => {
      console.log('updateConfig(retValue): ', retValue)
      if (retValue.success) {
        const { config } = retValue.payload
        dispatch(SourceAction.config(plugin_uuid, config))
      }
    })
  }
  const handleCancel = () => {
    console.log('handleCancel')
    setOpen(false)
  }

  return (
    <>
      <h1>MockSourcePanel</h1>
      <ControlBar handleSetting={handleClickOpen} />
      <MockSourceSettingDialog
        configValue={config}
        open={open}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      <dl>
        <dt>plugin_name</dt>
        <dd>{plugin_name}</dd>
        <dt>plugin_uuid</dt>
        <dd>{plugin_uuid}</dd>
        <dt>config.name</dt>
        <dd>{config.name}</dd>
        <dt>config.url</dt>
        <dd>{config.url}</dd>
      </dl>
    </>
  )
}
