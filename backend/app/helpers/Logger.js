const fs = require('fs');

class Logger {
    constructor({ filename = '' }) {
        this.pathToFile = '';
        if (typeof process.app.modules['logger-conf'] != 'undefined' && typeof process.app.modules['logger-conf']['custom_log_dir'] != 'undefined') {
            this.pathToFile = __dirname + process.app.modules['logger-conf']['custom_log_dir'] + filename + '.log';
        } else {
            this.pathToFile = __dirname + '/../../../sma/' + filename + '.log';
        }
        this.buffers = Array.from({ length: 2 }, () => []);
        this.currentIndexOfBuffer = 0;
        this.maxLength = 100;

        this.file = fs.createWriteStream(this.pathToFile, { flags: 'a' });
    }

    write(str) {
        this.buffers[this.currentIndexOfBuffer].push(str);
        if (this.buffers[this.currentIndexOfBuffer].length > this.maxLength) {
            this.setNextBuffer();
        }
    }

    setNextBuffer() {
        this.currentIndexOfBuffer = (this.currentIndexOfBuffer + 1) % this.buffers.length;
    }

    flush() {
        const i = this.currentIndexOfBuffer;
        this.setNextBuffer();

    }
}