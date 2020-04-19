import * as React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  })
)

type TabBarProp = {
  tabs: Array<string>
  tabNumber: number
  onChange: Function
}

export const TabBar: React.FC<TabBarProp> = (props) => {
  const classes = useStyles()
  const { tabs, tabNumber, onChange } = props

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.root}>
        {/* <AppBar position="sticky"> */}
        {/* <AppBar position="fixed"> */}
        <Tabs
          value={tabNumber}
          onChange={(e, val) => {
            e.preventDefault()
            onChange(val)
          }}
        >
          {tabs.map((tab_name, idx) => (
            <Tab label={tab_name} key={idx} />
          ))}
        </Tabs>
      </AppBar>
      {/* <div className={classes.tabs_offset} /> */}
    </React.Fragment>
    // <Tabs value={value} onChange={handleChange}>
    //   {names.map((name, idx) => (
    //     <Tab label={name} key={idx} />
    //   ))}
    // </Tabs>
  )
}
