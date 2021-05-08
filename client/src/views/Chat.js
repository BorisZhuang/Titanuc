import React, {useEffect, useState, useRef} from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CallEndIcon from '@material-ui/icons/CallEnd';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Videocam from '@material-ui/icons/Videocam';
import Edit from '@material-ui/icons/Edit';
import {
  makeStyles,
  createMuiTheme,
  responsiveFontSizes,
} from '@material-ui/core/styles';
import Layout, {
  Root,
  getHeader,
  getContent,
  getFullscreen,
  getDrawerSidebar,
  getSidebarTrigger,
  getInsetContainer,
  getInsetSidebar,
  getInsetFooter,
} from '@mui-treasury/layout';
import ConversationHead from '../components/ConversationHeader';
import ChatHeader from '../components/ChatHeader';
import Search from '../components/Search';
import ChatBar from '../components/ChatBar';
import ChatList from '../components/ChatList';
import ChatDialog from '../components/ChatDialog';
import Profile from '../views/Profile';

const Header = getHeader(styled);
const Content = getContent(styled);
const Fullscreen = getFullscreen(styled);
const DrawerSidebar = getDrawerSidebar(styled);
const SidebarTrigger = getSidebarTrigger(styled);
const InsetSidebar = getInsetSidebar(styled);
const InsetFooter = getInsetFooter(styled);
const InsetContainer = getInsetContainer(styled);

const useStyles = makeStyles(() => ({
  header: {
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .10)',
    backgroundColor: '#ffffff',
  },
  insetBody: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
  edit: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0
  }
}));

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        main: 'rgb(0, 153, 255)',
      },
      background: {
        default: '#fff',
      },
    },
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      body1: {
        fontSize: `${15 / 16}rem`,
      },
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          'strong, b': {
            fontWeight: 'bold',
          },
        },
      },
    },
  })
);

