/* eslint-env node */
'use strict';

/**
 * POSTS GENERATOR
 * Calls the given template with every post
 */

var _ = require('lodash'),
    winston = require('winston'),
    path = require('path'),
    plumber = require('../pipe/plumber'),
    Bluebird = require('bluebird'),
    fileWriter = require('../tools/file-writer');

module.exports = function (pipe, template) {
    var posts = plumber.filter(pipe.content, 'posts'),
        taskStack = [];

    var generate = function (post) {
        if (post === undefined || post.parentDir === undefined || post.name === undefined) {
            winston.error('Post Generator:', 'Missing information for post', post);
            return Bluebird.resolve(pipe);
        }

        return new Bluebird(function (resolve) {
            winston.info('Post Generator:', 'writing', post.name);

            template(post, function (file, content) {
                fileWriter
                    .prefix(path.resolve(pipe.buildDir, post.parentDir))
                    .add(file, content)
                    .run()
                    .then(function () {
                        resolve(pipe);
                    });
            });
        });
    };

    _.forEach(posts, function (post) {
        taskStack.push(generate(post));
    });

    return Bluebird.all(taskStack).return(pipe);
};
