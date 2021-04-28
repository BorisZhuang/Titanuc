import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Send from '@material-ui/icons/Send';

const useStyles = makeStyles(() => ({
  icon: {
    color: 'rgb(0, 153, 255)',
    width: 44,
    height: 44,
    padding: 6,
  },
  iconBtn: {
    padding: 8,
  },
  input: {
    flex: 'auto',
    borderRadius: 40,
    paddingLeft: 16,
    backgroundColor: 'rgba(0,0,0,0.04)',
    margin: '0 8px',
    height: 36,
    fontSize: 13,
  },
}));

const ChatBar = ({onSend}) => {
  const styles = useStyles();
  const [message, setMessage] = useState('');
  const handleChange = (event) => {
    setMessage(event.target.value)
  }

  return (
    <>
      <InputBase
        className={styles.input}
        placeholder={'Type a message...'}
        onChange={handleChange}
      />
      <IconButton className={styles.iconBtn} onClick={(event) => onSend(event, message)}>
        <Send className={styles.icon} />
      </IconButton>
    </>
  );
};

export default ChatBar;
