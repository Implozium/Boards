<template>
    <div class="column-grid__item" :column="column" ref="item" :type="type" :active="active ? 'active' : ''" @click="onClick">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        "column": {
            type: Number,
            default: 0,
        },
        "type": {
            type: String,
            default: '',
            validator: (val) => ['', 'full', 'new'].includes(val),
        },
    },
    data: function () {
        return {
            active: false,
        };
    },
    inject: ["addItem", "removeItem", "setActiveItem"],
    mounted: function () {
        this.addItem(this);
    },
    beforeDestroy: function () {
        this.removeItem(this);
    },
    methods: {
        onClick: function () {
            this.setActiveItem(this);
        },
        setActive: function (isActive) {
            this.active = isActive;
        },
    }
}
</script>

<style scoped>
    .column-grid__item {
        position: absolute;
        transition: transform 0.3s, width 0.3s;
        z-index: 1;
        will-change: transform, width;
    }
    .column-grid__item[active="active"] {
        z-index: 10;
    }
</style>