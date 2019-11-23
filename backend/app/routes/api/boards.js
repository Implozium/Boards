const express = require("express");

const boards = require('app/actions/boards');

const router = express.Router();

router.get('/', (req, res, next) => {
    boards.loadAll({ username: req.user.name })
        .then((boards) => {
            res.json(boards);
        })
        .catch((err) => {
            console.error(err, new Error().stack);
            res.sendStatus(500);
        });
});
router.get('/:id', (req, res, next) => {
    boards.load({ username: req.user.name, id: req.params.id })
        .then((board) => {
            res.json(board);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.post('/:id', (req, res, next) => {
    boards.update({ username: req.user.name, id: req.params.id, board: req.body })
        .then(() => res.json({ result: true }))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.post('/:id/actions/delete', (req, res, next) => {
    boards.delete({ username: req.user.name, id: req.params.id })
        .then(() => res.json({ result: true }))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.post('/:id/actions/constrict', (req, res, next) => {
    boards.constrict({ username: req.user.name, id: req.params.id, boardId: req.body.boardId })
        .then(() => res.json({ result: true }))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

module.exports = router;