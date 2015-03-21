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
    index;

module.exports = (function () {
    'use strict';

    return function () {
        if (index === undefined) {
            index = {
                'base': '../',
                'posts': postModel.getAll()
            };
        }

        return index;
    };
})();
