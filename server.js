const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// From https://facebook.github.io/create-react-app/docs/deployment
app.use(express.static(path.join(__dirname, "/client/build")));

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

// "catchall" route: for any request that doesn't match any routes above
// will be redirected to React's index.html file.
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
});

app.listen(port, () => console.log(`Listening on port ${port}`));
