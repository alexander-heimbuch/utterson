/**
 * UTTERSON
 * Flexible static blog generator
 * @author Alexander Heimbuch (alex@zusatzstoff.org)
 * @version 0.0.1
 */

var _ = require('lodash'),
    fileWriter = require('./lib/file-writer'),
    fileCopy = require('./lib/file-copy'),

    categoryModel = require('./model/category'),
    pageModel = require('./model/page'),
    postModel = require('./model/post'),
    startpageModel = require('./model/startpage');

module.exports = (function () {
    'use strict';

    var files = [],
        template,
        src,
        dest;

    return {
        'use': function (uttersonTemplate) {
            template = uttersonTemplate;
        },

        'generate': function () {
            if (template === undefined || src === undefined || dest === undefined) {
                return;
            }

        }
    };

    return function (source, dist) {
        // Generate Categories
        _.forEach(config.categories, function (categoryPath, categoryName) {
            var categoryData = categoryModel(categoryName, categoryPath);
            files.push(template.index(categoryData, categoryName));
        });

        // Generate Index
        files.push(template.index(startpageModel()));

        // Generate Posts
        _.forEach(postModel.getAll(), function (post) {
            files.push(template.post(post));
        });

        // Generate Pages
        _.forEach(config.pages, function (pagePath, pageName) {
            var pageData = pageModel.getPage(pageName, pagePath);
            files.push(template.page(pageData, pageName));
        });

        // Enhance the files
        files = _.flatten(files, true);

        // Write the files
        fileWriter(path.resolve(dist), files);

        // Copy all images
        fileCopy(path.resolve(source), path.resolve(dist), ['.jpg', '.JPG', '.png', '.PNG', '.pdf', '.PDF']);

        // Copy all assets
        template.assets().forEach(function (asset) {
            fileCopy(asset.src, path.resolve(dist) + asset.dest);
        });
    };
})();