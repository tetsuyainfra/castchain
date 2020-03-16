import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Typography from '@material-ui/core/Typography'
import { blue } from '@material-ui/core/colors'

type MockSourceSettingDialogProp = {
  // onSubmit: (config: { name?: string; url?: string }) => void
  onSubmit: (config: MockSourceSettingDialogProp['configValue']) => void
  onCancel?: () => void
  open: boolean
  configValue: {
    name?: string
    url?: string
  }
}

export const MockSourceSettingDialog: React.FC<MockSourceSettingDialogProp> = props => {
  const { onSubmit, onCancel, configValue, open } = props

  const refName = React.createRef<HTMLInputElement>()
  const refUrl = React.createRef<HTMLInputElement>()

  const handleClose = () => {
    e.preventDefault()
    onCancel && onCancel()
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    // console.log(refName.current?.value)
    // console.log(refUrl.current?.value)
    const name = refName.current?.value || configValue.name
    const url = refUrl.current?.value || configValue.url
    onSubmit({ name, url })
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">MockConfig</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <TextField
          margin="dense"
          id="name"
          label="config.name"
          type="text"
          defaultValue={configValue.name}
          inputRef={refName || null}
          fullWidth
        />
        <TextField
          margin="dense"
          id="url"
          label="config.url"
          type="url"
          defaultValue={configValue.url || null}
          inputRef={refUrl}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
