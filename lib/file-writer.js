/**
 * UTTERSON - file writer
 */

module.exports = (function () {
    'use strict';

    var fs = require('fs'),
        path = require('path'),
        rimraf = require('rimraf'),
        file = require('file'),

        createDirectory = function (filePath) {
            if (fs.existsSync(filePath)) {
                return;
            }
            file.mkdirsSync(path.dirname(filePath));
        };

    return function (destination, files) {
        // Purge dist directory
        rimraf.sync(destination);
        file.mkdirsSync(destination);

        files.forEach(function (file) {
            if (file === undefined || file.path === undefined) {
                return;
            }
            try {
                fs.writeFileSync(destination + file.path, file.content);
            } catch (error) {
                switch (error.errno) {
                    case -2:
                    case 34:
                        createDirectory(destination + file.path);
                        fs.writeFileSync(destination + file.path, file.content);
                    break;
                }
            }
        });
    }

})();
