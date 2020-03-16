import * as React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => {
  // if customize style with theme variable, you can use it
  // console.log(theme)
  return {
    fabButton: {
      // backgroundColor: 'primary.main',
      backgroundColor: 'grey',
      position: 'absolute',
      zIndex: 1,
      top: 30,
      // left: 0,
      right: 0,
      margin: '0 auto'
    }
  }
})

export const AddButton: React.FC<{}> = props => {
  const theme = useTheme()
  const classes = useStyles(theme)
  return (
    <Fab color="secondary" aria-label="add" className={classes.fabButton}>
      <AddIcon />
    </Fab>
  )
}
