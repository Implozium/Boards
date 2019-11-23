<template>
    <div class="task__wrapper">
        <div class="task" :class="{ task_done: taskInfo.isDone, task_archival: task.archival, task_active: actived || active, ['task_' + type]: true, ['task_period']: task.type === 'week' || task.type === 'month' }" ref="task" @click="clickTask">
            <div class="task__inner">
                <div class="task__head">
                    <checkbox v-if="task.type !== 'common'" :checked="taskInfo.isDone" :name="task.id" @click="handleTask" :style="{ visibility: taskInfo.canSetDone ? 'visible' : 'hidden' }"/>
                    <div class="task__title">
                        <div class="task__title-upper">
                            <span
                                >{{ task.title }}&nbsp;<span class="task__title-badge"
                                >
                                    <span class="task__title-badge-item task__title-badge-item_links" v-if="task.links.length">{{ task.links.length }}</span><span class="task__title-badge-item task__title-badge-item_items" v-if="task.items.length">{{ task.items.length - undoneItems.length }} / {{ task.items.length }}</span>
                                </span>
                            </span>
                            <div class="task__buttons">
                                <div
                                    v-if="task.description || task.items.length"
                                    class="task__button task__button_single"
                                    :title="task.open ? 'свернуть' : 'развернуть'"
                                    @click="onOpen"
                                    >{{ task.open ? '⏶' : '⏷' }}</div>
                                <div class="task__button task__button_single" @click="onShow">👁</div>
                                <menu-block class="task__button">
                                    <template v-slot:main>…</template>
                                    <menu-block-item @click="onEdit">редактировать</menu-block-item>
                                    <menu-block-item @click="onMove">переместить</menu-block-item>
                                    <menu-block-hr></menu-block-hr>
                                    <menu-block-item type="ex" :checked="task.archival !== 0" @click="onArchive">архивная</menu-block-item>
                                    <menu-block-item @click="onOpen" v-if="task.description || task.items.length">{{ task.open ? 'свернуть' : 'развернуть' }}</menu-block-item>
                                    <menu-block-hr></menu-block-hr>
                                    <menu-block-item title="Преобразовать в доску" @click="onExpand">расширить</menu-block-item>
                                    <menu-block-hr></menu-block-hr>
                                    <menu-block-item @click="onRemove">удалить</menu-block-item>
                                </menu-block>
                            </div>
                        </div>
                        <!--<div class="task__title-length" v-if="taskInfo.allTime">({{ taskInfo.allTime }})</div>-->
                        <div class="task__title-tags" v-if="task.tags.length">
                            <tag v-for="(tag) in task.tags" :key="tag">{{ tag }}</tag>
                        </div>
                        <div class="task__title-info">
                            <div v-if="taskInfo.allTime" class="task__title-info-item">{{ taskInfo.allTime }}</div>
                            <div v-if="!taskInfo.isDone && type === 'past' && taskInfo.afterTo" class="task__title-info-item task__title-info-item_past">{{ taskInfo.afterTo }}</div>
                            <div v-else-if="!taskInfo.isDone && type === 'present' && taskInfo.beforeTo" class="task__title-info-item task__title-info-item_present">{{ taskInfo.beforeTo }}</div>
                            <div v-else-if="!taskInfo.isDone && type === 'future' && taskInfo.beforeFrom" class="task__title-info-item task__title-info-item_future">{{ taskInfo.beforeFrom }}</div>
                        </div>
                    </div>
                </div>

                <div class="task__body" :class="{ 'task__body_fixed': fixed }" v-if="task.open && (task.description || task.items.length)">
                    <div class="task__description"><md-viewer :text="task.description"></md-viewer></div>
                    <ol class="task__items" v-if="task.items.length">
                        <li class="task__item" v-for="(item, i) in task.items" :key="i" :class="{ task__item_done: item.done }">
                            <div class="task__item-title">
                                <checkbox v-if="task.type !== 'common'" :checked="Boolean(item.done)" :name="i" @click="handleItem"/><span>{{ item.title }}</span>
                            </div>
                            <div class="task__item-description" v-if="item.description"><md-viewer :text="item.description"></md-viewer></div>
                        </li>
                    </ol>
                </div>
                <!-- <div class="task__body task__body_closed" v-if="task.description || task.items.length" @click="onOpen">…</div> -->
                <!-- <div class="task__body task__body_closed" v-else-if="!task.open" @click="onOpen">˅</div> -->
                
                <!--<div class="task__footer" v-if="!taskInfo.isDone && type === 'past' && taskInfo.afterTo">{{ taskInfo.afterTo }}</div>
                <div class="task__footer" v-else-if="!taskInfo.isDone && type === 'present' && taskInfo.beforeTo">{{ taskInfo.beforeTo }}</div>
                <div class="task__footer" v-else-if="!taskInfo.isDone && type === 'future' && taskInfo.beforeFrom">{{ taskInfo.beforeFrom }}</div>-->
            </div>

            <div :hidden="!active && !actived" class="task__info" :class="{ ['task__info_' + position]: true }">
                <div class="task__info-item" v-if="task.from || task.to || taskInfo.allTime || taskInfo.doneTime">
                    <template v-if="taskInfo.fromAsString">
                        <div class="task__info-item-title">Начало:</div>
                        <div>
                            {{ taskInfo.fromAsString }}
                            <span v-if="taskInfo.beforeFrom"><br/>осталось {{ taskInfo.beforeFrom }}</span>
                            <span v-if="taskInfo.afterFrom"><br/>прошло {{ taskInfo.afterFrom }}</span>
                        </div>
                    </template>
                    <template v-if="taskInfo.toAsString">
                        <div class="task__info-item-title">Конец:</div>
                        <div>
                            {{ taskInfo.toAsString }}
                            <span v-if="taskInfo.beforeTo"><br/>осталось {{ taskInfo.beforeTo }}</span>
                            <span v-if="taskInfo.afterTo"><br/>прошло {{ taskInfo.afterTo }}</span>
                        </div>
                    </template>
                    <template v-if="taskInfo.allTime">
                        <div class="task__info-item-title">Длительность:</div>
                        <div>{{ taskInfo.allTime }}</div>
                    </template>
                    <template v-if="taskInfo.isDone">
                        <div class="task__info-item-title">Сделано:</div>
                        {{ taskInfo.doneAsString }}
                        <div>прошло: {{ taskInfo.doneTime }}</div>
                    </template>
                </div>
                <template v-if="task.links.length">
                    <a class="task__info-item task__info-item_link" v-for="(link, i) in task.links" :key="i" :href="link.href" target="blank" :title="link.href">
                        <div class="task__info-item-link-title">{{ link.title || link.href.replace(/https?:\/\//, '').replace(/\/.+/, '') }}</div>
                        <div class="task__info-item-link-href">{{ link.href.replace(/https?:\/\//, '').replace(/\/.+/, '') }}</div>
                    </a>
                </template>
                <div class="task__info-item">
                    <div class="task__info-item-title">Создана:</div>
                    <div>
                        {{ taskInfo.createdAsString }}
                        <div>прошло: {{ taskInfo.createdTime }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Checkbox from '@/components/inputs/Checkbox.vue';
import MenuBlock from '@/components/common/MenuBlock';
import MenuBlockItem from '@/components/common/MenuBlock/MenuBlockItem.vue';
import MenuBlockHr from '@/components/common/MenuBlock/MenuBlockHr.vue';
import MdViewer from '@/components/common/MdViewer.vue';
import Common from 'common';
import Tag from '@/components/common/Tag.vue';

export default {
    components: {
        Checkbox,
        MenuBlock,
        MenuBlockItem,
        MenuBlockHr,
        MdViewer,
        Tag,
    },
    props: {
        'task': {
            type: Object,
        },
        'type': {
            type: String,
            default: '',
        },
        "fixed": {
            type: Boolean,
            default: true,
        },
        "actived": {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            time: Date.now(),
            timer: null,
            unclickTask: null,
            active: false,
            ignoreClick: false,
            position: "right",
        };
    },
    computed: {
        taskInfo() {
            return Common.getTaskInfo(this.task, this.time);
        },
        undoneItems() {
            return this.task.items.filter(anItem => anItem.done === 0);
        }
    },
    created() {
        this.timer = setInterval(() => {
            this.time = Date.now();
        }, 1000);
    },
    mounted() {
        this.unclickTask = (event) => {
            if (!this.$refs.task.contains(event.target) && this.active) {
                this.active = false;
                if (this.$refs.task.closest('.column-grid-item')) {
                    this.$refs.task.closest('.column-grid-item').style.zIndex = 1;
                }
            }
        };
        document.addEventListener('click', this.unclickTask);
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
        document.removeEventListener('click', this.unclickTask);
    },
    methods: {
        deactivate() {
            this.active = false;
            this.ignoreClick = true;
            // hack
            if (this.$refs.task.closest('.column-grid-item')) {
                this.$refs.task.closest('.column-grid-item').style.zIndex = 1;
            }
        },
        handleItem(id, checked) {
            const items = this.task.items.map(item => Object.assign({}, item));
            items[id].done = checked ? Date.now() : 0;
            this.$emit('update', this.task.id, { items: items });
        },
        handleTask(id, checked) {
            this.$emit('update', this.task.id, { done: checked ? Date.now() : 0 });
            this.deactivate();
        },
        onEdit() {
            this.$emit('edit', this.task.id);
            this.deactivate();
        },
        onRemove() {
            this.$emit('remove', this.task.id);
            this.deactivate();
        },
        onArchive() {
            this.$emit('archive', this.task.id);
            this.deactivate();
        },
        onMove() {
            this.$emit('move', this.task.id);
            this.deactivate();
        },
        onOpen() {
            this.$emit('update', this.task.id, { open: !this.task.open });
            //this.deactivate();
        },
        onShow() {
            this.$emit('show', this.task.id);
            this.deactivate();
        },
        onExpand() {
            this.$emit('expand', this.task.id);
            this.deactivate();
        },
        clickTask() {
            if (!this.active && !this.ignoreClick && this.actived === false) {
                const bordersOfTask = this.$refs.task.getBoundingClientRect();
                const bordersOfBody = document.body.getBoundingClientRect();
                this.position = bordersOfBody.width - bordersOfTask.right > bordersOfTask.left ? "right" : "left";
                this.active = true;
                // hack
                if (this.$refs.task.closest('.column-grid-item')) {
                    this.$refs.task.closest('.column-grid-item').style.zIndex = 100;
                }
            }
            this.ignoreClick = false;
        }
    },
}
</script>

<style scoped>
    .task__wrapper {
        padding: 10px;
    }
    .task {
        /*border: 2px solid #cfd9e7;*/
        transition: all 0.3s;
        box-sizing: border-box;
        position: relative;
        background-color: #355079;;
        color: #cfd9e7;
        animation: anim-show 0.3s;
        /*border-radius: 8px; */
        box-shadow: 0 0 8px 2px #355079;
    }
    .task:hover,
    .task_active {
        opacity: 1;
        box-shadow: 0 0 6px 2px grey;
        filter: drop-shadow(2px 4px 6px black);
    }
    /* .task__inner {
        margin: 6px 0px;
        border-top: 2px solid #cfd9e7;
        border-bottom: 2px solid #cfd9e7;
        background-color: #4d607c;
    } */
    .task__inner > div + div {
        border-top: 1px solid #cfd9e7;
    }
    /* .task__inner > div:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    .task__inner > div:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    } */
    .task__head {
        padding: 4px 10px 4px 10px;
        position: relative;
        display: flex;
        color: #fff;
    }
    /* .task_past {
        border: 2px solid #f93e3e;
        background-color: #feebeb;
    } */
    .task_past .task__head {
        background-color: #f93e3e;
    }
    /* .task_present {
        border: 2px solid #fca130;
        background-color: #fff5ea;
    } */
    .task_present .task__head {
        background-color: #fca130;
    }
    /* .task_future {
        border: 2px solid #49cc90;
        background-color: #ecfaf4;
    } */
    .task_future .task__head {
        background-color: #49cc90;
    }
    /* .task_free {
        border: 2px solid #61affe;
        background-color: #eff7ff;
    } */
    .task_free .task__head {
        background-color: #61affe;
    }
    /* .task_done {
        border: 2px solid #ddd;
        background-color: #f8f8f8;
    } */
    .task_done .task__head {
        background-color: #ebebeb;
        color: #606060;
    }
    .task_archival {
        filter: saturate(0.6);
    }
    /* .task_period {
        background-color: orange;
    } */
    .task_period .task__head::after {
        content: '';
        height: 4px;
        position: absolute;
        bottom: -2px;
        background-color: orange;
        left: 0px;
        right: 0px;
        /* border: 1px solid #ddd; 
        border-bottom: 1px solid white;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px; */
    }
    .task__title {
        /* text-decoration: underline; */
        font-size: 14px;
        font-weight: 600;
        text-shadow: 0 1px 0 rgba(0,0,0,.1);
        flex-grow: 1;
    }
    .task__title-upper {
        display: flex;
    }
    .task__title-length {
        font-size: 14px;
        font-weight: normal;
        color: #eee;
        text-shadow: 0 0 0.1px grey;
    }
    .task__title-badge {
        font-size: 10px;
        font-weight: bold;
        /* color: #fff;
        background-color: #44f; */
        /* box-shadow: 0 0 1px 0px black; */
        /* text-shadow: 1px 1px 0.1px black; */
        /* border-radius: 6px; */
        /* margin-left: 4px; */
        /* padding: 1px 6px 1px 6px; */
        line-height: 10px;
        display: inline-block;
        top: -4px;
        position: relative;
        /* min-width: 8px; */
        /* text-align: center; */
    }
    .task__title-badge-item {
        border-radius: 0;
        padding: 0px 4px;
    }
    .task__title-badge-item:first-of-type {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        padding-left: 6px;
    }
    .task__title-badge-item:last-of-type {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        padding-right: 6px;
    }
    .task__title-badge-item_links {
        color: #fff;
        background-color: #7575ff
    }
    .task__title-badge-item_items {
        color: #fff;
        background-color: #ff9c75;
    }
    .task__title-tags {
        display: flex;
        flex-wrap: wrap;
    }
    .task__title-info {
        display: flex;
        flex-wrap: wrap;
    }
    .task__title-info-item {
        border: 1px solid #6e6e6e;
        border-radius: 10px;
        padding: 0 8px 0 22px;
        margin-right: 12px;
        margin-top: 4px;
        position: relative;
        background-color: #f2f2f2;
        color: #6e6e6e;
        text-shadow: none;
        font-weight: 600;
        font-size: 12px;
    }
    .task__title-info-item::before {
        content: '';
        border: 1px solid #6e6e6e;
        border-radius: 10px;
        width: 18px;
        height: 18px;
        position: absolute;
        left: -1px;
        top: -1px;
        /* background-color: #6e6e6e; */
        padding-left: 4px;
        box-sizing: border-box;
    }
    .task__title-info-item_past {
        border-color: #f93e3e;
        background-color: #fcbaba;
        color: #f93e3e;
    }
    .task__title-info-item_past::before {
        border: 2px solid #f93e3e;
    }
    .task__title-info-item_present {
        border-color: #fca130;
        background-color: #fedfb9;
        color: #fca130;
    }
    .task__title-info-item_present::before {
        border: 2px solid #fca130;
    }
    .task__title-info-item_future {
        border-color: #49cc90;
        background-color: #b7ebd4;
        color: #49cc90;
    }
    .task__title-info-item_future::before {
        border: 2px solid #49cc90;
    }
    .task__buttons {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
    }
    .task__button {
        transition: all 0.3s;
        font-size: 18px;
        color: black;
        font-weight: bold;
        line-height: 18px;
        cursor: pointer;
    }
    .task__button_single {
        padding-right: 4px;
        color: #888;
        font-weight: 200;
    }
    .task__button_single:hover {
        color: black;
    }
    .task__body {
        padding: 10px;
        /* color: #909090; */
        /* border-top: 2px solid #909090; */
        /* background-color: white; */
    }
    .task__body_fixed {
        max-height: 400px;
        overflow: auto;
    }
    .task__body_closed {
        padding: 0px;
        text-align: center;
        font-weight: 800;
        color: #c5c5c5;
        /* background-color: #eee; */
        font-size: 10px;
        cursor: pointer;
        border-top: 1px solid lightgrey;
    }
    .task__body_closed:hover {
        color: black;
    }
    .task__description {
        font-size: 14px;
        color: #eaeff5;
        white-space: pre-wrap;
        word-break: break-word;
    }
    .task__items {
        margin: 0px;
        padding: 6px 0 6px 14px;
    }
    .task__item {
        font-size: 14px;
        line-height: 22px;
    }
    .task__item-title {
        font-weight: 600;
    }
    .task__item-description {
        color: #eaeff5;
        white-space: pre-wrap;
        word-break: break-word;
        font-size: 12px;
    }
    .task__item_done .task__item-title span {
        text-decoration: line-through;
        color: #9cb1ce;
    }
    .task__footer {
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        /* text-shadow: 0.5px 0.5px 4px black; */
        /* background-color: lightgrey; */
        /* border-top: 2px solid #cfd9e7; */
        padding-bottom: 6px;
        padding-top: 6px;
        /* border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px; */
        /* color: #666; */
        /* background-color: rgba(255, 255, 255, 0.6); */
    }
    .task__info {
        position: absolute;
        top: 0;
        z-index: 10;
        width: 240px;
        margin-top: -1px;
        animation: anim-show 0.3s;
    }
    .task__info_right {
        left: 100%;
        margin-left: 12px;
    }
    .task__info_left {
        right: 100%;
        margin-right: 12px;
    }
    .task__info-item {
        /* border-radius: 4px; */
        background-color: white;
        color: #999;
        box-shadow: 0 0 4px 0 black;
        margin-bottom: 6px;
        padding: 4px 8px;
        border-left: 10px solid lightgrey;
    }
    .task__info-item_time {
        border-left: 10px solid lightgrey;
    }
    .task__info-item_link {
        background-color: #9fccff;
        text-decoration: none;
        display: block;
        padding: 8px 8px;
        transition: all 0.3s;
        border-left: 10px solid #0366d6;
    }
    .task__info-item_link:hover {
        background-color: #afdcff;
    }
    .task__info-item-link-title {
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: pre;
        font-size: 16px;
        font-weight: 500;
        color: black;
        overflow: hidden;
    }
    .task__info-item-link-href {
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: pre;
        color: #80868b;
        font-size: 12px;
        font-weight: 400;
        overflow: hidden;
    }
    .task__info-item-title {
        font-size: 12px;
        color: #999;
        font-weight: bold;
        text-decoration: underline;
        margin-top: 10px;
    }
    .task__info-item-title:first-of-type {
        margin-top: 0px;
    }
</style>