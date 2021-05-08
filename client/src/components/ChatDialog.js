import React from 'react';
import Box from '@material-ui/core/Box';
import ChatMsg from '@mui-treasury/mockup/brands/messenger/ChatMsg';

const ChatDialog = ({messages, myId}) => {
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
