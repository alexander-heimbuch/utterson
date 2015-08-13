/* eslint-env node */
'use strict';

/**
 * CUSTOM GENERATOR
 * Calls the given template with the full pipe
 */

var Bluebird = require('bluebird'),
    fileWriter = require('../tools/file-writer');

module.exports = function (pipe, template) {
    return new Bluebird(function (resolve) {
        template(pipe, function (file, content) {
            fileWriter
                .prefix(pipe.buildDir)
                .add(file, content)
                .run()
                .then(function () {
                    resolve(pipe);
                });
        });
    });
};
