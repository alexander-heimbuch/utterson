/* eslint-env node */
'use strict';

/**
 * STATICS GENERATOR
 * Writes the static files to the corresponding build path
 */

var _ = require('lodash'),
    path = require('path'),
    plumber = require('../pipe/plumber'),
    fileWriter = require('../tools/file-writer');

module.exports = function (pipe) {
    var files = _.map(plumber.filter(pipe.content, 'statics'), function (file) {
        return {'dest': path.join(file.parentDir, file.name), 'content': file};
    });

    return fileWriter.prefix(pipe.buildDir).add(files).run().return(pipe);
};
