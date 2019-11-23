const express = require("express");

const tasks = require('app/actions/tasks');

const router = express.Router();

router.get('/', (req, res, next) => {
    tasks.loadAll({ username: req.user.name })
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.get('/:id', (req, res, next) => {
    tasks.load({ username: req.user.name, id: req.params.id })
        .then((task) => {
            res.json(task);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.post('/:id', (req, res, next) => {
    tasks.update({ username: req.user.name, id: req.params.id, task: req.body })
        .then(() => res.json({ result: true }))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.post('/:id/actions/delete', (req, res, next) => {
    tasks.delete({ username: req.user.name, id: req.params.id })
        .then(() => res.json({ result: true }))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});
router.post('/:id/actions/expand', (req, res, next) => {
    tasks.expand({ username: req.user.name, id: req.params.id })
        .then(() => res.json({ result: true }))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

module.exports = router;