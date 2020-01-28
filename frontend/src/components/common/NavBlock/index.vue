<template>
    <div class="nav-block">
        <div class="nav-block__short-menu">
            <div class="nav-block__button" :class="{ 'nav-block__button_active': isOpened }" @click="isOpened = !isOpened">
                <div class="nav-block__button-line nav-block__button-line_top"></div>
                <div class="nav-block__button-line nav-block__button-line_mid"></div>
                <div class="nav-block__button-line nav-block__button-line_bot"></div>
            </div>
            <div v-if="title" class="nav-block__title-short">{{ title }}</div>
            <slot name="short-menu"></slot>
        </div>
        <div class="nav-block__body">
            <nav class="nav-block__body-menu" :class="{ 'nav-block__body-menu_active': isOpened }">
                <div v-if="title" class="nav-block__title">{{ title }}</div>
                <nav-block-group title="Компоненты">
                    <div class="nav-block__page" @click="toPage('boards')">➜ Доски</div>
                    <div class="nav-block__page" @click="toPage('bookmarks')">➜ Закладки</div>
                </nav-block-group>
                <slot name="menu"></slot>
            </nav>
            <div class="nav-block__body-menu-wrapper" @click="isOpened = false"></div>
            <div class="nav-block__body-main">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import NavBlockGroup from './NavBlockGroup';

export default {
    components: {
        NavBlockGroup
    },
    props: {
        "title": {
            type: String,
            default: '',
        },
        "active": {
            type: String,
            default: '',
        }
    },
    data: function () {
        return {
            isOpened: false,
        }
    },
    methods: {
        toPage(page, params = {}) {
            if (page === this.active) {
                return;
            }
            this.$router.push({ name: page, params: params });
        }
    }
}
</script>

<style scoped>
    .nav-block {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .nav-block__title {
        font-size: 18px;
        line-height: 28px;
        margin-top: 8px;
        margin-bottom: 8px;
        font-weight: bold;
    }
    .nav-block__title-short {
        flex-grow: 1;
        text-align: center;
        font-size: 24px;
        line-height: 40px;
        font-weight: bold;
    }
    .nav-block__body {
        width: 100%;
        background-color: #627a9d;
        display: flex;
        align-items: stretch;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
    .nav-block__body-menu {
        width: 300px;
        border-right: 2px solid #111;
        background-color: #2d2d2d;
        padding-left: 8px;
        padding-right: 8px;
        color: #eee;
        box-sizing: border-box;
    }
    .nav-block__short-menu {
        height: 40px;
        display: none;
        border-bottom: 2px solid #111;
        background-color: #2d2d2d;
        color: #eee;
        width: 100%;
    }
    .nav-block__body-menu-wrapper {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.6);
        z-index: 100;
    }
    .nav-block__body-main {
        flex-grow: 1;
        max-height: 100%;
        overflow-y: scroll;
    }
    .nav-block__button {
        position: relative;
        width: 40px;
        height: 40px;
        cursor: pointer;
        border-right: 1px solid black;
    }
    .nav-block__button-line {
        width: 80%;
        height: 3px;
        background: white;
        box-shadow: 0 0 1px 0 grey;
        position: absolute;
        margin: 0 10%;
        border-radius: 4px;
        transition: all 0.3s;
    }
    .nav-block__button-line_top {
        top: 25%;
    }
    .nav-block__button-line_mid {
        top: 50%;
    }
    .nav-block__button-line_bot {
        top: 75%;
    }
    .nav-block__button_active .nav-block__button-line_top {
        top: 50%;
        transform: rotate(45deg);
    }
    .nav-block__button_active .nav-block__button-line_mid {
        display: none;
    }
    .nav-block__button_active .nav-block__button-line_bot {
        top: 50%;
        transform: rotate(-45deg);
    }
    .nav-block__page {
        color: #15a3e7;
        cursor: pointer;
        /* font-weight: bold; */
        margin-left: 12px;
        margin-top: 4px;
        transition: all 0.3s;
    }
    .nav-block__page:hover {
        color: #5fc9fa;
        text-decoration: underline;
    }
    
    @media screen and (max-width: 768px) {
        .nav-block__body-menu {
            position: absolute;
            left: -100%;
            transition: all 0.3s;
            top: 0px;
            bottom: 0px;
            z-index: 1000;
            overflow-y: auto;
            max-height: calc(100% - 40px);
        }
        .nav-block__body-main {
            max-height: calc(100% - 40px);
        }
        .nav-block__body-menu.nav-block__body-menu_active {
            left: 0%;
        }
        .nav-block__body-menu.nav-block__body-menu_active + .nav-block__body-menu-wrapper {
            display: block;
        }
        .nav-block__short-menu {
            display: flex;
        }
    }
</style>