import * as React from 'react'
import log from 'electron-log'

import { StateType, ActionType, reducer, initialState } from './reducers'

export const GlobalStateContext = React.createContext<StateType>(initialState)
export const GlobalDispatchContext = React.createContext<
  React.Dispatch<ActionType>
>(() => true)

export type InitFunctionType = (state: StateType) => StateType

export const defaultInitialize: InitFunctionType = (state) => {
  log.debug('defaultInitalize()', state)
  return state
}

type GlobalProviderProps = {
  initState?: StateType
  initFunc?: InitFunctionType
}

export const GlobalProvider: React.FC<GlobalProviderProps> = (props) => {
  const { initState, initFunc } = props
  const [state, dispatch] = React.useReducer(
    reducer,
    initState ? initState : initialState,
    initFunc ? initFunc : defaultInitialize
  )

  log.debug('render <GlobalProvider>')

  return (
    <GlobalDispatchContext.Provider value={dispatch}>
      <GlobalStateContext.Provider value={state}>
        {props.children}
      </GlobalStateContext.Provider>
    </GlobalDispatchContext.Provider>
  )
}
