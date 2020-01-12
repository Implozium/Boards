<template>
    <form class="board-form">
        <row>
            <column>
                <input-text name="title" :value="newBoard.title" title="Заголовок" @change="onChange"></input-text>
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
                <input-text name="description" :value="newBoard.description" title="Описание" type="area" @change="onChange"></input-text>
            </column>
        </row>
    </form>
</template>

<script>
import InputText from '@/components/inputs/InputText.vue';
import Column from '@/components/common/Column.vue';
import Row from '@/components/common/Row.vue';
import Tag from '@/components/common/Tag.vue';
import Common from 'common';

export default {
    components: {
        Column,
        Row,
        InputText,
        Tag,
    },
    props: {
        "board": {
            type: Object,
        },
    },
    data: function () {
        return {
            "newBoard": Common.makeBoard(this.board),
        };
    },
    computed: {
        "tags": function () {
            return this.newBoard.tags.concat().sort((a, b) => a.localeCompare(b));
        },
    },
    methods: {
        getBoard() {
            return this.newBoard;
        },
        onChange(event) {
            const {
                name,
                value
            } = event;
            switch (name) {
                default:
                    this.newBoard[name] = value;
            }
        },
        onAddTag(event) {
            const {
                name,
                value
            } = event;
            if (value && !this.newBoard.tags.includes(value)) {
                this.newBoard.tags.push(value);
            }
        },
        onRemoveTag(value) {
            const index = this.newBoard.tags.indexOf(value);
            if (index !== -1) {
                this.newBoard.tags.splice(index, 1);
            }
        },
    },
}
</script>

<style scoped>
    .board-form {
        width: 100%;
    }
</style>