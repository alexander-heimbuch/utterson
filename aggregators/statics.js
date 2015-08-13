/* eslint-env node */
'use strict';

/**
 * STATICS AGGREGATOR
 * Resolves content from static files
 */

var _ = require('lodash'),
    path = require('path'),
    Bluebird = require('bluebird'),
    fs = Bluebird.promisifyAll(require('fs-extra'));

module.exports = function (base, statics) {
    var staticFiles = {};

    _.forEach(statics.files, function (file) {
        staticFiles[file] = fs.readFileAsync(path.resolve(base, file));
    });

    return Bluebird.props(staticFiles)
        .then(function (staticFiles) {
            return Bluebird.resolve(_.extend(staticFiles, statics));
        });
};
