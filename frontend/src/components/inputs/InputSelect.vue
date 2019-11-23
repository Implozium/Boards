<template>
    <div class="input-select" :class="{ 'input-select_active': active, 'input-select_filled': val !== '', 'input-select_error': err !== '' }">
        <label class="input-select__label">{{ title }}</label>
        <select
            class="input-select__select"
            :name="name"
            :value="val"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        >
            <option v-for="item in items" class="input-select__option" :key="item.value" :value="item.value">{{ item.title }}</option>
        </select>
        <div class="input-select__footer">
            <div class="input-select__error" v-if="err">{{ err }}</div>
            <div class="input-select__hint" v-else-if="hint">{{ hint }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        "title": {
            type: String,
            default: '',
        },
        "items": {
            type: Array,
            default: () => [],
        },
        "name": {
            type: [String, Number],
            default: '',
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
    },
    data: function () {
        return {
            "active": false,
            "ownError": '',
            "val": this.value,
        };
    },
    computed: {
        err() {
            return this.ownError || this.error || '';
        }
    },
    watch: {
        "value": function () {
            this.val = this.value;
        },
        "name": function () {
            this.val = this.value;
        },
    },
    methods: {
        onChange(event) {
            let value = event.target.value;
            this.val = value;
            this.$emit('change', event.target.name, value);
        },
        onFocus() {
            this.active = true;
        },
        onBlur() {
            this.active = false;
        }
    },
}
</script>

<style scoped>
    .input-select {
        width: 100%;
        position: relative;
    }
    .input-select__label {
        position: absolute;
        color: grey;
        font-size: 14px;
        width: 100%;
        padding: 20px 12px 4px 12px;
        box-sizing: border-box;
        top: -2px;
        left: 2px;
        pointer-events: none;
        transition: all 0.3s;
    }
    .input-select_filled .input-select__label,
    .input-select_active .input-select__label {
        font-size: 12px;
        padding-top: 4px;
    }
    .input-select__select {
        width: 100%;
        border-radius: 4px;
        border: 1px solid #ccc;
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
    }
    .input-select_error .input-select__select {
        border: 1px solid red;
    }
    .input-select__option {
        color: #333;
    }
    .input-select__footer {
        min-height: 16px;
        font-size: 12px;
    }
    .input-select__hint {
        color: grey;
        padding-left: 16px;
    }
    .input-select__error {
        color: red;
        padding-left: 16px;
    }
</style>