import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import { BbsComment } from '../../commons/source'

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
})

export const Comment: React.FC<BbsComment> = (props) => {
  const classes = useStyles()
  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          レス{props.num} {props.name}[{props.mail}]
        </Typography>
        <Typography variant="body2" component="p">
          {props.body}
        </Typography>
      </CardContent>
    </Card>
  )
}

type BbsCommentListType = {
  comments: Array<BbsComment>
}

export const BbsCommentList: React.FC<BbsCommentListType> = (props) => {
  const comments = props.comments.map((comment: BbsComment) => (
    <Comment key={comment.num} {...comment} />
  ))
  return <div>{comments}</div>
}
