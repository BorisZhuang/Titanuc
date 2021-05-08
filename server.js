const express = require('express');
const http = require('http')
const app = express();
const httpServer = http.createServer(app)
const socket = require('socket.io')
const io = socket(httpServer)
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// From https://facebook.github.io/create-react-app/docs/deployment
app.use(express.static(path.join(__dirname, '/client/build')));

// "catchall" route: for any request that doesn't match any routes above
// will be redirected to React's index.html file.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
});

const users={}

io.on('connection', socket => {
    let userId;

    socket.on('disconnect', () => {
      console.log(`delete user ${userId}`)
      delete users[userId]
    })

    socket.on('addUser', user => {
      console.log(`adding user, ${user.email}`)
      userId = user.email;
      let pair = { socketId: socket.id };
      user = {...user, ...pair};
      const {picture, ...otherProps} = user;
      const newUser = {avatar: picture, ...otherProps};
      users[userId] = newUser
      console.log(`users count, ${Object.keys(users).length}`)
      io.sockets.emit('allUsers', users)
    })

    socket.on('connectUser', data => {
      console.log(`server connect user is called from ${data.from.email} to ${data.userToConnect}`)
      if (users[data.userToConnect]) {
        io.to(users[data.userToConnect]["socketId"]).emit('hey2', {signal: data.signalData, from: data.from})
      }
    })

    socket.on('callUser', data => {
        console.log(`server call user is called from ${data.from} to ${data.userToCall}`)
        if (users[data.userToCall]) {
          io.to(users[data.userToCall]["socketId"]).emit('hey', {signal: data.signalData, from: data.from})
        }
    })

    socket.on('acceptConnection', data => {
      if (users[data.to]) {
        io.to(users[data.to]["socketId"]).emit('connectionAccepted', data.signal)
      }
    })

    socket.on('acceptCall', data => {
      if (users[data.to]) {
        io.to(users[data.to]["socketId"]).emit('callAccepted', data.signal)
      }
    })

    socket.on('close', data => {
        console.log(`call closed, ${data.to}`)
        if (users[data.to]) {
          io.to(users[data.to]["socketId"]).emit('close')
        }
    })

    socket.on('rejected', data => {
        console.log(`call rejected, ${data.to}`)
        if (users[data.to]) {
          io.to(users[data.to]["socketId"]).emit('rejected')
        }
    })
})

const port = process.env.PORT || 8080;

httpServer.listen(port, () => console.log(`Server running on port ${port}`));
