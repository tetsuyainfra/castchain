import * as React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { createStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { BbsComment } from '../../../commons/source'
import { NichanSourceInfo } from '../../../commons/sources/NichanSource'

import { ControlBar } from '../ControlBar'
import { BbsCommentList } from '../BbsCommentList'

export const NichanSourcePanel: React.FC<NichanSourceInfo> = (props) => {
  console.log('render MockSourcePanel')
  const { plugin_name, plugin_uuid, config, status } = props
  const comments: Array<BbsComment> = [
    {
      num: 1,
      name: 'name1',
      mail: '',
      date: '',
      body: 'A',
      meta: { thread_title: 'あいうえおの日々' },
    },
    { num: 2, name: 'name2', mail: '', date: '', body: 'B', meta: {} },
  ]
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {config.bbs_name}
      </Typography>
      <ControlBar
        handlePlay={() => {}}
        handlePause={() => {}}
        handleSetting={() => {}}
      />
      <BbsCommentList comments={comments} />
    </>
  )
}
