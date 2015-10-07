/* eslint-env node */
'use strict';

var path = require('path'),
    Bluebird = require('bluebird'),
    startpage = require('./startpage'),
    categories = require('./categories'),
    posts = require('./posts'),
    pages = require('./pages'),
    statics = require('./statics'),
    custom = require('./custom');

module.exports = function (pipe) {
    var template = require(path.resolve(pipe.themesDir, pipe.theme)),
        tasks = [];

    // build categories
    if (template.category !== undefined) {
        tasks.push(categories(pipe, template.category));
    }

    // build posts
    if (template.post !== undefined) {
        tasks.push(posts(pipe, template.post));
    }

    // build pages
    if (template.page !== undefined) {
        tasks.push(pages(pipe, template.page));
    }

    // build statics
    tasks.push(statics(pipe));

    // build custom
    if (template.custom !== undefined) {
        tasks.push(custom(pipe, template.custom));
    }

    return Bluebird.all(tasks)
        .return(pipe)
        .then(function () {
            // build startpage
            if (template.startpage !== undefined || template.category !== undefined) {
                return startpage(pipe, template.startpage || template.category);
            }
            return Bluebird.resolve(pipe);
        }).return(pipe);
};
