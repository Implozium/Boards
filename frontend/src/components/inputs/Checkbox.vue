<template>
    <label class="checkbox" :class="{ ['checkbox_' + type]: true }">
        <input type="checkbox" class="checkbox__input" :checked="checked" @click="check" :name="name" :title="title"/>
        <span class="checkbox__body"></span>
    </label>
</template>

<script>
import CustomEmitter from '@/mixins/CustomEmitter';

export default {
    mixins: [CustomEmitter],
    props: {
        'name': {
            type: [String, Number],
        },
        'checked': {
            type: Boolean,
        },
        'click': {
            type: Function,
        },
        'title': {
            type: String,
            default: '',
        },
        "type": {
            type: String,
            default: 'default',
            validator: (val) => ['default', 'big'].includes(val),
        },
    },
    data: function () {
        return {};
    },
    computed: {
    },
    methods: {
        check(event) {
            this.emit('click', event.target.checked);
            //this.$emit('click', this.name, event.target.checked);
        }
    },
}
</script>

<style scoped>
    .checkbox {
        /* display: block;
        line-height: 21px; */
        margin: 0 2px;
        cursor: pointer;
        display: inline-block;
    }
    .checkbox__input {
        display: none;
    }
    .checkbox__input ~ .checkbox__body {
        width: 14px;
        height: 14px;
        border: 1px solid grey;
        border-radius: 2px;
        display: inline-block;
        position: relative;
        top: 3px;
        background-color: white;
    }
    .checkbox__input:checked ~ .checkbox__body::after {
        content: '';
        width: 4px;
        height: 8px;
        border-bottom: 3px solid #68acbd;
        border-right: 3px solid #68acbd;
        display: block;
        position: absolute;
        transform: rotateZ(45deg);
        top: 0px;
        left: 4px;
    }

    .checkbox_big .checkbox__input ~ .checkbox__body {
        width: 32px;
        height: 32px;
        border: 1px solid rgba(0, 0, 0, 0);
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
    }
    .checkbox_big .checkbox__input ~ .checkbox__body::after {
        content: '';
        width: 6px;
        height: 11px;
        border-bottom: 3px solid rgba(255, 255, 255, 0.2);
        border-right: 3px solid rgba(255, 255, 255, 0.2);
        display: block;
        position: absolute;
        transform: rotateZ(45deg);
        top: 6px;
        left: 10px;
        transition: all 0.3s;
    }
    .checkbox_big.checkbox:hover .checkbox__input ~ .checkbox__body::after {
        border-color: #41ff9c;
    }
    .checkbox_big .checkbox__input:checked ~ .checkbox__body {
        background-color: rgba(255, 255, 255, 0.2);
        border: 1px solid #84bda0;
    }
    .checkbox_big .checkbox__input:checked ~ .checkbox__body::after {
        border-bottom: 3px solid #41ff9c;
        border-right: 3px solid #41ff9c;
    }
</style>