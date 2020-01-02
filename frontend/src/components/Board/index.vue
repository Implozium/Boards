<template>
    <div class="board">
        <div class="board__info">
            <div class="board__info-title">
                <slot name="boards"></slot>
                <template v-if="board">
                    <div class="board__info-button"><slot name="board-menu"></slot></div>
                </template>
            </div>
            <template v-if="board">
                <div class="board__info-block">
                    <div class="board__info-button board__info-button_add" @click="onEditTask">+ Новая задача</div>
                    <input-text :value="filters.str" name="str" title="Поиск" @change="setTextFilter"></input-text>
                    <div>
                        <label><checkbox :checked="filters.archival" name="archival" @click="setArchival"/> Архивные</label>
                    </div>
                    <div class="board__info-tags">
                        <tag v-for="(tag) in tags" :key="tag" :has-activing="true" @click="toggleTag(tag)" :status="filters.tags.includes(tag) ? 'actived' : 'default'">{{ tag }}</tag>
                    </div>
                </div>
            </template>
        </div>
        <div class="board__tasks" v-if="board">
            <column-grid :minSubcolumnWidth="320">
                <column-grid-item v-for="wrapper in wrappedTasks" :key="wrapper.task.id" :column="wrapper.column">
                    <task
                        :task="wrapper.task"
                        :type="wrapper.type"
                        @edit="onEditTask"
                        @remove="onRemoveTask"
                        @archive="onArchiveTask"
                        @update="subupdateTask"
                        @move="onMoveTask"
                        @show="onShowTask"
                        @expand="onExpandTask"
                        @copy="onCopyTask"
                        @extract="onExtractTask"
                        @separate="onSeparateTask"
                        @attach="onAttachTask"
                    >
                    </task>
                </column-grid-item>
            </column-grid>
        </div>
        <modal v-if="modals.editing.show" @hide="closeModals" :close-on-wrap="false" type="full">
            <template v-slot:header>
                Редактировать задачу
            </template>
            <template v-slot:default>
                <task-form :task="modals.editing.task" ref="taskForm"></task-form>
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="updateTask($refs.taskForm.getTask()), closeModals()">Сохранить</custom-button>
            </template>
        </modal>
        <modal v-if="modals.removing.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Вы действительно хотите удалить задачу<br/>"<b>{{ modals.removing.task.title }}</b>"?
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="removeTask(modals.removing.task.id), closeModals()">Удалить</custom-button>
                <!-- <custom-button type="link" @click="closeModals">Отмена</custom-button> -->
            </template>
        </modal>
        <modal v-if="modals.archiving.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Вы действительно хотите архивировать задачу<br/>"<b>{{ modals.archiving.task.title }}</b>"?
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="archiveTask(modals.archiving.task.id), closeModals()">Архивировать</custom-button>
            </template>
        </modal>
        <modal v-if="modals.moving.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Перемещение задачи<br/>"<b>{{ modals.moving.task.title }}</b>"?
            </template>
            <template v-slot:default>
                <input-select
                    name="boardId"
                    title="Доска"
                    :value="modals.moving.boardId"
                    :items="boards.map(aBoard => ({ title: aBoard.title, value: aBoard.id }))"
                    @change="onChangeInMoving"
                ></input-select>
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="moveTask(modals.moving.task.id, modals.moving.boardId), closeModals()">Переместить</custom-button>
            </template>
        </modal>
        <modal v-if="modals.showing.show" @hide="closeModals" type="raw">
            <task class="board__showing-task" :fixed="false" :actived="true" :task="modals.showing.wrappedTask.task" :type="modals.showing.wrappedTask.type"
                @edit="onEditTask" @remove="onRemoveTask" @archive="onArchiveTask" @update="subupdateTask" @move="onMoveTask" @show="onShowTask" @expand="onExpandTask">
            </task>
        </modal>
        <modal v-if="modals.expanding.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Вы действительно преобразовать (расширить) задачу в доску<br/>"<b>{{ modals.expanding.task.title }}</b>"?
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="expandTask(modals.expanding.task.id), closeModals()">Преобразовать</custom-button>
            </template>
        </modal>
        <modal v-if="modals.extracting.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Какие пункты этой задачи извлечь в отдельные задачи<br/>"<b>{{ modals.extracting.task.title }}</b>"?
            </template>
            <template v-slot:default>
                <ol>
                    <li v-for="(item, i) in modals.extracting.task.items" :key="i">
                        <checkbox
                            :checked="modals.extracting.itemsIds[i] === true"
                            :name="i"
                            @click="modals.extracting.itemsIds[$event.name] = $event.value"
                        ></checkbox>{{ item.title }}
                    </li>
                </ol>
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="extractTask(modals.extracting.task.id, modals.extracting.itemsIds), closeModals()">Извлечь</custom-button>
            </template>
        </modal>
        <modal v-if="modals.separating.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Какие пункты этой задачи переместить в новую задачу<br/>"<b>{{ modals.separating.task.title }}</b>"?
            </template>
            <template v-slot:default>
                <ol>
                    <li v-for="(item, i) in modals.separating.task.items" :key="i">
                        <checkbox
                            :checked="modals.separating.itemsIds[i] === true"
                            :name="i"
                            @click="modals.separating.itemsIds[$event.name] = $event.value"
                        ></checkbox>{{ item.title }}
                    </li>
                </ol>
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="separateTask(modals.separating.task.id, modals.separating.itemsIds), closeModals()">Разделить (переместить)</custom-button>
            </template>
        </modal>
        <modal v-if="modals.attaching.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Слияние задачи<br/>"<b>{{ modals.attaching.task.title }}</b>"?
            </template>
            <template v-slot:default>
                <input-select
                    name="toTaskId"
                    title="Задача к которой присоединится эта задача"
                    :value="modals.attaching.toTaskId"
                    :items="tasks.filter(aTask => aTask.id !== modals.attaching.task.id).map(aTask => ({ title: aTask.title, value: aTask.id }))"
                    @change="modals.attaching.toTaskId = $event.value"
                ></input-select>
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="attachTask(modals.attaching.task.id, modals.attaching.toTaskId), closeModals()">Влить</custom-button>
            </template>
        </modal>
    </div>
