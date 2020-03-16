import { ShitarabaPlugin } from './Shitaraba'

describe('Shitaraba Plugin', () => {
  //  HOSTNAME/BOARD_ID/ pattern
  it('new Shitaraba(url)', () => {
    let thread_instance = new ShitarabaPlugin(
      'https://bbs.jpnkn.com/test/read.cgi/tetsuyainfra/1582375424/l50'
    )
    expect(thread_instance.isValidURL()).toBe(true)
    expect(thread_instance.board_id).toEqual('tetsuyainfra')
    expect(thread_instance.thread_id).toEqual('1582375424')

    let board_instance = new ShitarabaPlugin(
      'https://bbs.jpnkn.com/tetsuyainfra/'
    )
    expect(board_instance.isValidURL()).toBe(true)
    expect(board_instance.board_id).toEqual('tetsuyainfra')
    expect(board_instance.thread_id).toEqual(null)

    let google = new ShitarabaPlugin('https://www.google.com/')
    expect(google.isValidURL()).toBe(false)
  })
  it('fetch', () => {})
  it('normal route', () => {
    let s = new ShitarabaPlugin(
      'http://jbbs.shitaraba.net/bbs/read.cgi/game/58589/1414143826/'
    )
    // s.fetch()
  })
  //  HOSTNAME/NESTED/BOARD_ID/ pattern
  it('new Shitaraba(nested_url)', () => {})
})
