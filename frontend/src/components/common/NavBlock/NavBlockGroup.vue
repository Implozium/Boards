<template>
    <div class="nav-block__group">
        <div v-if="title" class="nav-block__group-title">{{ title }}</div>
        <div class="nav-block__group-body">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        "title": {
            type: String,
            default: '',
        }
    },
    data: function () {
        return {
        }
    },
}
</script>

<style scoped>
    .nav-block__group {
        width: 100%;
    }
    .nav-block__group-title {
        font-size: 16px;
        padding-bottom: 6px;
    }
    .nav-block__group + .nav-block__group {
        margin-top: 12px;
    }
</style>