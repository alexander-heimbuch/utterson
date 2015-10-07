/* eslint-env node */
'use strict';

/**
 * PAGES AGGREGATOR
 * Resolves content from page files
 */

var _ = require('lodash'),
    path = require('path'),
    Bluebird = require('bluebird'),
    markdown = require('../tools/markdown'),
    plumber = require('../pipe/plumber');

module.exports = function (base, pages, folder) {
    var parsePages = function (base, pages) {
            var pagesContent = {};

            _.forEach(pages.files, function (page) {
                pagesContent[page] = markdown(path.resolve(base, page));
            });

            return Bluebird.props(pagesContent);
        },

        augmentData = function (pages) {
            return Bluebird.resolve(_.reduce(pages, function (results, page, key) {
                results[key] = _.extend(page, plumber.relatives(key, folder, 'page'));
                return results;
            }, {}));
        };

    return parsePages(base, pages)
        .then(augmentData)
        .then(function (resolvedPages) {
            return Bluebird.resolve(_.extend(pages, resolvedPages));
        });
};
