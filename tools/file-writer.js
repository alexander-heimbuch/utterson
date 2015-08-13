/* eslint-env node */
'use strict';

var _ = require('lodash'),
    path = require('path'),
    Bluebird = require('bluebird'),
    fs = require('fs-extra-promise'),
    winston = require('winston');

module.exports = {
    stack: [],
    pathPrefix: '',

    prefix: function (customPrefix) {
        if (customPrefix === undefined) {
            return;
        }

        this.pathPrefix = path.resolve(customPrefix);
        return this;
    },

    filter: function (file) {
        if (file === undefined || file.dest === undefined || (file.content === undefined && file.src === undefined)) {
            winston.info('FileWriter:', 'Missing file information', file);
            return this;
        }

        if (_.isString(file.dest) !== true) {
            winston.info('FileWriter:', 'Expected destination to be a string', file);
            return this;
        }

        this.stack.push(file);
    },

    /**
     * Possible function calls
     * fileWriter.add('myFilePath', 'myFileContent')
     * fileWriter.add({dest: 'myFilePath', content: 'myFileContent' || src: 'path/to/my/file'})
     * fileWriter.add({dest: 'myFilePath', content: 'myFileContent' || src: 'path/to/my/file'}, {dest: 'myFilePath', content: 'myFileContent' || src: 'path/to/my/file'})
     * fileWriter.add([{dest: 'myFilePath', content: 'myFileContent' || src: 'path/to/my/file'}, {dest: 'myFilePath', content: 'myFileContent' || src: 'path/to/my/file'}])
     * It's also fully chainable
     */
    add: function () {
        var files = arguments;

        if (_.isArray(arguments[0]) === true) {
            files = arguments[0];
        }

        if (arguments.length === 2 && _.isString(arguments[0]) === true) {
            files = [{
                dest: arguments[0],
                content: arguments[1]
            }];
        }
        _.forEach(files, this.filter.bind(this));
        return this;
    },

    write: function (file) {
        if (file.dest === undefined) {
            return Bluebird.reject();
        }

        file.dest = path.resolve(this.pathPrefix, file.dest);

        if (file.content !== undefined) {
            return fs.outputFileAsync(file.dest, file.content, 'utf-8');
        }

        if (file.src !== undefined) {
            return fs.copyAsync(file.src, file.dest);
        }
    },

    run: function () {
        var self = this;
        return Bluebird.all(_.map(this.stack, this.write.bind(this)))
            .then(function () {
                self.stack = [];
                return Bluebird.resolve();
            });
    }
};
