<template>
    <form class="task-form">
        <row>
            <column>
                <input-text name="title" :value="newTask.title" title="Заголовок" @change="onChange"></input-text>
            </column>
        </row>
        <row class="task-form__header">Теги:</row>
        <row>
            <tag v-for="(tag) in tags" :key="tag" :has-deleting="true" @click="onRemoveTag(tag)">{{ tag }}</tag>
        </row>
        <row>
            <input-text :name="''" :value="''" :title="'Новый тег ' + (tags.length + 1)" @change="onAddTag" type="short"></input-text>
        </row>
        <row class="task-form__header">Тип:</row>
        <row>
            <column>
                <label class="task-form__radio-type">
                    <input type="radio" name="type" value="common" :checked="newTask.type === 'common'" @click="newTask.type = 'common'"/>
                    <span>Заметка</span>
                </label>
                <label class="task-form__radio-type">
                    <input type="radio" name="type" value="period" :checked="newTask.type === 'period'" @click="newTask.type = 'period'"/>
                    <span>Простой</span>
                </label>
                <label class="task-form__radio-type">
                    <input type="radio" name="type" value="week" :checked="newTask.type === 'week'" @click="newTask.type = 'week'"/>
                    <span>Недельный</span>
                </label>
                <label class="task-form__radio-type">
                    <input type="radio" name="type" value="month" :checked="newTask.type === 'month'" @click="newTask.type = 'month'"/>
                    <span>Месячный</span>
                </label>
            </column>
        </row>
        <row v-if="newTask.type === 'week'">
            <label class="task-form__checkbox">
                <input type="checkbox" name="day" :value="1" :checked="newTask.days.includes(1)" @click="setDay"/><span>понедельник</span>
            </label>
            <label class="task-form__checkbox">
                <input type="checkbox" name="day" :value="2" :checked="newTask.days.includes(2)" @click="setDay"/><span>вторник</span>
            </label>
            <label class="task-form__checkbox">
                <input type="checkbox" name="day" :value="3" :checked="newTask.days.includes(3)" @click="setDay"/><span>среда</span>
            </label>
            <label class="task-form__checkbox">
                <input type="checkbox" name="day" :value="4" :checked="newTask.days.includes(4)" @click="setDay"/><span>четверг</span>
            </label>
            <label class="task-form__checkbox">
                <input type="checkbox" name="day" :value="5" :checked="newTask.days.includes(5)" @click="setDay"/><span>пятница</span>
            </label>
            <label class="task-form__checkbox">
                <input type="checkbox" name="day" :value="6" :checked="newTask.days.includes(6)" @click="setDay"/><span>суббота</span>
            </label>
            <label class="task-form__checkbox">
                <input type="checkbox" name="day" :value="0" :checked="newTask.days.includes(0)" @click="setDay"/><span>воскресенье</span>
            </label>
        </row>
        <div v-if="newTask.type === 'month'">
            <row>
                <label class="task-form__checkbox task-form__checkbox_date" v-for="i in Array.from({ length: 10 }, (v, i) => i + 1)" :key="i">
                    <input type="checkbox" name="date" :value="i" :checked="newTask.dates.includes(i)" @click="setDate"/><span>{{ i }}</span>
                </label>
            </row>
            <row>
                <label class="task-form__checkbox task-form__checkbox_date" v-for="i in Array.from({ length: 10 }, (v, i) => 10 +i + 1)" :key="i">
                    <input type="checkbox" name="date" :value="i" :checked="newTask.dates.includes(i)" @click="setDate"/><span>{{ i }}</span>
                </label>
            </row>
            <row>
                <label class="task-form__checkbox task-form__checkbox_date" v-for="i in Array.from({ length: 11 }, (v, i) => 20 + i + 1)" :key="i">
                    <input type="checkbox" name="date" :value="i" :checked="newTask.dates.includes(i)" @click="setDate"/><span>{{ i }}</span>
                </label>
            </row>
        </div>
        <row v-if="newTask.type === 'period'">
            <column :offset="true">
                <input-text-datetime name="from" :value="newTask.from" title="Дата начала" @change="onChange" hint="В формате 2015-02-12 23:05:58"></input-text-datetime>
            </column>
            <column :offset="true">
                <input-text name="lengthDate" :value="Math.floor(length / dateMs) || ''" title="Длительность (дни)" @change="onChange"></input-text>
            </column>
            <column :offset="true">
                <input-text-time name="lengthTime" :value="length % dateMs" title="Длительность" @change="onChange" hint="В формате 23:05:58"></input-text-time>
            </column>
            <column :offset="true">
                <input-text-datetime name="to" :value="newTask.to" title="Дата конца" @change="onChange" hint="В формате 2018-02-12 23:05:58"></input-text-datetime>
            </column>
        </row>
        <row v-else-if="newTask.type === 'week' || newTask.type === 'month'">
            <column :offset="true">
                <input-text-time name="fromTime" :value="newTask.fromTime" title="Время начала" @change="onChange" hint="В формате 23:05:58"></input-text-time>
            </column>
            <column :offset="true">
                <input-text-time name="length" :value="length" title="Длительность" @change="onChange" hint="В формате 23:05:58"></input-text-time>
            </column>
        </row>
        <row>
            <column>
                <input-text name="description" :value="newTask.description" title="Описание" type="area" @change="onChange" :monospace="true"></input-text>
            </column>
        </row>
        <row>
            <column type="md">
                <row class="task-form__header task-form__header_offset">Пункты:</row>
                <ol class="task-form__header-list-items">
                    <li v-for="(item, i) in newTask.items" :key="i" class="task-form__header-list-item">
                        <row type="short">
                            <column>
                                <input-text :name="i + '.title'" :value="item.title" :title="'Заголовок ' + (i + 1)" @change="onChangeItem" type="short"></input-text>
                                <div v-if="itemsDescriptions[i] === false" @click="openDescription(i)" class="task-form__item-open-description">Добавить описание</div>
                                <input-text v-else :name="i + '.description'" :value="item.description" :title="'Описание ' + (i + 1)" @change="onChangeItem" type="area" :monospace="true"></input-text>
                            </column>
                            <div class="task-form__item-buttons">
                                <div class="task-form__item-button" @click="onRemoveItem(i)" title="Удалить">×</div>
                                <div v-if="i !== 0" class="task-form__item-button" @click="onMoveItem(i)" title="Переместить вверх">🠹</div>
                                <div v-if="i !== newTask.items.length - 1" class="task-form__item-button" @click="onMoveItem(i, true)" title="Переместить вниз">🠻</div>
                            </div>
                        </row>
                    </li>
                    <row type="short">
                        <column>
                            <custom-button type="default" size="full" @click="onChangeItem({ name: newTask.items.length + '.title', value: ''})">Добавить пункт</custom-button>
                        </column>
                    </row>
                </ol>
            </column>
            <column>
                <row class="task-form__header task-form__header_offset">Ссылки:</row>
                <ol>
                    <li v-for="(link, i) in newTask.links" :key="i" class="task-form__header-list-item">
                        <row type="short">
                            <column>
                                <input-text :name="i + '.title'" :value="link.title" :title="'Заголовок'" @change="onChangeLink" type="short"></input-text>
                                <input-text :name="i + '.href'" :value="link.href" :title="'Ссылка'" @change="onChangeLink" type="short"></input-text>
                            </column>
                            <div class="task-form__item-buttons">
                                <div class="task-form__item-button" @click="onRemoveLink(i)" title="Удалить">×</div>
                                <div v-if="i !== 0" class="task-form__item-button" @click="onMoveLink(i)" title="Переместить вверх">🠹</div>
                                <div v-if="i !== newTask.links.length - 1" class="task-form__item-button" @click="onMoveLink(i, true)" title="Переместить вниз">🠻</div>
                            </div>
                        </row>
                    </li>
                    <row type="short">
                        <column>
                            <custom-button type="default" size="full" @click="onChangeLink({ name: newTask.links.length + '.title', value: '' })">Добавить ссылку</custom-button>
                        </column>
                    </row>
                </ol>
            </column>
        </row>
    </form>
