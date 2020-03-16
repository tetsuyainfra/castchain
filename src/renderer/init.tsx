import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import log from 'electron-log'

import CircularProgress from '@material-ui/core/CircularProgress'

import { App } from './App'

import './global.css'

declare namespace global {
  let Setting: any
}
import { Setting } from '../commons/setting'
global.Setting = Setting

import { CastChainAPI } from './api'

const WaitInit = () => {
  const [initStatus, setInitStatus] = React.useState('loading')
  React.useEffect(() => {
    log.debug('WaitInit:useEffect()')

    let umounted = false
    const f = async () => {
      await new Promise(resolve => {
        resolve(CastChainAPI.initCheck())
      }).then(resolve => {
        if (!umounted) {
          setInitStatus('load')
        }
      })
    }
    f()

    const cleanup = () => {
      log.debug('WaitInit:cleanup()')
      umounted = true
    }
    return cleanup
  }, [])

  return initStatus == 'loading' ? <CircularProgress /> : <App />
}

ReactDOM.render(<WaitInit />, document.getElementById('app'))
