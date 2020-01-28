<template>
    <div class="title-info__item" :class="{ ['title-info__item_' + type]: true, ['title-info__item_icon-' + icon]: true }"><slot></slot></div>
</template>

<script>
export default {
    props: {
        "type": {
            type: String,
            default: 'default',
            validator: (val) => ['default', 'danger', 'danger-invert', 'warning', 'warning-invert', 'success', 'success-invert'].includes(val),
        },
        "icon": {
            type: String,
            default: 'default',
            validator: (val) => ['default', 'archival'].includes(val),
        },
    }
}
</script>

<style scoped>
    .title-info__item {
        border: 1px solid #6e6e6e;
        border-radius: 10px;
        padding: 0 8px 0 22px;
        margin-right: 12px;
        margin-top: 4px;
        position: relative;
        background-color: #f2f2f2;
        color: #6e6e6e;
        text-shadow: none;
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
    }
    .title-info__item::before {
        content: '';
        border: 1px solid #6e6e6e;
        border-radius: 10px;
        width: 18px;
        height: 18px;
        position: absolute;
        left: -1px;
        top: -1px;
        /* background-color: #6e6e6e; */
        padding-left: 4px;
        box-sizing: border-box;
    }
    .title-info__item_danger {
        border-color: #fcbaba;
        background-color: #f93e3e;
        color: #fff;
    }
    .title-info__item_danger::before {
        border-color: transparent;
        background-color: #fcbaba;
    }
    .title-info__item_danger-invert {
        border-color: #f93e3e;
        background-color: #fcbaba;
        color: #f93e3e;
    }
    .title-info__item_danger-invert::before {
        border: 2px solid #f93e3e;
    }
    .title-info__item_warning {
        border-color: #fedfb9;
        background-color: #fca130;
        color: #fff;
    }
    .title-info__item_warning::before {
        border-color: transparent;
        background-color: #fedfb9;
    }
    .title-info__item_warning-invert {
        border-color: #fca130;
        background-color: #fedfb9;
        color: #fca130;
    }
    .title-info__item_warning-invert::before {
        border: 2px solid #fca130;
    }
    .title-info__item_success {
        border-color: #b7ebd4;
        background-color: #49cc90;
        color: #fff;
    }
    .title-info__item_success::before {
        border-color: transparent;
        background-color: #b7ebd4;
    }
    .title-info__item_success-invert {
        border-color: #49cc90;
        background-color: #b7ebd4;
        color: #49cc90;
    }
    .title-info__item_success-invert::before {
        border: 2px solid #49cc90;
    }
    .title-info__item_default {
        color: #a0a0a0;
        background-color: #fff;
        border-color: #a0a0a0;
        /* text-shadow: 0 0 0px black; */
        font-weight: 600;
    }
    .title-info__item_icon-archival::before {
        border-color: inherit;
        content: '🕮';
        font-size: 10px;
        padding-left: 2px;
        padding-top: 1px;
    }
</style>