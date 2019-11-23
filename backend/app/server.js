const express = require("express");
const http = require("http");
const favicon = require('serve-favicon');

const config = require('config');
const routes = require('app/routes');
// const common = require('./common');
// const api = require('./api');

const app = express();

app.use(express.static(config.get('global')['static']));
app.use(favicon(config.get('global')['favicon']));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

http.createServer(app).listen(config.get('global')['port']);