'use strict';
var fs = require('fs'),
    path = require('path'),
    mime = require('mime');

module.exports = {

    'categories': function (source, ignore) {
        var categories = {};

        fs.readdirSync(source).map(function (file) {
            if (!fs.statSync(source + path.sep + file).isDirectory()) {
                return;
            }

            if (ignore.indexOf(file) > -1) {
                return;
            }

            categories[file] = path.resolve(source + path.sep + file);
        });

        return categories;
    },

    'pages': function (source) {
        var name,
            pages = {};

        fs.readdirSync(source).map(function (file) {
            if (fs.statSync(source + path.sep + file).isDirectory()) {
                return;
            }

            if (mime.lookup(source + path.sep + file) !== 'text/x-markdown') {
                return;
            }

            name = file.split(path.extname(source + path.sep + file))[0];
            pages[name] = path.resolve(source + path.sep + file);
        });

        return pages;
    }
};
