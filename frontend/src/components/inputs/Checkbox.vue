<template>
    <label class="checkbox">
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
        }
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
</style>