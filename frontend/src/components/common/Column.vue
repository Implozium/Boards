<template>
    <div class="col" :class="{ ['col_' + type]: true, 'col_offset': offset }"><slot></slot></div>
</template>

<script>
export default {
    props: {
        "type": {
            type: String,
            default: 'sm',
            validator: (val) => ['sm', 'md', 'lg'].includes(val),
        },
        "offset": {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style scoped>
    .col {
        flex-grow: 1;
        flex-basis: 0px;
    }
    .col_sm {
        flex-grow: 1;
    }
    .col_md {
        flex-grow: 2;
    }
    .col_lg {
        flex-grow: 4;
    }
    .col_offset {
        margin: 0 8px;
    }
    .col_offset:first-of-type {
        margin-left: 0;
    }
    .col_offset:last-of-type {
        margin-right: 0;
    }
</style>