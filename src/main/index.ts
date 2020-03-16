import * as Electron from 'electron'
import log from 'electron-log'
// こういう回避方法もある模様
// import commandLineArgs from './node_modules/command-line-args/dist/index.mjs'
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

import { initializeSetting } from '../commons/setting'

import { SourceContainer } from './SourceContainer'
import { PluginContainer } from './PluginContainer'
import { WebServer } from './WebServer'

declare const IS_WATCH: boolean | undefined
declare const IS_DEVELOPMENT: boolean | undefined

if (typeof IS_DEVELOPMENT !== 'undefined' && IS_DEVELOPMENT == true) {
  log.verbose
}

class Application {
  private mainWindow: Electron.BrowserWindow | null = null
  private app: Electron.App
  private source_container_: SourceContainer | null = null
  private plugin_container_: PluginContainer | null = null
  private open_url: string

  constructor(app: Electron.App) {
    this.app = app
    this.open_url = `file://${__dirname}/../renderer/index.html`
    if (IS_WATCH) {
      this.open_url = `http://localhost:8080/index.html`
    }
    this.app.on('window-all-closed', this.onWindowAllClosed.bind(this))
    this.app.on('activate', this.onActivated.bind(this))

    // app start
    this.app.once('ready', this.onReady.bind(this))
  }

  private onWindowAllClosed() {
    if (this.source_container_) {
      this.source_container_.cleanup()
      this.source_container_ = null
    }
    if (this.plugin_container_) {
      this.plugin_container_.cleanup()
      this.plugin_container_ = null
    }
    this.app.quit()
  }

  private create() {
    let options = Object.assign(
      {
        width: 800,
        height: 400,
        minWidth: 500,
        minHeight: 200,
        acceptFirstMouse: true,
        titleBarStyle: 'hidden'
      },
      {
        webPreferences: {
          nodeIntegration: true
          // nodeIntegration: IS_WATCH ? true : false
        }
      }
    )

    this.mainWindow = new Electron.BrowserWindow(options)
    this.mainWindow.loadURL(this.open_url)

    // ChromiumのDevツールを開く
    if (IS_DEVELOPMENT) {
      this.mainWindow.webContents.openDevTools()
    }

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }
  private createSourcePlugin() {
    if (this.source_container_ === null) {
      this.source_container_ = new SourceContainer()
    }
    if (this.plugin_container_ === null) {
      this.plugin_container_ = new PluginContainer()
    }
  }

  private onReady() {
    this.createSourcePlugin()
    this.create()
  }

  private onActivated() {
    if (this.mainWindow === null) {
      this.create()
    }
  }
}

// const options = commandLineArgs([
//   { name: 'init-config', type: Boolean },
//   { name: 'version', type: Boolean }
// ])

// const sections = [
//   {
//     header: 'Example App',
//     content:
//       'Generates something {italic very} important. This is a rather long, but ultimately inconsequential description intended solely to demonstrate description appearance. '
//   },
//   {
//     header: 'Synopsis',
//     content: '$ app <options> <command>'
//   },
//   {
//     header: 'Command List',
//     content: [
//       { name: 'help', summary: 'Display help information about Git.' },
//       { name: 'commit', summary: 'Record changes to the repository.' },
//       { name: 'Version', summary: 'Print the version.' },
//       { name: 'etc', summary: 'Etc.' }
//     ]
//   }
// ]
// const usage = commandLineUsage(sections)
const optionDefinitions = [
  {
    name: 'init-config',
    type: Boolean,
    description: 'Initialize config file'
  },
  {
    name: 'help',
    type: Boolean,
    description: 'Print this usage guide.'
  },
  {
    name: 'version',
    type: Boolean,
    description: 'Print application version.'
  }
]

const sections = [
  {
    header: 'Castchain',
    content: "It is for broadcaster's tools."
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
]

const options = commandLineArgs(optionDefinitions)
if (options.help) {
  const usage = commandLineUsage(sections)
  console.log(usage)
  Electron.app.exit(0)
} else if (options.version) {
  const { version } = require('../package.json')
  console.log(`Castchain v${version}`)
  Electron.app.exit(0)
} else if (options['init-config']) {
  log.info('Castchain initialize config')
  initializeSetting()
  Electron.app.exit(0)
}

log.debug('arguments parsed', options)

const myApp: Application = new Application(Electron.app)
