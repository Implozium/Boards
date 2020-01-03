<template>
    <div class="board">
        <board :board-id="activeBoardId" @change-board="onChangeBoard">
            <template v-slot:boards>
                <menu-block class="boards" type="none">
                    <template v-slot:main>
                        <div
                            class="boards__head"
                            :class="{ 'boards__head_empty': !activeBoard }"
                            :title="activeBoard ? activeBoard.description : 'Не выбрано доски'"
                        >{{ activeBoard ? activeBoard.title : 'Не выбрано доски' }}</div>
                    </template>
                    <menu-block-item
                        v-for="aBoard in boards"
                        :key="aBoard.id"
                        :status="aBoard.id === activeBoardId ? 'disabled' : 'default'"
                        :title="aBoard.description || ''"
                        @click="setBoard(aBoard.id)"
                    >
                        <div class="boards__item-title">{{ aBoard.title }}</div>
                        <div class="boards__item-description">{{ aBoard.description }}</div>
                    </menu-block-item>
                    <menu-block-hr></menu-block-hr>
                    <menu-block-item class="boards__item-add" @click="onEditBoard">+ Новая доска</menu-block-item>
                </menu-block>
            </template>
            <template v-slot:board-menu>
                <menu-block class="boards__main-button">
                    <template v-slot:main>…</template>
                    <menu-block-item @click="onEditBoard(activeBoardId)">редактировать</menu-block-item>
                    <menu-block-hr></menu-block-hr>
                    <menu-block-item @click="onConstrictBoard(activeBoardId)">сузить</menu-block-item>
                    <menu-block-hr></menu-block-hr>
                    <menu-block-item @click="onArchiveDoneTasks(activeBoardId)">архивировать все сделанные</menu-block-item>
                    <menu-block-hr></menu-block-hr>
                    <menu-block-item @click="onRemoveBoard(activeBoardId)">удалить</menu-block-item>
                </menu-block>
            </template>
        </board>
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
import Board from '@/components/Board';
import Modal from '@/components/common/Modal.vue';
import Column from '@/components/common/Column.vue';
import Row from '@/components/common/Row.vue';
import CustomButton from '@/components/common/CustomButton.vue';
import InputText from '@/components/inputs/InputText.vue';
import MenuBlock from '@/components/common/MenuBlock';
import MenuBlockItem from '@/components/common/MenuBlock/MenuBlockItem.vue';
import MenuBlockHr from '@/components/common/MenuBlock/MenuBlockHr.vue';
import BoardForm from '@/forms/BoardForm.vue';
import InputSelect from '@/components/inputs/InputSelect.vue';
import Common from 'common';

export default {
    components: {
        Column,
        Row,
        Board,
        CustomButton,
        Modal,
        InputText,
        BoardForm,
        MenuBlock,
        MenuBlockItem,
        MenuBlockHr,
        InputSelect,
    },
    data: function () {
        return {
            activeBoardId: this.$route.params.id,// '010903CC6822-9042BB2780D4-CB3206B4',
            active: false,
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
        activeBoard() {
            return this.boards.find(aBoard => aBoard.id === this.activeBoardId);
        }
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
        setBoard(id) {
            this.activeBoardId = id || null;
            this.$router.push({ name: 'board', params: { id } });
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
            this.$store.dispatch('boards/update', { board: aBoard })
                .then((res) => {
                    this.setBoard(aBoard.id);
                });
        },
        archiveDoneTasksInBoard(id) {
            this.closeModals();
            this.$store.dispatch('boards/archiveDoneTasks', { id })
        },
        constrictBoard(id, boardId) {
            this.closeModals();
            this.$store.dispatch('boards/constrict', { id, boardId })
                .then((res) => {
                    this.setBoard(boardId);
                });
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
        onChangeBoard(boardId) {
            this.init()
                .then(() => this.setBoard(boardId));
        }
    },
}
</script>

<style scoped>
    .board {
        height: 100%;
    }
    .boards {
        top: 6px;
    }
    .boards__head {
        line-height: 26px;
        font-size: 16px;
        font-weight: 500;
        padding: 0px 8px;
        background-color: white;
        border: 2px solid #eee;
        color: #eee;
        border-radius: 12px;
        cursor: pointer;
        max-width: 200px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        min-height: 28px;
        white-space: pre;
        min-width: 200px;
        box-sizing: border-box;
        background-color: #355079;
    }
    .boards__head_empty {
        color: #888;
        font-size: 18px;
    }
    .boards__item-title {
        font-weight: bold;
        font-size: 14px;
    }
    .boards__item-description {
        font-size: 12px;
    }
    .boards__item-add {
        font-weight: bold;
        font-size: 14px;
    }
    .boards__main-button {
        margin: 0 6px;
        transition: all 0.3s;
        font-size: 18px;
        color: white;
        font-weight: bold;
        line-height: 18px;
        cursor: pointer;
    }
</style>