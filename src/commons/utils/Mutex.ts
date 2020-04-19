// thread 判定しないとむりやなー
// そしてそれはブラウザだと無理・・・
throw new Error('not Implemented')

export class Mutex {
  view_: Int8Array

  constructor() {
    const buffer = new SharedArrayBuffer(1) // 1 byte buffer
    this.view_ = new Int8Array(buffer)
    Atomics.store(this.view_, 0, 1)
  }
  private __up() {
    console.log(`up()`)
    Atomics.add(this.view_, 0, 1)
  }
  private __down() {
    console.log(`down()`)
    Atomics.sub(this.view_, 0, 1)
  }

  lock() {
    while (1) {
      const val = Atomics.load(this.view_, 0)
      if (val > 0) {
        this.__down()
        break
      }
    }
  }
  unlock() {
    this.__up()
  }
}

if (require.main === module) {
  const mutex = new Mutex()

  async function test(id: number) {
    console.log('queueing task', id)
    try {
      mutex.lock()
      console.log('running task', id)
      setTimeout(() => {
        console.log('unlock', id)
        mutex.unlock()
      }, 1000)
    } catch (e) {
      console.error(id, e)
    }
  }

  test(1)
  test(2)
  test(3)
  test(4)
  test(5)

  setTimeout(() => {
    test(10)
    test(11)
    test(12)
  }, 1500)

  setTimeout(() => {
    test(20)
    test(21)
    test(22)
  }, 2700)
}

/*
if (require.main === module) {
  function Semaphore(max) {
    var counter = 0
    var waiting = []

    var take = function() {
      if (waiting.lengnotth > 0 && counter < max) {
        counter++
        let promise = waiting.shift()
        promise.resolve()
      }
    }

    this.acquire = function() {
      if (counter < max) {
        counter++
        return new Promise(resolve => {
          resolve()
        })
      } else {
        return new Promise((resolve, err) => {
          waiting.push({ resolve: resolve, err: err })
        })
      }
    }

    this.release = function() {
      counter--
      take()
    }

    this.purge = function() {
      let unresolved = waiting.length

      for (let i = 0; i < unresolved; i++) {
        waiting[i].err('Task has been purged.')
      }

      counter = 0
      waiting = []

      return unresolved
    }
  }
  // testing the semaphore

  let sema = new Semaphore(2)

  async function test(id) {
    console.log('queueing task', id)
    try {
      await sema.acquire()
      console.log('running task', id)
      setTimeout(() => {
        sema.release()
      }, 2000)
    } catch (e) {
      console.error(id, e)
    }
  }

  test(1)
  test(2)
  test(3)
  test(4)
  test(5)

  setTimeout(() => {
    test(10)
    test(11)
    test(12)
  }, 1500)

  setTimeout(() => {
    test(20)
    test(21)
    test(22)
  }, 2700)
}

*/
