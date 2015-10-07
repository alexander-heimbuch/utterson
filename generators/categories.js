/* eslint-env node */
'use strict';

/**
 * CATEGORIES GENERATOR
 * Calls the given theme for every existing category
 */

var _ = require('lodash'),
    winston = require('winston'),
    path = require('path'),
    plumber = require('../pipe/plumber'),
    Bluebird = require('bluebird'),
    fileWriter = require('../tools/file-writer');

module.exports = function (pipe, template) {
    var categories = plumber.sieve(pipe.content, 'posts'),
        taskStack = [];

    var generate = function (name, content) {
        return new Bluebird(function (resolve) {
            winston.info('Category Generator:', 'Writing', name);

            template(content, function (file, response) {
                fileWriter
                    .prefix(path.resolve(pipe.buildDir, name))
                    .add(file, response)
                    .run()
                    .then(function () {
                        resolve(pipe);
                    });
            });
        });
    };

    _.forEach(categories, function (content, name) {
        if (content['index.md'] === undefined) {
            return;
        }

        taskStack.push(generate(name, content['index.md']));
    });

    return Bluebird.all(taskStack).return(pipe);
};
