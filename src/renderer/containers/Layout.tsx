import * as React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      padding: '0',
      widht: '100vw',
      height: '100vh',
    },
  })
)

export const Layout: React.FC<{}> = (props) => {
  const classes = useStyles()

  return <div className={classes.layout}>{props.children}</div>
}
