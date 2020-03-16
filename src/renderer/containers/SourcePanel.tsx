import * as React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core/styles'

const has = require('lodash/has')

import { GlobalDispatchContext, GlobalStateContext } from '../stores'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'

import { TabPanel } from '../components/TabPanel'
import { CastChainAPI } from '../api'
import { Actions, SourceAction } from '../actions'

import { MockSourcePanel } from '../components/MockSource/MockSourcePanel'
import { WithTabContainer } from './WithTabContainer'

// TODO: i will be able to fixe it ?
// https://github.com/mui-org/material-ui/pull/19491
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    source_panel: {
      height: '100%',
      // backgroundColor: 'grey',
      display: 'flex',
      flexDirection: 'column'
    },
    tabs: {},
    tabs_offset: {},
    panels: {
      flexGrow: 1,
      overflow: 'auto'
    }
  })
)

type SourcePanelProps = {
  // className?: string
}

const PanelMaps = {
  MockSourcePlugin: MockSourcePanel
}

export const SourcePanel: React.FC<SourcePanelProps> = props => {
  const classes = useStyles()
  const state = React.useContext(GlobalStateContext)
  const dispatch = React.useContext(GlobalDispatchContext)

  React.useEffect(() => {
    let unmounted = false
    const f = async () => {
      await CastChainAPI.listSourceInstances().then(settings => {
        // console.log('CastChainAPI.listSourceInstances()', settings)
        if (!unmounted) {
          // console.log('mounted')
          settings.forEach((setting: any) => {
            const action = SourceAction.created(
              setting.plugin_uuid,
              setting.plugin_name,
              setting.tab_name,
              setting.config
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

  const [tabNumber, setTabNumber] = React.useState<number>(0)

  return (
    <div className={classes.source_panel}>
      <React.Fragment>
        <AppBar position="static">
          {/* <AppBar position="sticky"> */}
          {/* <AppBar position="fixed"> */}
          <Tabs
            value={tabNumber}
            onChange={(e, val) => {
              setTabNumber(val)
            }}
          >
            {state.sources.map((src, idx) => (
              <Tab label={src.tab_name} key={idx} />
            ))}
          </Tabs>
        </AppBar>
        <div className={classes.tabs_offset} />
      </React.Fragment>
      <React.Fragment>
        {state.sources
          .map((src, idx) => {
            if (has(PanelMaps, src.plugin_name)) {
              return (
                <MockSourcePanel
                  plugin_name={src.plugin_name}
                  plugin_uuid={src.plugin_uuid}
                  config={src.config}
                />
              )
            } else {
              return 'Item One'
            }
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
