<template>
    <div class="input-radio" :class="{ ['input-radio_' + type]: true }">
        <label class="input-radio__item" v-for="item in items" :key="item.value">
            <input type="radio" :name="name" :value="item.value" :checked="item.value === val" @click="onChange"/>
            <span>{{ item.title }}</span>
        </label>
    </div>
</template>

<script>
import CustomEmitter from '@/mixins/CustomEmitter';

export default {
    mixins: [CustomEmitter],
    props: {
        "title": {
            type: String,
            default: '',
        },
        "items": {
            type: Array,
            default: () => [],
        },
        "name": {
            type: [String, Number],
            default: '',
        },
        "value": {
            type: [String, Number],
            default: '',
        },
        "error": {
            type: String,
            default: '',
        },
        "type": {
            type: String,
            default: 'horizontal',
            validator: (val) => ['vertical', 'horizontal'].includes(val),
        },
    },
    data: function () {
        return {
            "active": false,
            "ownError": '',
            "val": this.value,
        };
    },
    computed: {
        err() {
            return this.ownError || this.error || '';
        }
    },
    watch: {
        "value": function () {
            this.val = this.value;
        },
        "name": function () {
            this.val = this.value;
        },
    },
    methods: {
        onChange(event) {
            let value = event.target.value;
            this.val = value;
            this.emit('change', value);
        },
    },
}
</script>

<style scoped>
    .input-radio {
        display: flex;
    }
    .input-radio_horizontal {
        flex-direction: row;
        margin-left: -4px;
        flex-wrap: wrap;
        margin-top: -4px;
    }
    .input-radio_vertical {
        flex-direction: column;
    }
    .input-radio__item {
        display: inline-block;
        flex-grow: 1;
    }
    .input-radio_horizontal .input-radio__item {
        margin-left: 4px;
        margin-top: 4px;
    }
    .input-radio_vertical .input-radio__item + .input-radio__item {
        margin-top: 4px;
    }
    .input-radio__item input {
        display: none;
    }
    .input-radio__item span {
        cursor: pointer;
        padding: 2px 4px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #fff;
        color: #888;
        transition: all 0.3s;
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
    }
    .input-radio__item span:hover {
        color: #333;
        border: 1px solid #355079;
    }
    .input-radio__item input:checked + span {
        background-color: #61affe;
        color: #fff;
    }
    .input-radio__item input:checked + span:hover {
        background-color: #1486f8;
    }
</style>