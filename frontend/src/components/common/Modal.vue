<template>
    <transition name="modal">
        <div class="modal">
            <div class="modal__wrapper" @click="closeOnWrap && $emit('hide')"></div>
            <div class="modal__container" :class="{ ['modal__container_' + type]: true }">
                <template v-if="type === 'raw'">
                    <slot></slot>
                </template>
                <template v-else>
                    <div class="modal__header">
                        <slot name="header"></slot>
                        <div class="modal__close" @click="$emit('hide')">×</div>
                    </div>
                    <div class="modal__body">
                        <slot></slot>
                    </div>
                    <div class="modal__footer">
                        <slot name="footer"></slot>
                    </div>
                </template>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        "closeOnWrap": {
            type: Boolean,
            default: true,
        },
        "type": {
            type: String,
            default: 'wide',
            validator: (val) => ['wide', 'short', 'raw', 'full'].includes(val),
        }
    },
    data: function () {
        return {};
    },
    computed: {
    },
    mounted() {
        document.body.style.overflow = 'hidden';//classList.add('body_modaled');
    },
    beforeDestroy() {
        document.body.style.overflow = '';
        // document.body.classList.remove('body_modaled');
    },
    methods: {
    },
}
</script>

<style scoped>
    .modal {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: all .3s ease;
        z-index: 100000;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        overflow-y: auto;
        padding-top: 40px;
    }
    .modal__wrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #333;
        opacity: 0.8;
        z-index: 1;
    }
    .modal__container {
        position: relative;
        transition: all .3s ease;
        z-index: 2;
    }
    .modal__container_wide,
    .modal__container_short,
    .modal__container_full {
        width: 800px;
        background-color: white;
        border: 0px solid grey;
        box-shadow: 0 0 20px 4px black;
        border-radius: 4px;
        /* max-height: 80%; */
        /* margin: 40px 0px 40px 0px; */
        /* position: relative;
        top: 40px; */
    }
    .modal__container_wide {
        width: 800px;
    }
    .modal__container_short {
        width: 400px;
    }
    .modal__container_raw {
        max-width: 600px;
    }
    .modal__container_full {
        width: calc(100% - 50px);
    }
    .modal__header {
        font-size: 14px;
        /* font-weight: bold; */
        padding: 14px 28px 14px 14px;
        text-align: center;
        font-weight: 600;
        border-bottom: 1px solid #ccc;
        background-color: #eee;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }
    .modal__close {
        position: absolute;
        top: 4px;
        right: 14px;
        font-size: 28px;
        color: grey;
        transition: color 0.3s;
        cursor: pointer;
    }
    .modal__close:hover {
        color: black;
    }
    .modal__body {
        font-size: 14px;
        padding: 16px;
        /* max-height: 600px;
        overflow-y: auto; */
    }
    .modal__footer {
        padding: 8px 16px;
        text-align: right;
    }

    .modal-enter {
        opacity: 0;
    }
    .modal-leave-active {
        opacity: 0;
    }
    .modal-enter .modal__container,
    .modal-leave-active .modal__container {
        transform: scale(1.1);
    }
    .body_modaled {
        overflow: hidden;
    }
</style>