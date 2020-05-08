import * as React from 'react'
import log from 'electron-log'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { GlobalDispatchContext, GlobalStateContext } from '../stores'
import { Actions, SourceAction } from '../actions'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { ControlBar } from '../components/ControlBar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: {
      overflow: 'scroll',
      // padding: '0',
      // widht: '100vw'
      // height: '100vh'
    },
  })
)

type TabPanelProps = {
  tabIndex: number
  tabSelect: number
  className?: string
}

// TODO: check
// tabSelect === tabIndexしてると消えるのでは？
export const TabPanel: React.FC<TabPanelProps> = (props) => {
  const classes = useStyles()
  // console.log('TabPanel')
  const { children, tabSelect, tabIndex, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={tabSelect !== tabIndex}
      id={`simple-tabpanel-${tabIndex}`}
      aria-labelledby={`simple-tab-${tabIndex}`}
      // className={classes.panel}
      className={props.className}
      {...other}
    >
      {tabSelect === tabIndex && <Box p="1rem">{children}</Box>}
    </Typography>
  )
}
