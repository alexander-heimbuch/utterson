/* eslint-env node */
'use strict';

var _ = require('lodash'),
    body = require('./body'),
    singlePost = require('./partials/post');

module.exports = function (data, done) {
    var posts = _.reduce(data.posts, function (result, post) {
        if (_.isString(result) === false) {
            result = '';
        }

        result += singlePost(post);
        return result;
    });

    return done('index.html', body(posts));
};
