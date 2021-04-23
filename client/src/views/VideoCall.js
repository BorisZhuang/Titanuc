import React from 'react';
import Peer from "simple-peer";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  preview: {
    width: 151,
    height: 151
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function VideoCall({
  peerId,
  caller,
  receivingCall,
  callAccepted,
  openVideo,
  onVideoCallClose,
  onCallPeer,
  onCallPeerSignal,
  onAcceptCall,
  onAcceptCallSignal,
  onRejectCall,
  onEndCall }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [videoInput, setVideoInput] = React.useState('');
  const [audioInput, setAudioInput] = React.useState('');
  const [audioOutput, setAudioOutput] = React.useState('');
  const [videoInputs, setVideoInputs] = React.useState([]);
  const [audioInputs, setAudioInputs] = React.useState([]);
  const [audioOutputs, setAudioOutputs] = React.useState([]);
  const [stream, setStream] = React.useState();
  const [callingFriend, setCallingFriend] = React.useState(false);
  const [callRejected, setCallRejected] = React.useState(false);

  const userVideo = React.useRef();
  const partnerVideo = React.useRef();
  const myPeer = React.useRef();

  React.useEffect(() => {
    setOpen(openVideo);
    callPeer(peerId)
  }, [openVideo]);

  const endCall = () => {
    myPeer.current.destroy()
    onEndCall()
    window.location.reload()
  }

  const callPeer = (id) => {
    if (id !== '' /* && users[id] && id !== user.email*/) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        setStream(stream);
        console.log('setStream was called')
        setCallingFriend(true)
        //setCaller(id)
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
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
          stream: stream,
        });

        myPeer.current = peer;

        peer.on("signal", data => {
          onCallPeerSignal(data)
          //socket.current.emit("callUser", { userToCall: id, signalData: data, from: user.email })
        })

        peer.on("stream", stream => {
          if (partnerVideo.current) {
            partnerVideo.current.srcObject = stream;
          }
        });

        peer.on('error', (err)=>{
          endCall()
        })

        onCallPeer(peer)
      })
      .catch (() => {
        //setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.')
        //setModalVisible(true)
      })
    } else {
      //setModalMessage('We think the username entered is wrong. Please check again and retry!')
      //setModalVisible(true)
      return
    }
  }

  const acceptCall = () => {
    //ringtoneSound.unload();
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
      //setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      myPeer.current = peer

      peer.on("signal", data => {
        onAcceptCallSignal(data)
        //socket.current.emit("acceptCall", { signal: data, to: caller })
      })

      peer.on("stream", stream => {
        partnerVideo.current.srcObject = stream;
      });

      peer.on('error', (err)=>{
        endCall()
      })

      //peer.signal(callerSignal);

      onAcceptCall(peer)
    })
    .catch(()=>{
      //setModalMessage('You cannot place/ receive a call without granting video and audio permissions! Please change your settings to use Cuckoo.')
      //setModalVisible(true)
    })
  }

  const rejectCall = () => {
    //ringtoneSound.unload();
    setCallRejected(true)
    onRejectCall()
    window.location.reload()
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <video className="partnerVideo cover" playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall && !callAccepted && !callRejected) {
    incomingCall = (
      <div className="incomingCallContainer">
        <div className="incomingCall flex flex-column">
          <div><span>{caller}</span> is calling you!</div>
          <div className="flex">
          <button name="accept" onClick={()=>acceptCall()}>Accept</button>
          <button name="reject" onClick={()=>rejectCall()}>Reject</button>
          </div>
        </div>
      </div>
    )
  }

  const getMediaDevices = () => {
    let videoInputs = [];
    let audioInputs = [];
    let audioOutputs = [];

    navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
      deviceInfos.forEach((deviceinfo) => {
        if(deviceinfo.kind === 'audioinput'){
          audioInputs.push(deviceinfo);
        }else if(deviceinfo.kind === 'audiooutput'){
          audioOutputs.push(deviceinfo);
        }else if(deviceinfo.kind === 'videoinput'){
          videoInputs.push(deviceinfo);
        }
      });
      setVideoInputs(videoInputs);
      setAudioInputs(audioInputs);
      setAudioOutputs(audioOutputs);
    });
  }

  const getMediaStream = (stream) => {
    setStream(stream);
	  //setVideoInput(window.URL.createObjectURL(stream));
    //var videoTrack = stream.getVideoTracks()[0];
	  //window.stream = stream;
	  //videoplay.srcObject = stream;
  }

  const handleError = err => {
    console.log('getUserMedia error:', err);
  }

/* 	if (!navigator.mediaDevices ||
		!navigator.mediaDevices.getUserMedia) {
		console.log('getUserMedia is not supported!');
	} else {
		var constraints = {
			video : true,
			audio : true
		}
		navigator.mediaDevices.getUserMedia(constraints)
			.then(getMediaDevices)
			.catch(handleError);
	} */

  const handleVideoInputChange = (event) => {
    setVideoInput(event.target.value);
    var constraints = {
/* 			video : {
				width: 640,
				height: 480,
				frameRate:15,
				facingMode: 'enviroment',
				deviceId : videoInput
			}, */
      video: true,
			audio : true
		}
		navigator.mediaDevices.getUserMedia(constraints)
      .then(getMediaStream)
      .catch(handleError);
  }

  const handleAudioInputChange = (event) => {
    setAudioInput(event.target.value);
  }

  const handleAudioOutputChange = (event) => {
    setAudioOutput(event.target.value);
  }

  return (
    <div>
      <Dialog fullScreen open={open} onClose={onVideoCallClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onVideoCallClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Video
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          {incomingCall}
        </div>
        <div className="callContainer">
          <div className="partnerVideoContainer">
            {PartnerVideo}
          </div>
          <div className="userVideoContainer">
            {UserVideo}
          </div>
        </div>
{/*         <FormControl className={classes.formControl}>
          <InputLabel id="video-input-label">Video Input</InputLabel>
          <Select
            labelId="video-input-label"
            id="video-input-select"
            value={videoInput}
            onChange={handleVideoInputChange}>
            {videoInputs.map(videoInput => (
              <MenuItem key={videoInput.deviceId} value={videoInput.deviceId}>
                    {videoInput.label}
              </MenuItem>
            ))}
            </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="audio-input-label">Audio Input</InputLabel>
          <Select
            labelId="audio-input-label"
            id="audio-input-select"
            value={audioInput}
            onChange={handleAudioInputChange}>
            {audioInputs.map(audioInput => (
              <MenuItem key={audioInput.deviceId} value={audioInput.deviceId}>
                    {audioInput.label}
              </MenuItem>
            ))}
            </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="audio-output-label">Audio Output</InputLabel>
          <Select
            labelId="audio-output-label"
            id="audio-output-select"
            value={audioOutput}
            onChange={handleAudioOutputChange}>
            {audioOutputs.map(audioOutput => (
              <MenuItem key={audioOutput.deviceId} value={audioOutput.deviceId}>
                    {audioOutput.label}
              </MenuItem>
            ))}
            </Select>
        </FormControl> */}
      </Dialog>
    </div>
  );
}
