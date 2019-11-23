<template>
    <input-text v-on="$listeners" v-bind="$attrs" :transformFrom="transformFrom" :transformTo="transformTo" :validators="[checkTime]"></input-text>
</template>
<script>
import InputText from './InputText.vue';

export default {
    components: {
        InputText
    },
    computed: {
    },
    methods: {
        transformFrom(value) {
            return value ? new Date(value).toISOString().split(/[T.]/)[1] : '';
        },
        transformTo(value) {
            if (value === '') {
                return 0;
            }
            const [ datepart, timepart ] = new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T');
            const date = Date.parse((datepart + ' ' + value + timepart.slice(value.length)).replace(' ', 'T'));
            return isNaN(date) ? 0 : (date) % (24 * 60 * 60 * 1000);
        },
        checkTime(value) {
            if (value === '') {
                return '';
            }
            const [ datepart, timepart ] = new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T');
            const date = Date.parse((datepart + ' ' + value + timepart.slice(value.length)).replace(' ', 'T'));
            if (isNaN(date)) {
                return 'Введите правильное время';
            }
            return '';
        }
    },
}
</script>