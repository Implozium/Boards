<template>
    <form class="bookmark-form">
        <row>
            <column>
                <input-text name="title" :value="newBookmark.title" title="Заголовок" @change="onChange"></input-text>
            </column>
        </row>
        <row>
            <column>
                <input-select name="selectedTheme" :value="selectedTheme" title="Тема" :items="themes" @change="onChange"></input-select>
                <input-text v-if="selectedTheme === 'new'" name="theme" :value="newBookmark.theme" title="Новая тема" @change="onChange"></input-text>
            </column>
        </row>
        <row class="bookmark-form__header">Теги:</row>
        <row>
            <tag v-for="(tag) in tags" :key="tag" :has-deleting="true" @click="onRemoveTag(tag)">{{ tag }}</tag>
        </row>
        <row>
            <input-text :name="'tag' + tags.length" :value="''" :title="'Новый тег ' + (tags.length + 1)" @change="onAddTag" type="short"></input-text>
        </row>
        <row>
            <column>
                <input-text name="href" :value="newBookmark.href" title="Ссылка" @change="onChange"></input-text>
            </column>
        </row>
        <row>
            <column>
                <input-text name="description" :value="newBookmark.description" title="Описание" type="area" @change="onChange" :monospace="true"></input-text>
            </column>
        </row>
    </form>
</template>

<script>
import InputText from '@/components/inputs/InputText';
import InputTextDatetime from '@/components/inputs/InputTextDatetime';
import InputTextTime from '@/components/inputs/InputTextTime';
import InputSelect from '@/components/inputs/InputSelect';
import Column from '@/components/common/Column';
import Row from '@/components/common/Row';
import CustomButton from '@/components/common/CustomButton';
import Tag from '@/components/common/Tag';
import Common from 'common';

export default {
    components: {
        Column,
        Row,
        InputText,
        InputTextDatetime,
        InputTextTime,
        CustomButton,
        Tag,
        InputSelect,
    },
    props: {
        "bookmark": {
            type: Object,
        },
    },
    data: function () {
        return {
            "newBookmark": Common.makeBookmark(this.bookmark),
            "selectedTheme": this.bookmark.theme,
        };
    },
    computed: {
        "tags": function () {
            return this.newBookmark.tags.concat().sort((a, b) => a.localeCompare(b));
        },
        "themes": function () {
            return this.$store.getters['bookmarks/bookmarks']
                .map(aBookmark => aBookmark.theme)
                .filter((theme, i, arr) => arr.indexOf(theme) === i)
                .map(theme => ({ value: theme, title: theme }))
                .sort((aTheme, bTheme) => aTheme.value.localeCompare(bTheme.value))
                .concat([
                    { value: '---', title: '---', disabled: true },
                    { value: 'new', title: 'Новая тема' }
                ])
        }
    },
    methods: {
        getBookmark() {
            return this.newBookmark;
        },
        onChange(event) {
            const {
                name,
                value
            } = event;
            switch (name) {
                case 'selectedTheme':
                    if (value !== 'new') {
                        this.newBookmark["theme"] = value;
                    } else {
                        this.newBookmark["theme"] = '';
                    }
                    this.selectedTheme = value;
                break;
                default:
                    this.newBookmark[name] = value;
            }
        },
        onAddTag(event) {
            const {
                name,
                value
            } = event;
            if (value && !this.newBookmark.tags.includes(value)) {
                this.newBookmark.tags.push(value);
            }
        },
        onRemoveTag(value) {
            const index = this.newBookmark.tags.indexOf(value);
            if (index !== -1) {
                this.newBookmark.tags.splice(index, 1);
            }
        },
    },
}
</script>

<style scoped>
    .bookmark-form {
        width: 100%;
    }
    .bookmark-form__tag {
        display: flex;
        box-sizing: border-box;
        border: 1px solid black;
        height: 24px;
        line-height: 22px;
        position: relative;
        margin-right: 18px;
        padding-left: 8px;
        border-radius: 8px;
        background-color: black;
        top: 3px;
    }
    .bookmark-form__tag::before {
        /* content: ''; */
        position: absolute;
        height: 30px;
        width: 30px;
        border: 15px solid transparent;
        border-right: 8px solid black;
        top: -1px;
        box-sizing: border-box;
        right: 100%;
    }
    .bookmark-form__tag-name {
        color: lightgrey;
        padding-right: 8px;
    }
    .bookmark-form__tag-delete {
        border-left: 1px solid white;
        padding: 0 4px;
        font-size: 26px;
        line-height: 18px;
        font-weight: 600;
        color: lightgrey;
        cursor: pointer;
    }
</style>