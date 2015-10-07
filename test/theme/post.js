/* eslint-env node */
'use strict';

module.exports = function (data, done) {
    var html =
        '<h1>' + data.title + '</h1>' +
        '<meta><author>' + data.author + '</author><date>' + data.publish + '</date></meta>' +
        '<div>' + data.content + '</div>';
    return done(data.name + '.html',  html);
};
