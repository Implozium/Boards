const Entity = require('app/entities/Entity');
const common = require('common');
const jsonfile = require('app/helpers/jsonfile');
const path = require('path');
const config = require('config');

module.exports = class BoardsList extends Entity {
    constructor(params) {
        super();
        this.username = params.username;
        this.boards = params.boards.map(common.makeBoard);
    }
    
    toJSON() {
        return {
            username: this.username,
            boards: this.boards
        };
    }

    update(params) {
        const aBoard = common.makeBoard(params);
        const index = this.boards.findIndex(board => board.id === aBoard.id);
        if (index !== -1) {
            this.boards.splice(index, 1, aBoard);
        } else {
            this.boards.push(aBoard);
        }
        return this;
    }

    remove(id) {
        const index = this.boards.findIndex(aBoard => aBoard.id === id);
        if (index !== -1) {
            this.boards.splice(index, 1);
        }
        return this;
    }

    static getFileName(username) {
        return path.resolve(config.get('global')['storage'], username, 'boards.json');
    }

    static getCacheKey(params) {
        return ['boards', params.username].join('::');
    };

    static loadFromStorage(params) {
        return jsonfile.load(BoardsList.getFileName(params.username), [])
            .then((data) => {
                return {
                    username: params.username,
                    boards: data,
                };
            });
    }

    /**
     * 
     * @param {{}} params 
     * @return {Promise.<BoardsList>}
     */
    static load(params) {
        return super.load(params);
    }

    saveInStorage() {
        return jsonfile.save(BoardsList.getFileName(this.username), this.boards);
    }

    deleteInStorage() {
        this.boards = [];
        return jsonfile.save(BoardsList.getFileName(this.username), []);
    }
}