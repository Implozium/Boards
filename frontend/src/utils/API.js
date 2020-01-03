import Common from 'common';
import Request from './Request.js';

const API = {
    loadBoards() {
        return Request.get('/api/boards')
            .then((boards) => {
                return boards.map(Common.makeBoard);
            });
    },
    loadBoard(id) {
        return Request.get(`/api/boards/${id}`)
            .then((board) => {
                return board ? Common.makeBoard(board) : null;
            });
    },
    updateBoard(aBoard) {
        return Request.post(`/api/boards/${aBoard.id}`, aBoard)
            .then((res) => {
                return true;
            });
    },
    removeBoard(id) {
        return Request.post(`/api/boards/${id}/actions/delete`, {})
            .then((res) => {
                return true;
            });
    },
    constrictBoard(id, boardId) {
        return Request.post(`/api/boards/${id}/actions/constrict`, { boardId })
            .then((res) => {
                return true;
            });
    },
    archiveDoneTasksInBoard(id) {
        return Request.post(`/api/boards/${id}/actions/archive-done-tasks`, {})
            .then((res) => {
                return true;
            });
    },
    loadTasks(boardId) {
        return Request.get(`/api/tasks?board_id=${boardId}`)
            .then((tasks) => {
                return tasks.map(Common.makeTask);//.filter(aTask => aTask.boardId === boardId);
            });
    },
    updateTask(aTask) {
        return Request.post(`/api/tasks/${aTask.id}`, aTask)
            .then((res) => {
                return true;
            });
    },
    removeTask(id) {
        return Request.post(`/api/tasks/${id}/actions/delete`, {})
            .then((res) => {
                return true;
            });
    },
    expandTask(id) {
        return Request.post(`/api/tasks/${id}/actions/expand`, {})
            .then((res) => {
                return true;
            });
    },
    copyTask(id) {
        return Request.post(`/api/tasks/${id}/actions/copy`, {})
            .then((res) => {
                return true;
            });
    },
    extractTask(id, itemsIds) {
        return Request.post(`/api/tasks/${id}/actions/extract`, { itemsIds })
            .then((res) => {
                return true;
            });
    },
    separateTask(id, itemsIds) {
        return Request.post(`/api/tasks/${id}/actions/separate`, { itemsIds })
            .then((res) => {
                return true;
            });
    },
    attachTask(id, toTaskId) {
        return Request.post(`/api/tasks/${id}/actions/attach`, { toTaskId })
            .then((res) => {
                return true;
            });
    },
};

export default API;