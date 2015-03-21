/**
 * UTTERSON - Model posts
 */

var _ = require('lodash'),
    Bluebird = require('bluebird'),
    path = require('path'),
    config = require('../config'),
    markdownParser = require('../lib/markdown-parser'),
    posts = {};

module.exports = (function () {
    'use strict';

    var parsePost = function (categoryName, filePath) {
            var post = markdownParser(filePath, function (result) {
                return _.assign({
                    'publish': new Date(result.publish).getTime(),
                    'base': '..',
                    'category': categoryName,
                    'name': path.basename(filePath, path.extname(filePath)),
                    'url': '/' + filePath.replace(config.source, '').split(path.extname(filePath))[0]
                }, result);
            });

            return post;
        },

        getPost = function (name, path) {
            if (posts[path] === undefined) {
                posts[path] = parsePost(name, path);
            }

            return posts[path];
        },

        getAll = function () {
            return _.map(posts, function (post) {
                return post;
            });
        };

    return {
        'getPost': getPost,
        'getAll': getAll
    };
})();
