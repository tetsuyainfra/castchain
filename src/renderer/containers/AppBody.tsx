import * as React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { GlobalDispatchContext, GlobalStateContext } from '../stores'

import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'

import { Layout } from './Layout'
import { PluginPanel } from './PluginPanel'

import { SourceAction } from '../actions'
import { CastChainAPI } from '../api'

const mapValues = require('lodash/mapValues')
// const fromPairs = require('lodash/fromPairs')

const useStyles = makeStyles((theme: Theme) => {
  // console.log(theme.mixins.toolbar)

  return createStyles({
    forms: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 'auto',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    // see mixint
    // https://github.com/mui-org/material-ui/blob/a94ad0cbdf3e24301428c01ec1d1b96083bf12ac/packages/material-ui/src/styles/createMixins.js#L32
    // なんだけどうまくいかない死にたい とりあえず固定値でごまかす
    panels: {
      // backgroundColor: 'grey',
      height: 'calc(100vh - 48px)',
      [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        height: 'calc(100vh - 48px)',
      },
      [theme.breakpoints.up('sm')]: {
        // height: 'calc(100vh - 64px)'
        height: 'calc(100vh - 48px)',
      },
    },
  })
})

export const AppBody = () => {
  const classes = useStyles()

  const state = React.useContext(GlobalStateContext)
  const dispatch = React.useContext(GlobalDispatchContext)

  let urlInput = React.createRef<HTMLInputElement>()
  const [urlValue, setUrlValue] = React.useState<string>(
    'http://bbs.jpnkn.com/test/read.cgi/tetsuyainfra/1582375424/'
    // http://bbs.jpnkn.com/tetsuyainfra/
  )

  // evt: React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>
  const handleOnChangeURL = (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setUrlValue(evt.target.value)
  }

  const handleCreateSource = (
    evt: React.FormEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (urlInput && urlInput.current) {
      evt.preventDefault()
      const url = urlInput.current.value
      return CastChainAPI.createSource(url).then((pinfo) => {
        console.log('result', pinfo)
        const action = SourceAction.created(
          pinfo.plugin_uuid,
          pinfo.plugin_name,
          pinfo.config,
          pinfo.status
        )
        // console.log('action', action)
        dispatch(action)
        setUrlValue('')
      })
    }
  }

  return (
    <Layout>
      {/* Layout height=100vh */}
      <Paper
        component="form"
        className={classes.forms}
        elevation={0}
        onSubmit={handleCreateSource}
      >
        <IconButton className={classes.iconButton} aria-label="menu">
          <MenuIcon />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="Input BBS URL"
          inputProps={{ 'aria-label': 'search google maps' }}
          inputRef={urlInput}
          onChange={handleOnChangeURL}
          value={urlValue}
        />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          onClick={handleCreateSource}
        >
          <AddIcon />
        </IconButton>
      </Paper>
      {/* Layout height=100vh */}
      <div className={classes.panels}>
        <PluginPanel />
      </div>
    </Layout>
  )
}
