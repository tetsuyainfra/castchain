import * as React from 'react'
import log from 'electron-log'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { GlobalDispatchContext, GlobalStateContext } from '../stores'
import { Actions, SourceAction } from '../actions'
import { StubAPI, FactorySourceAPI, CommentObject } from '../api'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import { CommentList, Comment } from './CommentList'
import { ControlBar } from './ControlBar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: {
      overflow: 'scroll'
      // padding: '0',
      // widht: '100vw'
      // height: '100vh'
    }
  })
)

type TabPanelProps = {
  tabIndex: number
  tabSelect: number
  className?: string
}

// TODO: check
// tabSelect === tabIndexしてると消えるのでは？
export const TabPanel: React.FC<TabPanelProps> = props => {
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
      {tabSelect === tabIndex && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

/*
type TabPanelProp = {
  tabSelect: number // selected tab number
  tabIndex: number //
  name: string
  ulid: string
  comments: Array<CommentObject>
}

type TabPanelState = {
  comments: Array<CommentObject>
}

export class TabPanel extends React.Component<TabPanelProp, TabPanelState> {
  static contextType = GlobalDispatchContext
  api: StubAPI | null = null

  constructor(props: TabPanelProp) {
    super(props)
    this.state = { comments: [] }
    this.handlePlay.bind(this)
    this.handleStop.bind(this)
  }

  componentDidMount() {
    let dispatch = this.context
    this.api = FactorySourceAPI.getApi(this.props.ulid)
    this.api.getName().then(name => {
      if (name) {
        SourceAction.updateMeta(dispatch, this.props.ulid, { name: name })
      }
    })
    console.log('didmount')
  }
  componentWillUnmount() {
    console.log('WillUnmount')
  }

  handlePlay(e) {
    e.preventDefault()
    console.log('handlePlay')
    this.api?.startPublish((comments: Array<CommentObject>) => {
      console.log('startPublish Callback', comments.length)
      if (comments.length > 0) {
        console.log('comments', comments.length)
        this.setState({
          comments: [...this.state.comments, ...comments]
        })
      }
    })
  }
  handleStop(e) {
    e.preventDefault()
    console.log('handleStop')
    this.api?.stopPublish()
  }

  render() {
    let { tabSelect, tabIndex, ulid, name } = this.props
    let dispatch = this.context
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={tabSelect !== tabIndex}
        id={`simple-tabpanel-${tabIndex}`}
        aria-labelledby={`simple-tab-${tabIndex}`}
        // {...other}
      >
        <Box p={3}>
          <ControlBar
            handlePlay={e => {
              console.log('play')
              this.handlePlay(e)
            }}
            handleStop={e => {
              console.log('stop')
              this.handleStop(e)
            }}
            handleSetting={e => {
              e.preventDefault()
              console.log('setting')
            }}
          />
          <Typography variant="h6" component="h1">
            {ulid}
            <br />
            {name}
          </Typography>
          <ul>
            {this.state.comments.map((c, idx) => (
              <li key={idx}>
                {c.num}: {c.body}
              </li>
            ))}
          </ul>
        </Box>
      </Typography>
    )
  }
}
*/

// export const TabPanel: React.FC<TabPanelProp> = props => {
//   log.debug('TabPanel')
//   const { value, index, name, ulid, comments, ...other } = props
//   const dispatch = React.useContext(GlobalDispatchContext)

//   React.useEffect(() => {
//     const new_name = 'abcde'
//     setTimeout(() => {
//       SourceAction.updateMeta(dispatch, ulid, { name: new_name })
//     }, 3000)
//   }, [name])

//   return (
//     <>
//       <Typography
//         component="div"
//         role="tabpanel"
//         hidden={value !== index}
//         id={`simple-tabpanel-${index}`}
//         aria-labelledby={`simple-tab-${index}`}
//         {...other}
//       >
//         <Box p={3}>
//           <ControlBar
//             handlePlay={() => {
//               console.log('play')
//             }}
//             handleStop={() => {
//               console.log('stop')
//             }}
//             handleSetting={() => {
//               console.log('setting')
//               dispatch({
//                 type: Actions.data_arrived,
//                 payload: {
//                   name: 'updated name',
//                   // uuid: ulid
//                   ulid: 'ulid_yote'
//                 }
//               })
//             }}
//           />
//           <Typography variant="h6" component="h1">
//             {ulid}
//           </Typography>
//           <Typography variant="h6" component="h1">
//             {name}
//           </Typography>
//           <CommentList comments={comments} />
//         </Box>
//       </Typography>
//     </>
//   )
// }
