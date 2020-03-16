import * as React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import StopIcon from '@material-ui/icons/Stop'
import SettingsIcon from '@material-ui/icons/Settings'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: 'fit-content',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    '& svg': {
      margin: theme.spacing(2)
    },
    '& hr': {
      margin: theme.spacing(0, 0.5)
    }
  }
}))

type ControlBarProps = {
  handlePlay?: Function
  handlePause?: Function
  handleStop?: Function
  handleSetting?: Function
}

export const ControlBar: React.FC<ControlBarProps> = props => {
  const classes = useStyles()
  const { handlePlay, handlePause, handleStop, handleSetting } = props
  return (
    <ButtonGroup color="primary" aria-label="outlined primary button group">
      <Button onClick={e => handlePlay && handlePlay(e)} disabled={!handlePlay}>
        <PlayArrowIcon />
      </Button>
      <Button
        onClick={e => handlePause && handlePause(e)}
        disabled={!handlePause}
      >
        <PauseIcon />
      </Button>
      <Button onClick={e => handleStop && handleStop(e)} disabled={!handleStop}>
        <StopIcon />
      </Button>
      <Button
        onClick={e => {
          e.preventDefault()
          handleSetting && handleSetting(e)
        }}
        disabled={!handleSetting}
      >
        <SettingsIcon />
      </Button>
    </ButtonGroup>
  )
}

// <Grid container alignItems="center" className={classes.root}>
//   <PlayArrowIcon onClick={() => props.handlePlay && props.handlePlay()} />
//   <PauseIcon onClick={() => handlePause && handlePause()} />
//   <StopIcon onClick={() => handleStop && handleStop()} />
//   {/* TODO: why divide is not visibel? */}
//   <Divider orientation="vertical" />
//   <SettingsIcon onClick={() => handleSetting && handleSetting()} />
// </Grid>
