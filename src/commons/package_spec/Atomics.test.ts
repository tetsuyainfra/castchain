function psleep(time: number, cb: Function) {
  return new Promise((resolve, reject) => {
    // console.log('Promise()')
    setTimeout(() => {
      // console.log(`resolve(${time})`)
      cb()
      resolve()
    }, time)
  })
}

async function asleep(time: number, cb: Function) {
  // console.log(`asleep(${time})`)
  return psleep(time, cb)
}

describe('test Atomics', () => {
  it('simple usage', () => {
    const buffer = new SharedArrayBuffer(10)
    const bufferView = new Uint8Array(buffer)

    bufferView.forEach((elm, i, _) => (_[i] = 0))

    Atomics.add(bufferView, 0, 1)
    Atomics.add(bufferView, 0, 1)
    expect(bufferView[0]).toBe(2)
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
