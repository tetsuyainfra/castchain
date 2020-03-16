import { ShitarabaPlugin } from './Shitaraba'

describe('Shitaraba Plugin', () => {
  it('new Shitaraba(url)', () => {
    // const log = jest.spyOn(console, 'log').mockReturnValue()
    // main()
    // expect(log).nthCalledWith(1, 'Hello, world!')
    // log.mockRestore()
    let thread_instance = new ShitarabaPlugin(
      'http://jbbs.shitaraba.net/bbs/read.cgi/game/58589/1414143826/'
    )
    expect(thread_instance.isValidURL()).toBe(true)
    expect(thread_instance.categroy).toEqual('game')
    expect(thread_instance.board_id).toEqual('58589')
    expect(thread_instance.thread_id).toEqual('1414143826')

    let board_instance = new ShitarabaPlugin(
      'https://jbbs.shitaraba.net/game/58589/'
    )
    expect(board_instance.isValidURL()).toBe(true)

    let board_instance2 = new ShitarabaPlugin(
      'https://jbbs.shitaraba.net/game/58589/xxx'
    )
    expect(board_instance2.isValidURL()).toBe(true)
    expect(board_instance2.categroy).toEqual('game')
    expect(board_instance2.board_id).toEqual('58589')
    expect(board_instance2.thread_id).toEqual(null)

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
})
