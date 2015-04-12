/**
 * UTTERSON - category model
 */
var _ = require('lodash'),
    Bluebird = require('bluebird'),
    validFile = require('../lib/file-validator'),

    path = require('path'),
    fs = require('fs'),
    index;

module.exports = (function () {
    'use strict';

    return function (src) {
        var postModel = require('./post')(src);

        return function () {
            if (index === undefined) {
                index = {
                    'base': '../',
                    'posts': postModel.getAll()
                };

                index.posts.sort(function (a, b) {
                    var dateA = Date.parse(a.publish),
                        dateB = Date.parse(b.publish);

                    if (dateA > dateB) {
                        return -1;
                    }

                    if (dateA < dateB) {
                        return 1;
                    }

                    return 0;
                });
            }

            return index;
        };
    };
})();
