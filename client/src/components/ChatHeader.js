import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { useAuth0 } from '@auth0/auth0-react';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
  },
  root: {
    padding: '8px 8px 8px 16px',
  },
  primary: {
    fontWeight: 'bold',
  },
  secondary: {
    fontSize: 12,
  },
  middle: {
    flex: 'auto',
    marginLeft: 16,
  },
  iconBtn: {
    padding: 8,
    //backgroundColor: 'rgba(0, 0, 0, .0)',
    '&:not(:last-child)': {
      marginRight: 16,
    },
  },
}));

const ChatHeader = ({onProfileClick}) => {
  const { user } = useAuth0();
  const [actionClicked, setActionClicked] = useState(false);

  const styles = useStyles();

  const onActionClick = () => {
    onProfileClick()
    setActionClicked(!actionClicked)
  }

  return (
    <ListItem
      ContainerComponent={'div'}
      ContainerProps={{ className: styles.container }}
      className={styles.root}
    >
    <ListItemAvatar>
      <Avatar alt={'me'} src={user.picture} />
    </ListItemAvatar>
    <ListItemText
      primary={user.name}
      secondary={user.email}
      classes={{ primary: styles.primary, secondary: styles.secondary }}
    />
    <ListItemSecondaryAction>
      <IconButton edge='end' className={styles.iconBtn} onClick={onActionClick}>
        {actionClicked ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>
    </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ChatHeader;
