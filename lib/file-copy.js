/**
 * UTTERSON - attatchment tasks
 */

var moment = require('moment'),
    file = require('file'),
    path = require('path'),
    fs = require('fs-extra'),

    ignoredFolders = ['.git'],
    ignoredFiles = ['.gitignore', '.DS_STORE'];

module.exports = (function () {
    'use strict';

    var isValidFolder = function (folderPath) {
        return ignoredFolders.some(function (ignore) {
            if (folderPath.indexOf(ignore) > -1) {
                return false;
            }
            return true;
        });
    },

    isValidFile = function (fileName, allowed) {
        if (ignoredFiles.indexOf(fileName) > -1) {
            return false;
        }

        if (allowed === undefined) {
            return true;
        }

        return allowed.indexOf(path.extname(fileName)) > -1;
    };

    return function (source, destination, allowed, log) {
        log = log || new Function;

        var fileCopy = function (folder, files) {
            if (!isValidFolder(folder)) {
                return;
            }

            files.forEach(function (fileName) {
                if (!isValidFile(fileName, allowed)) {
                    return;
                }
                log(moment().format() + ' - Copying file ' + folder.replace(source, '') + path.sep + fileName);
                fs.copySync(folder + path.sep + fileName, destination + folder.replace(source, '') + path.sep + fileName, {
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
