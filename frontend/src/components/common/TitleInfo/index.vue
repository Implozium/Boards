<template>
    <div class="title-info">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
    }
}
</script>

<style scoped>
    .title-info {
        display: flex;
        flex-wrap: wrap;
    }
</style>