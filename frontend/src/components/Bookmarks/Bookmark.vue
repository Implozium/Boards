<template>
    <div class="bookmark__wrapper">
        <div class="bookmark" :class="{ bookmark_archival: bookmark.archival }" ref="bookmark">
            <div class="bookmark__image"></div>
            <div class="bookmark__inner">
                <div class="bookmark__head">
                    <div class="bookmark__title">
                        <div class="bookmark__title-upper">
                            <span>{{ bookmark.title }}</span>
                            <div class="bookmark__buttons">
                                <div
                                    class="bookmark__button bookmark__button_single"
                                    :title="bookmark.chosen ? 'Удалить из избранных' : 'Добавить в избранные'"
                                    @click="onChoose"
                                    >{{ bookmark.chosen ? '★' : '☆' }}</div>
                                <menu-block class="bookmark__button">
                                    <template v-slot:main>…</template>
                                    <menu-block-item @click="onEdit">редактировать</menu-block-item>
                                    <menu-block-hr></menu-block-hr>
                                    <menu-block-item type="ex" :checked="bookmark.archival !== 0" @click="onArchive">архивная</menu-block-item>
                                    <menu-block-hr></menu-block-hr>
                                    <menu-block-item type="ex" :checked="bookmark.state === 'simple'" @click="onSetState('simple')">закладка</menu-block-item>
                                    <menu-block-item type="ex" :checked="bookmark.state === 'new'" @click="onSetState('new')">новая</menu-block-item>
                                    <menu-block-item type="ex" :checked="bookmark.state === 'reading'" @click="onSetState('reading')">читается</menu-block-item>
                                    <menu-block-item type="ex" :checked="bookmark.state === 'have-read'" @click="onSetState('have-read')">прочитана</menu-block-item>
                                    <menu-block-hr></menu-block-hr>
                                    <menu-block-item @click="onRemove">удалить</menu-block-item>
                                </menu-block>
                            </div>
                        </div>
                        <div class="bookmark__title-info">
                            <div v-if="bookmark.state === 'have-read'" class="bookmark__title-info-item bookmark__title-info-item_have-read">прочитана</div>
                            <div v-else-if="bookmark.state === 'reading'" class="bookmark__title-info-item bookmark__title-info-item_reading">читается</div>
                            <div v-else-if="bookmark.state === 'new'" class="bookmark__title-info-item bookmark__title-info-item_new">новая</div>
                            <div v-if="bookmark.theme" class="bookmark__title-info-item">{{ bookmark.theme }}</div>
                            <!-- <div v-if="bookmark.created" class="bookmark__title-info-item">{{ createdAsString }}</div>
                            <div v-if="bookmark.seen" class="bookmark__title-info-item">{{ seenAsString }}</div> -->
                            <div v-if="bookmark.archival !== 0" class="bookmark__title-info-item bookmark__title-info-item_archival">арх</div>
                        </div>
                        <div class="bookmark__title-tags" v-if="bookmark.tags.length">
                            <tag v-for="(tag) in bookmark.tags" :key="tag">{{ tag }}</tag>
                        </div>
                    </div>
                </div>

                <!-- <div class="bookmark__body bookmark__body_fixed">
                    <div class="bookmark__description"><md-viewer :text="bookmark.description"></md-viewer></div>
                </div> -->
            </div>
            <a class="bookmark__to" target="_blank" :href="bookmark.href" @click="onSee">➜</a>
        </div>
    </div>
</template>

<script>
import MenuBlock from '@/components/common/MenuBlock';
import MenuBlockItem from '@/components/common/MenuBlock/MenuBlockItem.vue';
import MenuBlockHr from '@/components/common/MenuBlock/MenuBlockHr.vue';
import MdViewer from '@/components/common/MdViewer.vue';
import Common from 'common';
import Tag from '@/components/common/Tag.vue';

export default {
    components: {
        MenuBlock,
        MenuBlockItem,
        MenuBlockHr,
        MdViewer,
        Tag,
    },
    props: {
        'bookmark': {
            type: Object,
        },
    },
    data: function () {
        return {
        };
    },
    computed: {
        createdAsString() {
            return this.bookmark.created ? new Date(this.bookmark.created).toISOString().split('T')[0] : '';
        },
        seenAsString() {
            return this.bookmark.seen ? new Date(this.bookmark.seen).toISOString().split('T')[0] : '';
        }
    },
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
        onEdit() {
            this.$emit('edit', this.bookmark.id);
        },
        onRemove() {
            this.$emit('remove', this.bookmark.id);
        },
        onArchive() {
            this.$emit('archive', this.bookmark.id);
        },
        onChoose() {
            this.$emit('choose', this.bookmark.id);
        },
        onSee() {
            this.$emit('see', this.bookmark.id);
        },
        onSetState(state) {
            this.$emit('set-state', { id: this.bookmark.id, state: state });
        }
    },
}
</script>

