<template>
    <div class="menu-block-item" :class="{ ['menu-block-item_' + type]: true, ['menu-block-item_' + status]: true, 'menu-block-item_checked': checked }" @click="click"><slot></slot></div>
</template>

<script>
export default {
    props: {
        "type": {
            type: String,
            default: 'sm',
            validator: (val) => ['sm', 'ex'].includes(val),
        },
        "checked": {
            type: Boolean,
            default: false,
        },
        "status": {
            type: String,
            default: 'default',
            validator: (val) => ['default', 'disabled', 'actived'].includes(val),
        }
    },
    inject: ['onClick'],
    data: function () {
        return {
        };
    },
    computed: {
    },
    methods: {
        click() {
            this.onClick();
            this.$emit('click');
        }
    },
}
</script>

<style scoped>
    .menu-block-item {
        padding: 4px 8px 4px 8px;
        transition: all .3s;
        font-size: 14px;
        /* line-height: 21px; */
        font-weight: 400;
        text-align: left;
        color: #333;
        position: relative;
        cursor: pointer;
    }
    .menu-block-item_ex {
        padding-right: 20px;
    }
    .menu-block-item_ex.menu-block-item_checked::after {
        content: '✓';
        position: absolute;
        right: 8px;
        font-weight: bold;
    }
    .menu-block-item:hover {
        color: white;
        background-color: #0366d6;
    }
    .menu-block-item_disabled {
        color: #888;
        cursor: default;
    }
    .menu-block-item_disabled:hover {
        background-color: #fff;
        color: #888;
        text-decoration: none;
    }
</style>