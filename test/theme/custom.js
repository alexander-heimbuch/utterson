/* eslint-env node */
'use strict';

module.exports = function (pipe, done) {
    var style = {
        dest: 'styles/style.css',
        content: 'body {background: black; color: white;}'
    };

    done([style]);
};
