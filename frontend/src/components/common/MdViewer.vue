<template>
    <div class="markdown" v-html="md(text)"></div>
</template>

<script>
import marked from 'marked';

export default {
    props: {
        "text": {
            type: String,
            default: "",
        }
    },
    methods: {
        md(str) {
            return marked(str);
        }
    }
}
</script>

<style>
    /* without scoped for global definition */
    .markdown {
        white-space: normal;
    }
    .markdown p {
        margin: 4px 0px;
    }
    .markdown blockquote {
        margin: 2px 0px;
        padding-left: 10px;
        border-left: 4px solid lightgrey;
    }
    .markdown code {
        background-color: #424141;
        color: #ccc;
        border-radius: 4px;
        padding: 0 4px;
        white-space: pre-wrap;
    }
    .markdown pre code {
        display: block;
    }
    .markdown a {
        color: #88d6fb;
        font-weight: 600;
    }
    .markdown ul,
    .markdown ol {
        padding-left: 20px;
        margin: 4px 0px;
    }
    .markdown ul li {
        list-style-type: disc;
    }
    .markdown h1,
    .markdown h2,
    .markdown h3,
    .markdown h4,
    .markdown h5,
    .markdown h6 {
        font-size: 14px;
        margin: 6px 0px;
    }
    .markdown h1 {
        font-size: 18px;
        text-align: center;
    }
    .markdown h2 {
        font-size: 16px;
    }
</style>