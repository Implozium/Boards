<template>
    <div class="board">
        <board></board>
    </div>
</template>

<script>
import Board from '@/components/Board';

export default {
    components: {
        Board,
    },
    data: function () {
        return {
        };
    },
    computed: {
    },
    created() {
    },
    beforeDestroy() {
    },
    methods: {
    },
}
</script>

<style scoped>
    .board {
        height: 100%;
    }
</style>