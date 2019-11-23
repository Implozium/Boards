function getAuthKeyFromRequest(req) {
    return '';
}

function loggedIn(req, res, next) {
    const authKey = getAuthKeyFromRequest(req);
    Promise.resolve({ name: 'default' })
        .then((user) => {
            if (user) {
                req.user = user;
                req.authKey = authKey;
                next();
            } else {
                res.status(401).send({ msg: 'unauthorized' });
            }
        });
}

function loggedOut(req, res, next) {
    const authKey = getAuthKeyFromRequest(req);

    next();
}

module.exports = {
    loggedIn,
    loggedOut,
};