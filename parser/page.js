/**
 * UTTERSON - page parser
 */
var config = require('../config'),
    path = require('path'),
    fs = require('fs'),
    markdownParser = require('../lib//markdown-parser'),
    pages = {};

module.exports = (function () {
    'use strict';

    var parsePage = function (pageName, filePath) {
            var page = markdownParser(filePath, function (result) {
                return _.assign({
                    'base': '..',
                    'name': pageName,
                    'blog': config.blog,
                    'cover': '../' + config.blog.cover,
                    'url': '/' + filePath.replace(config.content, '').split(path.extname(filePath))[0]
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
