/* eslint-env node, mocha */
'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    path = require('path'),
    pageAggregrator = require('../aggregators/pages'),
    testData = require('./helper/test-data-aggregator');

var expect = chai.expect;

chai.use(sinonChai);

describe('pages aggregator', function () {
    it('should export a function', function () {
        expect(pageAggregrator).to.be.a('function');
    });

    it('should resolve posts from the pipe', function (done) {
        var testPages = _.cloneDeep(testData.content['./']);

        pageAggregrator(path.resolve(testData.contentDir, './'), testPages)
            .then(function (pages) {
                expect(pages).to.have.any.keys(
                    'test-markdown-page-1.md',
                    'test-markdown-page-2.md',
                    'files',
                    'type'
                );

                expect(pages['test-markdown-page-1.md']).to.have.any.keys('content', 'title', 'teaser');
                expect(pages['test-markdown-page-1.md'].content).not.to.be.empty;
                expect(pages['test-markdown-page-2.md']).to.have.any.keys('content', 'title', 'teaser');
                expect(pages['test-markdown-page-2.md'].content).not.to.be.empty;
                expect(pages['test-markdown-page-2.md']).to.have.any.keys('content', 'title', 'teaser');
                expect(pages['test-markdown-page-2.md'].content).not.to.be.empty;
                done();
            });
    });
});
