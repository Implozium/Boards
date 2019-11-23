const Entity = require('app/entities/Entity');
const common = require('common');
const jsonfile = require('app/helpers/jsonfile');
const path = require('path');
const config = require('config');

module.exports = class TasksList extends Entity {
    constructor(params) {
        super();
        this.username = params.username;
        this.tasks = params.tasks.map(common.makeTask);
    }
    
    toJSON() {
        return {
            username: this.username,
            tasks: this.tasks
        };
    }

    update(params) {
        const aTask = common.makeTask(params);
        const index = this.tasks.findIndex(task => task.id === aTask.id);
        if (index !== -1) {
            this.tasks.splice(index, 1, aTask);
        } else {
            this.tasks.push(aTask);
        }
        return this;
    }

    remove(id) {
        const index = this.tasks.findIndex(aTask => aTask.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
        return this;
    }

    static getFileName(username) {
        return path.resolve(config.get('global')['storage'], username, 'tasks.json');
    }

    static getCacheKey(params) {
        return ['tasks', params.username].join('::');
    };

    static loadFromStorage(params) {
        return jsonfile.load(TasksList.getFileName(params.username))
            .then((data) => {
                return {
                    username: params.username,
                    tasks: data,
                };
            });
    }

    /**
     * 
     * @param {{}} params 
     * @return {Promise.<TasksList>}
     */
    static load(params) {
        return super.load(params);
    }

    saveInStorage() {
        return jsonfile.save(TasksList.getFileName(this.username), this.tasks);
    }

    deleteInStorage() {
        this.tasks = [];
        return jsonfile.save(TasksList.getFileName(this.username), []);
    }
}