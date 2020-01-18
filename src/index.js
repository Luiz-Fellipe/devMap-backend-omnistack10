const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('../src/routes');
const {setupWebsocket} = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://luiz:123456aa@cluster0-ldo8r.mongodb.net/devMap-omnistack10?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);