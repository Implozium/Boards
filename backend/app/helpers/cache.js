/**
 * Реализует класс для кеширования
 */
class Cache {
    /**
     * 
     * @param {object} options объект опций
     * @param {number=} options.maxKeys максимальное количество ключей
     */
    constructor(options = {}) {
        this.cache = new Map();
    }
    /**
     * Устанавливает значение записи `data` по ключу `key` в кеш
     * @param {string} key ключ
     * @param {*} data значение, которое с помощью JSON.stringify заносится в кеш
     * @param {object} params объект опций
     * @param {number=} params.expiresIn срок действия ключа
     * @return {Promise.<Cache>} промис который разрешиться при добавлении значения ключа с текущим кешем
     */
    set(key, data, params = {}) {
        console.log('cache set', key);
        this.cache.set(key, JSON.stringify({
            data,
            to: !isNaN(Number(params.expiresIn)) ? Date.now() + Number(params.expiresIn) : Number.MAX_SAFE_INTEGER,
        }));
        return Promise.resolve(this);
    }
    /**
     * Получает значение по ключу `key` из кеша
     * @param {string} key ключ
     * @return {Promise.<*>} промис который разрешиться значение ключа с помощью JSON.parse или undefined если значения по ключу нет
     *  или истекло время жизни ключа
     */
    get(key) {
        const row = this.cache.get(key);
        if (!row) {
            return Promise.resolve(undefined);
        }
        const { data, to } = JSON.parse(row);
        if (to < Date.now()) {
            this.cache.delete(key);
            return Promise.resolve(undefined);
        }
        if (data) {
            console.log('cache get', key);
        }
        return Promise.resolve(data);
    }
    /**
     * Удаляет значение по ключу `key` из кеша
     * @param {string} key ключ
     * @return {Promise.<Cache>} промис который разрешиться при добавлении значения ключа с текущим кешем
     */
    delete(key) {
        this.cache.delete(key);
        return Promise.resolve(this);
    }
}

module.exports = new Cache();