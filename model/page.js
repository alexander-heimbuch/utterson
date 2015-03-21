/**
 * UTTERSON - page parser
 */
var _ = require('lodash'),
    config = require('../config'),
    path = require('path'),
    fs = require('fs'),
    mime = require('mime'),
    markdownParser = require('../lib/markdown-parser'),
    pages = {};

module.exports = (function () {
    'use strict';

    var parsePage = function (pageName, filePath) {
            var page = markdownParser(filePath, function (result) {
                return _.assign({
                    'base': '..',
                    'name': pageName,
                    'url': '/' + filePath.replace(config.source, '').split(path.extname(filePath))[0]
                }, result);
            });

            return page;
        },

        getPage = function (pageName, filePath) {
            if (pages[filePath] === undefined) {
                pages[filePath] = parsePage(pageName, filePath);
            }

            return pages[filePath];
        },

        getAll = function () {
            return _.map(pages, function (page) {
                return page;
            });
        };

    return {
        'getPage': getPage,
        'getAll': getAll
    }
})();
