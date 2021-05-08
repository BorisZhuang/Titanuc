import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ChatMsg from '@mui-treasury/mockup/brands/messenger/ChatMsg';

const AVATAR = '';

const useStyles = makeStyles(() => ({
  date: {
    fontWeight: 500,
    color: 'rgba(0,0,0,0.4)',
    margin: '12px 0',
    fontSize: 12,
    textAlign: 'center',
  },
}));

const ChatDialog = ({messages, myId}) => {
  const styles = useStyles();
  if (!messages) return null;
  const chatMsgs = messages.map((m) => {
    console.log(m)
    let m2 = []
    if (typeof m.message === "string") {
      m2.push(m.message)
    } else {
      let str = new TextDecoder().decode(m.message)
      m2.push(str)
    }
    return (
      m.from.email === myId
      ? <ChatMsg side={'right'} messages={m2} />
      : <ChatMsg avatar={m.from.avatar} messages={m2} />
    )
  })

  return (
    <Box p={'16px 30px 12px 10px'}>
      {chatMsgs}
    </Box>
  );
};

export default ChatDialog;
