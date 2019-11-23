export default {
    methods: {
        emit(type, value, name) {
            const event = {
                type: type,
                name: name !== undefined ? name : this.name !== undefined ? this.name : '',
                target: this,
                time: Date.now(),
                value: value,
            };
            this.$emit(type, event);
        }
    }
};