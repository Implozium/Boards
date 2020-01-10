const express = require("express");

const auth = require('app/auth');
const user = require('app/actions/user');

const router = express.Router();

router.use(auth.loggedIn, (req, res, next) => {
    console.log(req.guid, req.user.name, req.url, req.method);
    user.init(req.user.name)
        .then(() => next());
});

router.use('/boards', require('./boards'));
router.use('/tasks', require('./tasks'));
router.use('/bookmarks', require('./bookmarks'));

module.exports = router;