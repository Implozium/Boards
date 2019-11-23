<template>
    <div class="column-grid-item" :column="column">
        <slot></slot>
    </div>
</template>

<script>
export default {
    data: function () {
        return {};
    },
    props: {
        "column": {
            type: Number,
            default: 0,
        },
    },
}
</script>

<style scoped>
    .column-grid-item {
        position: absolute;
        transition: transform 0.3s, width 0.3s;
    }
</style>