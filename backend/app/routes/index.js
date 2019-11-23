const express = require("express");

const config = require('config');
const common = require('common');

const router = express.Router();

router.use((req, res, next) => {
    req.guid = common.makeGuid();
    res.setHeader('Request-Id', req.guid);
    return next();
});

router.use('/api', require('./api'));

router.get('/*', (req, res, next) => {
    res.sendFile(path.resolve(config.get('global')['static'], 'index.html'));
});

module.exports = router;