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

import { Actions, SourceAction } from '../actions'

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

  const handleCreateSource = (
    evt: React.FormEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    evt.preventDefault()

    if (urlInput && urlInput.current) {
      const url = urlInput.current.value
      urlInput.current.value = ''

      // FactorySourceAPI.createPlugin('ShitarabaPlugin', url).then(result => {
      //   const { plugin_id, ulid } = result.payload
      //   SourceAction.createPlugin(dispatch, ulid, plugin_id)
      // })
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
          value="http://jbbs.shitaraba.net/bbs/read.cgi/game/58589/1414143826/"
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
