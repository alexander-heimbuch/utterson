/* eslint-env node */
'use strict';

/**
 * PAGES GENERATOR
 * Calls the given template for every page
 */

var _ = require('lodash'),
    path = require('path'),
    winston = require('winston'),
    Bluebird = require('bluebird'),
    fileWriter = require('../tools/file-writer'),
    plumber = require('../pipe/plumber');

module.exports = function (pipe, template) {
    var pages = plumber.filter(pipe.content, 'pages'),
        taskStack = [];

    var generate = function (page) {
        if (page === undefined || page.parentDir === undefined || page.name === undefined) {
            winston.error('Post Generator:', 'Missing information for post', page);
            return Bluebird.resolve(pipe);
        }

        return new Bluebird(function (resolve) {
            winston.info('Page Generator:', 'writing', page.name);

            template(page, function (file, content) {
                fileWriter
                    .prefix(path.resolve(pipe.buildDir, page.parentDir))
                    .add(file, content)
                    .run()
                    .then(function () {
                        resolve(pipe);
                    });
            });
        });
    };

    _.forEach(pages, function (page) {
        taskStack.push(generate(page));
    });

    return Bluebird.all(taskStack).return(pipe);
};
