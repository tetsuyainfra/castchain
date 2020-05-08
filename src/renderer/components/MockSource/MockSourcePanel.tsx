import React from 'react'

import { GlobalDispatchContext, GlobalStateContext } from '../../stores'
import { SourceAction, Actions } from '../../actions'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { ControlBar } from '../ControlBar'

import { MockSourceSettingDialog } from './MockSourceSettingDialog'
import { CastChainAPI } from '../../api'
import { ipcRenderer } from 'electron'
import { SourceIpcNotifyEntries } from '../../../commons/source'

import {
  MockSourceConfig,
  MockSourceStatus,
} from '../../../commons/sources/MockSource'

type MockSourcePanelProp = {
  plugin_name: string
  plugin_uuid: string
  config: Partial<MockSourceConfig>
  status: MockSourceStatus
}

type StatusMsg = {
  type: typeof SourceIpcNotifyEntries.STATUS
  payload: {
    plugin_uuid: string
    status: Partial<MockSourceStatus>
  }
}
type DataMsg = {
  type: typeof SourceIpcNotifyEntries.DATA
  payload: {
    plugin_uuid: string
    count: number
    msec: number
  }
}

type Message = StatusMsg | DataMsg

export const MockSourcePanel: React.FC<MockSourcePanelProp> = (props) => {
  console.log('render MockSourcePanel')
  const { plugin_name, plugin_uuid, config, status } = props

  // const state = React.useContext(GlobalStateContext)
  const dispatch = React.useContext(GlobalDispatchContext)
  const handleStart = () => {
    console.log('handleStart')
    const api = CastChainAPI.getSourceInstance(plugin_uuid, plugin_name)
    api.startPublish()
  }
  const handleStop = () => {
    console.log('handleStop')
    const api = CastChainAPI.getSourceInstance(plugin_uuid, plugin_name)
    api.stopPublish()
  }

  const [data, setData] = React.useState({ count: -1, msec: -1 })

  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleSubmit = (config: MockSourcePanelProp['config']) => {
    // console.log('handleSubmit', config)
    setOpen(false)
    // dispatch(SourceAction.config(plugin_uuid, config))
    const api = CastChainAPI.getSourceInstance(plugin_uuid, plugin_name)
    api.updateConfig(config).then((retValue) => {
      console.log('updateConfig(retValue): ', retValue)
      if (retValue.success) {
        dispatch(SourceAction.update_status(plugin_uuid, retValue.payload))
      }
    })
  }
  const handleCancel = () => {
    // console.log('handleCancel')
    setOpen(false)
  }

  React.useEffect(() => {
    console.log('MockSourcePanel@useEffect')
    const api = CastChainAPI.getSourceInstance(plugin_uuid, plugin_name)
    const handle = (msg: Message) => {
      console.log(msg)
      switch (msg.type) {
        case SourceIpcNotifyEntries.STATUS:
          break
        case SourceIpcNotifyEntries.DATA:
          {
            const { count, msec } = msg.payload
            setData({ count: count, msec: msec })
          }
          break
        default:
          break
      }
    }
    api.listen(handle)

    const clean = () => {
      console.log('MockSourcePanel@userEfefct clean()')
      api.unlisten(handle)
    }

    return clean
  }, [plugin_uuid, status.publish_status])

  return (
    <>
      {/* <Typography>MockSourcePanel</Typography> */}
      <Typography variant="h6" gutterBottom>
        MockSourcePanel
      </Typography>
      <ControlBar
        handlePlay={handleStart}
        handlePause={handleStop}
        handleSetting={handleClickOpen}
      />
      <MockSourceSettingDialog
        configValue={config}
        open={open}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      <dl>
        <dt>count</dt>
        <dd>{data.count} </dd>
        <dt>msec</dt>
        <dd>{data.msec} </dd>
      </dl>
      <dl>
        <dt>plugin_name</dt>
        <dd>{plugin_name}</dd>
        <dt>plugin_uuid</dt>
        <dd>{plugin_uuid}</dd>
        <dt>status.tab_name</dt>
        <dd>{status.tab_name}</dd>
        <dt>status.publish_status</dt>
        <dd>{status.publish_status}</dd>
        <dt>config.name</dt>
        <dd>{config.name}</dd>
        <dt>config.url</dt>
        <dd>{config.url}</dd>
      </dl>
    </>
  )
}

// const MockStatusMsg = (payload: any) => {
//   return {
//     type: NotifyEntries.STATUS,
//     payload: {
//       plugin_name: payload.plugin_name,
//       plugin_uuid: payload.plugin_uuid,
//       status: {
//         tab_name: payload.status.tab_name,
//         publish_status: payload.status.publish_status,
//       },
//     },
//   }
// }

// const MockDataMsg = (payload: any) => {
//   return {
//     type: NotifyEntries.DATA,
//     payload: {
//       plugin_uuid: payload.plugin_uuid,
//       count: payload.count,
//       msec: payload.msec,
//     },
//   }
// }

// type NotifyMessage =
//   | // | ReturnType<typeof MockConfig>
//   ReturnType<typeof MockStatusMsg>
//   | ReturnType<typeof MockDataMsg>
