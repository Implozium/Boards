<template>
    <div class="menu-block" :class="{ 'menu-block_active': active }" ref="menu">
        <div class="menu-block__main-button" :class="{ active: active }" @click="click">
            <slot name="main"></slot>
        </div>
        <div class="menu-block__buttons" :class="{ ['menu-block__buttons_' + type]: true }">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        "type": {
            type: String,
            default: "right",
            validator: (val) => ["right", "left", "none"].includes(val)
        }
    },
    data: function () {
        return {
            active: false,
            unclickMenu: null,
        };
    },
    provide() {
        return {
            onClick: () => {
                this.active = false;
            }
        };
    },
    computed: {
    },
    mounted() {
        this.unclickMenu = (event) => {
            if (!this.$refs.menu.contains(event.target) && this.active) {
                this.active = false;
            }
        };
        document.addEventListener('click', this.unclickMenu);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.unclickMenu);
    },
    methods: {
        click() {
            this.active = !this.active;
        }
    }
}
</script>

<style scoped>
    .menu-block {
        position: relative;
    }
    /* .menu-block__main-button {

    } */
    .menu-block__buttons {
        display: none;
        position: absolute;
        background-color: white;
        padding: 4px 0px;
        border: 1px solid grey;
        border-radius: 4px;
        min-width: 20px;
        margin-top: 8px;
    }
    .menu-block__buttons_right {
        right: -6px;
    }
    .menu-block__buttons_left {
        left: -6px;
    }
    .menu-block__buttons_none {
        left: -6px;
        right: -6px;
    }
    .menu-block__buttons_right::after,
    .menu-block__buttons_right::before,
    .menu-block__buttons_left::after,
    .menu-block__buttons_left::before {
        content: '';
        width: 4px;
        height: 4px;
        position: absolute;
        top: -13px;
        box-sizing: border-box;
        border: 6px solid transparent;
        border-bottom-color: grey;
    }
    
    .menu-block__buttons_right::after,
    .menu-block__buttons_right::before {
        right: 6px;
    }
    .menu-block__buttons_left::after,
    .menu-block__buttons_left::before {
        left: 6px;
    }
    .menu-block__buttons_right::after,
    .menu-block__buttons_left::after {
        top: -12px;
        border-bottom-color: white;
    }
    .menu-block_active .menu-block__buttons {
        display: block;
        z-index: 10;
    }
</style>