/* eslint-env node */
'use strict';

module.exports = function (post) {
    return '<section>' +
                '<h3>' + post.title + '</h3>' +
                '<meta><author>' + post.author + '</author><date>' + post.publish + '</date></meta>' +
                '<div>' + post.teaser + '</div>' +
            '</section>';
}
