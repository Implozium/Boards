<template>
    <div class="bookmark__wrapper">
        <div class="bookmark" :class="{ bookmark_archival: bookmark.archival }" ref="bookmark">
            <div class="bookmark__image"></div>
            <div class="bookmark__inner" :class="{ bookmark___inner_chosen: bookmark.chosen }">
                <div class="bookmark__head">
                    <div class="bookmark__title">
                        <div class="bookmark__title-upper">
                            <span>{{ bookmark.title }}</span>
                            <div class="bookmark__buttons">
                                <div
                                    class="bookmark__button bookmark__button_single"
                                    :class="{ bookmark__button_active: bookmark.chosen }"
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
                        <title-info>
                            <title-info-item v-if="bookmark.state === 'have-read'" type="success">прочитана</title-info-item>
                            <title-info-item v-else-if="bookmark.state === 'reading'" type="warning">читается</title-info-item>
                            <title-info-item v-else-if="bookmark.state === 'new'" type="danger">новая</title-info-item>
                            <title-info-item v-if="bookmark.theme">{{ bookmark.theme }}</title-info-item>
                            <!-- <title-info-item v-if="bookmark.created">{{ createdAsString }}</title-info-item>
                            <title-info-item v-if="bookmark.seen">{{ seenAsString }}</title-info-item> -->
                            <title-info-item v-if="bookmark.archival !== 0" icon="archival">арх</title-info-item>
                        </title-info>
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
import MenuBlockItem from '@/components/common/MenuBlock/MenuBlockItem';
import MenuBlockHr from '@/components/common/MenuBlock/MenuBlockHr';
import MdViewer from '@/components/common/MdViewer';
import Common from 'common';
import Tag from '@/components/common/Tag';
import TitleInfo from '@/components/common/TitleInfo';
import TitleInfoItem from '@/components/common/TitleInfo/TitleInfoItem';

export default {
    components: {
        MenuBlock,
        MenuBlockItem,
        MenuBlockHr,
        MdViewer,
        Tag,
        TitleInfo,
        TitleInfoItem,
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
        },
        color() {
            function hashCode(str) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }
                return hash;
            }

            function intToRGB(i) {
                const c = (i & 0x00FFFFFF)
                    .toString(16)
                    .toUpperCase();

                return "00000".substring(0, 6 - c.length) + c;
            }

            return intToRGB(hashCode(this.bookmark.href.replace(/(?:.+\/\/)?([^\/]+)(?:\/.+)?/, '$1')));
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
        /* animation: anim-show 0.3s; */
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
        background-color: #355079;
        color: #cfd9e7;
        /* box-shadow: 0 0 8px 2px #355079; */
        box-sizing: border-box;
        flex-grow: 1;
        border: 1px solid #355079;
        box-sizing: border-box;
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
    .bookmark___inner_chosen {
        border: 1px solid #ffae00;
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
        color: #ffae00;
    }
    .bookmark__button_active {
        color: #ffae00;
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