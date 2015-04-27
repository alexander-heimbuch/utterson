/**
 * UTTERSON - file writer
 */

var fs = require('fs'),
    moment = require('moment'),
    path = require('path'),
    rimraf = require('rimraf'),
    file = require('file');

module.exports = (function () {
    'use strict';

    var createDirectory = function (filePath) {
        if (fs.existsSync(filePath)) {
            return;
        }
        file.mkdirsSync(path.dirname(filePath));
    },

    purgeDirectory = function (dir) {
        fs.readdirSync(dir).forEach(function (purgeFile) {
            if (purgeFile === '.git' || purgeFile === '.gitignore') {
                return;
            }

            purgeFile = path.resolve(dir, purgeFile);

            if (fs.statSync(purgeFile).isDirectory()) {
                rimraf.sync(purgeFile);
            } else {
                fs.unlinkSync(purgeFile);
            }
        });
    };

    return function (destination, files, log) {
        log = log || new Function;

        // Purge dist directory
        if (fs.existsSync(destination)) {
            purgeDirectory(destination);
        } else {
            file.mkdirsSync(destination);
        }

        files.forEach(function (file) {
            if (file === undefined || file.path === undefined) {
                return;
            }
            try {
                log(moment().format() + ' - Writing file ' + file.path);
                fs.writeFileSync(destination + path.sep + file.path, file.content);
            } catch (error) {
                switch (error.errno) {
                case -2:
                case 34:
                    log(moment().format() + ' - Creating directory ' + file.path);
                    createDirectory(destination + path.sep + file.path);
                    fs.writeFileSync(destination + path.sep + file.path, file.content);
                    break;
                }
            }
        });
    }

})();
