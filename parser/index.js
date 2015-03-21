/**
 * UTTERSON Generator
 * Converting markdown files to js data
 * @author Alexander Heimbuch (alex@zusatzstoff.org)
 * @version 0.0.1
 */

var _ = require('lodash'),
    config = require('../config'),
    categoryParser = require('./category'),
    pageParser = require('./page'),

    // Parse the categories
    getCategory = function (category) {
        var request,
            posts;

        if (config.categories[category] === undefined) {
            request = config.categories;
        } else {
            // We need an array to keep the result consistent
            request = [config.categories[category]];
        }

        return _.reduce(request, function (result, path, category) {
            var categoryData = categoryParser(category, path);
            // Order DESC
            categoryData = _.sortBy(categoryData, 'publish').reverse();

            result[category] = {
                'posts': categoryData,
                'blog': config.blog,
                'baseUrl': '../'
            };

            return result;
        }, {});
    },

    // Parse the index
    getIndex = function () {
        var posts = _.map(getCategory(), function (category) {
            return category.posts;
        }, {});

        // Order DESC
        posts = _.sortBy(_.flatten(posts, true), 'publish').reverse();

        return {
            'baseUrl': './',
            'posts': posts.sort(config.order.sort),
            'blog': config.blog
        };
    },

    // Parse all pages
    getPage = function (page) {
        var request, pages;

        if (config.pages[page] === undefined) {
            request = config.pages;
        } else {
            // We need an array to keep the result consistent
            request = [config.pages[page]];
        }

        pages = _.reduce(request, function (result, path, page) {
            result[page] = pageParser(page, path);
            return result;
        }, {});

        return {
            'baseUrl': './',
            'pages': pages,
            'blog': config.blog
        }
    };

module.exports = (function () {
    'use strict';

    return {
        'index': getIndex,
        'category': getCategory,
        'categories': getCategory,
        'page': getPage
    };

})();