</template>

<script>
import InputText from '@/components/inputs/InputText.vue';
import InputTextDatetime from '@/components/inputs/InputTextDatetime.vue';
import InputTextTime from '@/components/inputs/InputTextTime.vue';
import Column from '@/components/common/Column.vue';
import Row from '@/components/common/Row.vue';
import CustomButton from '@/components/common/CustomButton.vue';
import Tag from '@/components/common/Tag.vue';
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
    },
    props: {
        "task": {
            type: Object,
        },
    },
    data: function () {
        return {
            "newTask": Common.makeTask(this.task),
            "dateMs": 24 * 60 * 60 * 1000,
            "openedDescriptionsOfItems": this.task.items.map(item => false),
        };
    },
    computed: {
        "itemsDescriptions": function () {
            return this.newTask.items.map((anItem, i) => this.openedDescriptionsOfItems[i] || Boolean(anItem.description));
        },
        "length": function () {
            if (this.newTask.type === 'period') {
                return this.newTask.from && this.newTask.to ? this.newTask.to - this.newTask.from : 0;
            } else {
                return this.newTask.length;
            }
        },
        "tags": function () {
            return this.newTask.tags.concat().sort((a, b) => a.localeCompare(b));
        }
    },
    methods: {
        getTask() {
            return this.newTask;
        },
        onChange(event) {
            const {
                name,
                value
            } = event;
            switch (name) {
                case 'length':
                    if (value === '') {
                        break;
                    }
                    if (this.newTask.fromTime + +value >= this.dateMs) {
                        this.newTask.length = this.dateMs - this.newTask.fromTime;
                    } else {
                        this.newTask.length = +value;
                    }
                break;
                case 'lengthTime':
                    if (value === '') {
                        break;
                    }
                    if (this.newTask.from) {
                        this.newTask.to = this.newTask.from + Math.floor(this.length / this.dateMs) * this.dateMs + +value;
                    } else if (this.newTask.to) {
                        this.newTask.from = this.newTask.to - Math.floor(this.length / this.dateMs) * this.dateMs - +value;
                    }
                break;
                case 'lengthDate':
                    if (value === '') {
                        break;
                    }
                    if (this.newTask.from) {
                        this.newTask.to = this.newTask.from + this.length % this.dateMs + +value * this.dateMs;
                    } else if (this.newTask.to) {
                        this.newTask.from = this.newTask.to - this.length % this.dateMs - +value * this.dateMs;
                    }
                break;
                case 'from':
                    if (value && this.newTask.to && value > this.newTask.to) {
                        this.newTask.from = this.newTask.to;
                        this.newTask.to = value;
                    } else {
                        this.newTask.from = value;
                    }
                break;
                case 'to':
                    if (value && this.newTask.from && value < this.newTask.from) {
                        this.newTask.to = this.newTask.from;
                        this.newTask.from = value;
                    } else {
                        this.newTask.to = value;
                    }
                break;
                case 'fromTime':
                    if (value && value + this.newTask.length >= this.dateMs) {
                        this.newTask.fromTime = value;
                        this.newTask.length = this.dateMs - value;
                    } else {
                        this.newTask.fromTime = value;
                    }
                break;
                default:
                    this.newTask[name] = value;
            }
        },
        onChangeItem(event) {
            const {
                name,
                value
            } = event;
            const [ id, prop ] = name.split('.');
            if (this.newTask.items[id]) {
                this.newTask.items[id][prop] = value;
            } else {
                this.newTask.items.push(Common.makeItem({ [prop]: value }));
            }
        },
        onRemoveItem(i) {
            if (this.newTask.items[i]) {
                this.newTask.items.splice(i, 1);
            }
        },
        onMoveItem(i, isDown) {
            const item = this.newTask.items[i];
            if (isDown) {
                this.newTask.items.splice(i, 1);
                this.newTask.items.splice(i + 1, 0, item);
            } else {
                this.newTask.items.splice(i, 1);
                this.newTask.items.splice(i - 1, 0, item);
            }
        },
        onChangeLink(event) {
            const {
                name,
                value
            } = event;
            const [ id, prop ] = name.split('.');
            if (this.newTask.links[id]) {
                this.newTask.links[id][prop] = value;
            } else {
                this.newTask.links.push(Common.makeLink({ [prop]: value }));
            }
        },
        onRemoveLink(i) {
            if (this.newTask.links[i]) {
                this.newTask.links.splice(i, 1);
            }
        },
        onMoveLink(i, isDown) {
            const link = this.newTask.links[i];
            if (isDown) {
                this.newTask.links.splice(i, 1);
                this.newTask.links.splice(i + 1, 0, link);
            } else {
                this.newTask.links.splice(i, 1);
                this.newTask.links.splice(i - 1, 0, link);
            }
        },
        setDay(e) {
            if (e.target.checked && !this.newTask.days.includes(+e.target.value)) {
                this.newTask.days.push(+e.target.value);
            } else if (!e.target.checked && this.newTask.days.includes(+e.target.value)) {
                this.newTask.days.splice(this.newTask.days.indexOf(+e.target.value), 1);
            }
        },
        setDate(e) {
            if (e.target.checked && !this.newTask.dates.includes(+e.target.value)) {
                this.newTask.dates.push(+e.target.value);
            } else if (!e.target.checked && this.newTask.dates.includes(+e.target.value)) {
                this.newTask.dates.splice(this.newTask.dates.indexOf(+e.target.value), 1);
            }
        },
        openDescription(i) {
            this.openedDescriptionsOfItems.splice(i, 1, true);
        },
        onAddTag(event) {
            const {
                name,
                value
            } = event;
            if (value && !this.newTask.tags.includes(value)) {
                this.newTask.tags.push(value);
            }
        },
        onRemoveTag(value) {
            const index = this.newTask.tags.indexOf(value);
            if (index !== -1) {
                this.newTask.tags.splice(index, 1);
            }
        },
    },
}
</script>

