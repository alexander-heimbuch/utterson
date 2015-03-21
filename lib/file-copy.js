/**
 * UTTERSON - attatchment tasks
 */

var file = require('file'),
    path = require('path'),
    fs = require('fs-extra');

module.exports = (function () {
    'use strict';

        return function (source, destination, allowed) {
            var fileCopy = function (folder, files) {

                files.forEach(function (src) {
                    if (allowed.indexOf(path.extname(src)) === -1) {
                        return;
                    }

                    fs.copy(folder + path.sep + src, destination + folder.replace(source, '') + path.sep + src, {
                        replace: false
                    });
                });
            };

            if (fs.statSync(source).isFile()) {
                fs.copy(source, destination, {
                    replace: false
                });
            } else {
                file.walkSync(source, function (folder, folders, files) {
                    fileCopy(folder, files);
                });
            }
        };
})();
