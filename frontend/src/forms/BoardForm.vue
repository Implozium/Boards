<template>
    <form class="board-form">
        <row>
            <column>
                <input-text name="title" :value="newBoard.title" title="Заголовок" @change="onChange"></input-text>
            </column>
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
import Common from 'common';

export default {
    components: {
        Column,
        Row,
        InputText,
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
    },
    methods: {
        getBoard() {
            return this.newBoard;
        },
        onChange(name, value) {
            switch (name) {
                default:
                    this.newBoard[name] = value;
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