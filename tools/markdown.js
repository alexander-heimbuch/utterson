/* eslint-env node */
'use strict';

/**
 * UTTERSON - markdown parser
 */

var Bluebird = require('bluebird'),
    _ = require('lodash'),
    fs = Bluebird.promisifyAll(require('fs-extra')),
    eol = require('os').EOL,
    mde = require('markdown-extra'),
    markdown = require('marked'),
    excerpt = require('excerpt-html');

var parseContent = function (fileContent) {
        // TODO: RegEx for linebreaks
        var content = mde.content(fileContent) || '';

        content = markdown(content).replace(/\r?\n|\r/g, '');

        return {
            content: markdown(content).replace(/<h1.*>.*<\/h1>/ig, ''),
            title: mde.heading(fileContent) || undefined,
            teaser: excerpt(content, {
                moreRegExp:  /\s*<!--\s*more\s*-->/i,  // Search for the slug
                stripTags:   true, // Set to false to get html code
                pruneLength: 300, // Amount of characters that the excerpt should contain
                pruneString: '...', // Character that will be added to the pruned string
            })
        };
    },

    parseMeta = function (fileContent) {
        var meta = mde.metadata(fileContent, function (meta) {
                return meta.split(eol);
            }),

            result = {};

        // Parse the meta
        meta.forEach(function (attribute) {
            var field = attribute.split(':'),
                attributeName = '',
                attributeValue = '';

            if (field.length < 2) {
                return;
            }

            // Aggregate the field data
            field.map(function (value, key) {
                switch (key) {
                case 0:
                    // the first key is everytime the name of the attribute
                    attributeName = value;
                    break;
                case 1:
                    attributeValue += value;
                    break;
                default:
                    // In case there was a double point in the value
                    attributeValue += ':' + value;
                    break;
                }
            });

            result[attributeName] = attributeValue.trim();
        });

        return result;
    };

markdown.setOptions({
    renderer: new markdown.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

module.exports = function (file, extentMeta) {
    if (file === undefined) {
        throw new Error('Missing Parameter', 'Markdown parser expects a given file path');
    }

    return fs.readFileAsync(file, 'utf8')
        .then(function (fileContent) {
            return Bluebird.resolve(_.extend(parseContent(fileContent), parseMeta(fileContent)));
        })
        .then(function (data) {
            extentMeta = extentMeta || function (result) {
                return result;
            };

            return extentMeta(data);
        })
        .catch(function (error) {
            if (error.code === 'ENOENT') {
                throw new Error('Invalid Filepath', 'The given path ' + file + ' is incorrect');
            }
        });
};
