<template>
    <input-text v-on="$listeners" v-bind="$attrs" :transformFrom="transformFrom" :transformTo="transformTo" :validators="[checkDatetime]"></input-text>
</template>

<script>
import InputText from './InputText.vue';
import Common from 'common';

export default {
    components: {
        InputText
    },
    computed: {
    },
    methods: {
        transformFrom(value) {
            return value ? Common.toDate(value) : '';
        },
        transformTo(value) {
            if (value === '') {
                return 0;
            }
            const str = new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString();
            const date = Date.parse((value + str.slice(value.length)).replace(' ', 'T'));
            return isNaN(date) ? 0 : date + new Date().getTimezoneOffset() * 60 * 1000;
        },
        checkDatetime(value) {
            if (value === '') {
                return '';
            }
            const str = new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString();
            const date = Date.parse((value + str.slice(value.length)).replace(' ', 'T'));
            if (isNaN(date)) {
                return 'Введите правильную дату';
            }
            return '';
        }
    },
}
</script>