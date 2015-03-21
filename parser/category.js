/**
 * UTTERSON - category model
 */
var _ = require('lodash'),
    Bluebird = require('bluebird'),
    validFile = require('../lib/file-validator'),

    config = require('../config'),
    path = require('path'),
    fs = require('fs'),
    markdownParser = require('./markdown-parser'),

    category = {};

module.exports = (function () {
    'use strict';
    /**
     * Retrieve posts from a category
     * @param  {String} categoryPath Path to the category
     * @return {Array}               Filename and Filepath
     */
    var getCategoryFiles = function (categoryPath) {
        return new Bluebird(function (resolve) {
            var files = [];

            fs.readdirSync(categoryPath).forEach(function (file) {
                var filePath = categoryPath + path.sep + file;

                if (validFile(filePath)) {
                    files.push(filePath);
                }
            });

            resolve(files);
        });

    },

    getCategoryPosts = function (files) {
        var posts = [];
        return new Bluebird(function (resolve) {
            //files.forEach()

            resolve(posts);
        });
    };
    /**
     * Factory for category
     * @param  {String} category     Name of the category
     * @param  {String} categoryPath Path to category files
     * @return {Array}               Array of posts
     */
    return function (category, categoryPath) {
        return getPosts(categoryPath).map(function (post) {
            return _.assign({
                'base': '..',
                'category': category,
                'name': path.basename(post.path, path.extname(post.path)),
                'blog': config.blog,
                'cover': '../' + config.blog.cover,
                'url': '/' + post.path.replace(config.content, '').split(path.extname(post.path))[0]
            }, markdownParser(post.path, function (result) {
                result.publish = new Date(result.publish).getTime();
                return result;
            }));
        });
    };

    return function (name, path) {
        if (category[name]) {
            return new BlueBird(function (resolve) {
                resolve(category[name]);
            });
        }

        return getCategoryFiles(path)
                .then(function (files) {
                    console.log(files);
                });
    };
})();
// Kategorie pfad auflösen
// Kategorie mit Daten aufbereiten
