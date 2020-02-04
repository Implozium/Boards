<template>
    <div class="input-text" :class="{ 'input-text_active': active, 'input-text_filled': val !== '', 'input-text_error': err !== '' }">
        <label class="input-text__label" :class="{ 'input-text__label_area': type === 'area' }" v-if="type !== 'short'">{{ title }}</label>
        <textarea
            v-if="type === 'area'"
            class="input-text__input"
            :class="{ 'input-text__input_tall': true, 'input-text__input_monospace': monospace }"
            :name="name"
            :value="val"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
            @input="onInput"
            ref="textarea"
        ></textarea>
        <input
            v-else
            type="text"
            class="input-text__input"
            :class="{ 'input-text__short': type === 'short' }"
            :placeholder="type === 'short' ? title : ''"
            :name="name"
            :value="val"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
        <div class="input-text__footer">
            <div class="input-text__error" v-if="err">{{ err }}</div>
            <div class="input-text__hint" v-else-if="hint">{{ hint }}</div>
        </div>
    </div>
</template>

<script>
import CustomEmitter from '@/mixins/CustomEmitter';

export default {
    mixins: [CustomEmitter],
    props: {
        "title": {
            type: String,
            default: '',
        },
        "name": {
            type: [String, Number],
            default: '',
        },
        "type": {
            type: String,
            default: '',
            validator: (val) => ['area', 'short', ''].includes(val)
        },
        "hint": {
            type: String,
            default: '',
        },
        "value": {
            type: [String, Number],
            default: '',
        },
        "error": {
            type: String,
            default: '',
        },
        "transformFrom": {
            type: Function,
            default: value => value,
        },
        "transformTo": {
            type: Function,
            default: value => value,
        },
        "validators": {
            type: Array,
            default: () => [],
        },
        "monospace": {
            type: Boolean,
            default: false,
        }
    },
    data: function () {
        return {
            "active": false,
            "ownError": '',
            "val": this.transformFrom(this.value),
        };
    },
    computed: {
        err() {
            return this.ownError || this.error || '';
        }
    },
    watch: {
        "value": function () {
            this.val = this.transformFrom(this.value);
        },
        "name": function () {
            this.val = this.transformFrom(this.value);
        },
    },
    mounted: function () {
        this.fitTextArea();
    },
    methods: {
        onChange(event) {
            let value = event.target.value;
            this.val = value;
            const error = this.validators.reduce((error, validator) => error ? error : validator(value), '');
            if (error) {
                this.ownError = error;
            } else {
                this.ownError = '';
                value = this.transformTo(value);
                this.emit('change', value);
            }
        },
        onFocus() {
            this.active = true;
        },
        onBlur() {
            this.active = false;
        },
        onInput(e) {
            this.fitTextArea();
            // e.target.style.height = "";
            // e.target.style.height = e.target.scrollHeight + 3 + "px";
        },
        fitTextArea() {
            if (this.type === 'area' && this.$refs.textarea) {
                const textarea = this.$refs.textarea;
                const container = textarea.closest('.modal') || document.body;
                const scrollTop = container.scrollTop;
                textarea.style.height = "";
                textarea.style.height = textarea.scrollHeight + 6 + "px";
                container.scrollTop = scrollTop;
            }
        }
    },
}
</script>

<style scoped>
    .input-text {
        width: 100%;
        position: relative;
    }
    .input-text__label {
        position: absolute;
        color: grey;
        font-size: 14px;
        width: 100%;
        padding: 16px 12px 0px 12px;
        margin-bottom: 4px;
        box-sizing: border-box;
        top: 2px;
        left: 2px;
        pointer-events: none;
        transition: all 0.3s;
        width: calc(100% - 20px);
    }
    .input-text__label_area {
        background-color: #fff;
        top: 2px;
    }
    .input-text_filled .input-text__label,
    .input-text_active .input-text__label {
        font-size: 12px;
        padding-top: 0px;
    }
    .input-text__input {
        width: 100%;
        border-radius: 4px;
        border: 2px solid #ccc;
        padding: 20px 12px 4px 12px;
        box-sizing: border-box;
        max-width: 100%;
        min-width: 100%;
        min-height: 45px;
        height: 45px;
        font-family: "Segoe UI", Roboto;
        font-size: 14px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        background-color: #fff;
    }
    .input-text__input_tall {
        min-height: 104px;
        height: 104px;
        resize: vertical;
    }
    .input-text__input_monospace {
        font-family: monospace;
    }
    .input-text__short {
        padding-top: 4px;
        min-height: auto;
        height: auto;
    }
    .input-text_error .input-text__label {
        color: red;
    }
    .input-text_error .input-text__input {
        border: 2px solid red;
    }
    .input-text_active .input-text__label {
        color: #61affe;
        background-color: #fff;
    }
    .input-text_active .input-text__input {
        border: 2px solid #61affe;
        outline: none;
        background-color: #fff;
    }
    .input-text__footer {
        min-height: 16px;
        font-size: 12px;
    }
    .input-text__hint {
        color: grey;
        padding-left: 16px;
    }
    .input-text__error {
        color: red;
        padding-left: 16px;
    }
</style>