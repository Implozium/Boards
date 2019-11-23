<template>
    <div class="tag" :class="{ ['tag_' + status]: true, 'tag_activing': hasActiving }" @click="$emit('click')"><span><slot></slot></span><span v-if="hasDeleting" class="tag__deleting" @click="$emit('delete')" title="Удалить">×</span></div>
</template>

<script>
export default {
    props: {
        "hasDeleting": {
            type: Boolean,
            default: false,
        },
        "hasActiving": {
            type: Boolean,
            default: false,
        },
        "status": {
            type: String,
            default: 'default',
            validator: (val) => ['default', 'actived'].includes(val),
        }
    },
}
</script>

<style scoped>
    .tag {
        box-sizing: border-box;
        border: 2px solid #4747eb;
        height: 18px;
        line-height: 14px;
        margin-right: 6px;
        padding: 0 6px 0 6px;
        border-radius: 8px;
        text-shadow: none;
        font-weight: bold;
        margin-top: 4px;
        transition: all 0.3s;
    }
    .tag::before {
        content: ':';
        font-weight: bold;
        position: relative;
        top: -1px;
    }
    .tag_activing {
        cursor: pointer;
    }
    .tag_default {
        background-color: #fff;
        color: #8383dd;
        border: 2px solid #8383dd;
    }
    .tag_activing:hover,
    .tag_actived {
        background-color: #4747eb;
        color: #fff;
        border: 2px solid #fff;
    }
    .tag__deleting {
        /* border-left: 1px solid #4747eb; */
        padding-left: 4px;
        /* font-size: 26px;
        line-height: 18px; */
        font-weight: 600;
        /* color: #4747eb; */
        cursor: pointer;
    }
</style>