<style scoped>
    .task-form {
        width: 100%;
    }
    .task-form__tag {
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
    .task-form__tag::before {
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
    .task-form__tag-name {
        color: lightgrey;
        padding-right: 8px;
    }
    .task-form__tag-delete {
        border-left: 1px solid white;
        padding: 0 4px;
        font-size: 26px;
        line-height: 18px;
        font-weight: 600;
        color: lightgrey;
        cursor: pointer;
    }
    .task-form__radio-type {
        display: inline-block;
    }
    .task-form__radio-type + .task-form__radio-type {
        margin-left: 16px;
    }
    .task-form__radio-type input {
        display: none;
    }
    .task-form__radio-type span {
        cursor: pointer;
        padding: 4px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #fff;
        color: #888;
        transition: all 0.3s;
        display: inline-block;
    }
    .task-form__radio-type span:hover {
        color: #333;
        border: 1px solid #333;
    }
    .task-form__radio-type input:checked + span {
        background-color: #333;
        color: #fff;
    }
    .task-form__radio-type input:checked + span:hover {
        background-color: #666;
    }
    .task-form__checkbox {
        margin-right: 16px;
        flex-grow: 1;
    }
    .task-form__checkbox_date {
        flex-grow: 0;
    }
    .task-form__checkbox:last-of-type {
        margin-right: 0px;
    }
    .task-form__checkbox input {
        display: none;
    }
    .task-form__checkbox span {
        cursor: pointer;
        padding: 4px 15px 4px 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #fff;
        color: #888;
        transition: all 0.3s;
        position: relative;
        display: inline-block;
    }
    .task-form__checkbox_date span {
        width: 14px;
    }
    .task-form__checkbox span::before {
        content: '';
    }
    .task-form__checkbox input:checked + span {
        background-color: #33e;
        color: #fff;
        padding: 4px 10px 4px 20px;
    }
    .task-form__checkbox input:checked + span::before {
        content: '✓';
        position: absolute;
        left: 8px;
    }
    .task-form ol li {
        position: relative;
    }
    .task-form__item-open-description {
        text-decoration: underline;
        margin-bottom: 10px;
        cursor: pointer;
        color: grey;
        font-weight: 600;
        transition: all 0.3s;
    }
    .task-form__item-open-description:hover {
        color: black;
    }
    .task-form__item-buttons {
        display: flex;
        flex-direction: column;
    }
    .task-form__item-button {
        font-size: 24px;
        font-weight: bold;
        color: grey;
        opacity: 0.5;
        cursor: pointer;
        transition: all 0.3s;
        line-height: 22px;
        margin-left: 6px;
        height: 24px;
    }
    .task-form__item-button:hover {
        opacity: 1;
    }
    .task-form__header {
        color: #666;
    }
    .task-form__header_offset {
        padding-left: 40px;
    }
    .task-form__header-list-items {
        display: flex;
        flex-wrap: wrap;
    }
    .task-form__header-list-item {
        min-width: 280px;
        margin-left: 30px;
        flex-grow: 1;
        margin-bottom: 20px;
    }
    /* .task-form__header-list-item + .task-form__header-list-item {
        border-top: 1px solid lightgrey;
        padding-top: 8px;
    } */

</style>