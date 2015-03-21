/**
 * UTTERSON - file validator
 */

var mime = require('mime');

module.exports = (function () {
    return function (file) {
        if (mime.lookup(file) === 'text/x-markdown') {
            return true;
        }

        return false;
    };
})();
