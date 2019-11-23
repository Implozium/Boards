<template>
    <div id="main">
        <!-- <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div> -->
        <router-view/>
    </div>
</template>

<style>
    body {
        font-family: "Segoe UI", Roboto;
        font-size: 14px;
        background-color: #627a9d;
        padding: 0px;
        margin: 0px;
    }
    #main {
        margin-top: 0px;
    }
    html,
    body,
    #main {
        height: 100%;
    }
    @keyframes anim-show {
        from {
            opacity: 0;
        }
        50% {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