const Chat = () => {
  const { user } = useAuth0();

  const [users, setUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [farEnd, setFarEnd] = useState("")
  const [farEndSignal, setFarEndSignal] = useState();
  const [callingFriend, setCallingFriend] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [connectionAccepted, setConnectionAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [peerMessages, setPeerMessages] = useState([]);
  const [profileOpened, setProfileOpened] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const myPeer = useRef();

  useEffect(() => {
    socket.current = io().connect();
    socket.current.on("connect", () => {
      socket.current.emit("addUser", user)
    })
    socket.current.on("allUsers", (users) => {
      console.log("allusers")
      console.log(users)
      setUsers(users);
    });
    socket.current.on("hey", (data) => {
      console.log(`received hey from ${data.from}`)
      setReceivingCall(true)
      //ringtoneSound.play();
      setCaller(data.from)
    })
    socket.current.on("hey2", data => {
      console.log(`received hey2 from ${data.from.email}`)
      setFarEnd(data.from)
      setFarEndSignal(data.signal)
      acceptPeerConnection(data.from, data.signal)
    })
  }, []); // only once

   useEffect(() => {
    if (myPeer.current) {
      console.log("adding stream")
      myPeer.current.addStream(stream)
      myPeer.current.on("stream", stream => {
        console.log("receiving stream from caller")
        if (partnerVideo.current) {
          console.log('set partner video srcObj')
          console.log(stream)
          partnerVideo.current.srcObject = stream;
        }
      })
    }
  }, [callAccepted])

  const styles = useStyles();
  const scheme = Layout();
  scheme.configureHeader(builder => {
    builder.create('appHeader').registerConfig('xs', {
      position: 'relative',
      initialHeight: 60,
    });
  });
  scheme.configureEdgeSidebar(builder => {
    builder
      .create('primarySidebar', { anchor: 'left' })
      .registerTemporaryConfig('xs', {
        anchor: 'left',
        width: '30%'
      })
      .registerPermanentConfig('md', {
        width: '25%',
      });
  });
  scheme.enableAutoCollapse('primarySidebar', 'sm');
  scheme.configureInsetSidebar(builder => {
    builder
      .create('secondarySidebar', { anchor: 'right' })
      .registerAbsoluteConfig('xs', {
        width: '0%', // this inset side bar is just a placehold, used to push the chat bar to the buttom.
      });
  });

  const connectPeer = (id) => {
    console.log("connectPeer was called")
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
            {url:'stun:stun01.sipphone.com'},
            {url:'stun:stun.ekiga.net'},
            {url:'stun:stun.fwdnet.net'},
            {url:'stun:stun.ideasip.com'},
            {url:'stun:stun.iptel.org'},
            {url:'stun:stun.rixtelecom.se'},
            {url:'stun:stun.schlund.de'},
            {url:'stun:stun.l.google.com:19302'},
            {url:'stun:stun1.l.google.com:19302'},
            {url:'stun:stun2.l.google.com:19302'},
            {url:'stun:stun3.l.google.com:19302'},
            {url:'stun:stun4.l.google.com:19302'},
            {url:'stun:stunserver.org'},
            {url:'stun:stun.softjoys.com'},
            {url:'stun:stun.voiparound.com'},
            {url:'stun:stun.voipbuster.com'},
            {url:'stun:stun.voipstunt.com'},
            {url:'stun:stun.voxgratia.org'},
            {url:'stun:stun.xten.com'},
            {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
            },
            {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
            },
            {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
            }
        ]
      },
    });

    myPeer.current=peer;

    peer.on("signal", data => {
      console.log(data)
      console.log("peer was signaled.")
      socket.current.emit("connectUser", { userToConnect: id, signalData: data, from: user })
    })

    peer.on('data', data => {
      console.log('data: ' + data)
      setPeerMessages(prevMsgs => [...prevMsgs, {from: users[id], to: user, message: data}])
    })

    peer.on('error', (err)=>{
      console.log(`error is ${err}`)
      handleEndCall()
    })

    socket.current.on("connectionAccepted", signal => {
      console.log("connection was accepted.")
      setConnectionAccepted(true);
      peer.signal(signal);
    })

    socket.current.on('close', ()=>{
      window.location.reload()
    })
  }

  const callPeer = (id) => {
    if(id !== '' && users[id] && id !== user.email) {
      socket.current.emit("callUser", { userToCall: id, signalData: farEndSignal, from: user.email })
      socket.current.on("callAccepted", () => {
        console.log("call was accepte by the callee")
        setCallAccepted(true);
      })

      socket.current.on('rejected', ()=>{
        window.location.reload()
      })
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        setStream(stream);
        setCallingFriend(true)
        setCaller(id) // todo is this right?
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch(() => {
        console.log('You cannot place/ receive a call without granting video and audio permissions!')
      })
    } else {
      console.log('We think the username entered is wrong. Please check again and retry!')
    }
  }

  const acceptPeerConnection = (from, peerSignal) => {
    setConnectionAccepted(true)
    if (myPeer.current) {
      console.log("acceptPeerConnection1")
      myPeer.current.signal(peerSignal);
    } else {
      console.log("acceptPeerConnection2")
      const peer = new Peer({
        initiator: false,
        trickle: false,
      });
      myPeer.current = peer
      peer.on("signal", data => {
        socket.current.emit("acceptConnection", { signal: data, to: from.email })
      })

      peer.on('data', data => {
        console.log('data: ' + data)
        console.log(from)
        setPeerMessages(prevMsgs => [...prevMsgs, {from, to: user, message: data}])
      })

      peer.signal(peerSignal);

      socket.current.on('close', ()=>{
        // todo, close video call page
        window.location.reload()
      })
    }
  }

  const acceptCall = () => {
    console.log("accept call from: ")
    console.log(farEnd)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      setCallAccepted(true);
      socket.current.emit("acceptCall", { to: farEnd.email })
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
      myPeer.current.on('error', (err)=>{
        handleEndCall()
      })
    })
    .catch(() => {
      console.log('You cannot place/ receive a call without granting video and audio permissions!')
    })
  }

  const rejectCall = () => {
    //ringtoneSound.unload();
    setCallRejected(true)
    socket.current.emit('rejected', {to:caller})
    window.location.reload()
  }

  const handleOpenVideoCall = () => {
    callPeer(selectedUser.email);
  }

  const handleConnect = () => {
    connectPeer(selectedUser.email);
  }

  const handleEndCall = () => {
    myPeer.current.destroy()
    socket.current.emit('close',{to:caller})
    // todo, better not to refresh the page.
    window.location.reload()
  }

  const handleUserSelected = (event, email) => {
    let selectedUser = users[email];
    console.log(`selected user's email: ${selectedUser.email}`)
    setSelectedUser(selectedUser);
  }

  const handleOnSend = (event, message) => {
    myPeer.current.send(message)
    console.log(`send ${message}`)
    setPeerMessages(prevMsgs => [...prevMsgs, {from: user, to: selectedUser, message}])
  }

  const handleProfileClick= () => {
    setProfileOpened(!profileOpened)
  }

  function renderCall() {
    return callingFriend || callAccepted ? 'block' : 'none'
  }

  const toggleMuteAudio = () => {
    if(stream){
      setAudioMuted(!audioMuted)
      stream.getAudioTracks()[0].enabled = audioMuted
    }
  }

  const toggleMuteVideo = () => {
    if(stream){
      setVideoMuted(!videoMuted)
      stream.getVideoTracks()[0].enabled = videoMuted
    }
  }

  const removeKey = (key, {[key]: _, ...rest}) => rest;

  function usersExceptSelf() {
      let others = removeKey(user.email, users)
      return Object.values(others)
  }

  function filteredPeerMessages() {
    return peerMessages.filter(m => m.from.email === selectedUser.email
      || m.to.email === selectedUser.email)
  }

  let incomingCall;
  if (receivingCall && !callAccepted && !callRejected) {
    console.log('receiving Call');
    incomingCall = (
      <div className="incomingCallContainer">
        <div className="incomingCall flex flex-column">
          <div><span>{farEnd.email}</span> is calling you!</div>
          <div className="flex">
          <button name="accept" onClick={acceptCall}>Accept</button>
          <button name="reject" onClick={rejectCall}>Reject</button>
          </div>
        </div>
      </div>
    )
  }

  let UserVideo;
  if (stream) {
    console.log('load UserVideo component')
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />)
  }

  let PartnerVideo;
  if (callAccepted) {
    console.log('load Partner Video component')
    PartnerVideo = (
      <video className="partnerVideo cover" playsInline ref={partnerVideo} autoPlay />
    );
  }

  let audioControl;
  if(audioMuted){
    audioControl=<IconButton color="primary" aria-label="volume up" onClick={toggleMuteAudio}>
      <VolumeUp />
    </IconButton>
  } else {
    audioControl=<IconButton color="primary" aria-label="volume off" onClick={toggleMuteAudio}>
      <VolumeOff />
    </IconButton>
  }

  let videoControl;
  if(videoMuted){
    videoControl=<IconButton color="primary" aria-label="video on" onClick={toggleMuteVideo}>
      <Videocam />
    </IconButton>
  } else {
    videoControl=<IconButton color="primary" aria-label="video off" onClick={toggleMuteVideo}>
      <VideocamOff />
    </IconButton>
  }

  let hangUp = <IconButton color="secondary" aria-label="end call" onClick={handleEndCall}>
    <CallEndIcon />
  </IconButton>

  return (
    <Fullscreen>
      <Root theme={theme} scheme={scheme}>
        {({ state: { sidebar } }) => (
          <>
            <CssBaseline />
            <div>
              {incomingCall}
            </div>
            <div className="callContainer" style={{display: renderCall()}}>
              <div className="callContainer">
                <div className="partnerVideoContainer">
                  {PartnerVideo}
                </div>
                <div className="userVideoContainer">
                  {UserVideo}
                </div>
              </div>
              <Grid
                className={styles.controlsContainer}
                container
                direction="row"
                justify="space-evenly"
                alignItems="center">
                  {audioControl}
                  {hangUp}
                  {videoControl}
              </Grid>
            </div>
            <Header className={styles.header}>
              <Toolbar disableGutters>
                <SidebarTrigger sidebarId='primarySidebar' />
                {selectedUser && <ConversationHead user={selectedUser} connected={connectionAccepted} onConnect={handleConnect} onVideoCallClick={handleOpenVideoCall}/>}
              </Toolbar>
            </Header>
            <DrawerSidebar sidebarId={'primarySidebar'}>
              {sidebar.primarySidebar.collapsed ? (
                <Box textAlign={'center'} my={1}>
                  <IconButton className={styles.edit} onClick={handleProfileClick}>
                    <Edit />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <ChatHeader onProfileClick={handleProfileClick}/>
                  <Box p={'4px 16px 12px'}>
                    <Search />
                  </Box>
                </>
              )}
              <ChatList users={usersExceptSelf()} concise={sidebar.primarySidebar.collapsed} onUserSelected={handleUserSelected}/>
            </DrawerSidebar>
            <Content>
              <InsetContainer
                disableGutters
                rightSidebar={
                  <InsetSidebar
                    sidebarId={'secondarySidebar'}
                    classes={{ paper: styles.insetBody }}
                  >
                    {/*placeholder*/}
                  </InsetSidebar>
                }
              >
                {profileOpened && <Profile />}
                {selectedUser && <ChatDialog messages={filteredPeerMessages()} myId={user.email}/>}
              </InsetContainer>
            </Content>
            <InsetFooter ContainerProps={{ disableGutters: true }}>
              <Box display={'flex'} alignItems={'center'} p={1}>
                {selectedUser && <ChatBar concise={sidebar.primarySidebar.collapsed} onSend={handleOnSend}/>}
              </Box>
            </InsetFooter>
          </>
        )}
      </Root>
    </Fullscreen>
  );
};

export default Chat;
