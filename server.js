const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helloRoutes = require('./routes/helloRoutes');
const worldRoutes = require('./routes/worldRoutes');
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// From https://facebook.github.io/create-react-app/docs/deployment
app.use(express.static(path.join(__dirname, '/client/build')));

app.use('/api/hello', helloRoutes);
app.use('/api/world', worldRoutes);

// "catchall" route: for any request that doesn't match any routes above
// will be redirected to React's index.html file.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
});

app.listen(port, () => console.log(`Listening on port ${port}`));
