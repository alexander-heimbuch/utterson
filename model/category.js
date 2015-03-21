/**
 * UTTERSON - category model
 */
var _ = require('lodash'),
    Bluebird = require('bluebird'),
    validFile = require('../lib/file-validator'),

    config = require('../config'),
    path = require('path'),
    fs = require('fs'),

    postModel = require('./post'),
    category = {};

module.exports = (function () {
    'use strict';
    /**
     * Retrieve posts from a category
     * @param  {String} categoryPath Path to the category
     * @return {Array}               Filename and Filepath
     */
    var getCategoryFiles = function (categoryPath) {
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
        }

        return category[name];
    };
})();
