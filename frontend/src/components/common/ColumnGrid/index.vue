<template>
    <div class="column-grid">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        "subcolumns": {
            type: Number,
            default: 10,
        },
        "minSubcolumnWidth": {
            type: Number,
            default: 200,
        },
    },
    data: function () {
        return {
            timer: null,
            isFinished: true,
            items: [],
            resizeTimer: null,
            observer: null,
        };
    },
    computed: {
    },
    watch: {
    },
    mounted() {
        window.addEventListener('resize', this.resize);
        this.reinit();
        this.observer = new MutationObserver(() => {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.reinit();
            }, 100);
        });
        this.observer.observe(this.$el, {
            attributes: true,
            childList: true,
            subtree: true
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
        clearTimeout(this.timer);
        this.timer = null;
        this.observer.disconnect();
    },
    methods: {
        reinit() {
            if (!this.isFinished) {
                return;
            }
            if (this.$el.hidden === true || this.$el.offsetParent === null) {
                return;
            }
            const items = Array.from(this.$el.querySelectorAll('.column-grid-item')).sort((a, b) => +a.getAttribute("column") - +b.getAttribute("column"));
            // const items = this.items;
            const infoOfColumns = items.reduce((obj, item, i) => {
                const column = +item.getAttribute("column");
                if (!obj[column]) {
                    obj[column] = {
                        id: column,
                        to: column,
                        count: 0,
                        subcolumns: [],
                        offset: 0,
                    }
                }
                obj[column].count += 1;
                return obj;
            }, {});

            const countOfColumn = Object.keys(infoOfColumns).length;
            // const countOfSubColumns = Math.min(Math.floor(this.$el.getBoundingClientRect().width / this.minSubcolumnWidth) || 1, items.length);
            const countOfSubColumns = Math.floor(this.$el.getBoundingClientRect().width / this.minSubcolumnWidth) || 1;
            const arrayOfInfo = Object.values(infoOfColumns).sort((a, b) => a.id - b.id);

            if (countOfColumn > countOfSubColumns) {
                for (let i = countOfColumn; i > countOfSubColumns; i--) {
                    const minId = arrayOfInfo.reduce((min, info, i, arr) => {
                        if (i === 0) {
                            return null;
                        }
                        if (info.id === info.to && (!min || arr[min].count > info.count)) {
                            return i;
                        }
                        return min;
                    }, null);
                    arrayOfInfo[minId].to = arrayOfInfo[minId - 1].id;
                }
                arrayOfInfo.forEach((info, arr) => {
                    if (info.id === info.to) {
                        info.subcolumns = [0];
                    } else {
                        let head = infoOfColumns[info.to];
                        while (head && head.id !== head.to) {
                            head = infoOfColumns[head.to];
                        }
                        info.to = head.id;
                    }
                });
            } else {
                const amount = arrayOfInfo.reduce((amount, info) => amount + info.count, 0);
                const arrayOfAmountOfColumns = arrayOfInfo.map(info => ({
                    id: info.id,
                    count: Math.floor(info.count * countOfSubColumns / amount),
                    rest: info.count * countOfSubColumns / amount - Math.floor(info.count * countOfSubColumns / amount),
                }));
                let restOfCountOfSubColumns = countOfSubColumns;
                arrayOfAmountOfColumns.forEach((item) => {
                    if (item.count < 1) {
                        item.count = 1;
                        item.rest = 0;
                        restOfCountOfSubColumns--;
                    } else {
                        restOfCountOfSubColumns -= item.count;
                    }
                });
                arrayOfAmountOfColumns.sort((a, b) => b.rest - a.rest === 0 ? b.count - a.count : b.rest - a.rest)
                    .forEach((item) => {
                        if (restOfCountOfSubColumns > 0) {
                            item.count++;
                            restOfCountOfSubColumns--;
                        } else if (restOfCountOfSubColumns < 0) {
                            item.count--;
                            restOfCountOfSubColumns++;
                        }
                        infoOfColumns[item.id].subcolumns = new Array(item.count).fill(0);
                    });
            }

            const columnWidth = Math.floor(this.$el.getBoundingClientRect().width / countOfSubColumns);
            let offset = 0;
            for (let i = 0; i < arrayOfInfo.length; i++) {
                arrayOfInfo[i].offset = arrayOfInfo[i - 1] ? offset : 0;
                offset = offset + arrayOfInfo[i].subcolumns.length * columnWidth;
            }

            items.forEach((item) => {
                const info = infoOfColumns[item.getAttribute("column")];
                const mainInfo = info.id === info.to ? info : infoOfColumns[info.to];
                
                item.style.width = columnWidth + 'px';
                const height = item.getBoundingClientRect().height;
                // item.style.transition = "";
                const minId = mainInfo.subcolumns.reduce((minId, el, i, arr) => el < arr[minId] ? i : minId, 0);
                item.style.transform = `translate(${ mainInfo.offset + minId * columnWidth + 'px' }, ${ mainInfo.subcolumns[minId] + 'px' })`;
                mainInfo.subcolumns[minId] += height;
            });

            const max = Math.max(...arrayOfInfo.reduce((arr, infoOfColumn) => arr.concat(infoOfColumn.subcolumns), []));
            this.$el.style.height = max + 'px';
            this.isFinished = true;
        },
        resize() {
            if (this.resizeTimer) {
                clearTimeout(this.resizeTimer);
            }
            this.resizeTimer = setTimeout(() => {
                this.reinit();
                this.resizeTimer = null;
            }, 100);
        }
    },
}
</script>

<style scoped>
    .column-grid {
        width: 100%;
        position: relative;
    }
</style>