</template>

<script>
import TaskForm from '@/forms/TaskForm.vue';
import Modal from '@/components/common/Modal.vue';
import ColumnGrid from '@/components/common/ColumnGrid';
import ColumnGridItem from '@/components/common/ColumnGrid/ColumnGridItem.vue';
import CustomButton from '@/components/common/CustomButton.vue';
import InputSelect from '@/components/inputs/InputSelect.vue';
import Checkbox from '@/components/inputs/Checkbox.vue';
import InputText from '@/components/inputs/InputText.vue';
import Tag from '@/components/common/Tag.vue';
import Task from './Task.vue';
import Common from 'common';

export default {
    components: {
        TaskForm,
        ColumnGrid,
        ColumnGridItem,
        CustomButton,
        Modal,
        Task,
        InputSelect,
        Tag,
        InputText,
        Checkbox,
    },
    props: {
        "boardId": {
            type: String
        }
    },
    data() {
        return {
            time: Date.now(),
            modals: {
                editing: {
                    show: false,
                    task: null,
                },
                removing: {
                    show: false,
                    task: null,
                },
                archiving: {
                    show: false,
                    task: null,
                },
                moving: {
                    show: false,
                    task: null,
                    boardId: null,
                },
                showing: {
                    show: false,
                    wrappedTask: null,
                },
                expanding: {
                    show: false,
                    task: null,
                },
                extracting: {
                    show: false,
                    task: null,
                    itemsIds: null,
                },
                separating: {
                    show: false,
                    task: null,
                    itemsIds: null,
                },
                attaching: {
                    show: false,
                    task: null,
                    toTaskId: null,
                },
            },
            timer: null,
            mappingForTaskTypes: {
                "done": 0,
                "past": 1,
                "present": 2,
                // "week": 2,
                // "month": 2,
                "free": 2,
                "future": 3,
                "common": 4,
            },
            filters: {
                tags: [],
                str: '',
                timer: null,
                archival: false
            }
        };
    },
    computed: {
        board() {
            return this.$store.getters['boards/boardById'](this.boardId);
        },
        boards() {
            return this.$store.getters['boards/boards'];
        },
        tasks() {
            return this.$store.getters['tasks/tasksByBoardId'](this.boardId);
        },
        wrappedTasks() {
            return this.tasks
                .filter((aTask) => {
                    let has = true;
                    if (this.filters.str) {
                        let hasSrt = false;
                        const regexp = new RegExp(this.filters.str.replace(/./g, '\$&'), 'i');
                        hasSrt = hasSrt || aTask.title.search(regexp) !== -1 || aTask.description.search(regexp) !== -1;
                        hasSrt = hasSrt || aTask.items.some(({ title, description }) => title.search(regexp) !== -1 || hasSrt || description.search(regexp) !== -1);
                        hasSrt = hasSrt || aTask.links.some(({ title, href }) => title.search(regexp) !== -1 || hasSrt || href.search(regexp) !== -1);
                        has = has && hasSrt;
                    }
                    if (this.filters.tags.length) {
                        has = has && aTask.tags.some(tag => this.filters.tags.includes(tag));
                    }
                    if (!this.filters.archival) {
                        has = has && aTask.archival === 0;
                    }
                    return has;
                })
                .map((aTask) => {
                    const type = this.getTaskType(aTask);
                    return {
                        task: aTask,
                        type: type,
                        column: this.mappingForTaskTypes[type],
                    };
                })
                .sort((aWrapper, bWrapper) => aWrapper.task.from && bWrapper.task.from ? aWrapper.task.from - bWrapper.task.from : aWrapper.task.from ? -1 : 1); // aWrapper.task.done ? 1 : bWrapper.task.done ? -1 : 
        },
        tags() {
            return this.tasks
                .reduce((tags, aTask) => {
                    aTask.tags.forEach((tag) => {
                        if (!tags.includes(tag)) {
                            tags.push(tag);
                        }
                    });
                    return tags;
                }, [])
                .sort((a, b) => a.localeCompare(b));;
        },
    },
    watch: {
        "boardId": function () {
            this.init();
        },
    },
    created() {
        this.timer = setInterval(() => {
            this.time = Date.now();
        }, 1000);
        this.init();
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
    methods: {
        resetFilter() {
            this.filters = {
                tags: [],
                str: '',
            };
        },
        setArchival({ value }) {
            this.filters.archival = value;
        },
        onEditTask(id) {
            this.closeModals();
            this.modals.editing.show = true;
            this.modals.editing.task = this.tasks.find(task => task.id === id) || Common.makeTask({ boardId: this.board.id });
        },
        onRemoveTask(id) {
            this.closeModals();
            this.modals.removing.show = true;
            this.modals.removing.task = this.tasks.find(task => task.id === id);
        },
        onArchiveTask(id) {
            this.closeModals();
            this.modals.archiving.show = true;
            this.modals.archiving.task = this.tasks.find(task => task.id === id);
        },
        onMoveTask(id) {
            this.closeModals();
            this.modals.moving.show = true;
            this.modals.moving.task = this.tasks.find(task => task.id === id);
            this.modals.moving.boardId = this.modals.moving.task.boardId;
        },
        onChangeInMoving(event) {
            const {
                name,
                value
            } = event;
            this.modals.moving[name] = value;
        },
        onShowTask(id) {
            this.closeModals();
            this.modals.showing.show = true;
            this.modals.showing.wrappedTask = this.wrappedTasks.find(({ task }) => task.id === id);
        },
        onExpandTask(id) {
            this.closeModals();
            this.modals.expanding.show = true;
            this.modals.expanding.task = this.tasks.find(task => task.id === id);
        },
        onCopyTask(id) {
            this.$store.dispatch('tasks/copy', { id: id });
        },
        onExtractTask(id) {
            this.closeModals();
            this.modals.extracting.show = true;
            this.modals.extracting.task = this.tasks.find(task => task.id === id);
            this.modals.extracting.itemsIds = this.modals.extracting.task.items.map(item => false);
        },
        onSeparateTask(id) {
            this.closeModals();
            this.modals.separating.show = true;
            this.modals.separating.task = this.tasks.find(task => task.id === id);
            this.modals.separating.itemsIds = this.modals.separating.task.items.map(item => false);
        },
        onAttachTask(id) {
            this.closeModals();
            if (this.tasks.length < 2) {
                return;
            }
            this.modals.attaching.show = true;
            this.modals.attaching.task = this.tasks.find(task => task.id === id);
            this.modals.attaching.toTaskId = this.tasks.find(task => task.id !== id).id;
        },
        closeModals() {
            Object.keys(this.modals).forEach(key => this.modals[key].show = false);
        },
        updateTask(aTask) {
            this.$store.dispatch('tasks/update', { task: aTask });
        },
        subupdateTask(id, options) {
            return this.$store.dispatch('tasks/subupdate', { id: id, options: options });
        },
        removeTask(id) {
            this.$store.dispatch('tasks/remove', { id: id });
        },
        archiveTask(id) {
            const index = this.tasks.findIndex(task => task.id === id);
            this.subupdateTask(id, { archival: this.tasks[index].archival ? 0 : Date.now() });
        },
        moveTask(id, boardId) {
            this.subupdateTask(id, { boardId: boardId })
                .then(() => this.$emit('change-board', boardId));
        },
        expandTask(id) {
            this.$store.dispatch('tasks/expand', { id: id })
                .then(() => this.$emit('change-board', id));
        },
        extractTask(id, itemsIds) {
            this.$store.dispatch('tasks/extract', { id: id, itemsIds: itemsIds.reduce((res, checked, i) => checked ? res.concat(i) : res, []) });
        },
        separateTask(id, itemsIds) {
            this.$store.dispatch('tasks/separate', { id: id, itemsIds: itemsIds.reduce((res, checked, i) => checked ? res.concat(i) : res, []) });
        },
        attachTask(id, toTaskId) {
            this.$store.dispatch('tasks/attach', { id: id, toTaskId: toTaskId });
        },
        getTaskType(aTask) {
            if (aTask.type === 'common') {
                return "common";
            } else 
            if (aTask.type === 'period') {
                if (aTask.done) {
                    return "done";
                }
                if (aTask.to && aTask.to < this.time) {
                    return "past";
                }
                if (aTask.from && aTask.from <= this.time && aTask.to && aTask.to >= this.time
                    || aTask.from && !aTask.to && aTask.from <= this.time
                    || !aTask.from && aTask.to && aTask.to >= this.time
                ) {
                    return "present";
                }
                // if (!aTask.from && !aTask.to) {
                //     return "free";
                // }
                if (aTask.from && aTask.from > this.time) {
                    return "future";
                }
            } else if (aTask.type === 'week') {
                const date = new Date();
                const ms = date.getHours() * 60 * 60 * 1000 + date.getMinutes() * 60 * 1000 + date.getSeconds() * 1000;
                const dateDone = new Date(aTask.done);
                if (aTask.days.includes(date.getDay())) {
                    // if (aTask.done)
                    // debugger;
                    if (aTask.done && dateDone.getFullYear() === date.getFullYear() && dateDone.getMonth() === date.getMonth() && dateDone.getDate() === date.getDate()) {
                        return "done";
                    }
                    if (ms < aTask.fromTime) {
                        return "future";
                    }
                    if (ms <= aTask.fromTime + aTask.length) {
                        return "present";
                    }
                    if (ms > aTask.fromTime + aTask.length) {
                        return "past";
                    }
                }
                return "future";
            } else if (aTask.type === 'month') {
                const date = new Date();
                const ms = date.getHours() * 60 * 60 * 1000 + date.getMinutes() * 60 * 1000 + date.getSeconds() * 1000;
                const dateDone = new Date(aTask.done);
                if (aTask.dates.includes(date.getDate())) {
                    if (aTask.done && dateDone.getFullYear() === date.getFullYear() && dateDone.getMonth() === date.getMonth() && dateDone.getDate() === date.getDate()) {
                        return "done";
                    }
                    if (ms < aTask.fromTime) {
                        return "future";
                    }
                    if (ms <= aTask.fromTime + aTask.length) {
                        return "present";
                    }
                    if (ms > aTask.fromTime + aTask.length) {
                        return "past";
                    }
                }
                return "future";
            }
            return "free";
        },
        init() {
            this.resetFilter();
            return Promise.all([
                this.$store.dispatch('boards/load'),
                this.$store.dispatch('tasks/load', { boardId: this.boardId })
            ])
                .then((arr) => {
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        toggleTag(tag) {
            if (this.filters.tags.includes(tag)) {
                this.filters.tags.splice(this.filters.tags.indexOf(tag), 1);
            } else {
                this.filters.tags.push(tag);
            }
        },
        setTextFilter(event) {
            const {
                name,
                value
            } = event;
            this.filters.str = value;
            // if (this.filters.timer) {
            //     clearTimeout(this.filters.timer);
            // }
            // this.filters.timer = setTimeout(() => {
            //     this.filters.str = value;
            // }, 300);
        }
    },
}
</script>

<style scoped>
    .board {
        width: 100%;
        background-color: #627a9d;
        position: relative;
        display: flex;
    }
    .board__showing-task {
        /* margin: 40px 0px 40px 0px; */
        min-width: 600px;
        /* position: relative;
        top: 40px; */
    }
    .board__info {
        width: 240px;
        flex-basis: 240px;
        border-right: 2px solid #111;
        background-color: #2d2d2d;
        padding-left: 8px;
        color: #eee;
        box-sizing: border-box;
        position: fixed;
        height: 100%;
    }
    .board__info-title {
        display: flex;
        margin-bottom: 16px;
    }
    /* .board__info-task-state {
        line-height: 14px;
        margin-top: 14px;
        box-sizing: border-box;
        border: 1px solid transparent;
        position: relative;
        right: -1px;
        padding: 6px 12px;
        cursor: pointer;
        font-weight: 600;
    }
    .board__info-task-state_active {
        color: #fdfdfd;
        background-color:#627a9d;
        border: 2px solid #111;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: 2px solid #627a9d;
        margin-right: -1px;
    } */
    .board__info-block {
        margin-right: 8px;
    }
    .board__info-button {
        align-self: center;
    }
    .board__info-button_add {
        border: 2px solid #444;
        border-radius: 4px;
        padding: 4px 12px;
        background-color: white;
        color: black;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.3s;
        color: #666;
        margin: 18px 0px 18px 0px;
    }
    .board__info-button_add:hover {
        border: 2px solid #888;
        color: #000;
    }
    .board__info-tags {
        display: flex;
        flex-wrap: wrap;
    }
    .board__tasks {
        flex-grow: 1;
        margin-left: 240px;
    }
</style>