const fs = require('fs');

module.exports = {
    /**
     * Читает JSON из файла и если файла нет, то возвращает пустой объект
     * @param {string} filename путь к файлу
     * @param {*} def значение по умолчанию
     * @return {Promise.<*>} промис который разрешиться когда произведется чтение из файла
     */
    load(filename, def = {}) {
        return new Promise((res, rej) => {
            if (fs.existsSync(filename)) {
                return fs.readFile(filename, 'utf-8', (err, file) => err ? rej(err) : res(JSON.parse(file)));
            }
            return res(def);
        });
    },

    /**
     * Пишет данные в виде JSON в файл
     * @param {string} filename путь к файлу
     * @param {*} data данные
     * @return {Promise.<boolean>} промис который разрешиться когда произведется запись в файла
     */
    save(filename, data) {
        return new Promise((res, rej) => {
            return fs.writeFile(filename, JSON.stringify(data, null, 4), 'utf-8', err => err ? rej(err) : res(true));
        });
    }
};