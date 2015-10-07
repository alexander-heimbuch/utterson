/* eslint-env node, mocha */
'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    path = require('path'),
    staticAggregrator = require('../aggregators/statics'),
    testData = require('./helper/test-data-aggregator');

var expect = chai.expect;

chai.use(sinonChai);

describe('statics aggregator', function () {
    it('should export a function', function () {
        expect(staticAggregrator).to.be.a('function');
    });

    it('should resolve statics from the pipe', function (done) {
        var testStatics = _.cloneDeep(testData.content['static/']);

        staticAggregrator(path.resolve(testData.contentDir, 'static/'), testStatics)
            .then(function (statics) {
                expect(statics).to.have.any.keys(
                    'test-image-1.png',
                    'test-image-2.png',
                    'files',
                    'type'
                );

                expect(statics['test-image-1.png']).not.to.be.empty;
                expect(statics['test-image-2.png']).not.to.be.empty;

                done();
            });
    });
});
