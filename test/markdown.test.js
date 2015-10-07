/* eslint-env node, mocha */
'use strict';

var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    path = require('path'),
    markdown = require('../tools/markdown'),
    expect = chai.expect;

chai.use(sinonChai);

describe('markdown parser', function () {
    it('should export a function', function () {
        expect(markdown).to.be.a('function');
    });

    it('should be able to handel a missing file path', function () {
        expect(markdown).to.throw('Missing Parameter');
    });

    it('should be able to parse a Markdown file', function () {
        markdown(path.resolve('test', 'content', 'test-markdown-page-1.md')).then(function (data) {
            expect(data).to.have.any.keys('content', 'title', 'teaser', 'author', 'custom-tag', 'description', 'publish', 'template', 'comments');
        });
    });

    it('should be possible to extent the attributes', function () {
        markdown(path.resolve('test', 'content', 'test-markdown-page-1.md'), function (result) {
            result['custom-tag-1'] = 'custom-value-1';
            result['custom-tag-2'] = 'custom-value-2';
            return result;
        }).then(function (data) {
            expect(data).to.have.any.keys('custom-tag', 'custom-tag-1', 'custom-tag-2');
        });
    });
});
