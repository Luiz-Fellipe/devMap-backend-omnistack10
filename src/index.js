const express = require('express');
const mongoose = require('mongoose');
const routes = require('../src/routes');

const app = express();

mongoose.connect('mongodb+srv://luiz:123456aa@cluster0-ldo8r.mongodb.net/devMap-omnistack10?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(routes);

app.listen(3333);