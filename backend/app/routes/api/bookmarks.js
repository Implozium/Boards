const express = require("express");

const bookmarks = require('app/actions/bookmarks');

const router = express.Router();

router.get('/', (req, res, next) => {
    bookmarks.loadAll({ username: req.user.name })
        .then((bookmarks) => {
            res.json(bookmarks);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.get('/:id', (req, res, next) => {
    bookmarks.load({ username: req.user.name, id: req.params.id })
        .then((bookmark) => {
            res.json(bookmark);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.post('/:id', (req, res, next) => {
    bookmarks.update({ username: req.user.name, id: req.params.id, bookmark: req.body })
        .then(() => res.json({ result: true }))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.post('/:id/actions/delete', (req, res, next) => {
    bookmarks.delete({ username: req.user.name, id: req.params.id })
        .then(() => res.json({ result: true }))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

module.exports = router;