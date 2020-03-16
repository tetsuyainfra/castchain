import * as React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

type TabBarProp = {
  value: number
  handleChange: any
  names: string[]
}

export const TabBar: React.FC<TabBarProp> = props => {
  const { value, handleChange, names } = props

  return (
    <Tabs value={value} onChange={handleChange}>
      {names.map((name, idx) => (
        <Tab label={name} key={idx} />
      ))}
    </Tabs>
  )
}
