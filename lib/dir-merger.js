var path = require('path'),
    fs = require('fs-extra'),
    rimraf = require('rimraf'),
    file = require('file'),
    fileCopy = require('./file-copy');

module.exports = (function () {
    'use strict';

    var mergeDirs = [],
        mergeDest;

    return {
        'dest': function (dest) {
            mergeDest = dest;
        },

        'add': function (dir, prefix) {
            if (dir === undefined) {
                return;
            }

            mergeDirs.push({
                'dir': dir,
                'prefix': prefix || ''
            });
        },

        'merge': function () {
            rimraf.sync(mergeDest);
            file.mkdirsSync(mergeDest);
            mergeDirs.forEach(function (merge) {
                fileCopy(merge.dir, mergeDest + path.sep + merge.prefix + path.sep);
            });
        },

        'cleanUp': function () {
            rimraf.sync(mergeDest);
        }
    }
})();
