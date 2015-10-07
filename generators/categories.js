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
        if (name === undefined || content === undefined) {
            winston.error('CategoryGenerator:', 'Missing information for category with path', name, 'and content', content);
            return Bluebird.resolve(pipe);
        }

        return new Bluebird(function (resolve) {
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

    if (categories === undefined) {
        return Bluebird.resolve(pipe);
    }

    _.forEach(categories, function (content, name) {
        taskStack.push(generate(name, content));
    });

    return Bluebird.all(taskStack).return(pipe);
};