<style scoped>
    .bookmark__wrapper {
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
    }
    .bookmark {
        /*border: 2px solid #cfd9e7;*/
        transition: all 0.3s;
        box-sizing: border-box;
        position: relative;
        animation: anim-show 0.3s;
        /*border-radius: 8px; */
        display: flex;
    }
    .bookmark__image {
        width: 24px;
        height: 24px;
        border: 2px solid #cfd9e7;
        background-color: #355079;
        box-sizing: border-box;
        border-radius: 50%;
        margin-right: 8px;
        flex-shrink: 0;
        display: none;
    }
    .bookmark__to {
        width: 28px;
        /* height: 100%; */
        /* margin-left: 8px; */
        /* border: 1px solid #9e6c00; */
        box-sizing: border-box;
        background-color: #ffae00;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        /* line-height: 100%; */
        font-size: 18px;
        color: #fff;
        text-align: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-shadow: 0 0 2px black;
        flex-shrink: 0;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.3s;
    }
    .bookmark__to:hover {
        background-color: #ffc851;
    }
    .bookmark__inner {
        position: relative;
        background-color: #355079;;
        color: #cfd9e7;
        /* box-shadow: 0 0 8px 2px #355079; */
        box-sizing: border-box;
        flex-grow: 1;
    }
    /* .bookmark:hover,
    .bookmark_active {
        opacity: 1;
        box-shadow: 0 0 6px 2px grey;
        filter: drop-shadow(2px 4px 6px black);
    } */
    .bookmark__inner > div + div {
        border-top: 1px solid #cfd9e7;
    }
    .bookmark__head {
        padding: 4px 10px 4px 10px;
        position: relative;
        display: flex;
        color: #fff;
    }
    .bookmark_archival {
        filter: saturate(0.6);
    }
    .bookmark__title {
        /* text-decoration: underline; */
        font-size: 12px;
        font-weight: 600;
        text-shadow: 0 1px 0 rgba(0,0,0,.1);
        flex-grow: 1;
    }
    .bookmark__title-upper {
        display: flex;
    }
    .bookmark__title-length {
        font-size: 14px;
        font-weight: normal;
        color: #eee;
        text-shadow: 0 0 0.1px grey;
    }
    .bookmark__title-tags {
        display: flex;
        flex-wrap: wrap;
    }
    .bookmark__title-info {
        display: flex;
        flex-wrap: wrap;
    }
    .bookmark__title-info-item {
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
    .bookmark__title-info-item::before {
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
    .bookmark__title-info-item_archival {
        color: #a0a0a0;
        background-color: #fff;
        border-color: #a0a0a0;
        /* text-shadow: 0 0 0px black; */
        font-weight: 600;
    }
    .bookmark__title-info-item_archival::before {
        border-color: #a0a0a0;
        content: '🕮';
        font-size: 10px;
        padding-left: 2px;
        padding-top: 1px;
    }
    .bookmark__title-info-item_have-read,
    .bookmark__title-info-item_reading,
    .bookmark__title-info-item_new {
        color: #fff;
        line-height: 12px;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
    }
    .bookmark__title-info-item_have-read {
        border-color: #9de0c2;
        background-color: #49cc90;
    }
    .bookmark__title-info-item_have-read::before {
        border-color: transparent;
        background-color: #9de0c2;
    }
    .bookmark__title-info-item_reading {
        border-color: #ffd39d;
        background-color: #fca130;
    }
    .bookmark__title-info-item_reading::before {
        border-color: transparent;
        background-color: #ffd39d;
    }
    .bookmark__title-info-item_new {
        border-color: #ff9292;
        background-color: #f93e3e;
    }
    .bookmark__title-info-item_new::before {
        border-color: transparent;
        background-color: #ff9292;
    }
    .bookmark__buttons {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
    }
    .bookmark__button {
        transition: all 0.3s;
        font-size: 18px;
        color: black;
        font-weight: bold;
        line-height: 18px;
        cursor: pointer;
    }
    .bookmark__button_single {
        padding-right: 4px;
        color: #888;
        font-weight: 200;
    }
    .bookmark__button_single:hover {
        color: black;
    }
    .bookmark__body {
        padding: 10px;
    }
    .bookmark__body_fixed {
        max-height: 400px;
        overflow: auto;
    }
    .bookmark__description {
        font-size: 14px;
        color: #eaeff5;
        white-space: pre-wrap;
        word-break: break-word;
    }
</style>