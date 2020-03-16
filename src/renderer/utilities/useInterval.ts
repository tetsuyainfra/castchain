// ReactでPollingをどうするか調べた結果
// reference from https://stackoverflow.com/questions/46140764/polling-api-every-x-seconds-with-react

import React from 'react'

export function useInterval(callback: Function, delay: number) {
  const savedCallback = React.useRef<Function>()

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

// Example
// import { useInterval } from '../utils';
//
// const MyPage = () => {
//
//   useInterval(() => {
//     // put your interval code here.
//   }, 1000 * 10);
//
//   return <div>my page content</div>;
// }
