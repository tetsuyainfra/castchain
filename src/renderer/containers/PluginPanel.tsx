import * as React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core/styles'

const has = require('lodash/has')

import { GlobalDispatchContext, GlobalStateContext } from '../stores'
import Typography from '@material-ui/core/Typography'

import { CastChainAPI } from '../api'
import { Actions, SourceAction } from '../actions'

import { TabBar } from './TabBar'
import { TabPanel } from './TabPanel'

import { SourcePluginInfo } from '../../commons/source'
import { MockSourcePanel } from '../components/MockSource/MockSourcePanel'
import { NichanSourcePanel } from '../components/NichanSource/NichanSourcePanel'

// TODO: i will be able to fixe it ?
// https://github.com/mui-org/material-ui/pull/19491
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    source_panel: {
      height: '100%',
      // backgroundColor: 'grey',
      display: 'flex',
      flexDirection: 'column',
    },
    panels: {
      flexGrow: 1,
      overflow: 'auto',
    },
  })
)

type SrcType = {
  plugin_name: string
  plugin_uuid: string
  config: any
  status: any
}

const PanelMaps: { [key: string]: any } = {
  MockSourcePlugin: MockSourcePanel,
  NichanSourcePlugin: NichanSourcePanel,
}
const getPanel = (src: SrcType): JSX.Element => {
  return React.createElement(PanelMaps[src.plugin_name], src)
}

type PluginPanelProps = {
  // className?: string
}

export const PluginPanel: React.FC<PluginPanelProps> = (props) => {
  const classes = useStyles()
  const state = React.useContext(GlobalStateContext)
  const dispatch = React.useContext(GlobalDispatchContext)

  // TODO: なんで副作用ありにしてるんだっけ？
  React.useEffect(() => {
    let unmounted = false
    const f = async () => {
      await CastChainAPI.listSourceInstances().then((plugin_infos) => {
        // console.log('CastChainAPI.listSourceInstances()', settings)
        if (!unmounted) {
          // console.log('mounted')
          plugin_infos.forEach((pinfo: SourcePluginInfo) => {
            const action = SourceAction.created(
              pinfo.plugin_uuid,
              pinfo.plugin_name,
              pinfo.config,
              pinfo.status
            )
            // console.log('action', action)
            dispatch(action)
          })
        }
      })
    }
    f()

    const cleanup = () => {
      unmounted = true
    }
    return cleanup
  }, [])
  // TODO: ↑この監視するリスト違う気がする

  const [tabNumber, setTabNumber] = React.useState<number>(0)

  return (
    <div className={classes.source_panel}>
      <TabBar
        tabs={state.sources.map((src) => src.status.tab_name)}
        tabNumber={tabNumber}
        onChange={setTabNumber}
      />
      <React.Fragment>
        {state.sources
          .map((src: SrcType, idx) => {
            return getPanel(src)
          })
          .map((elm, idx) => (
            <TabPanel
              tabSelect={tabNumber}
              tabIndex={idx}
              key={idx}
              className={classes.panels}
            >
              {elm}
            </TabPanel>
          ))}
      </React.Fragment>
    </div>
  )
}

/* クラスで作ろうとしたけどがんばってHOOKSで作るぞ！！！！
// やだおよおおおおお
type SourcePanelProps = {}
type SourcePanelState = {}

class SourcePanel extends React.Component<SourcePanelProps, SourcePanelState> {
  constructor(props: SourcePanelProps) {
    super(props)
    this.state = {}
  }

  render() {
    return <div>SourcePanel</div>
  }
}
*/
