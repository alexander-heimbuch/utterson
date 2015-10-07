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
        if (post === undefined || post.parent === undefined) {
            winston.error('CategoryGenerator:', 'Missing information for post', post);
            return Bluebird.resolve(pipe);
        }

        return new Bluebird(function (resolve) {
            template(post, function (file, content) {
                fileWriter
                    .prefix(path.resolve(pipe.buildDir, post.parent))
                    .add(file, content)
                    .run()
                    .then(function () {
                        resolve(pipe);
                    });
            });
        });
    };

    if (posts === undefined) {
        return Bluebird.resolve(pipe);
    }

    _.forEach(posts, function (post) {
        taskStack.push(generate(post));
    });

    return Bluebird.all(taskStack).return(pipe);
};
