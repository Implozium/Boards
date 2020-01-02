<template>
    <div class="column-grid-item" :column="column" ref="item">
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
    },
    data: function () {
        return {};
    },
    inject: ["addItem", "removeItem"],
    mounted: function () {
        this.addItem(this.$refs.item);
    },
    beforeDestroy: function () {
        this.removeItem(this.$refs.item);
    },
}
</script>

<style scoped>
    .column-grid-item {
        position: absolute;
        transition: transform 0.3s, width 0.3s;
    }
</style>