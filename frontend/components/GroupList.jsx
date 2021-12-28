import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(0, 0, 0),
  },
}));



export default function Populargroup({ title, type }) {
  const classes = useStyles();
  const [list, setList] = useState(false)
  const [reqid, setReqid] = useState([])


  useEffect(() => {
    axios.get('/user/get')
      .then(res => {
        setList(res.data.user)
      })
      .catch(err => {
        alert('something went wrong,try again later')
      })
  }, [])

  let sendFriendReq = (id) => {
    axios.put('user/addfriend/' + id)
      .then(res => {
        setReqid([...reqid, res.data.user._id])
      })
      .catch(err => {
        alert('something went wrong,try again later')
      })
  }
  return (
    <div className={classes.root}>

      <Typography className={classes.title}>
        {title}
      </Typography>
      <div className={classes.demo}>
        <List>
          {
            list && list.map((user, index) => {
              return <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={user.profileimg}>

                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  style={{ textTransform: "capitalize" }}
                  primary={`${user.first} ${user.last}`}
                />
                {
                  type === 'people' &&
                  <ListItemSecondaryAction>

                    <Button onClick={() => sendFriendReq(user._id)} edge="end" aria-label="delete">
                      {reqid.includes(user._id) ? "Requested" : "Add"}
                    </Button>

                  </ListItemSecondaryAction>
                }
              </ListItem>
            })
          }

        </List>
      </div>

    </div>
  );
}
