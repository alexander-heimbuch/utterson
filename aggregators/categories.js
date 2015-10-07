/* eslint-env node */
'use strict';

/**
 * CATEGORY AGGREGATOR
 * Resolves content from post files
 * Builds startpage index
 * Builds category indexes
 * Sorts posts by publish date
 */

var _ = require('lodash'),
    Bluebird = require('bluebird'),
    plumber = require('../pipe/plumber');

var orderPosts = function (posts, order) {
        if (order === 'ASC') {
            return _.sortBy(posts, 'publish');
        }
        // Order DESC
        return  _.sortBy(posts, 'publish').reverse();
    },

    getAttributes = function (parent) {
        var ignoreAttributes = ['files', 'posts', 'indexed', 'order', 'type'];

        return  _.reduce(parent, function (result, attr, key) {
            if (ignoreAttributes.indexOf(key) > -1 || parent.files.indexOf(key) > -1) {
                return result;
            }

            result[key] = attr;
            return result;
        }, {});
    },

    categoriesIndex = function (content) {
        _.forEach(plumber.sieve(content, 'posts'), function (category) {
            if ((category.indexed !== undefined && category.indexed === false) || category['index.md'] !== undefined) {
                return;
            }

            category['index.md'] = _.merge({
                posts: orderPosts(_.map(category.files, function (file) {
                    return category[file];
                }), category.order)
            }, getAttributes(category));

            category.files.push('index.md');
        });

        return Bluebird.resolve(content);
    },

    startpageIndex = function (content) {
        var startpage = content['./'],
            posts = [];

        if (startpage === undefined || startpage['index.md'] !== undefined) {
            return Bluebird.resolve(content);
        }

        if (startpage.indexed !== undefined && startpage.indexed === false) {
            return Bluebird.resolve(content);
        }

        startpage['index.md'] = _.extend(getAttributes(startpage), {posts: posts});

        _.forEach(plumber.sieve(content, 'posts'), function (category) {

            if (category.indexed === false) {
                return;
            }

            _.forEach(category.files, function (file) {
                if (file === 'index.md') {
                    return;
                }
                posts.push(category[file]);
            });

            startpage['index.md'].posts = orderPosts(posts, startpage.order);
            startpage.files.push('index.md');
        });

        return Bluebird.resolve(content);
    };

module.exports = function (content) {
    return startpageIndex(content)
        .then(categoriesIndex);
};
