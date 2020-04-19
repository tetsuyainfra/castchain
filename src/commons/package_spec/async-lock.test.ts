import AsyncLock from 'async-lock'

function psleep(time, cb) {
  return new Promise((resolve, reject) => {
    // console.log('Promise()')
    setTimeout(() => {
      // console.log(`resolve(${time})`)
      cb()
      resolve()
    }, time)
  })
}

async function asleep(time, cb) {
  // console.log(`asleep(${time})`)
  return psleep(time, cb)
}

describe('test asleep', () => {
  it('simple usage', async () => {
    const myMock_ = jest.fn()
    const myMock = (i) => {
      console.log(`myMock(${i})`)
      myMock_(i)
    }
    const lock = new AsyncLock()

    const l1 = lock.acquire('testKey', async () => {
      await asleep(500, () => {
        myMock(0)
      })
      myMock(1)
    })

    const l2 = lock.acquire('testKey', async () => {
      await asleep(1, () => {
        myMock(2)
      })
      myMock(3)
    })

    // 実態はPromiseなので全部実行済みになるのを待つ
    const r = await Promise.all([l1, l2])
    expect(myMock_.mock.calls.length).toBe(4)
    myMock_.mock.calls.forEach((c, idx) => {
      expect(c[0]).toBe(idx)
    })
  })
})

// test "test function"
// describe('test asleep', () => {
//   it('simple usage', async () => {
//     const myMock = jest.fn()
//     const r = await asleep(1, myMock) // myMock()
//     myMock(1)
//     const r2 = await asleep(1, myMock) // myMock()
//     myMock(3)
//     expect(myMock.mock.calls.length).toBe(4)
//     expect(myMock.mock.calls[0][0]).toBe(undefined)
//     expect(myMock.mock.calls[1][0]).toBe(1)
//     expect(myMock.mock.calls[2][0]).toBe(undefined)
//     expect(myMock.mock.calls[3][0]).toBe(3)
//   })
// })
