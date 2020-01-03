const TasksList = require('app/entities/TasksList');
const BoardsList = require('app/entities/BoardsList');
const common = require('common');

module.exports = {
    loadAll({ username }) {
        return BoardsList.load({ username })
            .then((aBoardsList) => {
                return aBoardsList.boards;
            });
    },
    load({ username, id }) {
        return BoardsList.load({ username })
            .then((aBoardsList) => {
                return aBoardsList.boards.filter(aBoard => aBoard.id === id)[0];
            });
    },
    update({ username, id, board }) {
        return BoardsList.load({ username })
            .then((aBoardsList) => {
                aBoardsList.update(board);
                return aBoardsList.save();
            });
    },
    delete({ username, id }) {
        return Promise.all([
            BoardsList.load({ username }),
            TasksList.load({ username })
        ])
            .then(([ aBoardsList, aTasksList ]) => {
                const aBoard = aBoardsList.boards.find(aBoard => aBoard.id === id);
                if (!aBoard) {
                    return true;
                }
                aBoardsList.remove(aBoard.id);
                aTasksList.tasks.filter(aTask => aTask.boardId === aBoard.id)
                    .forEach(aTask => aTasksList.remove(aTask.id));

                return Promise.all([
                    aBoardsList.save(),
                    aTasksList.save()
                ]);
            })
            .then(() => true);
    },
    constrict({ username, id, boardId }) {
        Promise.all([
            BoardsList.load({ username }),
            TasksList.load({ username })
        ])
            .then(([ aBoardsList, aTasksList ]) => {
                if (aBoardsList.boards.length <= 1) {
                    throw new Error('Count of boards is less 1 or 0, so cannot constrict board');
                }
                if (!aBoardsList.boards.find(aBoard => aBoard.id === boardId)) {
                    throw new Error('Cannot find board with id ' + boardId);
                }
                if (id === boardId) {
                    throw new Error('Cannot include board in self');
                }
                const aBoard = aBoardsList.boards.find(aBoard => aBoard.id === id);
                aBoardsList.remove(aBoard.id);
                const boardTasks = aTasksList.tasks.filter(aTask => aTask.boardId === id);
                aTasksList.update({
                    id: aBoard.id,
                    title: aBoard.title,
                    description: aBoard.description,
                    created: aBoard.created,
                    boardId: boardId,
                    items: boardTasks.map(aTask => common.makeItem({
                        title: aTask.title,
                        description: aTask.description + (aTask.items.length === 0 ? '' : '\n' + aTask.items.map(item => `- ${item.title}`).join('\n')),
                        done: aTask.done,
                        created: aTask.created,
                    })),
                    links: boardTasks.reduce((arr, aTask) => arr.concat(aTask.links), []),
                    tags: aBoard.tags,
                })
                boardTasks.forEach(aTask => aTasksList.remove(aTask.id));
                return Promise.all([
                    aBoardsList.save(),
                    aTasksList.save()
                ]);
            })
            .then(() => true);
    },
    archiveDoneTasks({ username, id }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                const boardTasks = aTasksList.tasks.filter(aTask => aTask.boardId === id && aTask.done && !aTask.archival && aTask.type !== 'common');
                boardTasks.forEach((aTask) => {
                    aTask.archival = Date.now();
                });

                return aTasksList.save();
            })
            .then(() => true);
    }
};