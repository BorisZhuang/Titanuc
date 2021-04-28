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
  const chatMsgs = messages.map(message => {
    message.sender.email === myId
    ? <ChatMsg side={'right'} messages={[message.message]} />
    : <ChatMsg avatar={message.sender.avatar} messages={[message.message]} />
  })

  return (
    <Box p={'16px 30px 12px 10px'}>
      {chatMsgs}
    </Box>
  );
};

export default ChatDialog;
