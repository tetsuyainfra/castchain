const log = require('electron-log')
console.log('child start')
log.info('child start @log')

process.on('message', function (msg) {
  console.log(msg)
  const { message_type } = msg

  switch (message_type) {
    case 'start_server':
      break
    case 'stop_server':
      break
    default:
      break
  }
})
