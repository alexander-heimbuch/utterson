/**
 * UTTERSON - markdown parser
 */

module.exports = (function () {
    'use strict';

    var fs = require('fs'),
        eol = require('os').EOL,
        mde = require('markdown-extra'),
        markdown = require('marked'),
        striptags = require('striptags');

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

    return function (file, extendMeta) {

        // In case the extended functionality wasn't provided
        if (extendMeta === undefined) {
            extendMeta = function (result) {
                return result;
            }
        }

        var raw = fs.readFileSync(file, 'utf8'),
            content = mde.content(raw.replace(eol, '')),
            result = {},
            title = mde.heading(raw) || undefined,
            content = markdown(content).replace(/<h1.*>.*<\/h1>/ig, '') || undefined,

            postMeta = mde.metadata(raw, function (meta) {
                return meta.split(eol);
            });

        if (title) {
            result.title = title;
        }

        if (content) {
            result.content = content;
            result.teaser = striptags(markdown(content).replace(/<h\d.*>.*<\/h\d>/ig, ''));
        }

        // Parse the postMeta
        postMeta.forEach(function (attribute) {
            var field = attribute.split(':'),
                attributeName = '',
                attributeValue = '';

            if (field.length < 2) {
                return;
            }

            // Aggregate the field data
            field.map(function (value, key) {
                // the first key is everytime the name of the attribute
                if (key === 0) {
                    attributeName = value;
                }
                else if (key === 1) {
                    attributeValue += value;
                } else {
                    // In case there was a : in the value
                    attributeValue += ':' + value;
                }
            });

            result[attributeName] = attributeValue.trim();
        });

        // Extend the meta with custom parameters
        // Jesus why they choosed miliseconds instead of seconds -.-
        return extendMeta(result);
    };

})();
