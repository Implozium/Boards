import Common from 'common';
import Request from './Request.js';

const API = {
    boards: {
        loadAll() {
            return Request.get('/api/boards')
                .then((boards) => {
                    return boards.map(Common.makeBoard);
                });
        },
        load(id) {
            return Request.get(`/api/boards/${id}`)
                .then((board) => {
                    return board ? Common.makeBoard(board) : null;
                });
        },
        update(aBoard) {
            return Request.post(`/api/boards/${aBoard.id}`, aBoard)
                .then((res) => {
                    return true;
                });
        },
        remove(id) {
            return Request.post(`/api/boards/${id}/actions/delete`, {})
                .then((res) => {
                    return true;
                });
        },
        constrict(id, boardId) {
            return Request.post(`/api/boards/${id}/actions/constrict`, { boardId })
                .then((res) => {
                    return true;
                });
        },
        archiveDoneTasks(id) {
            return Request.post(`/api/boards/${id}/actions/archive-done-tasks`, {})
                .then((res) => {
                    return true;
                });
        },
    },
    tasks: {
        loadAllByBoardId(boardId) {
            return Request.get(`/api/tasks?board_id=${boardId}`)
                .then((tasks) => {
                    return tasks.map(Common.makeTask);//.filter(aTask => aTask.boardId === boardId);
                });
        },
        update(aTask) {
            return Request.post(`/api/tasks/${aTask.id}`, aTask)
                .then((res) => {
                    return true;
                });
        },
        remove(id) {
            return Request.post(`/api/tasks/${id}/actions/delete`, {})
                .then((res) => {
                    return true;
                });
        },
        expand(id) {
            return Request.post(`/api/tasks/${id}/actions/expand`, {})
                .then((res) => {
                    return true;
                });
        },
        copy(id) {
            return Request.post(`/api/tasks/${id}/actions/copy`, {})
                .then((res) => {
                    return true;
                });
        },
        extract(id, itemsIds) {
            return Request.post(`/api/tasks/${id}/actions/extract`, { itemsIds })
                .then((res) => {
                    return true;
                });
        },
        separate(id, itemsIds) {
            return Request.post(`/api/tasks/${id}/actions/separate`, { itemsIds })
                .then((res) => {
                    return true;
                });
        },
        attach(id, toTaskId) {
            return Request.post(`/api/tasks/${id}/actions/attach`, { toTaskId })
                .then((res) => {
                    return true;
                });
        },
    },
    bookmarks: {
        loadAll() {
            return Request.get('/api/bookmarks')
                .then((bookmarks) => {
                    return bookmarks.map(Common.makeBookmark);
                });
        },
        load(id) {
            return Request.get(`/api/bookmarks/${id}`)
                .then((bookmark) => {
                    return bookmark ? Common.makeBookmark(bookmark) : null;
                });
        },
        update(aBookmark) {
            return Request.post(`/api/bookmarks/${aBookmark.id}`, aBookmark)
                .then((res) => {
                    return true;
                });
        },
        remove(id) {
            return Request.post(`/api/bookmarks/${id}/actions/delete`, {})
                .then((res) => {
                    return true;
                });
        },
    },
};

export default API;