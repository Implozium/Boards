<template>
    <div class="bookmarks">
        <nav-block title="Закладки" active="bookmarks">
            <template v-slot:menu>
                <nav-block-group>
                    <div class="bookmarks__info-button" @click="onEditBookmark">+ Новая закладка</div>
                </nav-block-group>
                <nav-block-group title="Фильтрация по">
                    <input-text :value="filters.str" name="str" title="Поиск" @change="setTextFilter"></input-text>
                    <input-select name="theme" :value="filters.theme" title="Тема" :items="themes" @change="filters.theme = $event.value"></input-select>
                    <input-radio
                        :value="filters.type"
                        name="type"
                        :items="[{ value: 'active', title: 'Активные' }, { value: 'archival', title: 'Архивные' }, { value: 'all', title: 'Все' }]"
                        @change="filters.type = $event.value"
                    >
                    </input-radio>
                    <br/>
                    <input-radio
                        :value="filters.state"
                        name="state"
                        :items="states"
                        @change="filters.state = $event.value"
                    >
                    </input-radio>
                    <br/>
                    <div class="bookmarks__info-tags">
                        <tag v-for="(tag) in tags" :key="tag" :has-activing="true" @click="toggleTag(tag)" :status="filters.tags.includes(tag) ? 'actived' : 'default'">{{ tag }}</tag>
                    </div>
                    <br/>
                    <div v-if="isFilters" class="bookmarks__info-button" @click="resetFilter">Сбросить фильтры</div>
                </nav-block-group>
                <nav-block-group title="Сортировка по">
                    <input-radio
                        :value="groupBy"
                        name="groupBy"
                        :items="groups"
                        @change="groupBy = $event.value"
                        type="vertical"
                    >
                    </input-radio>
                </nav-block-group>
            </template>
            <column-grid :minSubcolumnWidth="240">
                <column-grid-item v-for="item in items" :key="item.id" :column="0" :type="item.type === 'full' ? 'full' : ''">
                    <div class="bookmarks__info-title" v-if="item.type === 'full'">{{ item.title }}</div>
                    <bookmark
                        v-else
                        :bookmark="item.bookmark"
                        @edit="onEditBookmark"
                        @remove="onRemoveBookmark"
                        @archive="archiveBookmark"
                        @choose="chooseBookmark"
                        @see="seeBookmark"
                        @set-state="setStateBookmark"
                    >
                    </bookmark>
                </column-grid-item>
            </column-grid>
        </nav-block>
        <modal v-if="modals.editing.show" @hide="closeModals" :close-on-wrap="false" type="wide">
            <template v-slot:header>
                Редактировать закладку
            </template>
            <template v-slot:default>
                <bookmark-form :bookmark="modals.editing.bookmark" ref="bookmarkForm"></bookmark-form>
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="updateBookmark($refs.bookmarkForm.getBookmark()), closeModals()">Сохранить</custom-button>
            </template>
        </modal>
        <modal v-if="modals.removing.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Вы действительно хотите удалить закладку<br/>"<b>{{ modals.removing.bookmark.title }}</b>"?
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="removeBookmark(modals.removing.bookmark.id), closeModals()">Удалить</custom-button>
                <!-- <custom-button type="link" @click="closeModals">Отмена</custom-button> -->
            </template>
        </modal>
    </div>
</template>

<script>
import BookmarkForm from '@/forms/BookmarkForm';
import Modal from '@/components/common/Modal';
import ColumnGrid from '@/components/common/ColumnGrid';
import ColumnGridItem from '@/components/common/ColumnGrid/ColumnGridItem';
import CustomButton from '@/components/common/CustomButton';
import InputSelect from '@/components/inputs/InputSelect';
import InputRadio from '@/components/inputs/InputRadio';
import Checkbox from '@/components/inputs/Checkbox';
import InputText from '@/components/inputs/InputText';
import Tag from '@/components/common/Tag';
import NavBlock from '@/components/common/NavBlock';
import NavBlockGroup from '@/components/common/NavBlock/NavBlockGroup';
import Column from '@/components/common/Column';
import Row from '@/components/common/Row';
import Common from 'common';
import Bookmark from './Bookmark';

