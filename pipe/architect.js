/* eslint-env node */
'use strict';

/**
 * PIPE ARCHITECT
 * Responsible for creating the concept of the piping system
 * Reads and writes the config as well as custom options
 */

var _ = require('lodash'),
    Bluebird = require('bluebird'),
    plumber = require('./plumber'),
    defaults = require('../defaults');

var config;

module.exports = {
    initializeConfig: function (options) {
        config = options || {};

        return Bluebird.resolve({
            contentDir: plumber.path(defaults, 'contentDir', config),
            buildDir:   plumber.path(defaults, 'buildDir', config),
            themesDir:  plumber.path(defaults, 'themesDir', config),
            theme:      (config === undefined) ? defaults.theme : config.theme || defaults.theme,
            // content will be extended by the specific pipeline function
            baseUrl:   (config === undefined) ? defaults.baseUrl : config.baseUrl || defaults.baseUrl,
            content:    {}
        });
    },

    loadCustoms: function (pipe) {
        pipe.content = _.merge(pipe.content, defaults.content, config.content);
        return Bluebird.resolve(pipe);
    }
};
