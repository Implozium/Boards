const TasksList = require('app/entities/TasksList');
const BoardsList = require('app/entities/BoardsList');
const common = require('common');

module.exports = {
    loadAll({ username, boardId }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                if (boardId) {
                    return aTasksList.tasks.filter(aTask => aTask.boardId === boardId);
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
                aTask.items.forEach((item) => {
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
    copy({ username, id }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                const aTask = aTasksList.tasks.find(aTask => aTask.id === id);
                if (!aTask) {
                    return true;
                }
                const newTask = common.makeTask(aTask);
                newTask.title = newTask.title + ' (копия)';
                newTask.id = common.makeGuid();
                aTasksList.update(newTask);
                return aTasksList.save();
            });
    },
    extract({ username, id, itemsIds }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                const aTask = aTasksList.tasks.find(aTask => aTask.id === id);
                if (!aTask) {
                    return true;
                }
                if (!aTask.items.length) {
                    return true;
                }
                aTask.items.filter((item, i) => itemsIds.includes(i))
                    .forEach((item) => {
                        const newTask = common.makeTask(aTask);
                        newTask.title = item.title;
                        newTask.done = item.done ? Date.now() : 0;
                        newTask.description = item.description;
                        newTask.created = Date.now();
                        newTask.items = [];
                        newTask.id = common.makeGuid();
                        aTasksList.update(newTask);
                    });
                aTask.items = aTask.items.filter((item, i) => !itemsIds.includes(i));
                return aTasksList.save();
            });
    },
    separate({ username, id, itemsIds }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                const aTask = aTasksList.tasks.find(aTask => aTask.id === id);
                if (!aTask) {
                    return true;
                }
                if (!aTask.items.length) {
                    return true;
                }
                const newTask = common.makeTask(aTask);
                newTask.title = newTask.title + ' (дополнение)';
                newTask.done = aTask.done ? Date.now() : 0;
                newTask.created = Date.now();
                newTask.id = common.makeGuid();
                newTask.items = newTask.items.filter((item, i) => itemsIds.includes(i));
                aTasksList.update(newTask);
                aTask.items = aTask.items.filter((item, i) => !itemsIds.includes(i));
                return aTasksList.save();
            });
    },
    attach({ username, id, toTaskId }) {
        return TasksList.load({ username })
            .then((aTasksList) => {
                const aTask = aTasksList.tasks.find(aTask => aTask.id === id);
                const toTask = aTasksList.tasks.find(aTask => aTask.id === toTaskId);
                if (!aTask || !toTask) {
                    return true;
                }
                if (aTask.description) {
                    toTask.description += toTask.description ? `\n\n${aTask.title}\n${'='.repeat(aTask.title.length)}\n\n` : '';
                    toTask.description += aTask.description;
                }
                toTask.tags = toTask.tags.concat(aTask.tags.filter(tag => !toTask.tags.includes(tag)));
                toTask.items = toTask.items.concat(aTask.items);
                toTask.links = toTask.links.concat(aTask.links.filter(link => !toTask.links.find(aLink => aLink.title === link.title && aLink.href === link.href)));
                aTasksList.remove(id);
                return aTasksList.save();
            });
    },
};