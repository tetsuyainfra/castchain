describe('Jest Mock', () => {
  it('simple usage', async () => {
    const myMock = jest.fn()

    await (async () => {
      myMock(1, 0)
      myMock(2, true)
      myMock(3, false)
    })()

    // 呼び出し回数
    expect(myMock.mock.calls.length).toBe(3)

    // 引数
    expect(myMock.mock.calls[0][0]).toBe(1)
    expect(myMock.mock.calls[0][1]).toBe(0)
    expect(myMock.mock.calls[1][0]).toBe(2)
    expect(myMock.mock.calls[1][1]).toBe(true)
    expect(myMock.mock.calls[2][0]).toBe(3)
    expect(myMock.mock.calls[2][1]).toBe(false)
  })
})

// [jest で非同期関数をテストするときの注意点](https://qiita.com/ef81sp/items/178ed17982b13535ad59)

const someCallback = (isSuccess: boolean, cb: CallableFunction) => {
  setTimeout(() => {
    const err = new Error('error!')
    const data = 'data'
    return isSuccess ? cb(null, data) : cb(err, null)
  }, 200)
}

describe('async callbakc testing', () => {
  test('done exists', (done) => {
    someCallback(true, (err, data) => {
      expect(data).toBe('data')
      done()
    })
  })

  test('done exists', (done) => {
    someCallback(false, (err, data) => {
      expect(data).toBe(null)
      done()
    })
  })
})

const somePromise = (isSuccess: boolean) => {
  return new Promise((resolve, reject) => {
    const err = new Error('error!')
    const data = 'dataPromise'
    isSuccess ? resolve(data) : reject(err)
  })
}

describe('Promise testing', () => {
  test('done exists', (done) => {
    somePromise(true)
      .then((data) => {
        console.log('data:', data)
        expect(data).toBe('dataPromise')
      })
      .finally(() => {
        //　最後にdoneを呼び出す
        done()
      })
  })

  test('done failed pattern', (done) => {
    somePromise(false) // <-- call reject(err) at here
      .then((data) => data)
      .catch((err) => {
        console.log('err:', err.message)
        expect(err).toBeInstanceOf(Error)
        return
      })
      .finally(() => {
        console.log('done()')
        done()
      })
  })
  test('use expect().resolves', () => {
    return expect(somePromise(true)).resolves.toBe('dataPromise')
  })
  test('use expect().rejects', () => {
    return expect(somePromise(false)).rejects.toBeInstanceOf(Error)
  })
})

describe('async function testing', () => {
  test('use async/await on Normal System', async () => {
    const result = await somePromise(true)
    expect(result).toBe('dataPromise')
  })

  test('use async/await on Abnormal System', async () => {
    try {
      const result = await somePromise(false) // error!
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
      expect(err.message).toBe('error!')
    }
  })
})
