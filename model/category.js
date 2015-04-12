/**
 * UTTERSON - category model
 */
var _ = require('lodash'),
    Bluebird = require('bluebird'),
    validFile = require('../lib/file-validator'),

    path = require('path'),
    fs = require('fs'),
    category = {};

module.exports = (function () {
    'use strict';

    return function (src) {
        var postModel = require('./post')(src),

            /**
             * Retrieve posts from a category
             * @param  {String} categoryPath Path to the category
             * @return {Array}               Filename and Filepath
             */
            getCategoryFiles = function (categoryPath) {
                var files = [];

                fs.readdirSync(categoryPath).map(function (file) {
                    var filePath = categoryPath + path.sep + file;
                    if (validFile(filePath)) {
                        files.push(filePath);
                    }
                });

                return files;
            },

            collectPosts = function (name, post) {
                category[name].posts.push(post);
            };

        return function (name, categoryPath) {
            if (category[name] === undefined) {
                category[name] = {
                    'base': '../',
                    'name': name,
                    'posts': []
                };

                _.forEach(getCategoryFiles(categoryPath), function (file) {
                    collectPosts(name, postModel.getPost(name, file));
                });

                category[name].posts.sort(function (a, b) {
                    var dateA = Date.parse(a.publish),
                        dateB = Date.parse(b.publish);

                    if (dateA > dateB) {
                        return -1;
                    }

                    if (dateA < dateB) {
                        return 1;
                    }

                    return 0;
                });
            }

            return category[name];
        };
    };
})();
