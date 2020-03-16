import * as React from 'react'
import { ThemeProvider as MaterialThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { createMuiTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: 30,
    // left: 0,
    right: 0,
    margin: '0 auto'
  }
})

export const Layout: React.FC<{}> = props => {
  return <div>{props.children}</div>
}

const TabPanel: React.FC<{ value: number; index: number }> = props => {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

const Comment: React.FC<{}> = props => {
  const classes = useStyles()
  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          1
        </Typography>
        {/* <Typography variant="h5" component="h2">
                belent
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                adjective
              </Typography> */}
        <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
    </Card>
  )
}

const theme = createMuiTheme({
  palette: {
    primary: {
      // 緑色
      main: '#8BC34A',
      dark: '#689F38',
      light: '#DCEDC8'
    },
    secondary: {
      // オレンジ
      main: '#FF5722'
    },
    text: {
      // ちょっと薄い黒
      primary: '#212121',
      secondary: '#757575'
    }
  }
})

export default theme

export const App = () => {
  const [value, setValue] = React.useState(0)
  const classes = useStyles()

  const handleChange = (evt: any, newVal: number) => {
    setValue(newVal)
  }

  return (
    <MaterialThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme}>
        <Layout>
          <div></div>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
            </Tabs>
            <Fab
              color="secondary"
              aria-label="add"
              className={classes.fabButton}
            >
              <AddIcon />
            </Fab>
          </AppBar>
          <TabPanel value={value} index={0}>
            <Typography variant="h6" component="h1">
              1 - tetsuyainfra
            </Typography>
            <div>
              <Comment />
              <Comment />
              <Comment />
              <Comment />
              <Comment />
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Typography variant="h6" component="h1">
              Item Two
            </Typography>
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
        </Layout>
      </StyledThemeProvider>
    </MaterialThemeProvider>

    // <div>
    //   <form noValidate autoComplete="off">
    //     <TextField id="filled-basic" label="Filled" variant="filled" />
    //     <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    //     <Button variant="contained" color="primary">
    //       Send
    //     </Button>
    //   </form>
    // </div>
  )
}
