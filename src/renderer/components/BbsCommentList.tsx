import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
})

type BbsCommentType = {
  no: number
  name: string
  mail: string
  body: string
}

export const BbsComment: React.FC<BbsCommentType> = (props) => {
  const classes = useStyles()
  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {props.no} - {props.name}[{props.mail}]
        </Typography>
        {/* <Typography variant="h5" component="h2">
                belent
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                adjective
              </Typography> */}
        <Typography variant="body2" component="p">
          {props.body}
        </Typography>
      </CardContent>
    </Card>
  )
}

type BbsCommentListType = {
  comments: Array<BbsCommentType>
}

export const BbsCommentList: React.FC<BbsCommentListType> = (props) => {
  const comments = props.comments.map((comment: BbsCommentType) => (
    <BbsComment key={comment.no} {...comment} />
  ))
  return <div>{comments}</div>
}
