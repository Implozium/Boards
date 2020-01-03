<template>
    <div class="nav">
        <div class="nav__short-menu">
            <div class="nav__button" :class="{ 'nav__button_active': isOpened }" @click="isOpened = !isOpened">
                <div class="nav__button-line nav__button-line_top"></div>
                <div class="nav__button-line nav__button-line_mid"></div>
                <div class="nav__button-line nav__button-line_bot"></div>
            </div>
            <slot name="short-menu"></slot>
        </div>
        <div class="nav__body">
            <div class="nav__body-menu" :class="{ 'nav__body-menu_active': isOpened }">
                <slot name="menu"></slot>
            </div>
            <div class="nav__body-menu-wrapper" @click="isOpened = false"></div>
            <div class="nav__body-main">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        
    },
    data: function () {
        return {
            isOpened: false,
        }
    },
}
</script>

<style scoped>
    .nav {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .nav__body {
        width: 100%;
        background-color: #627a9d;
        display: flex;
        align-items: stretch;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
    .nav__body-menu {
        width: 240px;
        border-right: 2px solid #111;
        background-color: #2d2d2d;
        padding-left: 8px;
        color: #eee;
        box-sizing: border-box;
    }
    .nav__short-menu {
        height: 40px;
        display: none;
        border-bottom: 2px solid #111;
        background-color: #2d2d2d;
        color: #eee;
        width: 100%;
    }
    .nav__body-menu-wrapper {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.6);
        z-index: 10;
    }
    .nav__body-main {
        flex-grow: 1;
        max-height: 100%;
        overflow-y: scroll;
    }
    .nav__button {
        position: relative;
        width: 40px;
        height: 40px;
        cursor: pointer;
    }
    .nav__button-line {
        width: 80%;
        height: 3px;
        background: white;
        box-shadow: 0 0 1px 0 grey;
        position: absolute;
        margin: 0 10%;
        border-radius: 4px;
        transition: all 0.3s;
    }
    .nav__button-line_top {
        top: 25%;
    }
    .nav__button-line_mid {
        top: 50%;
    }
    .nav__button-line_bot {
        top: 75%;
    }
    .nav__button_active .nav__button-line_top {
        top: 50%;
        transform: rotate(45deg);
    }
    .nav__button_active .nav__button-line_mid {
        display: none;
    }
    .nav__button_active .nav__button-line_bot {
        top: 50%;
        transform: rotate(-45deg);
    }
    
    @media screen and (max-width: 768px) {
        .nav__body-menu {
            position: absolute;
            left: -100%;
            transition: all 0.3s;
            top: 0px;
            bottom: 0px;
            z-index: 100;
        }
        .nav__body-menu.nav__body-menu_active {
            left: 0%;
        }
        .nav__body-menu.nav__body-menu_active + .nav__body-menu-wrapper {
            display: block;
        }
        .nav__short-menu {
            display: block;
        }
    }
</style>