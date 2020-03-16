import React from 'react'
import Typography from '@material-ui/core/Typography'

// type WithTabContainerProps = {
//   tabIndex: number // tab index number
//   tabSelect: number // select tab index number
// }

// export const WithTabContainer: React.FC<WithTabContainerProps> = props => {
//   const { tabIndex, tabSelect, others } = props
//   return (
//     <Typography
//       component="div"
//       role="tabpanel"
//       id={`simple-tabpanel-${tabIndex}`}
//       aria-labelledby={`simple-tab-${tabIndex}`}
//       hidden={tabIndex !== tabSelect}
//     >
//       <WrappedContainer {...others} />
//     </Typography>
//   )
// }

type WithTabComponentProps = {
  tabIndex: number // tab index number
  tabSelect: number // select tab index number
}

// export const WithTabContainer = (WrappedComponent: React.ComponentType) => {
export const WithTabContainer = (
  WrappedComponent: React.ComponentType<{ name: string }>
) => {
  const WithTabComponent: React.FC<WithTabComponentProps> = props => {
    const { tabIndex, tabSelect, ...others } = props
    return (
      <Typography
        component="div"
        role="tabpanel"
        key={tabIndex}
        id={`simple-tabpanel-${tabIndex}`}
        aria-labelledby={`simple-tab-${tabIndex}`}
        hidden={tabIndex !== tabSelect}
      >
        <WrappedComponent {...others} />
      </Typography>
    )
  }

  if (WrappedComponent.displayName) {
    WithTabComponent.displayName = `${WrappedComponent.displayName}WithTabContainer`
  }

  return WithTabComponent
}

/*
export const MockSourceTab = TabContainer(MockSourcePanel)
export const NichanSourceTab = TabContainer(NichanSourcePanel)

<MockSourceTab tabIndex={1} tabSelect={0}  config={config} />
<NichanSourceTab tabIndex={1} tabSelect={0} config={config} />

*/
