const Common = {
    makeGuid() {
        return [
            (Math.random().toString(16).substr(2) + '0'.repeat(12)).substr(0, 12),
            (Math.random().toString(16).substr(2) + '0'.repeat(12)).substr(0, 12),
            (Math.random().toString(16).substr(2, 8) + '0'.repeat(8)).substr(0, 8)
        ].join('-').toUpperCase();
    },
    makeTask(params = {}) {
        return {
            title: params.title || '',
            description: params.description || '',
            id: params.id || Common.makeGuid(),
            done: params.done || 0,
            from: params.from || 0,
            to: params.to || 0,
            archival: params.archival || 0,
            items: params.items ? params.items.map(Common.makeItem) : [],
            links: params.links ? params.links.map(Common.makeLink) : [],
            type: params.type || 'period', // 'common', 'period', 'month', 'week'
            dates: params.dates ? params.dates.concat() : [],
            days: params.days ? params.days.concat() : [],
            fromTime: params.fromTime || 0,
            length: params.length || 0,
            created: params.created || Date.now(),
            boardId: params.boardId,
            open: params.open !== undefined ? params.open : true,
            tags: params.tags ? params.tags.concat() : [],
        };
    },
    getAddedMsAndMs(arr, val, time, comparator = (val, date) => false) {
        if (arr.length === 0) {
            return {
                addedMs: 0,
                ms: 0,
            };
        }
        const date = new Date(time);
        const sortarr = arr.concat().sort((a, b) => a - b);
        let v = sortarr.find(v => v >= val);
        if (v == undefined) {
            v = sortarr[0];
        }
        let addedDays = 0;
        while (comparator(v, date)) {
            addedDays++;
            date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
        }

        return {
            addedMs: addedDays * 24 * 60 * 60 * 1000,
            ms: date.getHours() * 60 * 60 * 1000 + date.getMinutes() * 60 * 1000 + date.getSeconds() * 1000,
        };
    },
    getAddedMsAndMsForTask(aTask, time) {
        const date = new Date(time);
        return aTask.type === 'week'
            ? Common.getAddedMsAndMs(aTask.days, date.getDay(), time, (val, date) => val !== date.getDay())
            : Common.getAddedMsAndMs(aTask.dates, date.getDate(), time, (val, date) => val !== date.getDate());
    },
    getTaskInfoCommon(aTask, time) {
        return {
            isDone: false,
            canSetDone: false,
            createdAsString: Common.toDate(aTask.created),
            fromAsString: '',
            toAsString: '',
            doneAsString: '',
            beforeFrom: '',
            afterFrom: '',
            beforeTo: '',
            afterTo: '',
            allTime: '',
            doneTime: '',
            createdTime: Common.stringDate(time - aTask.created),
        };
    },
    getTaskInfoPeriod(aTask, time) {
        return {
            isDone: Boolean(aTask.done),
            canSetDone: true,
            createdAsString: Common.toDate(aTask.created),
            fromAsString: Common.toDate(aTask.from),
            toAsString: Common.toDate(aTask.to),
            doneAsString: Common.toDate(aTask.done),
            beforeFrom: aTask.from && aTask.from > time ? Common.stringDate(aTask.from - time) : '',
            afterFrom: aTask.from && aTask.from < time ? Common.stringDate(time - aTask.from) : '',
            beforeTo: aTask.to && aTask.to > time ? Common.stringDate(aTask.to - time) : '',
            afterTo: aTask.to && aTask.to < time ? Common.stringDate(time - aTask.to) : '',
            allTime: aTask.from && aTask.to ? Common.stringDate(aTask.to - aTask.from) : '',
            doneTime: aTask.done ? Common.stringDate(time - aTask.done) : '',
            createdTime: Common.stringDate(time - aTask.created),
        };
    },
    getTaskInfoWeek(aTask, time) {
        const now = new Date();
        const date = new Date(time);
        const dateDone = new Date(aTask.done);
        const { addedMs, ms } = Common.getAddedMsAndMs(aTask.days, date.getDay(), time, (val, date) => val !== date.getDay());

        return {
            isDone: Boolean(aTask.done) && dateDone.getFullYear() === now.getFullYear() && dateDone.getMonth() === now.getMonth() && dateDone.getDate() === now.getDate()
                && aTask.days.includes(now.getDay()),
            canSetDone: aTask.days.includes(now.getDay()),
            createdAsString: Common.toDate(aTask.created),
            fromAsString: aTask.days.length === 0 ? ''
                : Common.toDate(Math.floor((date.getTime() - new Date().getTimezoneOffset() * 60 * 1000) / (24 * 60 * 60 * 1000)) * 24 * 60 * 60 * 1000
                    + addedMs + aTask.fromTime + new Date().getTimezoneOffset() * 60 * 1000),
            toAsString: aTask.days.length === 0 ? ''
                : Common.toDate(Math.floor((date.getTime() - new Date().getTimezoneOffset() * 60 * 1000) / (24 * 60 * 60 * 1000)) * 24 * 60 * 60 * 1000
                    + addedMs + aTask.fromTime + aTask.length + new Date().getTimezoneOffset() * 60 * 1000),
            doneAsString: Common.toDate(aTask.done),
            beforeFrom: aTask.days.length === 0 ? ''
                : addedMs !== 0 || aTask.fromTime > ms ? Common.stringDate(addedMs + aTask.fromTime - ms) : '',
            afterFrom: aTask.days.length === 0 ? ''
                : addedMs === 0 && aTask.fromTime < ms ? Common.stringDate(ms - aTask.fromTime) : '',
            beforeTo: aTask.days.length === 0 ? ''
                : addedMs !== 0 || aTask.fromTime + aTask.length > ms ? Common.stringDate(addedMs + aTask.fromTime + aTask.length - ms) : '',
            afterTo: aTask.days.length === 0 ? ''
                : addedMs === 0 && aTask.fromTime + aTask.length < ms ? Common.stringDate(ms - aTask.fromTime - aTask.length) : '',
            allTime: aTask.length ? Common.stringDate(aTask.length) : '',
            doneTime: aTask.done ? Common.stringDate(time - aTask.done) : '',
            createdTime: Common.stringDate(time - aTask.created),
        };
    },
    getTaskInfoMonth(aTask, time) {
        const now = new Date();
        const date = new Date(time);
        const dateDone = new Date(aTask.done);
        const { addedMs, ms } = Common.getAddedMsAndMs(aTask.dates, date.getDate(), time, (val, date) => val !== date.getDate());

        return {
            isDone: Boolean(aTask.done) && dateDone.getFullYear() === now.getFullYear() && dateDone.getMonth() === now.getMonth() && dateDone.getDate() === now.getDate()
                && aTask.dates.includes(now.getDate()),
            canSetDone: aTask.dates.includes(now.getDate()),
            createdAsString: Common.toDate(aTask.created),
            fromAsString: aTask.dates.length === 0 ? ''
                : Common.toDate(Math.floor((date.getTime() - new Date().getTimezoneOffset() * 60 * 1000) / (24 * 60 * 60 * 1000)) * 24 * 60 * 60 * 1000
                    + addedMs + aTask.fromTime + new Date().getTimezoneOffset() * 60 * 1000),
            toAsString: aTask.dates.length === 0 ? ''
                : Common.toDate(Math.floor((date.getTime() - new Date().getTimezoneOffset() * 60 * 1000) / (24 * 60 * 60 * 1000)) * 24 * 60 * 60 * 1000
                    + addedMs + aTask.fromTime + aTask.length + new Date().getTimezoneOffset() * 60 * 1000),
            doneAsString: Common.toDate(aTask.done),
            beforeFrom: aTask.dates.length === 0 ? ''
                : addedMs !== 0 || aTask.fromTime > ms ? Common.stringDate(addedMs + aTask.fromTime - ms) : '',
            afterFrom: aTask.dates.length === 0 ? ''
                : addedMs === 0 && aTask.fromTime < ms ? Common.stringDate(ms - aTask.fromTime) : '',
            beforeTo: aTask.dates.length === 0 ? ''
                : addedMs !== 0 || aTask.fromTime + aTask.length > ms ? Common.stringDate(addedMs + aTask.fromTime + aTask.length - ms) : '',
            afterTo: aTask.dates.length === 0 ? ''
                : addedMs === 0 && aTask.fromTime + aTask.length < ms ? Common.stringDate(ms - aTask.fromTime - aTask.length) : '',
            allTime: aTask.length ? Common.stringDate(aTask.length) : '',
            doneTime: aTask.done ? Common.stringDate(time - aTask.done) : '',
            createdTime: Common.stringDate(time - aTask.created),
        };
    },
    getTaskInfo(aTask, time) {
        switch (aTask.type) {
            case 'common':
                return Common.getTaskInfoCommon(aTask, time);
            case 'period':
                return Common.getTaskInfoPeriod(aTask, time);
            case 'week':
                return Common.getTaskInfoWeek(aTask, time);
            case 'month':
                return Common.getTaskInfoMonth(aTask, time);
            default:
                return {};
        }
    },
    makeItem(params = {}) {
        return {
            title: params.title || '',
            description: params.description || '',
            done: params.done || 0,
            created: params.created || Date.now(),
        };
    },
    makeLink(params = {}) {
        return {
            title: params.title || '',
            href: params.href || '',
        };
    },
    makeBoard(params = {}) {
        return {
            title: params.title || '',
            description: params.description || '',
            id: params.id || Common.makeGuid(),
            tags: params.tags ? params.tags.concat() : [],
            created: params.created || Date.now(),
        };
    },
    stringDate(number, offset = 1, numberOfParts = 2) {
        const parts = [];
        const dividers = [
            { value: 1000, postfix: ['милисекунда', 'милисекунды', 'милисекунд'] },
            { value: 60, postfix: ['секунда', 'секунды', 'секунд'] },
            { value: 60, postfix: ['минута', 'минуты', 'минут'] },
            { value: 24, postfix: ['час', 'часа', 'часов'] },
            { value: 30, postfix: ['день', 'дня', 'дней'] },
            { value: 12, postfix: ['месяц', 'месяца', 'месяцев'] },
            { value: 1000, postfix: ['год', 'года', 'лет'] }
        ];
        for (let i = 0; i < dividers.length; i++) {
            const val = number % dividers[i].value;
            if (val) {
                if (val === 1 || val > 11 && (val - 11) % 10 === 0) {
                    parts.push(val + ' ' + dividers[i].postfix[0]);
                } else if (val === 2 || val === 3 || val === 4 || val > 12 && (val - 12) % 10 === 0 || val > 13 && (val - 13) % 10 === 0 || val > 14 && (val - 14) % 10 === 0) {
                    parts.push(val + ' ' + dividers[i].postfix[1]);
                } else {
                    parts.push(val + ' ' + dividers[i].postfix[2]);
                }
            } else {
                parts.push('');
            }
            number = number / dividers[i].value | 0;
        }

        return parts.slice(offset).reverse().filter(Boolean).slice(0, numberOfParts).join(' ').trim();
    },
    toDate(number) {
        return number ? new Date(number - new Date().getTimezoneOffset() * 60 * 1000).toISOString().replace('T', ' ').replace(/\..+$/, '') : '';
    }
};

module.exports = Common;