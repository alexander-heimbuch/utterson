/* eslint-env node */
'use strict';

/**
 * STATICS AGGREGATOR
 * Resolves content from static files
 */

var _ = require('lodash'),
    path = require('path'),
    Bluebird = require('bluebird'),
    fs = Bluebird.promisifyAll(require('fs-extra')),
    plumber = require('../pipe/plumber');

module.exports = function (base, statics, folder) {
    var parseStatics = function (base, statics) {
            var staticFiles = {};

            _.forEach(statics.files, function (file) {
                staticFiles[file] = fs.readFileAsync(path.resolve(base, file));
            });

            return Bluebird.props(staticFiles);
        },

        augmentData = function (statics) {
            return Bluebird.resolve(_.reduce(statics, function (results, staticFile, key) {
                results[key] = _.extend(staticFile, plumber.relatives(key, folder, 'static'));
                return results;
            }, {}));
        };

    return parseStatics(base, statics)
        .then(augmentData)
        .then(function (staticFiles) {
            return Bluebird.resolve(_.extend(staticFiles, statics));
        });
};
