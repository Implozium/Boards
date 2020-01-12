<template>
    <div class="boards">
        <nav-block title="Доски" active="boards">
            <template v-slot:menu>
                <nav-block-group>
                    <div class="boards__info-button boards__info-button_add" @click="onEditBoard">+ Новая доска</div>
                </nav-block-group>
            </template>
            <column-grid :minSubcolumnWidth="240">
                <column-grid-item v-for="board in boards" :key="board.id" :column="0">
                    <board
                        :board="board"
                        @edit="onEditBoard"
                        @remove="onRemoveBoard"
                        @archive-done-tasks="onArchiveDoneTasks"
                        @constrict="onConstrictBoard"
                    >
                    </board>
                </column-grid-item>
            </column-grid>
        </nav-block>
        <modal v-if="modals.editing.show" @hide="closeModals" :close-on-wrap="false" type="short">
            <template v-slot:header>
                Редактирование доски
            </template>
            <template v-slot:default>
                <board-form :board="modals.editing.board" ref="boardForm"></board-form>
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="updateBoard($refs.boardForm.getBoard()), closeModals()">Сохранить</custom-button>
            </template>
        </modal>
        <modal v-if="modals.removing.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Вы действительно хотите удалить доску<br/>"<b>{{ modals.removing.board.title }}</b>"?
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="removeBoard(modals.removing.board.id), closeModals()">Удалить</custom-button>
                <!-- <custom-button type="link" @click="closeModals">Отмена</custom-button> -->
            </template>
        </modal>
        <modal v-if="modals.archiving.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Вы действительно хотите архивировать все сделанные задачи для доски<br/>"<b>{{ modals.archiving.board.title }}</b>"?
            </template>
            <template v-slot:footer>
                <custom-button type="primary" @click="archiveDoneTasksInBoard(modals.archiving.board.id), closeModals()">Архивировать</custom-button>
                <!-- <custom-button type="link" @click="closeModals">Отмена</custom-button> -->
            </template>
        </modal>
        <modal v-if="modals.constricting.show" @hide="closeModals" type="short">
            <template v-slot:header>
                Вы действительно хотите преобразовать доску в задачу<br/>"<b>{{ modals.constricting.board.title }}</b>"?
            </template>
            <template v-slot:default>
                <input-select
                    name="boardId"
                    title="Доска"
                    :value="modals.constricting.boardId"
                    :items="boards.filter(aBoard => aBoard.id !== modals.constricting.board.id).map(aBoard => ({ title: aBoard.title, value: aBoard.id }))"
                    @change="onChangeInConstricting"
                ></input-select>
            </template>
            <template v-slot:footer>
                <custom-button type="primary" v-show="modals.constricting.boardId !== ''" @click="constrictBoard(modals.constricting.board.id, modals.constricting.boardId), closeModals()">Преобразовать</custom-button>
                <!-- <custom-button type="link" @click="closeModals">Отмена</custom-button> -->
            </template>
        </modal>
    </div>
</template>

<script>
import BoardForm from '@/forms/BoardForm.vue';
import Modal from '@/components/common/Modal.vue';
import ColumnGrid from '@/components/common/ColumnGrid';
import ColumnGridItem from '@/components/common/ColumnGrid/ColumnGridItem.vue';
import CustomButton from '@/components/common/CustomButton.vue';
import InputSelect from '@/components/inputs/InputSelect.vue';
import InputRadio from '@/components/inputs/InputRadio.vue';
import Checkbox from '@/components/inputs/Checkbox.vue';
import InputText from '@/components/inputs/InputText.vue';
import Tag from '@/components/common/Tag.vue';
import NavBlock from '@/components/common/NavBlock';
import NavBlockGroup from '@/components/common/NavBlock/NavBlockGroup';
import Column from '@/components/common/Column';
import Row from '@/components/common/Row';
import Common from 'common';
import Board from './Board';

export default {
    components: {
        BoardForm,
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
        Board,
        NavBlockGroup,
    },
    props: {
    },
    data() {
        return {
            modals: {
                editing: {
                    show: false,
                    board: null,
                },
                removing: {
                    show: false,
                    board: null,
                },
                constricting: {
                    show: false,
                    board: null,
                    boardId: '',
                },
                archiving: {
                    show: false,
                    board: null,
                },
            },
        };
    },
    computed: {
        boards() {
            return this.$store.getters['boards/boards'];
        },
    },
    watch: {
    },
    created() {
        this.init();
    },
    beforeDestroy() {
    },
    methods: {
        init() {
            return this.$store.dispatch('boards/load')
                .then((res) => {
                    console.log('loaded boards');
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        onEditBoard(id) {
            this.modals.editing.show = true;
            this.modals.editing.board = this.boards.find(aBoard => aBoard.id === id) || Common.makeBoard();
        },
        onRemoveBoard(id) {
            this.modals.removing.show = true;
            this.modals.removing.board = this.boards.find(aBoard => aBoard.id === id);
        },
        onConstrictBoard(id) {
            this.modals.constricting.show = true;
            this.modals.constricting.board = this.boards.find(aBoard => aBoard.id === id);
        },
        onArchiveDoneTasks(id) {
            this.modals.archiving.show = true;
            this.modals.archiving.board = this.boards.find(aBoard => aBoard.id === id);
        },
        removeBoard(id) {
            this.closeModals();
            this.$store.dispatch('boards/remove', { id });
        },
        onChange(event) {
            const {
                name,
                value
            } = event;
            this.modals.editing.board[name] = value;
        },
        updateBoard(aBoard) {
            this.closeModals();
            this.$store.dispatch('boards/update', { board: aBoard });
        },
        archiveDoneTasksInBoard(id) {
            this.closeModals();
            this.$store.dispatch('boards/archiveDoneTasks', { id });
        },
        constrictBoard(id, boardId) {
            this.closeModals();
            this.$store.dispatch('boards/constrict', { id, boardId });
        },
        onChangeInConstricting(event) {
            const {
                name,
                value
            } = event;
            this.modals.constricting[name] = value;
        },
        closeModals() {
            Object.keys(this.modals).forEach(key => this.modals[key].show = false);
        },
    },
}
</script>

<style scoped>
    .boards {
        width: 100%;
    }
    .boards__showing-board {
        min-width: 600px;
    }
    .boards__info-title {
        display: flex;
        margin-bottom: 16px;
    }
    .boards__info-button {
        align-self: center;
    }
    .boards__info-button_add {
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
    .boards__info-button_add:hover {
        border: 2px solid #888;
        color: #000;
    }
    .boards__info-tags {
        display: flex;
        flex-wrap: wrap;
    }
    .boards__boards {
        flex-grow: 1;
        margin-left: 240px;
    }
    .boards__info-title {
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