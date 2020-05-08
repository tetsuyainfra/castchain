import { urlNormalize } from './NichanSource'
import { getBbsConfig } from './NichanSource'
import { getBbsThreads } from './NichanSource'
import { getBbsComments } from './NichanSource'

const test_urls = [
  'http://bbs.jpnkn.com/test/read.cgi/tetsuyainfra/1582375424/100-',
  'http://bbs.jpnkn.com/test/read.cgi/tetsuyainfra/1582375424/',
  'http://bbs.jpnkn.com/tetsuyainfra/',
  'http://nextbbs-test.test/nextbbs/test/read.cgi/tetsuyainfra/100/',
]

describe('WHATWG URL Standard', () => {
  it('parse detail check', () => {
    let url = new URL(test_urls[0])
    expect(url.origin).toBe('http://bbs.jpnkn.com')
    expect(url.pathname).toBe('/test/read.cgi/tetsuyainfra/1582375424/100-')
  })
})

describe('urlNormalize', () => {
  it('can be parsed', () => {
    test_urls.forEach((url, idx) => {
      expect(urlNormalize(url)).toBeTruthy()
    })
  })

  // it('have correct value pattern thread', () => {
  //   const _url = urlNormalize(test_urls[0])
  //   expect(_url.url_state).toBe('select_thread')
  //   expect(_url.api_url).toBe('http://bbs.jpnkn.com.test')
  //   expect(_url.bbs_path).toBe('/tetsuyainfra/')
  //   expect(_url.thread_path).toBe('/test/read.cgi/tetsuyainfra/1582375424/')
  //   expect(_url.res_no).toBe('100-')
  // })

  // it('have correct value pattern thread', () => {
  //   const _url = urlNormalize(test_urls[1])
  //   expect(_url.url_state).toBe('select_thread')
  //   expect(_url.api_url).toBe('http://bbs.jpnkn.com.test')
  //   expect(_url.bbs_path).toBe('/tetsuyainfra/')
  //   expect(_url.thread_path).toBe('/test/read.cgi/tetsuyainfra/1582375424/')
  //   expect(_url.res_no).toBe(null)
  // })

  // it('have correct value pattern thread', () => {
  //   const _url = urlNormalize(test_urls[2])
  //   expect(_url.url_state).toBe('select_bbs')
  //   expect(_url.api_url).toBe('http://bbs.jpnkn.com.test')
  //   expect(_url.bbs_path).toBe('/tetsuyainfra/')
  //   expect(_url.thread_path).toBe(null)
  //   expect(_url.res_no).toBe(null)
  // })

  it('掲示板情報を取得する', (done) => {
    // const config = getBbsConfig(test_urls[1])
    const config = getBbsConfig(test_urls[2])
    config
      .then((c) => {
        expect(c.get('BBS_TITLE')).toBe('tetsuyainfra')
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
  it('スレッド一覧を取得する', () => {})
  it('コメントを取得する', () => {})
  it('番号を指定してコメントを取得する', () => {})
})

describe('NichanSourcePlugin', () => {
  // it('new MockPlugin(url), and has variables and mehod', () => {
  //   let instance = new MockSourcePlugin()
  //   expect(instance.plugin_name_).toBe('MockOutputPlugin')
  //   expect(instance.isValid()).toBe(true)
  //   expect(instance.updateSourceURL('')).toBe(true)
  //   expect(instance.startPublish()).toBe(true)
  //   expect(instance.stopPublish()).toBe(true)
  // })
})
