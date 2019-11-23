const TasksList = require('app/entities/TasksList');
const BoardsList = require('app/entities/BoardsList');
const common = require('common');

module.exports = {
    loadAll({ username, boadrId }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                if (boadrId) {
                    return aTasksList.tasks.filter(aTask => aTask.boardId === boadrId);
                } else {
                    return aTasksList.tasks;
                }
            });
    },
    load({ username, id }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                return aTasksList.tasks.filter(aTask => aTask.id === id)[0];
            });
    },
    update({ username, id, task }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                aTasksList.update(task);
                return aTasksList.save();
            });
    },
    delete({ username, id }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                aTasksList.remove(id);
                return aTasksList.save();
            });
    },
    expand({ username, id }) {
        Promise.all([
            BoardsList.load({ username }),
            TasksList.load({ username })
        ])
            .then(([ aBoardsList, aTasksList ]) => {
                const aTask = aTasksList.tasks.find(aTask => aTask.id === id);
                if (!aTask) {
                    return true;
                }
                aBoardsList.update({
                    id: aTask.id,
                    title: aTask.title,
                    description: aTask.description,
                    created: aTask.created,
                    tags: aTask.tags,
                });
                aTasksList.remove(aTask.id);
                aTask.items.forEach(item => {
                    aTasksList.update({
                        id: common.makeGuid(),
                        title: item.title,
                        description: item.description,
                        done: item.done,
                        created: item.created,
                        boardId: aTask.id,
                    });
                });
                if (aTask.links.length) {
                    aTasksList.update({
                        id: common.makeGuid(),
                        title: 'Ссылки',
                        boardId: aTask.id,
                        links: aTask.links,
                        created: aTask.created,
                    });
                }
                return Promise.all([
                    aBoardsList.save(),
                    aTasksList.save()
                ]);
            })
            .then(() => true);
    },
};