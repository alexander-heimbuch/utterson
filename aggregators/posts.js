/* eslint-env node */
'use strict';

/**
 * POSTS AGGREGATOR
 * Resolves content from post files
 * Augments posts with publish date
 */

var _ = require('lodash'),
    path = require('path'),
    Bluebird = require('bluebird'),
    markdown = require('../tools/markdown');

var parsePosts = function (base, posts) {
        return Bluebird.props(_.reduce(posts.files, function (result, post) {
            result[post] = markdown(path.resolve(base, post));
            return result;
        }, {}));
    },

    resolveDates = function (posts) {
        return Bluebird.resolve(_.reduce(posts, function (result, post, index) {
            if (post.publish === undefined) {
                post.publish = new Date('01-01-1970').getTime();
            } else {
                post.publish = new Date(post.publish).getTime();
            }

            result[index] = post;
            return result;
        }, {}));
    };

module.exports = function (base, posts) {
    return parsePosts(base, posts)
        .then(resolveDates)
        .then(function (resolvedPosts) {
            return Bluebird.resolve(_.extend(posts, resolvedPosts));
        });
};
