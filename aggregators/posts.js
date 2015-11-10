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
    markdown = require('../tools/markdown'),
    plumber = require('../pipe/plumber');

module.exports = function (base, posts, category) {
    var parsePosts = function () {
            return Bluebird.props(_.reduce(posts.files, function (result, post) {
                result[post] = markdown(path.resolve(base, post));

                return result;
            }, {}));
        },

        augmentData = function (postsContent) {
            var resolvedPosts = _.reduce(postsContent, function (result, post, key) {
                post.publish = (post.publish === undefined) ? new Date('01-01-1970') : new Date(post.publish);

                result[key] = _.merge(post, plumber.relatives(key, category, 'posts'), plumber.attributes(posts));
                return result;
            }, {});

            return Bluebird.resolve(resolvedPosts);
        };

    return parsePosts()
        .then(augmentData)
        .then(function (resolvedPosts) {
            return Bluebird.resolve(_.extend(posts, resolvedPosts));
        });
};
