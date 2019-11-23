<template>
    <div class="row" :class="{ ['row_' + type]: true }"><slot></slot></div>
</template>

<script>
export default {
    props: {
        "type": {
            type: String,
            default: "",
            validator: (val) => ['', 'short'].includes(val),
        }
    },
}
</script>

<style scoped>
    .row {
        display: flex;
        width: 100%;
        margin-bottom: 12px;
    }
    .row_short {
        margin-bottom: 0px;
    }
</style>