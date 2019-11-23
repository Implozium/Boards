import Vue from 'vue';

export default {
    data() {
        return {
            "meta": {}
        };
    },
    methods: {
        update(field, name, value) {
            if (!this.meta[field]) {
                Vue.set(this.meta, field, {});
            }
            Vue.set(this.meta[field], name, value);

            return this;
        },
        attrs(field) {
            if (!this.meta[field]) {
                Vue.set(this.meta, field, {});
            }

            return this.meta[field];
        }
    }
};