/* eslint-env node */
'use strict';

/**
 * PIPE TINSMITH
 * Responsible for building the pipe
 * Give it form and file structure
 */

var _ = require('lodash'),
    path = require('path'),
    glob = require('glob-promise'),
    Bluebird = require('bluebird'),
    plumber = require('./plumber');

module.exports = {
    /**
     * Retrieve all categories from the contentDir (every directory in the root structure)
     * @param  {Object} pipe    Utterson pipe object
     * @return {Promise}        Promise resolving the extended pipe
     */
    defaultCategories: function (pipe) {
        return glob('*/', {cwd: pipe.contentDir})
            .then(function (categories) {
                categories.forEach(function (category) {
                    // Don't override already defined structures
                    if (pipe.content[category] !== undefined && pipe.content[category].type !== undefined) {
                        return;
                    }

                    pipe.content[category] = {
                        type: 'posts'
                    };
                });

                return Bluebird.resolve(pipe);
            });
    },

    /**
     * Retrieve all posts from the contentDir (markdown files within categories)
     * @param  {Object} pipe    Utterson pipe object
     * @return {Promise}        Promise resolving the extended pipe
     */
    getPosts: function (pipe) {
        var tasks = [];

        _.forEach(plumber.sieve(pipe.content, 'posts'), function (category, key) {
            tasks.push(glob('**/*.md', {cwd: path.resolve(pipe.contentDir, key)})
                .then(function (files) {
                    pipe.content[key].files = files;
                }));
        });

        return Bluebird.all(tasks).return(pipe);
    },

    /**
     * Retrieve all pages from the contentDir (markdown files within page folders)
     * @param  {Object} pipe    Utterson pipe object
     * @return {Promise}        Promise resolving the extended pipe
     */
    getPages: function (pipe) {
        var tasks = [];

        _.forEach(plumber.sieve(pipe.content, 'pages'), function (page, key) {
            tasks.push(glob('*.md', {cwd: path.resolve(pipe.contentDir, key)})
                .then(function (files) {
                    pipe.content[key].files = files;
                }));
        });

        return Bluebird.all(tasks).return(pipe);
    },

    /**
     * Retrieve all statics from the contentDir (all files within static folders)
     * @param  {Object} pipe    Utterson pipe object
     * @return {Promise}        Promise resolving the extended pipe
     */
    getStatics: function (pipe) {
        var tasks = [];

        _.forEach(plumber.sieve(pipe.content, 'statics'), function (file, key) {
            tasks.push(glob('**/*.*', {cwd: path.resolve(pipe.contentDir, key)})
                .then(function (files) {
                    pipe.content[key].files = files;
                }));
        });

        return Bluebird.all(tasks).return(pipe);
    }
};
