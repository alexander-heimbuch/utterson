/**
 * UTTERSON
 * Flexible static blog generator
 * @author Alexander Heimbuch (alex@zusatzstoff.org)
 * @version 0.0.1
 */

var _ = require('lodash'),
    path = require('path'),
    uuid = require('node-uuid'),

    fileWriter = require('./lib/file-writer'),
    fileCopy = require('./lib/file-copy'),
    dirParser = require('./lib/directory-parser'),
    contentMerger = require('./lib/dir-merger'),
    logger = new Function,

    categoryModel,
    startpageModel,
    pageModel,
    postModel;

module.exports = (function () {
    'use strict';

    var files = [],
        template,
        src = path.resolve('.' + path.sep + uuid.v1()),
        dest,
        ignore;

    // Initial content merger dest
    contentMerger.dest(src);

    return {
        'logger': function (remoteLogger) {
            logger = remoteLogger;
        },

        'use': function (uttersonTemplate) {
            template = uttersonTemplate;
        },

        'add': contentMerger.add,

        'dist': function (destination) {
            dest = path.resolve(destination);
        },

        'ignore': function (ign) {
            ignore = ign;
        },

        'build': function () {
            if (template === undefined || dest === undefined) {
                return;
            }
            // Merge all sources to the src directory
            contentMerger.merge();

            pageModel = require('./model/page')(src);
            postModel = require('./model/post')(src);
            categoryModel = require('./model/category')(src);
            startpageModel = require('./model/startpage')(src);

            // Generate Categories
            _.forEach(dirParser.categories(src, ignore), function (categoryPath, categoryName) {
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
            _.forEach(dirParser.pages(src), function (pagePath, pageName) {
                var pageData = pageModel.getPage(pageName, pagePath);
                files.push(template.page(pageData, pageName));
            });

            // Enhance the files
            files = _.flatten(files, true);

            // Write the files
            fileWriter(dest, files, logger);

            // Copy all images
            fileCopy(src, path.resolve(dest), ['.jpg', '.JPG', '.png', '.PNG', '.pdf', '.PDF'], logger);

            // Copy all assets
            template.assets().forEach(function (asset) {
                fileCopy(asset.src, dest + path.sep + asset.dest, undefined, logger);
            });
        },

        'cleanUp': function () {
            contentMerger.cleanUp();
        }
    };
})();
