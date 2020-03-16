import * as React from 'react'

{
  /* <Controls /> */
}
{
  /* <Data /> */
}

const Controls: React.FC<{}> = props => {
  return <div></div>
}

const Data: React.FC<{}> = props => {
  const { state, dispatch } = React.useContext(StoreContext)
  console.log('Data()', state)

  const clicked = () => {
    console.log('onclicked')
    dispatch({
      type: 'COUNT_UP',
      payload: { count_up: 1 }
    })
  }
  return <div onClick={clicked}>Data: {state.count}</div>
}

const TagData: React.FC<{}> = props => {
  const { state, dispatch } = React.useContext(StoreContext)
  React.useEffect(() => {
    function updateCount() {
      dispatch({
        type: 'COUNT_UP',
        payload: { count: state.count }
      })
    }
  })
  return (
    <StoreContext.Consumer>
      {value => <div>{value.state.sources[0].name}</div>}
    </StoreContext.Consumer>
  )
}