export default {
    components: {
        BookmarkForm,
        ColumnGrid,
        ColumnGridItem,
        CustomButton,
        Modal,
        InputSelect,
        Tag,
        InputText,
        Checkbox,
        NavBlock,
        Column,
        Row,
        InputRadio,
        Bookmark,
        NavBlockGroup,
    },
    props: {
    },
    data() {
        return {
            modals: {
                editing: {
                    show: false,
                    bookmark: null,
                },
                removing: {
                    show: false,
                    bookmark: null,
                },
            },
            filters: this.getDefaultFilter(),
            groupBy: 'seen',
            daysOfWeek: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            groups: [
                {
                    value: 'seen',
                    title: 'Дате просмотра',
                    comparator: (aBookmark, bBookmark) => bBookmark.seen - aBookmark.seen,
                    getGroup: (aBookmark) => {
                        const date = new Date(aBookmark.seen);
                        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + this.daysOfWeek[date.getDay()];
                    },
                },
                {
                    value: 'created',
                    title: 'Дате создания',
                    comparator: (aBookmark, bBookmark) => bBookmark.created - aBookmark.created,
                    getGroup: (aBookmark) => {
                        const date = new Date(aBookmark.created);
                        return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + this.daysOfWeek[date.getDay()];
                    },
                },
                {
                    value: 'theme',
                    title: 'Теме',
                    comparator: (aBookmark, bBookmark) => aBookmark.theme === ''
                        ? 1
                        : bBookmark.theme === ''
                            ? -1
                            : aBookmark.theme.localeCompare(bBookmark.theme),
                    getGroup: (aBookmark) => aBookmark.theme || 'Остальные',
                },
                {
                    value: 'host',
                    title: 'Адресу сайта',
                    comparator: (aBookmark, bBookmark) => aBookmark.href === ''
                        ? 1
                        : bBookmark.href === ''
                            ? -1
                            : aBookmark.href.replace(/(?:.+\/\/)?([^\/]+)(?:\/.+)?/, '$1').localeCompare(bBookmark.href.replace(/(?:.+\/\/)?([^\/]+)(?:\/.+)?/, '$1')),
                    getGroup: (aBookmark) => aBookmark.href.replace(/(?:.+\/\/)?([^\/]+)(?:\/.+)?/, '$1') || 'Остальные',
                },
                {
                    value: 'url',
                    title: 'url',
                    comparator: (aBookmark, bBookmark) => aBookmark.href === ''
                        ? 1
                        : bBookmark.href === ''
                            ? -1
                            : aBookmark.href.replace(/(.+)(?:\??.+)?/, '$1').localeCompare(bBookmark.href.replace(/(.+)(?:\??.+)?/, '$1')),
                    getGroup: (aBookmark) => aBookmark.href.replace(/(.+)(?:\??.+)?/, '$1') || 'Остальные',
                },
            ],
            states: [
                {
                    value: '*',
                    title: 'Все',
                },
                {
                    value: 'simple',
                    title: 'Закладки',
                },
                {
                    value: 'have-read',
                    title: 'Прочитаные',
                },
                {
                    value: 'reading',
                    title: 'Читаемые',
                },
                {
                    value: 'new',
                    title: 'Новые',
                },
            ],
        };
    },
    computed: {
        bookmarks() {
            return this.$store.getters['bookmarks/bookmarks'];
        },
        isFilters() {
            return JSON.stringify(this.filters) !== JSON.stringify(this.getDefaultFilter());
        },
        items() {
            const bookmarks = this.bookmarks
                .filter((aBookmark) => {
                    let has = true;
                    if (this.filters.str) {
                        let hasSrt = false;
                        const regexp = new RegExp(this.filters.str.replace(/./g, '\$&'), 'i');
                        hasSrt = hasSrt
                            || aBookmark.title.search(regexp) !== -1
                            || aBookmark.description.search(regexp) !== -1
                            || aBookmark.theme.search(regexp) !== -1
                            || aBookmark.href.search(regexp) !== -1
                            || new Date(aBookmark.created).toISOString().search(regexp) !== -1;
                        has = has && hasSrt;
                    }
                    if (this.filters.tags.length) {
                        has = has && aBookmark.tags.some(tag => this.filters.tags.includes(tag));
                    }
                    switch (this.filters.type) {
                        case 'active':
                            has = has && aBookmark.archival === 0;
                            break;
                        case 'archival':
                            has = has && aBookmark.archival !== 0;
                            break;
                    }
                    if (this.filters.state !== '*') {
                        has = has && aBookmark.state === this.filters.state;
                    }
                    if (this.filters.theme !== '*') {
                        has = has && aBookmark.theme === this.filters.theme;
                    }
                    return has;
                })
                .sort((aBookmark, bBookmark) => aBookmark.chosen && bBookmark.chosen
                    ? bBookmark.seen - aBookmark.seen
                    : aBookmark.chosen
                        ? -1
                        : bBookmark.chosen
                            ? 1
                            : bBookmark.seen - aBookmark.seen
                );
            const items = [];
            let lastGroupBy = null;
            if (bookmarks.length && bookmarks[0].chosen) {
                items.push({
                    type: 'full',
                    title: 'Избранные',
                    id: 'Избранные',
                });
                items.push(...bookmarks.filter(aBookmark => aBookmark.chosen).map((aBookmark) => {
                    return {
                        type: 'bookmark',
                        bookmark: aBookmark,
                        id: aBookmark.id,
                    };
                }));
            }
            const group = this.groups.find(group => group.value === this.groupBy);
            const comparator = group ? group.comparator : (aBookmark, bBookmark) => aBookmark.seen - bBookmark.seen;
            const getGroup = group ? group.getGroup : (aBookmark) => 'Остальные';
            bookmarks.filter(aBookmark => !aBookmark.chosen)
                .sort(comparator)
                .forEach((aBookmark) => {
                    const currentGroupBy = getGroup(aBookmark);
                    if (lastGroupBy !== currentGroupBy) {
                        items.push({
                            type: 'full',
                            title: currentGroupBy,
                            id: currentGroupBy,
                        });
                    }
                    items.push({
                        type: 'bookmark',
                        bookmark: aBookmark,
                        id: aBookmark.id,
                    });
                    lastGroupBy = currentGroupBy;
                });
            
            return items;
        },
        tags() {
            return this.bookmarks
                .reduce((tags, aBookmark) => {
                    aBookmark.tags.forEach((tag) => {
                        if (!tags.includes(tag)) {
                            tags.push(tag);
                        }
                    });
                    return tags;
                }, [])
                .sort((a, b) => a.localeCompare(b));;
        },
        themes() {
            const themes = this.$store.getters['bookmarks/bookmarks']
                .map(aBookmark => aBookmark.theme)
                .filter((theme, i, arr) => arr.indexOf(theme) === i)
                .map(theme => ({ value: theme, title: theme }))
                .sort((aTheme, bTheme) => aTheme.value.localeCompare(bTheme.value));
            themes.unshift(
                { value: '*', title: 'Все' },
                { value: '---', title: '---', disabled: true }
            );
            return themes;
        }
    },
    watch: {
    },
    created() {
        this.init();
    },
    beforeDestroy() {
    },
    methods: {
        getDefaultFilter() {
            return {
                tags: [],
                str: '',
                type: 'active',
                state: '*',
                theme: '*',
            };
        },
        resetFilter() {
            this.filters = this.getDefaultFilter();
        },
        onEditBookmark(id) {
            this.closeModals();
            this.modals.editing.show = true;
            this.modals.editing.bookmark = this.bookmarks.find(bookmark => bookmark.id === id) || Common.makeBookmark({});
        },
        onRemoveBookmark(id) {
            this.closeModals();
            this.modals.removing.show = true;
            this.modals.removing.bookmark = this.bookmarks.find(bookmark => bookmark.id === id);
        },
        closeModals() {
            Object.keys(this.modals).forEach(key => this.modals[key].show = false);
        },
        updateBookmark(aBookmark) {
            this.$store.dispatch('bookmarks/update', { bookmark: aBookmark });
        },
        removeBookmark(id) {
            this.$store.dispatch('bookmarks/remove', { id: id });
        },
        archiveBookmark(id) {
            const index = this.bookmarks.findIndex(bookmark => bookmark.id === id);
            this.updateBookmark(Object.assign({}, this.bookmarks[index], { archival: this.bookmarks[index].archival ? 0 : Date.now() }));
        },
        seeBookmark(id) {
            const index = this.bookmarks.findIndex(bookmark => bookmark.id === id);
            this.updateBookmark(Object.assign({}, this.bookmarks[index], { seen: Date.now() }));
        },
        chooseBookmark(id) {
            const index = this.bookmarks.findIndex(bookmark => bookmark.id === id);
            this.updateBookmark(Object.assign({}, this.bookmarks[index], { chosen: !this.bookmarks[index].chosen }));
        },
        setStateBookmark({ id, state }) {
            const index = this.bookmarks.findIndex(bookmark => bookmark.id === id);
            this.updateBookmark(Object.assign({}, this.bookmarks[index], { state: state }));
        },
        init() {
            this.resetFilter();
            return this.$store.dispatch('bookmarks/load')
                .then((res) => {
                    console.log('loaded bookmarks');
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
    .bookmarks {
        width: 100%;
    }
    .bookmarks__showing-bookmark {
        min-width: 600px;
    }
    .bookmarks__info-title {
        display: flex;
        margin-bottom: 16px;
    }
    .bookmarks__info-button {
        align-self: center;
        border: 2px solid #444;
        border-radius: 4px;
        padding: 4px 12px;
        background-color: white;
        color: black;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.3s;
        color: #666;
    }
    .bookmarks__info-button:hover {
        border: 2px solid #888;
        color: #000;
    }
    .bookmarks__info-tags {
        display: flex;
        flex-wrap: wrap;
    }
    .bookmarks__bookmarks {
        flex-grow: 1;
        margin-left: 240px;
    }
    .bookmarks__info-title {
        margin: 8px;
        padding: 8px;
        font-size: 16px;
        line-height: 20px;
        border: 1px solid #888;
        background-color: #49cc90;
        color: white;
        animation: anim-show 0.3s;
        word-break: break-all;
    }
</style>