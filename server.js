const express = require('express');
const http = require('http')
const app = express();
const httpServer = http.createServer(app)
const socket = require('socket.io')
const io = socket(httpServer)
const path = require('path');
//const helloRoutes = require('./routes/helloRoutes');
//const worldRoutes = require('./routes/worldRoutes');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// From https://facebook.github.io/create-react-app/docs/deployment
app.use(express.static(path.join(__dirname, '/client/build')));

//app.use('/api/hello', helloRoutes);
//app.use('/api/world', worldRoutes);

// "catchall" route: for any request that doesn't match any routes above
// will be redirected to React's index.html file.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
});

const users={}

io.on('connection', socket => {
    let userId;

    socket.on('disconnect', () => {
      delete users[userId]
    })

    socket.on('addUser', data => {
      userId = data.id;
      users[userId] = socket.id;
      io.sockets.emit('allUsers', users)
    })

    socket.on('callUser', data => {
        io.to(users[data.userToCall]).emit('hey', {signal: data.signalData, from: data.from})
    })

    socket.on('acceptCall', data => {
        io.to(users[data.to]).emit('callAccepted', data.signal)
    })

    socket.on('close', data => {
        io.to(users[data.to]).emit('close')
    })

    socket.on('rejected', data => {
        io.to(users[data.to]).emit('rejected')
    })
})

const port = process.env.PORT || 8080;

httpServer.listen(port, () => console.log(`Server running on port ${port}`));
