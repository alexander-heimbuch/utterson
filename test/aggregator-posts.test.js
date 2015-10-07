/* eslint-env node, mocha */
'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    path = require('path'),
    postAggregrator = require('../aggregators/posts'),
    testData = require('./helper/test-data-aggregator'),
    expect = chai.expect;

chai.use(sinonChai);

describe('posts aggregator', function () {
    it('should export a function', function () {
        expect(postAggregrator).to.be.a('function');
    });

    it('should resolve posts from the pipe', function (done) {
        var testCategory = _.cloneDeep(testData.content['test-category-one/']);

        postAggregrator(path.resolve(testData.contentDir, 'test-category-one'), testCategory)
            .then(function (category) {
                expect(category).to.have.any.keys(
                    'test-markdown-post-1.md',
                    'test-markdown-post-2.md',
                    'test-markdown-post-5.md',
                    'files',
                    'type'
                );

                expect(category['test-markdown-post-1.md']).to.have.any.keys('content', 'title', 'teaser');
                expect(category['test-markdown-post-1.md'].content).not.to.be.empty;
                expect(category['test-markdown-post-2.md']).to.have.any.keys('content', 'title', 'teaser');
                expect(category['test-markdown-post-2.md'].content).not.to.be.empty;
                expect(category['test-markdown-post-2.md']).to.have.any.keys('content', 'title', 'teaser');
                expect(category['test-markdown-post-2.md'].content).not.to.be.empty;
                done();
            });
    });
});
