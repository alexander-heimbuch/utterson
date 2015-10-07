/* eslint-env node */
'use strict';

/**
 * PAGES AGGREGATOR
 * Resolves content from page files
 */

var _ = require('lodash'),
    path = require('path'),
    Bluebird = require('bluebird'),
    markdown = require('../tools/markdown');

module.exports = function (base, pages) {
    var pagesContent = {};

    _.forEach(pages.files, function (page) {
        pagesContent[page] = markdown(path.resolve(base, page));
    });

    return Bluebird.props(pagesContent)
        .then(function (pagesContent) {
            return Bluebird.resolve(_.extend(pages, pagesContent));
        });
};
