/* eslint-env node */
'use strict';

var body = require('./body');

module.exports = function (data, done) {
    var html =
        '<h1>' + data.title + '</h1>' +
        '<div>' + data.content + '</div>';

    return done(data.name + '.html',  body(html));
};
