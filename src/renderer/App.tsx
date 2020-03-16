import { ipcRenderer, ipcMain } from 'electron'
import * as React from 'react'
import log from 'electron-log'

import { StylesProvider } from '@material-ui/core/styles'
import { ThemeProvider as MaterialThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { theme } from './theme'

import {
  GlobalProvider,
  GlobalDispatchContext,
  GlobalStateContext
} from './stores'

import { AppBody } from './containers/AppBody'

export const App = () => {
  return (
    <GlobalProvider>
      <StylesProvider injectFirst>
        <MaterialThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>
            <AppBody />
          </StyledThemeProvider>
        </MaterialThemeProvider>
      </StylesProvider>
    </GlobalProvider>
  )
}

// export const XApp = () => {
//   const classes = useStyles()
//   const [value, setValue] = React.useState(0)

//   const handleChange = (evt: any, newVal: number) => {
//     setValue(newVal)
//   }

//   let urlInput = React.createRef<HTMLInputElement>()

//   const handleCreateSource = async (evt: React.FormEvent<HTMLDivElement>) => {
//     evt.preventDefault()
//     if (urlInput && urlInput.current) {
//       const url = urlInput.current.value
//       dispatch(SourcePluginActions.createSource(url))
//       const result = await ipcRenderer.invoke('CASTCHAIN_PLUGIN_HANDLE', {
//         type: 'CREATE_SOURCE',
//         payload: ['ShitarabaPlugin', url]
//       })
//       log.debug('await return', result)
//       dispatch(result)
//     }
//   }

//   return (
//     <GlobalProvider>
//       {/* <TagData /> */}
//       <StylesProvider injectFirst>
//         <MaterialThemeProvider theme={theme}>
//           <StyledThemeProvider theme={theme}>
//             <Layout>
//               <Paper
//                 component="form"
//                 className={classes.root}
//                 elevation={0}
//                 onSubmit={handleCreateSource}
//               >
//                 <IconButton className={classes.iconButton} aria-label="menu">
//                   <MenuIcon />
//                 </IconButton>
//                 <InputBase
//                   className={classes.input}
//                   placeholder="Input BBS URL"
//                   inputProps={{ 'aria-label': 'search google maps' }}
//                   inputRef={urlInput}
//                   value="http://jbbs.shitaraba.net/bbs/read.cgi/game/58589/1414143826/"
//                 />
//                 <Divider className={classes.divider} orientation="vertical" />
//                 <IconButton
//                   color="primary"
//                   className={classes.iconButton}
//                   aria-label="directions"
//                 >
//                   <AddIcon />
//                 </IconButton>
//               </Paper>
//               <AppBar position="static">
//                 <Tabs value={value} onChange={handleChange}>
//                   {/* {sources.map((src, idx) => (
//                     <Tab label={src.name} key={idx} />
//                   ))} */}
//                 </Tabs>
//               </AppBar>
//               {/* {sources.map((src, idx) => (
//                 <TabPanel
//                   value={value}
//                   index={idx}
//                   key={idx}
//                   name={src.name}
//                   comments={src.data.comments}
//                 />
//               ))} */}
//             </Layout>
//           </StyledThemeProvider>
//         </MaterialThemeProvider>
//       </StylesProvider>
//     </GlobalProvider>
//   )
// }
