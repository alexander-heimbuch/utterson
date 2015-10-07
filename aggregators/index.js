/* eslint-env node */
'use strict';

var winston = require('winston'),
    path = require('path'),
    _ = require('lodash'),
    Bluebird = require('bluebird'),

    posts = require('./posts'),
    pages = require('./pages'),
    statics = require('./statics'),
    categories = require('./categories');

module.exports = function (pipe) {
    _.forEach(pipe.content, function (content, index) {
        var contentPath = path.resolve(pipe.contentDir, index);

        switch (content.type) {
        case 'posts':
            pipe.content[index] = posts(contentPath, content, index);
            break;
        case 'pages':
            pipe.content[index] = pages(contentPath, content, index);
            break;
        case 'statics':
            pipe.content[index] = statics(contentPath, content, index);
            break;
        default:
            winston.info('Unknown or undefined content type for', index);
        }
    });

    return Bluebird.props(pipe.content)
        .then(categories)
        .then(function (resolvedContent) {
            pipe.content = resolvedContent;
            return Bluebird.resolve(pipe);
        });
};
