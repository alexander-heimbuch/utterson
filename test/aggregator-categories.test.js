/* eslint-env node, mocha */
'use strict';

var Bluebird = require('bluebird'),
    _ = require('lodash'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    path = require('path'),
    categoryAggregrator = require('../aggregators/categories'),
    postAggregator = require('../aggregators/posts'),
    testData = require('./helper/test-data-aggregator');

var expect = chai.expect;

chai.use(sinonChai);

describe('categories aggregator', function () {
    var testContent;

    beforeEach(function (done) {
        testContent = _.cloneDeep(testData.content);
        Bluebird.all([
            postAggregator(path.resolve(testData.contentDir, 'test-category-one/'), testContent['test-category-one/'])
                .then(function (resolvedData) {
                    testContent['test-category-one/'] = resolvedData;
                }),
            postAggregator(path.resolve(testData.contentDir, 'test-category-two/'), testContent['test-category-two/'])
                .then(function (resolvedData) {
                    testContent['test-category-two/'] = resolvedData;
                })
        ]).then(function () {
            done();
        });
    });

    it('should exports a function', function () {
        expect(categoryAggregrator).to.be.a('function');
    });

    it('should generate posts ordered by DESC order', function (done) {
        categoryAggregrator(testContent).then(function (data) {
            var testCategory = data['test-category-one/']['index.md'].posts;

            expect(data['test-category-one/'].files).to.include('index.md');
            expect(testCategory).to.have.length(3);
            expect(testCategory[0].title).to.equal('Headline One Post Two');
            expect(testCategory[1].title).to.equal('Headline One Post One');
            expect(testCategory[2].title).to.equal('Headline One Post with missing Publish Date');
            done();
        });
    });

    it('should generate posts ordered by ASC order', function (done) {
        testContent['test-category-one/'].order = 'ASC';
        categoryAggregrator(testContent).then(function (data) {
            var testCategory = data['test-category-one/']['index.md'].posts;

            expect(data['test-category-one/'].files).to.include('index.md');
            expect(testCategory).to.have.length(3);
            expect(testCategory[2].title).to.equal('Headline One Post Two');
            expect(testCategory[1].title).to.equal('Headline One Post One');
            expect(testCategory[0].title).to.equal('Headline One Post with missing Publish Date');
            done();
        });
    });

    it('should be able to react to categories that don\'t want to be indexed', function (done) {
        testContent['test-category-one/'].indexed = false;
        categoryAggregrator(testContent).then(function (data) {
            expect(data['test-category-one/']['index.md']).to.be.undefined;
            expect(data['test-category-one/'].files).not.to.include('index.md');
            done();
        });
    });

    it('should generate the startpage posts', function (done) {
        categoryAggregrator(testContent).then(function (data) {
            expect(data['./']['index.md'].posts).to.have.length(5);
            expect(data['./'].files).to.include('index.md');
            done();
        });
    });

    it('should be able to a startpage that don\'t want to be indexed', function (done) {
        testContent['./'].indexed = false;
        categoryAggregrator(testContent).then(function (data) {
            expect(data['./']['index.md']).to.be.undefined;
            expect(data['./'].files).not.to.include('index.md');
            done();
        });
    });

    it('should be able to a a already defined startpage', function (done) {
        testContent['./']['index.md'] = {content: 'foo bar bar'};
        categoryAggregrator(testContent).then(function (data) {
            expect(data['./']['index.md'].posts).to.be.undefined;
            done();
        });
    });
});
