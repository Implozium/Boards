<template>
    <div class="board__wrapper">
        <div class="board" ref="board">
            <div class="board__image"></div>
            <div class="board__inner">
                <div class="board__head">
                    <div class="board__title">
                        <div class="board__title-upper">
                            <span>{{ board.title }}</span>
                            <div class="board__buttons">
                                <menu-block class="board__button">
                                    <template v-slot:main>…</template>
                                    <menu-block-item @click="onEdit">редактировать</menu-block-item>
                                    <menu-block-item @click="onConstrict">сузить</menu-block-item>
                                    <menu-block-item @click="onArchiveDoneTasks">архивировать все сделанные</menu-block-item>
                                    <menu-block-hr></menu-block-hr>
                                    <menu-block-item @click="onRemove">удалить</menu-block-item>
                                </menu-block>
                            </div>
                        </div>
                        <!-- <div class="board__title-info">
                            <div v-if="board.state === 'have-read'" class="board__title-info-item board__title-info-item_have-read">прочитана</div>
                            <div v-else-if="board.state === 'reading'" class="board__title-info-item board__title-info-item_reading">читается</div>
                            <div v-else-if="board.state === 'new'" class="board__title-info-item board__title-info-item_new">новая</div>
                            <div v-if="board.theme" class="board__title-info-item">{{ board.theme }}</div>
                            <div v-if="board.archival !== 0" class="board__title-info-item board__title-info-item_archival">арх</div>
                        </div> -->
                        <div class="board__title-tags" v-if="board.tags.length">
                            <tag v-for="(tag) in board.tags" :key="tag">{{ tag }}</tag>
                        </div>
                    </div>
                </div>

                <div v-if="board.description" class="board__body board__body_fixed">
                    <div class="board__description">{{ board.description }}</div>
                </div>
            </div>
            <a class="board__to" target="_blank" @click="onSee">Перейти</a>
        </div>
    </div>
</template>

<script>
import MenuBlock from '@/components/common/MenuBlock';
import MenuBlockItem from '@/components/common/MenuBlock/MenuBlockItem.vue';
import MenuBlockHr from '@/components/common/MenuBlock/MenuBlockHr.vue';
import Common from 'common';
import Tag from '@/components/common/Tag.vue';

export default {
    components: {
        MenuBlock,
        MenuBlockItem,
        MenuBlockHr,
        Tag,
    },
    props: {
        'board': {
            type: Object,
        },
    },
    data: function () {
        return {
        };
    },
    computed: {
    },
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
        onEdit() {
            this.$emit('edit', this.board.id);
        },
        onRemove() {
            this.$emit('remove', this.board.id);
        },
        onArchiveDoneTasks() {
            this.$emit('archive-done-tasks', this.board.id);
        },
        onConstrict() {
            this.$emit('constrict', this.board.id);
        },
        onSee(e) {
            e.preventDefault();
            this.$router.push({ name: 'board', params: { id: this.board.id } });
        }
    },
}
</script>

<style scoped>
    .board__wrapper {
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
    }
    .board {
        /*border: 2px solid #cfd9e7;*/
        transition: all 0.3s;
        box-sizing: border-box;
        position: relative;
        animation: anim-show 0.3s;
        /*border-radius: 8px; */
        display: flex;
        flex-direction: column;
    }
    .board__image {
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
    .board__to {
        /* width: 28px; */
        /* margin-left: 8px; */
        /* border: 1px solid #9e6c00; */
        height: 32px;
        box-sizing: border-box;
        background-color: #ffae00;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        line-height: 18px;
        font-size: 14px;
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
    .board__to:hover {
        background-color: #ffc851;
    }
    .board__inner {
        position: relative;
        background-color: #355079;;
        color: #cfd9e7;
        /* box-shadow: 0 0 8px 2px #355079; */
        box-sizing: border-box;
        flex-grow: 1;
    }
    /* .board:hover,
    .board_active {
        opacity: 1;
        box-shadow: 0 0 6px 2px grey;
        filter: drop-shadow(2px 4px 6px black);
    } */
    .board__inner > div + div {
        border-top: 1px solid #cfd9e7;
    }
    .board__head {
        padding: 4px 10px 4px 10px;
        position: relative;
        display: flex;
        color: #fff;
    }
    .board_archival {
        filter: saturate(0.6);
    }
    .board__title {
        /* text-decoration: underline; */
        font-size: 16px;
        font-weight: 600;
        text-shadow: 0 1px 0 rgba(0,0,0,.1);
        flex-grow: 1;
    }
    .board__title-upper {
        display: flex;
    }
    .board__title-length {
        font-size: 14px;
        font-weight: normal;
        color: #eee;
        text-shadow: 0 0 0.1px grey;
    }
    .board__title-tags {
        display: flex;
        flex-wrap: wrap;
    }
    .board__buttons {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
    }
    .board__button {
        transition: all 0.3s;
        font-size: 18px;
        color: black;
        font-weight: bold;
        line-height: 18px;
        cursor: pointer;
    }
    .board__button_single {
        padding-right: 4px;
        color: #888;
        font-weight: 200;
    }
    .board__button_single:hover {
        color: black;
    }
    .board__body {
        padding: 10px;
    }
    .board__body_fixed {
        max-height: 400px;
        overflow: auto;
    }
    .board__description {
        font-size: 14px;
        color: #eaeff5;
        white-space: pre-wrap;
        word-break: break-word;
    }
</style>