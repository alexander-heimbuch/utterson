/* eslint-env node */
'use strict';

/**
 * UTTERSON
 * Flexible static blog generator
 * @author Alexander Heimbuch (alex@zusatzstoff.org)
 * @version 0.1.0
 */

var architect = require('./pipe/architect'),
    tinsmith = require('./pipe/tinsmith'),
    aggregator = require('./aggregators'),
    generator = require('./generators');

module.exports = function (options) {
    // Drain the pipe
    return architect.initializeConfig(options)
        .then(tinsmith.defaultCategories)
        .then(architect.loadCustoms)
        .then(tinsmith.getPosts)
        .then(tinsmith.getPages)
        .then(tinsmith.getStatics)
        .then(aggregator)
        .then(generator);
};

