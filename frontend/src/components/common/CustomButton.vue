<template>
    <span class="custom-button" :class="{ ['custom-button_' + type]: true, ['custom-button_' + size]: true }" @click="$emit('click')">
        <slot></slot>
    </span>
</template>

<script>
export default {
    props: {
        "type": {
            type: String,
            default: 'default',
            validator: (val) => ['primary', 'link', 'default'].includes(val),
        },
        "size": {
            type: String,
            default: 'short',
            validator: (val) => ['short', 'full'].includes(val),
        },
    },
    data: function () {
        return {};
    },
}
</script>

<style scoped>
    .custom-button {
        /* min-width: 40px; */
        font-size: 18px;
        /* line-height: 42px; */
        transition: all 0.3s;
        display: inline-block;
        padding: 6px 24px;
        /* font-weight: bold; */
        cursor: pointer;
        margin-right: 16px;
        box-sizing: border-box;
        text-align: center;
        transition: all 0.3s;
    }
    .custom-button:last-of-type {
        margin-right: 0px;
    }
    .custom-button_primary {
        color: white;
        background-color: #0366d6;
        border-radius: 4px;
    }
    .custom-button_primary:hover {
        background-color: #0376fa;
    }
    .custom-button_default {
        color: black;
        background-color: #f8f8f8;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    }
    .custom-button_default:hover {
        background-color: #fff;
        border: 1px solid #0376fa;
        color: #0376fa;
    }
    .custom-button_link {
        color: #0366d6;
    }
    .custom-button_link:hover {
        color: #3493ff;
    }
    .custom-button_full {
        width: 100%;
    }
</style>