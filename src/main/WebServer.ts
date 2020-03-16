import path from 'path'
import * as child_process from 'child_process'

export class WebServer {
  private server_process: child_process.ChildProcess | null
  constructor() {
    this.server_process = null
  }
  start() {
    const web_server_dir = path.join(__dirname, '../', 'web')
    this.server_process = child_process.fork(
      path.join(web_server_dir, 'index.js')
    )

    this.server_process.on('message', (msg: any) => {
      console.log('子プロセスからメッセージを受信', msg)
    })

    this.server_process.on('disconnect', () => {
      console.log('IPC 接続を終了')
    })
    this.server_process.on('exit', () => {
      console.log('プロセス終了')
    })
    this.server_process.on('close', () => {
      console.log('標準入出力を終了')
    })
  }
  stop() {
    this.server_process?.kill()
  }
}
