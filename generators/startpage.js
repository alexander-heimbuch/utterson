/* eslint-env node */
'use strict';

/**
 * STARTPAGE GENERATOR
 * Calls the given template with startpage data
 */

var Bluebird = require('bluebird'),
    fileWriter = require('../tools/file-writer');

module.exports = function (pipe, template) {
    var startpage = pipe.content;

    if (startpage === undefined || startpage['./'] === undefined || startpage['./']['index.md'] === undefined) {
        return Bluebird.resolve(pipe);
    }

    return new Bluebird(function (resolve) {
        template(startpage['./']['index.md'], function (file, content) {
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
