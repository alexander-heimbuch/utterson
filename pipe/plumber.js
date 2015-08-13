/* eslint-env node*/
'use strict';

/**
 * PIPE PLUMBER
 * Responsible for fixing leaks and providing shortcuts to the pipe
 * Easy access to pipe content
 */

var _ = require('lodash'),
    path = require('path');

module.exports = {
    /**
     * Retrieving a resolved path from defaults or custom options
     * @param  {Object} defaults    Fallback options
     * @param  {String} attr        Attribute to be resolved
     * @param  {Object} custom      Custom options
     * @return {String}             Resolved path from custom options or default if undefined
     */
    path: function (defaults, attr, custom) {
        var resolvedPath;

        if (defaults === undefined || defaults[attr] === undefined) {
            throw new Error('Missing Parameter', 'Expect a given defaults object');
        }

        if (attr === undefined) {
            throw new Error('Missing Parameter', 'Expect a given attribute');
        }

        if (custom === undefined || custom[attr] === undefined) {
            resolvedPath = path.resolve(defaults[attr]);
        } else {
            resolvedPath = path.resolve(custom[attr]);
        }

        return resolvedPath;
    },

    /**
     * Sorts out a given type of content containers from the pipe
     * @param  {Object} content    Pipe content
     * @param  {String} type       Type of content to sort out (e.g. Pages, Posts or Statics)
     * @return {Object}            Object containing only content containers from a given type
     */
    sieve: function (content, type) {
        var results = {};

        if (content === undefined) {
            return results;
        }

        _.forEach(content, function (element, key) {
            if (element === undefined || element.type === undefined || element.type !== type) {
                return;
            }

            results[key] = element;
        });

        return results;
    },

    /**
     * Filters a given type of content files from the pipe
     * @param  {Object} content    Pipe content
     * @param  {String} type       Type of content to sort out (e.g. Pages, Posts or Statics)
     * @return {Array}             Object containing single content files from a given type
     */
    filter: function (content, type) {
        var results = [];

        if (content === undefined) {
            return results;
        }

        _.forEach(content, function (element, key) {
            if (element === undefined || element.type === undefined || element.type !== type) {
                return;
            }

            _.forEach(element.files, function (file) {
                var fragment = element[file],
                    fileDetails = path.parse(file);

                // filter collection of posts, these are commonly category fragments
                if (fragment === undefined || fragment.posts !== undefined) {
                    return;
                }

                _.extend(fragment, {
                    name: path.join(fileDetails.dir, fileDetails.name),
                    parent: key
                });

                results.push(fragment);
            });
        });

        return results;
    }
};