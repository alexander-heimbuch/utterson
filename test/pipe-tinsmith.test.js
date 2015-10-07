 /* eslint-env node, mocha */
'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    tinsmith = require('../pipe/tinsmith'),
    testData = require('./helper/test-data-aggregator'),
    expect = chai.expect;

chai.use(sinonChai);

describe('pipe tinsmith', function () {

    it('should parse the default categories structure', function (done) {
        tinsmith.defaultCategories(_.cloneDeep(testData)).then(function (data) {
            expect(data.content['test-category-one/']).to.deep.equal({
                type: 'posts',
                files: [
                    'test-markdown-post-1.md',
                    'test-markdown-post-2.md',
                    'test-markdown-post-5.md'
                ]
            });
            done();
        });
    });

    it('should parse post files', function (done) {
        tinsmith.getPosts(_.cloneDeep(testData)).then(function (data) {
            expect(data.content['test-category-one/']).to.deep.equal({
                type: 'posts',
                files: [
                    'test-markdown-post-1.md',
                    'test-markdown-post-2.md',
                    'test-markdown-post-5.md'
                ]
            });
            done();
        });
    });

    it('should parse page files', function (done) {
        tinsmith.getPages(_.cloneDeep(testData)).then(function (data) {
            expect(data.content['./']).to.deep.equal({
                type: 'pages',
                files: [
                    'test-markdown-page-1.md',
                    'test-markdown-page-2.md'
                ]
            });
            done();
        });
    });

    it('should parse the default statics structure', function (done) {
        tinsmith.getStatics(testData).then(function (data) {
            expect(data.content['static/']).to.deep.equal({
                type: 'statics',
                files: [
                    'subfolder/test-image-3.png',
                    'subfolder/test-image-4.png',
                    'test-image-1.png',
                    'test-image-2.png'
                ]
            });

            done();
        });
    });

});
