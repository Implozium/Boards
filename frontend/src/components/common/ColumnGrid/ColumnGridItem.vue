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
}
</script>

<style scoped>
    .column-grid-item {
        position: absolute;
        transition: transform 0.3s, width 0.3s;
    }
</style>